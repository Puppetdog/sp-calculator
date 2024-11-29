
// lib/utils/calculations.ts

import type { EligibilityRule, GeographicCoverage, ProgramWithRelations } from '@/lib/types/programs';
import type { EligibilityParams } from '@/lib/types/eligibility';

/**
 * A set of rule types that require numeric comparisons.
 * Any rule type not in this set will be treated as a string comparison.
 */
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

/**
 * Calculates the eligibility score for a given program based on the provided parameters.
 * 
 * @param program - The program for which eligibility is being calculated.
 * @param params - The applicant's eligibility parameters.
 * @returns A score between 0 and 100 indicating eligibility.
 */
export function calculateEligibilityScore(
        program: ProgramWithRelations,
        params: EligibilityParams
): number {
        // Handle programs with no explicit eligibility rules through category-based assessment
        if (program.eligibilityRules.length === 0) {
                return calculateCategoryBasedEligibility(program, params);
        }

        // Group rules by logic_group for AND/OR evaluation
        const ruleGroups = groupRulesByLogicGroup(program.eligibilityRules);

        // Evaluate each group - rules within a group use AND logic
        const groupResults = Object.values(ruleGroups).map(rules => {
                return rules.every(rule => evaluateRule(rule, params));
        });

        // If any group passes (OR logic between groups), calculate score
        const isEligible = groupResults.some(result => result === true);
        if (!isEligible) return 0;

        // Calculate score based on the percentage of matching rules
        const totalRules = program.eligibilityRules.length;
        const matchingRules = program.eligibilityRules.filter(rule => evaluateRule(rule, params)).length;

        // Return eligibility as a percentage
        return (matchingRules / totalRules) * 100;
}

/**
 * Groups eligibility rules by their logic_group.
 * 
 * @param rules - The list of eligibility rules.
 * @returns An object where each key is a logic_group number and the value is an array of rules.
 */
function groupRulesByLogicGroup(rules: EligibilityRule[]): Record<number, EligibilityRule[]> {
        return rules.reduce((groups, rule) => {
                const group = rule.logic_group || 0; // Default to group 0 if not specified
                if (!groups[group]) groups[group] = [];
                groups[group].push(rule);
                return groups;
        }, {} as Record<number, EligibilityRule[]>);
}

/**
 * Calculates eligibility based on program category when no explicit eligibility rules are defined.
 * 
 * @param program - The program for which eligibility is being calculated.
 * @param params - The applicant's eligibility parameters.
 * @returns A score of 100 if eligible, otherwise 0.
 */
function calculateCategoryBasedEligibility(
        program: ProgramWithRelations,
        params: EligibilityParams
): number {
        const age = parseInt(params.age);
        const isUnemployed = params.employmentStatus === '1';
        const hasDisability = params.disabilityStatus !== '1';
        const hasLowIncome = params.monthlyIncome
                ? parseFloat(params.monthlyIncome) < 1000
                : true;

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

/**
 * Retrieves the parameter value from EligibilityParams based on the rule type.
 * 
 * @param ruleType - The type of the rule.
 * @param params - The applicant's eligibility parameters.
 * @returns The corresponding parameter value as a string, or undefined if not found.
 */
function getParamValue(ruleType: string, params: EligibilityParams): string | undefined {
        switch (ruleType) {
                case 'country_of_residence':
                        return params.countryOfResidence; // Expected: 'TT' or 'LC'

                case 'income':
                case 'monthly_income':
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
                        // Handle boolean fields prefixed with 'has'
                        if (ruleType.startsWith('has') && ruleType in params) {
                                // Convert boolean to string ('true' or 'false')
                                const paramKey = ruleType as keyof EligibilityParams;
                                return params[paramKey] ? 'true' : 'false';
                        }

                        // Handle other direct mappings
                        if (ruleType in params) {
                                const paramKey = ruleType as keyof EligibilityParams;
                                return params[paramKey]?.toString();
                        }

                        // If ruleType does not match any EligibilityParams field
                        console.warn(`Unrecognized rule_type: ${ruleType}`);
                        return undefined;
        }
}

/**
 * Evaluates a single eligibility rule against the provided parameters.
 * 
 * @param rule - The eligibility rule to evaluate.
 * @param params - The applicant's eligibility parameters.
 * @returns True if the rule is satisfied, otherwise false.
 */
export function evaluateRule(rule: EligibilityRule, params: EligibilityParams): boolean {
        const paramValue = getParamValue(rule.rule_type, params);
        if (paramValue === undefined) {
                console.warn(`No parameter value found for rule_type: ${rule.rule_type}`);
                return false;
        }

        console.log(`Evaluating rule ${rule.rule_type}:`, {
                paramValue,
                operator: rule.operator,
                ruleValue: rule.value
        });

        try {
                if (numericRuleTypes.has(rule.rule_type)) {
                        // Perform numeric comparison
                        return evaluateNumericRule(rule.operator as '>' | '<' | '>=' | '<=', paramValue, rule.value);
                } else {
                        // Perform string comparison
                        return evaluateStringRule(rule.operator as '===', paramValue, rule.value);
                }
        } catch (error) {
                console.error(`Error evaluating rule: ${rule.rule_type}`, error);
                return false;
        }
}

/**
 * Helper function to perform numeric comparisons.
 * 
 * @param operator - The comparison operator ('>', '<', '>=', '<=').
 * @param paramValue - The applicant's parameter value as a string.
 * @param ruleValue - The rule's threshold value as a string.
 * @returns True if the comparison holds, otherwise false.
 */
function evaluateNumericRule(
        operator: '>' | '<' | '>=' | '<=',
        paramValue: string,
        ruleValue: string
): boolean {
        const numericParam = parseFloat(paramValue);
        const numericRule = parseFloat(ruleValue);

        if (isNaN(numericParam) || isNaN(numericRule)) {
                console.warn(`Invalid numeric values: paramValue=${paramValue}, ruleValue=${ruleValue}`);
                return false;
        }

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

/**
 * Helper function to perform string comparisons.
 * 
 * @param operator - The comparison operator ('===').
 * @param paramValue - The applicant's parameter value as a string.
 * @param ruleValue - The rule's threshold value as a string.
 * @returns True if the comparison holds, otherwise false.
 */
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

/**
 * Calculates the vulnerability score based on various criteria.
 * 
 * @param params - The applicant's eligibility parameters.
 * @returns The number of vulnerability criteria met.
 */
function calculateVulnerabilityScore(params: EligibilityParams): number {
        const age = parseInt(params.age);
        const vulnerabilityCriteria = [
                age < 18 || age > 60,
                params.disabilityStatus !== '1',
                params.chronicIllnessStatus !== '1',
                params.employmentStatus === '1',
                params.householdIncomePerPerson
                        ? parseFloat(params.householdIncomePerPerson) < 1000
                        : true,
                params.numberOfDependents
                        ? parseInt(params.numberOfDependents) > 0
                        : false
        ];

        return vulnerabilityCriteria.filter(Boolean).length;
}

/**
 * Checks if the applicant's region is covered by the program.
 * 
 * @param coverage - The geographic coverage details of the program.
 * @param region - The region of the applicant.
 * @returns True if the region is covered, otherwise false.
 */
export function checkGeographicEligibility(
        coverage: GeographicCoverage[],
        region: string
): boolean {
        // If no coverage rules defined, assume national coverage
        if (coverage.length === 0) return true;

        // Check for national coverage first
        const nationalCoverage = coverage.find(c =>
                c.region.toLowerCase() === 'national' &&
                c.coverage_type === 'full'
        );
        if (nationalCoverage) return true;

        // Check for specific regional coverage
        const regionCoverage = coverage.find(c =>
                c.region.toLowerCase() === region.toLowerCase()
        );
        if (!regionCoverage) return false;

        return regionCoverage.coverage_type === 'full' ||
                (regionCoverage.coverage_type === 'partial' && !regionCoverage.special_requirements);
}
