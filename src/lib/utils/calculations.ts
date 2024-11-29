
// lib/utils/calculations.ts

import type { EligibilityRule, GeographicCoverage, ProgramWithRelations } from '@/lib/types/programs';
import type { EligibilityParams } from '@/lib/types/eligibility';

// Define which rule types are numeric
const numericRuleTypes: Set<string> = new Set([
        'age',
        'income',
        'monthly_income',
        'contributions',
        'contributions_weeks',
        'additional_contributions_weeks',
        'pension_cap',
        // Add any other numeric rule types here
]);

// Main function to calculate eligibility score for a program
export function calculateEligibilityScore(
        program: ProgramWithRelations,
        params: EligibilityParams
): number {
        // Handle programs with no explicit eligibility rules through category-based assessment
        if (program.eligibilityRules.length === 0) {
                return calculateCategoryBasedEligibility(program, params);
        }

        // Group rules by logicGroup for AND/OR evaluation
        const ruleGroups = program.eligibilityRules.reduce((groups, rule) => {
                const group = rule.logicGroup || 0;
                if (!groups[group]) groups[group] = [];
                groups[group].push(rule);
                return groups;
        }, {} as Record<number, EligibilityRule[]>);

        // Evaluate each group - rules within a group use AND logic
        const groupResults = Object.values(ruleGroups).map(rules => {
                const groupMatches = rules.map(rule => {
                        const result = evaluateRule(rule, params);
                        console.log(`Rule evaluation: ${rule.ruleType}`, {
                                result,
                                ruleDetails: rule,
                                paramValue: getParamValue(rule.ruleType, params)
                        });
                        return result;
                });
                return groupMatches.every(Boolean);
        });

        // If any group passes (OR logic between groups), calculate score
        const isEligible = groupResults.some(Boolean);
        if (!isEligible) return 0;

        // Calculate score based on percentage of matching rules
        const totalRules = program.eligibilityRules.length;
        const matchingRules = program.eligibilityRules.filter(rule =>
                evaluateRule(rule, params)
        ).length;

        return (matchingRules / totalRules) * 100;
}

// New function to handle category-based eligibility
function calculateCategoryBasedEligibility(
        program: ProgramWithRelations,
        params: EligibilityParams
): number {
        const age = parseInt(params.age);
        const isUnemployed = params.employmentStatus === '1';
        const hasDisability = params.disabilityStatus !== '1';
        const hasLowIncome = params.monthlyIncome ?
                parseFloat(params.monthlyIncome) < 1000 : true;

        switch (program.category) {
                case 'disability':
                        return hasDisability ? 100 : 0;

                case 'social_assistance':
                        // Eligible if unemployed OR low income OR elderly
                        return (isUnemployed || hasLowIncome || age >= 60) ? 100 : 0;

                case 'education':
                        // School-based programs target youth
                        return age < 18 ? 100 : 0;

                case 'pension':
                        return age >= 60 ? 100 : 0;

                default:
                        return 0;
        }
}

// Enhanced parameter value retrieval without using 'value_type'
function getParamValue(ruleType: string, params: EligibilityParams): string | undefined {
        switch (ruleType) {
                case 'country_of_residence':
                        return params.countryOfResidence; // Returns 'TT' or 'DM'

                case 'income':
                case 'monthly_income':
                        // Assuming 'income' and 'monthly_income' both refer to monthly household income
                        return params.monthlyIncome;

                case 'age':
                        return params.age;

                case 'contributions':
                        return params.contributionsWeeks;

                case 'is_enrolled_in_school':
                        return params.isEnrolledInSchool;

                case 'background_check_status':
                        return params.backgroundCheckStatus;

                case 'affected_by_emergency':
                        return params.affectedByEmergency;

                default:
                        // Handle documentation status fields and other direct mappings
                        if (ruleType.startsWith('has') && ruleType in params) {
                                // Convert boolean to string ('true' or 'false')
                                return params[ruleType as keyof EligibilityParams] ? 'true' : 'false';
                        }

                        // Default to direct parameter lookup
                        return params[ruleType as keyof EligibilityParams]?.toString();
        }
}

// Enhanced rule evaluation without using 'value_type'
export function evaluateRule(rule: EligibilityRule, params: EligibilityParams): boolean {
        const paramValue = getParamValue(rule.ruleType, params);
        if (paramValue === undefined) return false;

        console.log(`Evaluating rule ${rule.ruleType}:`, {
                paramValue,
                operator: rule.operator,
                ruleValue: rule.value
        });

        try {
                if (numericRuleTypes.has(rule.ruleType)) {
                        // Perform numeric comparison
                        return evaluateNumericRule(rule.operator as '>' | '<' | '>=' | '<=', paramValue, rule.value);
                } else {
                        // Perform string comparison
                        return evaluateStringRule(rule.operator as '===', paramValue, rule.value);
                }
        } catch (error) {
                console.error(`Error evaluating rule: ${rule.ruleType}`, error);
                return false;
        }
}

// Helper function for numeric-based rules
function evaluateNumericRule(
        operator: '>' | '<' | '>=' | '<=',
        paramValue: string,
        ruleValue: string
): boolean {
        const numericParam = parseFloat(paramValue);
        const numericRule = parseFloat(ruleValue);

        if (isNaN(numericParam) || isNaN(numericRule)) return false;

        switch (operator) {
                case '>': return numericParam > numericRule;
                case '<': return numericParam < numericRule;
                case '>=': return numericParam >= numericRule;
                case '<=': return numericParam <= numericRule;
                default:
                        console.warn(`Unsupported numeric operator: ${operator}`);
                        return false;
        }
}

// Helper function for string-based rules
function evaluateStringRule(
        operator: '===',
        paramValue: string,
        ruleValue: string
): boolean {
        switch (operator) {
                case '===':
                        return paramValue.toLowerCase() === ruleValue.toLowerCase();
                default:
                        console.warn(`Unsupported string operator: ${operator}`);
                        return false;
        }
}

// Enhanced vulnerability score calculation
function calculateVulnerabilityScore(params: EligibilityParams): number {
        const age = parseInt(params.age);
        const vulnerabilityCriteria = [
                age < 18 || age > 60,
                params.disabilityStatus !== '1',
                params.chronicIllnessStatus !== '1',
                params.employmentStatus === '1',
                params.householdIncomePerPerson ?
                        parseFloat(params.householdIncomePerPerson) < 1000 : true,
                params.numberOfDependents ? parseInt(params.numberOfDependents) > 0 : false
        ];

        return vulnerabilityCriteria.filter(Boolean).length;
}

// Enhanced geographic eligibility check
export function checkGeographicEligibility(
        coverage: GeographicCoverage[],
        region: string
): boolean {
        // If no coverage rules defined, assume national coverage
        if (coverage.length === 0) return true;

        // Check for national coverage first
        const nationalCoverage = coverage.find(c =>
                c.region.toLowerCase() === 'national' &&
                c.coverageType === 'full'
        );
        if (nationalCoverage) return true;

        // Check for specific regional coverage
        const regionCoverage = coverage.find(c => c.region.toLowerCase() === region.toLowerCase());
        if (!regionCoverage) return false;

        return regionCoverage.coverageType === 'full' ||
                (regionCoverage.coverageType === 'partial' && !regionCoverage.specialRequirements);
}
