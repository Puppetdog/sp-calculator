
// actions.ts
'use server'
import { db } from './db'; // Ensure you have a db.ts exporting your Drizzle database instance
import { programs, benefitConditions } from './schema'; // Import your tables

import { eq } from "drizzle-orm";
// Infer types from your Drizzle ORM schemas
type Program = typeof programs.$inferInsert;
type BenefitCondition = typeof benefitConditions.$inferInsert;

// Function to add a new program along with its benefit conditions
export async function addProgram(
        programData: Program,
        benefitConditionsData: BenefitCondition[]
): Promise<void> {
        // Start a transaction to ensure atomicity
        await db.transaction(async (tx) => {
                // Insert the program data
                const [insertedProgram] = await tx
                        .insert(programs)
                        .values(programData)
                        .returning({ id: programs.id });

                const programId = insertedProgram.id;

                // Insert benefit conditions if any
                if (benefitConditionsData && benefitConditionsData.length > 0) {
                        // Add the programId to each benefit condition
                        const conditionsWithProgramId = benefitConditionsData.map((condition) => ({
                                ...condition,
                                programId,
                        }));

                        await tx.insert(benefitConditions).values(conditionsWithProgramId);
                }
        });
}

// Function to calculate the benefit amount for a participant based on benefit conditions
export async function calculateBenefitAmount(
        programId: number,
        participantData: Record<string, any>
): Promise<number> {
        // Fetch benefit conditions associated with the program
        const conditions = await db
                .select()
                .from(benefitConditions)
                .where(eq(benefitConditions.programId, programId));

        let benefitAmount = 0;

        // Iterate over each condition to evaluate
        for (const condition of conditions) {
                const fieldValue = participantData[condition.conditionField];

                // Skip if participant data doesn't have the field
                if (fieldValue === undefined) continue;

                // Evaluate the condition
                if (
                        evaluateCondition(
                                fieldValue,
                                condition.conditionOperator,
                                condition.conditionValue
                        )
                ) {
                        benefitAmount = condition.benefitAmount;
                        // Depending on your business logic, you can decide to break or continue
                        break; // Assuming the first matching condition applies
                }
        }

        return benefitAmount;
}

// Helper function to evaluate a single condition
function evaluateCondition(
        fieldValue: any,
        operator: string,
        conditionValue: any
): boolean {
        // Convert field and condition values to numbers if possible
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
                case '==':
                        return fieldValue == conditionValue;
                case '!=':
                        return fieldValue != conditionValue;
                default:
                        return false;
        }
}

// Example function to get a program by ID (optional)
export async function getProgramById(programId: number): Promise<Program | null> {
        const program = await db
                .select()
                .from(programs)
                .where(eq(programs.id, programId))
                .limit(1);

        return program.length > 0 ? program[0] : null;
}

// Example function to list all programs (optional)
export async function listPrograms(): Promise<Program[]> {
        const allPrograms = await db.select().from(programs);
        return allPrograms;
}
