// lib/utils/validators.ts
import { z } from 'zod';
import type { EligibilityParams } from '../types/eligibility';

const eligibilitySchema = z.object({
        // Basic demographics
        age: z.string().refine(val => {
                const age = parseInt(val);
                return !isNaN(age) && age >= 0 && age <= 120;
        }, "Age must be between 0 and 120"),
        gender: z.string(),
        countryOfResidence: z.string(),
        countryOfOrigin: z.string().optional(),

        // Household
        householdSize: z.string().refine(val => {
                const size = parseInt(val);
                return !isNaN(size) && size > 0;
        }, "Household size must be greater than 0"),
        numberOfDependents: z.string().refine(val => {
                const deps = parseInt(val);
                return !isNaN(deps) && deps >= 0;
        }, "Number of dependents must be non-negative"),
        typeOfDependents: z.string().optional(),
        householdIncomePerPerson: z.string().optional(),
        monthlyIncome: z.string().optional(),

        // Employment
        employmentStatus: z.string(),
        employmentSector: z.string().optional(),
        socialSecurityNumber: z.string().optional(),

        // Health
        disabilityStatus: z.string(),
        disabilityType: z.string().optional(),
        chronicIllnessStatus: z.string(),
        requiresMedicalCare: z.string().optional(),

        // Documentation
        hasValidID: z.boolean().optional(),
        hasProofOfResidence: z.boolean().optional(),
        hasIncomeDocuments: z.boolean().optional(),
}).refine(data => {
        if (data.numberOfDependents && data.householdSize) {
                return parseInt(data.numberOfDependents) <= parseInt(data.householdSize);
        }
        return true;
}, {
        message: "Number of dependents cannot exceed household size",
        path: ["numberOfDependents"]
});

export function validateEligibilityParams(params: EligibilityParams) {
        const result = eligibilitySchema.safeParse(params);

        if (!result.success) {
                return {
                        success: false,
                        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
                };
        }

        return {
                success: true,
                data: result.data
        };
}

export function validateDocumentation(
        requiredDocs: string[],
        providedDocs: Record<string, boolean>
): {
        isValid: boolean;
        missing: string[];
} {
        const missing = requiredDocs.filter(doc => !providedDocs[doc]);
        return {
                isValid: missing.length === 0,
                missing
        };
}

export function validateGeographicCoverage(
        region: string,
        allowedRegions: string[]
): boolean {
        return allowedRegions.includes(region);
}
