// lib/utils/calculations.ts

import type { EligibilityRule, GeographicCoverage, ProgramWithRelations } from '@/lib/types/programs';
import type { EligibilityParams } from '@/lib/types/eligibility';

// Main function to calculate eligibility score for a program
export function calculateEligibilityScore(
        program: ProgramWithRelations,
        params: EligibilityParams
): number {
        // Handle programs with no explicit eligibility rules through category-based assessment
        if (program.eligibilityRules.length === 0) {
                return calculateCategoryBasedEligibility(program, params);
        }

        // Group rules by logic group for AND/OR evaluation
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
                                params: getParamValue(rule.ruleType, params)
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

// Enhanced parameter value retrieval
function getParamValue(ruleType: string, params: EligibilityParams): string | undefined {
        // Handle special case parameters
        switch (ruleType) {
                case 'residency':
                        return params.hasProofOfResidence ? 'citizen_or_resident' : 'non_resident';

                case 'income':
                        // Convert monthly income to daily for poverty line comparisons
                        if (params.monthlyIncome) {
                                const monthlyIncome = parseFloat(params.monthlyIncome);
                                return (monthlyIncome / 30).toString();
                        }
                        return '0';

                case 'age_range':
                        return params.age;

                case 'vulnerability_status':
                        return calculateVulnerabilityScore(params) >= 2 ? 'vulnerable' : 'not_vulnerable';

                case 'employment_status':
                        return params.employmentStatus;

                case 'disability_status':
                        return params.disabilityStatus;

                case 'household_size':
                        return params.householdSize;

                case 'dependency_ratio':
                        if (params.numberOfDependents && params.householdSize) {
                                const dependents = parseInt(params.numberOfDependents);
                                const household = parseInt(params.householdSize);
                                return household > 0 ? (dependents / household).toString() : '0';
                        }
                        return '0';

                default:
                        // Handle documentation status fields
                        if (ruleType.startsWith('has') && ruleType in params) {
                                return params[ruleType as keyof EligibilityParams]?.toString();
                        }

                        // Default to direct parameter lookup
                        return params[ruleType as keyof EligibilityParams]?.toString();
        }
}

// Enhanced rule evaluation
export function evaluateRule(rule: EligibilityRule, params: EligibilityParams): boolean {
        const paramValue = getParamValue(rule.ruleType, params);
        if (paramValue === undefined) return false;

        console.log(`Evaluating rule ${rule.ruleType}:`, {
                paramValue,
                operator: rule.operator,
                ruleValue: rule.value
        });

        try {
                switch (rule.operator) {
                        case '>':
                        case '<':
                        case '>=':
                        case '<=':
                                return evaluateNumericRule(rule.operator, paramValue, rule.value);

                        case '===':
                                return paramValue.toLowerCase() === rule.value.toLowerCase();

                        case 'IN':
                                return evaluateInRule(paramValue, rule.value);

                        case 'BETWEEN':
                                return evaluateBetweenRule(paramValue, rule.value);

                        case 'ANY':
                                return evaluateAnyRule(paramValue, rule.value);

                        default:
                                console.warn(`Unknown operator: ${rule.operator}`);
                                return false;
                }
        } catch (error) {
                console.error(`Error evaluating rule: ${rule.ruleType}`, error);
                return false;
        }
}

// Helper functions for rule evaluation
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
        }
}

function evaluateInRule(paramValue: string, ruleValue: string): boolean {
        const validValues = ruleValue.split(',').map(v => v.trim().toLowerCase());
        return validValues.includes(paramValue.toLowerCase());
}

function evaluateBetweenRule(paramValue: string, ruleValue: string): boolean {
        const [min, max] = ruleValue.split(',').map(v => parseFloat(v.trim()));
        const value = parseFloat(paramValue);

        if (isNaN(value) || isNaN(min) || isNaN(max)) return false;
        return value >= min && value <= max;
}

function evaluateAnyRule(paramValue: string, ruleValue: string): boolean {
        const paramValues = paramValue.split(',').map(v => v.trim().toLowerCase());
        const validValues = ruleValue.split(',').map(v => v.trim().toLowerCase());
        return paramValues.some(value => validValues.includes(value));
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
