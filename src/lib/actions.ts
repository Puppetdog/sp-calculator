'use server'

import { programs, benefitConditions } from './schema';
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from './db';

// Zod schemas for validation
const ProgramSchema = z.object({
        id: z.number(),
        programTitle: z.string(),
        responsibleOrganization: z.string(),
        programDescription: z.string(),
        ageMinimum: z.number(),
        ageMaximum: z.number(),
        gender: z.string(),
        numberOfDependents: z.number(),
        typeOfDependents: z.string(),
        employmentStatus: z.string(),
        disabilityStatus: z.string(),
        chronicIllnessStatus: z.string(),
        householdSize: z.number(),
        programCountry: z.string(),
        citizenshipRequired: z.number(),
        cashTransfer: z.number(),
        cashTransferMonthlyAmount: z.number().nullable(),
        inKindTransfer: z.number(),
        inKindDollarValueAmt: z.number().nullable(),
});

const BenefitConditionInputSchema = z.object({
        benefitType: z.enum(['cash', 'in-kind']),
        conditionField: z.string(),
        conditionOperator: z.enum(['>', '<', '>=', '<=', '===', '!==']),
        conditionValue: z.string(),
        benefitAmount: z.number()
});

// Define the EligibilityParams interface
export interface EligibilityParams {
        age: string;
        gender: string;
        numberOfDependents: string;
        typeOfDependents: string;
        employmentStatus: string;
        disabilityStatus: string;
        chronicIllnessStatus: string;
        householdSize: string;
        countryOfOrigin: string;
        countryOfResidence: string;
}

// Types
export type Program = typeof programs.$inferInsert;
export type Programs = typeof programs.$inferSelect;

export interface BenefitConditionInput {
        benefitType: 'cash' | 'in-kind';
        conditionField: string;
        conditionOperator: '>' | '<' | '>=' | '<=' | '===' | '!==';
        conditionValue: string;
        benefitAmount: number;
}

// Helper function to evaluate conditions
function evaluateCondition(
        fieldValue: any,
        operator: string,
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
                        return fieldValue >= conditionValue;
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

// Main functions
export async function addProgram(
        programData: Program,
        benefitConditionsData: BenefitConditionInput[]
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
                                condition.conditionOperator,
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

export async function getEligiblePrograms(params: EligibilityParams): Promise<Programs[]> {
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

                        // Citizenship check (if required)
                        if (program.citizenshipRequired && params.countryOfOrigin !== '1') {
                                return false;
                        }

                        // Additional checks can be added here based on other criteria

                        return true;
                });

                return eligiblePrograms;
        } catch (error) {
                console.error('Error getting eligible programs:', error);
                throw new Error('Failed to get eligible programs');
        }
}

export async function getProgramById(programId: number): Promise<Program | null> {
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

export async function listPrograms(): Promise<Programs[]> {
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
