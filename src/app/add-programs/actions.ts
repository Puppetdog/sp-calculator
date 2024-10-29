'use server'

import { programs, benefitConditions } from "@/lib/schema";
import { z } from "zod";
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Benefit Condition Schema (matching your form)
const benefitConditionSchema = z.object({
        benefitType: z.enum(['cash', 'in-kind']),
        conditionField: z.string(),
        conditionOperator: z.enum(['>', '<', '>=', '<=', '===', '!==']),
        conditionValue: z.union([z.string(), z.number()]),
        benefitAmount: z.number().min(0),
});

// Form Schema (matching your component's schema)
const formSchema = z.object({
        programTitle: z.string().min(4),
        responsibleOrganization: z.string().min(4),
        programDescription: z.string().min(4),
        ageMinimum: z.number().min(0),
        ageMaximum: z.number().max(150),
        gender: z.enum(["1", "2", "3", "4"]),
        numberOfDependents: z.number().min(0),
        typeOfDependents: z.enum(["1", "2", "3"]),
        employmentStatus: z.enum(["1", "2", "3", "4", "5"]),
        disabilityStatus: z.enum(["1", "2", "3", "4"]),
        chronicIllnessStatus: z.enum(["1", "2", "3", "4"]),
        householdSize: z.number().min(1),
        programCountry: z.enum(["1", "2", "3", "4", "5"]),
        citizenshipRequired: z.boolean(),
        cashTransfer: z.boolean(),
        cashTransferMonthlyAmount: z.number().min(0).optional(),
        inKindTransfer: z.boolean(),
        inKindDollarValueAmt: z.number().min(0).optional(),
        benefitConditions: z.array(benefitConditionSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;
export type BenefitConditionInput = z.infer<typeof benefitConditionSchema>;

export async function addProgram(data: FormData) {
        try {
                const validatedFormData = formSchema.parse(data);

                const programData = {
                        ...validatedFormData,
                        citizenshipRequired: validatedFormData.citizenshipRequired ? 1 : 0,
                        cashTransfer: validatedFormData.cashTransfer ? 1 : 0,
                        inKindTransfer: validatedFormData.inKindTransfer ? 1 : 0,
                        cashTransferMonthlyAmount: validatedFormData.cashTransferMonthlyAmount || null,
                        inKindDollarValueAmt: validatedFormData.inKindDollarValueAmt || null,
                };

                const { benefitConditions: benefitConditionsData = [], ...programDataWithoutConditions } = programData;


                // Insert program first
                const [insertedProgram] = await db
                        .insert(programs)
                        .values(programDataWithoutConditions)
                        .returning({ id: programs.id });

                // Then insert benefit conditions if any
                if (benefitConditionsData.length > 0) {
                        const conditionsWithProgramId = benefitConditionsData.map((condition) => ({
                                ...condition,
                                conditionValue: String(condition.conditionValue),
                                programId: insertedProgram.id,
                        }));

                        await db
                                .insert(benefitConditions)
                                .values(conditionsWithProgramId);
                }

                revalidatePath('/add-program');
                return { success: true };
        } catch (error) {
                if (error instanceof z.ZodError) {
                        console.error('Validation error:', error.errors);
                        return {
                                success: false,
                                error: 'Invalid program data',
                                validationErrors: error.errors
                        };
                }

                console.error('Error adding program:', error);
                return { success: false, error: 'Failed to add program' };
        }
}
