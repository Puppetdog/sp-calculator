import { Beneficiary, Programs } from "./types";

export function calculateEligibility(beneficiary: Beneficiary, program: Programs): {
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

        if (program.citizenshipRequired && beneficiary.countryOfOrigin !== '1') {
                isEligible = false;
                reasons.push('Citizenship requirement not met');
        }

        if (beneficiary.countryOfResidence !== program.programCountry) {
                isEligible = false;
                reasons.push('Country of residence requirement not met');
        }

        // Calculate potential benefits if eligible
        if (isEligible) {
                const benefits = {
                        cashBenefits: 0,
                        inKindBenefits: 0,
                        totalValue: 0
                };

                // Add base benefits
                if (program.cashTransfer && program.cashTransferMonthlyAmount) {
                        benefits.cashBenefits += program.cashTransferMonthlyAmount;
                }

                if (program.inKindTransfer && program.inKindDollarValueAmt) {
                        benefits.inKindBenefits += program.inKindDollarValueAmt;
                }

                // Calculate additional benefits based on conditions
                program.benefitConditions.forEach(condition => {
                        const beneficiaryValue = beneficiary[condition.conditionField as keyof Beneficiary];
                        const meetsCondition = evaluateCondition(
                                beneficiaryValue,
                                condition.conditionOperator,
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
