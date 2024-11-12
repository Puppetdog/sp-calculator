import { programs, benefitConditions, type ProgramSelect, type BenefitConditionSelect } from './schema';

// Define the Beneficiary type based on your eligibility parameters
interface Beneficiary {
        age: number;
        gender: string;
        numberOfDependents: number;
        typeOfDependents: string;
        employmentStatus: string;
        disabilityStatus: string;
        chronicIllnessStatus: string;
        householdSize: number;
        countryOfOrigin: string;
        countryOfResidence: string;
}

// Define a type that combines Program with its conditions
interface ProgramWithConditions extends ProgramSelect {
        benefitConditions: BenefitConditionSelect[];
}

export function calculateEligibility(
        beneficiary: Beneficiary,
        program: ProgramWithConditions
): {
        isEligible: boolean;
        reasons?: string[];
        potentialBenefits?: {
                cashBenefits: number;
                inKindBenefits: number;
                totalValue: number;
        };
} {
        const reasons: string[] = [];
        let isEligible = true;

        // Basic eligibility checks
        if (beneficiary.age < program.ageMinimum || beneficiary.age > program.ageMaximum) {
                isEligible = false;
                reasons.push('Age requirements not met');
        }

        if (program.gender !== '4' && beneficiary.gender !== program.gender) {
                isEligible = false;
                reasons.push('Gender requirements not met');
        }

        if (beneficiary.householdSize < program.householdSize) {
                isEligible = false;
                reasons.push('Household size requirements not met');
        }

        if (program.citizenshipRequired === 1 && beneficiary.countryOfOrigin !== program.programCountry) {
                isEligible = false;
                reasons.push('Citizenship requirement not met');
        }

        if (beneficiary.countryOfResidence !== program.programCountry) {
                isEligible = false;
                reasons.push('Country of residence requirement not met');
        }

        // Additional eligibility checks
        if (program.employmentStatus !== '5' && beneficiary.employmentStatus !== program.employmentStatus) {
                isEligible = false;
                reasons.push('Employment status requirements not met');
        }

        if (program.disabilityStatus !== '4' && beneficiary.disabilityStatus !== program.disabilityStatus) {
                isEligible = false;
                reasons.push('Disability status requirements not met');
        }

        if (program.chronicIllnessStatus !== '4' && beneficiary.chronicIllnessStatus !== program.chronicIllnessStatus) {
                isEligible = false;
                reasons.push('Chronic illness status requirements not met');
        }

        // Calculate potential benefits if eligible
        if (isEligible) {
                const benefits = {
                        cashBenefits: 0,
                        inKindBenefits: 0,
                        totalValue: 0
                };

                // Add base benefits
                if (program.cashTransfer === 1 && program.cashTransferMonthlyAmount) {
                        benefits.cashBenefits += program.cashTransferMonthlyAmount;
                }

                if (program.inKindTransfer === 1 && program.inKindDollarValueAmt) {
                        benefits.inKindBenefits += program.inKindDollarValueAmt;
                }

                // Calculate additional benefits based on conditions
                program.benefitConditions.forEach((condition: BenefitConditionSelect) => {
                        const beneficiaryValue = beneficiary[condition.conditionField as keyof Beneficiary];
                        const meetsCondition = evaluateCondition(
                                beneficiaryValue,
                                condition.conditionOperator as '>' | '<' | '>=' | '<=' | '===' | '!==',
                                condition.conditionValue
                        );

                        if (meetsCondition) {
                                if (condition.benefitType === 'cash') {
                                        benefits.cashBenefits += condition.benefitAmount;
                                } else {
                                        benefits.inKindBenefits += condition.benefitAmount;
                                }
                        }
                });

                benefits.totalValue = benefits.cashBenefits + benefits.inKindBenefits;
                return { isEligible, potentialBenefits: benefits };
        }

        return { isEligible, reasons };
}

function evaluateCondition(
        value: any,
        operator: '>' | '<' | '>=' | '<=' | '===' | '!==',
        compareValue: string | number
): boolean {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        const numericCompareValue = typeof compareValue === 'string' ? parseFloat(compareValue) : compareValue;

        if (!isNaN(numericValue) && !isNaN(numericCompareValue)) {
                value = numericValue;
                compareValue = numericCompareValue;
        }

        switch (operator) {
                case '>':
                        return value > compareValue;
                case '<':
                        return value < compareValue;
                case '>=':
                        return value >= compareValue;
                case '<=':
                        return value <= compareValue;
                case '===':
                        return value === compareValue;
                case '!==':
                        return value !== compareValue;
                default:
                        return false;
        }
}
