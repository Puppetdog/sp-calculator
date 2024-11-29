
// lib/utils/transformers.ts

import type { EligibilityParams } from '../types/eligibility';
import { FormSubmissionData } from '../types/forms';
import { ProgramWithRelations } from '../types/programs';
import { validateEligibilityParams } from './validators';

export function transformFormData(formData: FormSubmissionData): EligibilityParams {
        const baseParams: Partial<EligibilityParams> = {
                // Basic demographics - required
                age: formData.basic.age,
                gender: formData.basic.gender,
                countryOfResidence: formData.basic.countryOfResidence,
        };

        // Add household information if present
        if (formData.household) {
                const householdSize = parseInt(formData.household.householdSize, 10);
                const dependents = parseInt(formData.household.numberOfDependents, 10);

                Object.assign(baseParams, {
                        householdSize: formData.household.householdSize,
                        numberOfDependents: formData.household.numberOfDependents,
                        typeOfDependents: formData.household.typeOfDependents,
                        householdIncomePerPerson: formData.household.monthlyIncome
                                ? (parseFloat(formData.household.monthlyIncome) / householdSize).toString()
                                : undefined,
                        dependencyRatio: householdSize > 0
                                ? (dependents / householdSize).toString()
                                : "0",
                });
        }

        // Add health status if present
        if (formData.health) {
                Object.assign(baseParams, {
                        disabilityStatus: formData.health.disabilityStatus || "1",
                        disabilityType: formData.health.disabilityType,
                        chronicIllnessStatus: formData.health.chronicIllnessStatus || "1",
                        // Convert boolean to string
                        requiresMedicalCare: (formData.health.disabilityStatus !== "1" || formData.health.chronicIllnessStatus !== "1") ? "true" : "false",
                });
        }

        // Add employment information if present
        if (formData.employment) {
                Object.assign(baseParams, {
                        employmentStatus: formData.employment.employmentStatus,
                        employmentSector: formData.employment.employmentSector,
                        socialSecurityNumber: formData.employment.socialSecurityNumber,
                });
        }

        // Add documentation status
        if (formData.documentation) {
                Object.assign(baseParams, {
                        hasValidID: formData.documentation.hasValidID,
                        hasProofOfResidence: formData.documentation.hasProofOfResidence,
                        hasIncomeDocuments: formData.documentation.hasIncomeDocuments,
                });
        }

        // Validate transformed parameters
        const validationResult = validateEligibilityParams(baseParams as EligibilityParams);
        if (!validationResult.success) {
                throw new Error(`Invalid parameters: ${validationResult.errors!.join(', ')}`);
        }

        return baseParams as EligibilityParams;
}

export function transformProgramResponse(
        program: ProgramWithRelations,
        eligibilityScore: number,
        calculatedBenefit: number,
        documentationStatus: Record<string, boolean>
) {
        return {
                id: program.id,
                title: program.title,
                description: program.description,
                organization: program.responsibleOrganization,
                benefit: {
                        amount: calculatedBenefit,
                        frequency: program.benefitFrequency,
                        minimum: program.minimumBenefit,
                        maximum: program.maximumBenefit,
                },
                eligibility: {
                        score: eligibilityScore,
                        rules: program.eligibilityRules,
                },
                documentation: {
                        required: program.requiredDocuments,
                        status: documentationStatus,
                },
                coverage: program.geographicCoverage,
        };
}
