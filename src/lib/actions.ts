'use server'

import { programs, benefitConditions, ProgramSchema, type Program, type ProgramSelect, type EligibilityParams, type BenefitCondition } from './schema';
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from './db';

const BenefitConditionInputSchema = z.object({
        benefitType: z.enum(['cash', 'in-kind']),
        conditionField: z.string(),
        conditionOperator: z.enum(['>', '<', '>=', '<=', '===', '!==']),
        conditionValue: z.string(),
        benefitAmount: z.number()
});

// Helper function to evaluate conditions
function evaluateCondition(
        fieldValue: any,
        operator: '>' | '<' | '>=' | '<=' | '===' | '!==',
        conditionValue: any
): boolean {
        const numericFieldValue = parseFloat(fieldValue);
        const numericConditionValue = parseFloat(conditionValue);

        const isNumericComparison =
                !isNaN(numericFieldValue) && !isNaN(numericConditionValue);

        if (isNumericComparison) {
                fieldValue = numericFieldValue;
                conditionValue = numericConditionValue;
        }

        switch (operator) {
                case '>':
                        return fieldValue > conditionValue;
                case '<':
                        return fieldValue < conditionValue;
                case '>=':
                        return fieldValue >= conditionValue; // This line had the error
                case '<=':
                        return fieldValue <= conditionValue;
                case '===':
                        return fieldValue === conditionValue;
                case '!==':
                        return fieldValue !== conditionValue;
                default:
                        return false;
        }
}

export async function addProgram(
        programData: Program,
        benefitConditionsData: BenefitCondition[]
): Promise<void> {
        try {
                const validatedProgram = ProgramSchema.parse(programData);
                const validatedConditions = z.array(BenefitConditionInputSchema).parse(benefitConditionsData);

                await db.transaction(async (tx) => {
                        const [insertedProgram] = await tx
                                .insert(programs)
                                .values(validatedProgram)
                                .returning({ id: programs.id });

                        const programId = insertedProgram.id;

                        if (validatedConditions.length > 0) {
                                const conditionsWithProgramId = validatedConditions.map((condition) => ({
                                        ...condition,
                                        conditionValue: String(condition.conditionValue),
                                        programId,
                                }));

                                await tx.insert(benefitConditions).values(conditionsWithProgramId);
                        }
                });
        } catch (error) {
                console.error('Error adding program:', error);
                throw new Error('Failed to add program');
        }
}

export async function calculateBenefitAmount(
        programId: number,
        participantData: EligibilityParams
): Promise<number> {
        try {
                const conditions = await db
                        .select()
                        .from(benefitConditions)
                        .where(eq(benefitConditions.programId, programId));

                let benefitAmount = 0;

                for (const condition of conditions) {
                        const fieldValue = participantData[condition.conditionField as keyof EligibilityParams];

                        if (fieldValue === undefined) continue;

                        if (evaluateCondition(
                                fieldValue,
                                condition.conditionOperator as '>' | '<' | '>=' | '<=' | '===' | '!==',
                                condition.conditionValue
                        )) {
                                benefitAmount = condition.benefitAmount;
                                break;
                        }
                }

                return benefitAmount;
        } catch (error) {
                console.error('Error calculating benefit amount:', error);
                throw new Error('Failed to calculate benefit amount');
        }
}

export async function getEligiblePrograms(params: EligibilityParams): Promise<ProgramSelect[]> {
        try {
                // Convert string values to appropriate types for comparison
                const numericParams = {
                        age: parseInt(params.age),
                        numberOfDependents: parseInt(params.numberOfDependents),
                        householdSize: parseInt(params.householdSize),
                };

                const allPrograms = await db.select().from(programs);

                // Filter programs based on eligibility criteria
                const eligiblePrograms = allPrograms.filter(program => {
                        // Age check
                        if (numericParams.age < program.ageMinimum || numericParams.age > program.ageMaximum) {
                                return false;
                        }

                        // Gender check (4 represents "All")
                        if (program.gender !== '4' && params.gender !== program.gender) {
                                return false;
                        }

                        // Household size check
                        if (numericParams.householdSize < program.householdSize) {
                                return false;
                        }

                        // Country check
                        if (params.countryOfResidence !== program.programCountry) {
                                return false;
                        }

                        // Citizenship check
                        if (program.citizenshipRequired === 1 && params.countryOfOrigin !== program.programCountry) {
                                return false;
                        }

                        // Employment status check
                        if (program.employmentStatus !== '5' && params.employmentStatus !== program.employmentStatus) {
                                return false;
                        }

                        // Additional checks for disability and chronic illness status
                        if (program.disabilityStatus !== '4' && params.disabilityStatus !== program.disabilityStatus) {
                                return false;
                        }

                        if (program.chronicIllnessStatus !== '4' && params.chronicIllnessStatus !== program.chronicIllnessStatus) {
                                return false;
                        }

                        return true;
                });

                return eligiblePrograms;
        } catch (error) {
                console.error('Error getting eligible programs:', error);
                throw new Error('Failed to get eligible programs');
        }
}

export async function getProgramById(programId: number): Promise<ProgramSelect | null> {
        try {
                const program = await db
                        .select()
                        .from(programs)
                        .where(eq(programs.id, programId))
                        .limit(1);

                return program.length > 0 ? program[0] : null;
        } catch (error) {
                console.error('Error fetching program:', error);
                throw new Error('Failed to fetch program');
        }
}

export async function listPrograms(): Promise<ProgramSelect[]> {
        try {
                const allPrograms = await db.select().from(programs);
                return allPrograms.map(program =>
                        ProgramSchema.parse({
                                ...program,
                                cashTransferMonthlyAmount: program.cashTransferMonthlyAmount ?? null,
                                inKindDollarValueAmt: program.inKindDollarValueAmt ?? null
                        })
                );
        } catch (error) {
                console.error('Error listing programs:', error);
                throw new Error('Failed to list programs');
        }
}
