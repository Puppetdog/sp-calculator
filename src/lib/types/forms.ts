// lib/types/forms.ts
import { z } from 'zod';

export type FormSubmissionData = {
        // Basic Information Section
        basic: {
                age: string;
                gender: string;
                countryOfResidence: string;
                countryOfOrigin?: string;
        };

        // Household Information Section
        household?: {
                householdSize: string;
                numberOfDependents: string;
                typeOfDependents?: string;
                monthlyIncome?: string;
                primaryIncomeName?: string;
                primaryIncomeRelation?: string;
        };

        // Health Status Section
        health?: {
                disabilityStatus: string;
                disabilityType?: string;
                chronicIllnessStatus: string;
                medicalDocumentation?: boolean;
                requiresContinuousCare?: boolean;
                registeredDisability?: boolean;
        };

        // Employment Information Section
        employment?: {
                employmentStatus: string;
                employmentSector?: string;
                employmentType?: string;
                socialSecurityNumber?: string;
                monthsEmployed?: string;
                seasonalWork?: boolean;
                employmentHistory?: {
                        lastEmployed?: string;
                        reasonForUnemployment?: string;
                        seekingWork?: boolean;
                };
        };

        // Documentation Section
        documentation?: {
                hasValidID: boolean;
                hasProofOfResidence: boolean;
                hasIncomeDocuments: boolean;
                hasSocialSecurityCard?: boolean;
                hasBankAccount?: boolean;
                hasUtilityBills?: boolean;
                hasPropertyDocuments?: boolean;
        };

        // Program Preferences
        preferences: {
                includeInKindBenefits: boolean;
                includeCashTransfers: boolean;
                includeEmergencyAssistance: boolean;
                preferredPaymentMethod?: string;
                languagePreference?: string;
                communicationPreference?: string;
        };
};

// Validation schema for the form
export const formSchema = z.object({
        basic: z.object({
                age: z.string().min(1, "Age is required"),
                gender: z.string().min(1, "Gender must be selected"),
                countryOfResidence: z.string().min(1, "Country of residence must be selected"),
                countryOfOrigin: z.string().optional()
        }),

        household: z.object({
                householdSize: z.string().min(1, "Household size is required"),
                numberOfDependents: z.string().min(0, "Number of dependents must be provided"),
                typeOfDependents: z.string().optional(),
                monthlyIncome: z.string().optional(),
                primaryIncomeName: z.string().optional(),
                primaryIncomeRelation: z.string().optional()
        }).optional(),

        health: z.object({
                disabilityStatus: z.string().min(1, "Disability status must be selected"),
                disabilityType: z.string().optional(),
                chronicIllnessStatus: z.string().min(1, "Chronic illness status must be selected"),
                medicalDocumentation: z.boolean().optional(),
                requiresContinuousCare: z.boolean().optional(),
                registeredDisability: z.boolean().optional()
        }).optional(),

        employment: z.object({
                employmentStatus: z.string().min(1, "Employment status must be selected"),
                employmentSector: z.string().optional(),
                employmentType: z.string().optional(),
                socialSecurityNumber: z.string().optional(),
                monthsEmployed: z.string().optional(),
                seasonalWork: z.boolean().optional(),
                employmentHistory: z.object({
                        lastEmployed: z.string().optional(),
                        reasonForUnemployment: z.string().optional(),
                        seekingWork: z.boolean().optional()
                }).optional()
        }).optional(),

        documentation: z.object({
                hasValidID: z.boolean(),
                hasProofOfResidence: z.boolean(),
                hasIncomeDocuments: z.boolean(),
                hasSocialSecurityCard: z.boolean().optional(),
                hasBankAccount: z.boolean().optional(),
                hasUtilityBills: z.boolean().optional(),
                hasPropertyDocuments: z.boolean().optional()
        }).optional(),

        preferences: z.object({
                includeInKindBenefits: z.boolean(),
                includeCashTransfers: z.boolean(),
                includeEmergencyAssistance: z.boolean(),
                preferredPaymentMethod: z.string().optional(),
                languagePreference: z.string().optional(),
                communicationPreference: z.string().optional()
        })
}).refine(data => {
        if (data.household) {
                const dependents = parseInt(data.household.numberOfDependents);
                const householdSize = parseInt(data.household.householdSize);
                return !isNaN(dependents) && !isNaN(householdSize) && householdSize >= dependents;
        }
        return true;
}, {
        message: "Household size must be greater than or equal to the number of dependents",
        path: ["household.householdSize"]
});

export type FormData = z.infer<typeof formSchema>;

