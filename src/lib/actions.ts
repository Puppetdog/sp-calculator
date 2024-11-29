import { cache } from 'react';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { programs, eligibilityRules, benefitRules, requiredDocuments, geographicCoverage, mebValues, programIncompatibility } from './schema';
import type { BenefitRule, ProgramWithRelations, RequiredDocument } from '@/lib/types/programs';
import { calculateEligibilityScore, checkGeographicEligibility } from '@/lib/utils/calculations';
import { EligibilityParams } from './types/eligibility';
import { colaAdjustments } from './schema';
import { transformFormData } from './utils/transformers';
import { FormSubmissionData } from './types/forms';
import { BenefitFrequency, convertToMonthly } from './utils/benefitConversions';

/**
 * Retrieves eligible programs based on provided parameters
 * Cached at the request level using React cache()
 */
export interface ProcessedProgramResponse {
        program: {
                id: number;
                code: string;
                title: string;
                description: string;
                countryCode: string;
                category: string;
                type: string;
                responsibleOrganization: string;
                minimumBenefit: number | null;
                maximumBenefit: number | null;
                benefitFrequency: string;
                reapplicationPeriod: number | null;
                active: number;
                createdAt: string;
                updatedAt: string;
                eligibilityRules: {
                        id: number;
                        programId: number;
                        ruleType: string;
                        operator: string;
                        value: string;
                        logicGroup: number | null;
                        priority: number | null;
                        description: string | null;
                        errorMessage: string | null;
                        active: number;
                }[];
                benefitRules: {
                        id: number;
                        programId: number;
                        conditionType: string;
                        operator: string;
                        thresholdValue: string;
                        benefitModifier: number;
                        modifierType: string;
                        priority: number | null;
                        active: number;
                }[];
                geographicCoverage: {
                        id: number;
                        programId: number;
                        region: string;
                        coverageType: string;
                        specialRequirements: string | null;
                        active: number;
                }[];
        };
        eligibilityScore: number;
        calculatedBenefit: number;
        documentationStatus: DocumentationStatusMap;
        geographicEligibility: boolean;
}
function isProcessedProgramResponse(result: ProcessedProgramResponse | null): result is ProcessedProgramResponse {
        return result !== null;
}

export const getEligiblePrograms = cache(async (formData: FormSubmissionData): Promise<ProcessedProgramResponse[]> => {
        // Transform form data to eligibility params
        const params = transformFormData(formData);
        // Log transformed params for debugging
        console.log('Transformed params:', params);


        try {
                const programsWithRelations = await db.query.programs.findMany({
                        where: and(
                                eq(programs.active, 1),
                                eq(programs.countryCode, params.countryOfResidence)
                        ),
                        with: {
                                eligibilityRules: {
                                        where: eq(eligibilityRules.active, 1),
                                        orderBy: eligibilityRules.priority
                                },
                                benefitRules: {
                                        where: eq(benefitRules.active, 1),
                                        orderBy: benefitRules.priority
                                },
                                requiredDocuments: {
                                        where: eq(requiredDocuments.active, 1),
                                        with: {
                                                alternatives: true
                                        }
                                },
                                geographicCoverage: {
                                        where: eq(geographicCoverage.active, 1)
                                }
                        }


                });

                const eligiblePrograms = await Promise.all(
                        programsWithRelations.map(async program => {
                                const eligibilityScore = calculateEligibilityScore(program, params);

                                if (eligibilityScore === 0) {
                                        return null;
                                }

                                const calculatedBenefit = await calculateBenefitAmount(program.id, params);
                                const geographicEligibility = checkGeographicEligibility(
                                        program.geographicCoverage,
                                        params.countryOfResidence
                                );

                                if (!geographicEligibility) {
                                        return null;
                                }

                                return {
                                        program,
                                        eligibilityScore,
                                        calculatedBenefit,
                                        documentationStatus: generateDocumentationStatus(program.requiredDocuments, params),
                                        geographicEligibility
                                } as ProcessedProgramResponse;
                        })
                );
                return eligiblePrograms
                        .filter(isProcessedProgramResponse)
                        .sort((a, b) => {
                                if (!a || !b) return 0;
                                return b.eligibilityScore - a.eligibilityScore;
                        });

        } catch (error) {
                console.error('Error fetching eligible programs:', error);
                throw new Error('Failed to fetch eligible programs');
        }
});




/**
 * Calculates benefit amount for a specific program
 */

export async function calculateBenefitAmount(programId: number, params: EligibilityParams): Promise<number> {
        try {
                // Explicitly type the query result
                type ProgramWithBenefits = {
                        benefitFrequency: string;
                        minimumBenefit: number | null;
                        maximumBenefit: number | null;
                        benefitRules: Array<BenefitRule & {
                                conditionType: string;
                                thresholdValue: string;
                                benefitModifier: number;
                                operator: '>' | '<' | '>=' | '<=' | '===';
                                modifierType: 'multiply' | 'add' | 'subtract' | 'set';
                        }>;
                };

                const program = await db.query.programs.findFirst({
                        where: eq(programs.id, programId),
                        with: {
                                benefitRules: {
                                        where: eq(benefitRules.active, 1),
                                        orderBy: benefitRules.priority
                                }
                        }
                }) as ProgramWithBenefits | null;

                if (!program) throw new Error('Program not found');

                let benefit = program.minimumBenefit || 0;

                // Utility function to convert snake_case to camelCase
                function snakeToCamel(s: string): string {
                        return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                }

                function evaluateBenefitRule(rule: ProgramWithBenefits['benefitRules'][number], params: EligibilityParams): boolean {
                        console.log('rule:', rule);
                        console.log('parameters', params);

                        // Convert snake_case to camelCase
                        const camelKey = snakeToCamel(rule.conditionType) as keyof EligibilityParams;
                        const paramValue = params[camelKey];

                        console.log('paramValue:', paramValue);

                        if (typeof paramValue !== 'string') return false;

                        const threshold = parseFloat(rule.thresholdValue);
                        const value = parseFloat(paramValue);

                        if (isNaN(threshold) || isNaN(value)) return false;

                        switch (rule.operator) {
                                case '>': return value > threshold;
                                case '<': return value < threshold;
                                case '>=': return value >= threshold;
                                case '<=': return value <= threshold;
                                case '===': return value === threshold;
                                default: return false;
                        }
                }

                for (const rule of program.benefitRules) {
                        if (evaluateBenefitRule(rule, params)) {
                                switch (rule.modifierType) {
                                        case 'multiply':
                                                benefit *= rule.benefitModifier;
                                                break;
                                        case 'add':
                                                benefit += rule.benefitModifier;
                                                break;
                                        case 'subtract':
                                                benefit -= rule.benefitModifier;
                                                break;
                                        case 'set':
                                                benefit = rule.benefitModifier;
                                                break;
                                }
                        }
                }

                return convertToMonthly(Math.min(
                        Math.max(benefit, program.minimumBenefit || 0),
                        program.maximumBenefit || Infinity
                ), program.benefitFrequency as BenefitFrequency);

        } catch (error) {
                console.error('Error calculating benefit amount:', error);
                throw new Error('Failed to calculate benefit amount');
        }
}



/**
 * Calculates the benefits gap against MEB (Minimum Expenditure Basket)
 */

export interface BenefitsGapResult {
        totalBenefits: number;
        mebAmount: number;
        gap: number;
        coverage: number;
}

export async function calculateBenefitsGap(formData: FormSubmissionData): Promise<BenefitsGapResult> {
        try {
                const params = transformFormData(formData);
                const [eligiblePrograms, meb] = await Promise.all([
                        getEligiblePrograms(formData),
                        getMEBAmount(params.countryOfResidence)
                ]);

                const totalBenefits = eligiblePrograms.reduce(
                        (sum, program) => sum + program.calculatedBenefit,
                        0
                );

                return {
                        totalBenefits,
                        mebAmount: meb.amount,
                        gap: Math.max(0, meb.amount - totalBenefits),
                        coverage: (totalBenefits / meb.amount) * 100
                };
        } catch (error) {
                console.error('Error calculating benefits gap:', error);
                throw new Error('Failed to calculate benefits gap');
        }
}



/**
 * Retrieves MEB amount for a specific country
 */
export async function getMEBAmount(countryCode: string) {
        const meb = await db.query.mebValues.findFirst({
                where: eq(mebValues.countryCode, countryCode)
        });

        if (!meb) {
                throw new Error(`No MEB data found for country: ${countryCode}`);
        }

        return meb;
}

/**
 * Generates documentation status based on provided parameters
 */

interface DocumentationStatusMap {
        [key: string]: boolean;
}

function generateDocumentationStatus(
        requiredDocs: RequiredDocument[],
        params: EligibilityParams
): DocumentationStatusMap {
        const status: DocumentationStatusMap = {};

        for (const doc of requiredDocs) {
                // Create the property key with proper type checking
                const documentKey = `has${doc.documentType.charAt(0).toUpperCase() + doc.documentType.slice(1)}` as keyof EligibilityParams;

                // Get the value with explicit boolean conversion
                const paramValue = params[documentKey];
                const hasMainDocument = typeof paramValue === 'boolean' ? paramValue : false;

                // Handle alternatives with proper type checking
                const hasAlternative = doc.alternatives?.some(alt => {
                        const altKey = `has${alt.alternativeType.charAt(0).toUpperCase() + alt.alternativeType.slice(1)}` as keyof EligibilityParams;
                        const altValue = params[altKey];
                        return typeof altValue === 'boolean' ? altValue : false;
                }) ?? false;

                // Assign the final boolean value
                status[doc.documentType as string] = hasMainDocument || hasAlternative;
        }

        return status;
}


/**
 * Updates program benefit amounts based on COLA (Cost of Living Adjustment)
 * This is an admin function that should be protected
 */
export async function updateProgramBenefits(programId: number, adjustmentRate: number) {
        try {
                await db.transaction(async tx => {
                        const program = await tx.query.programs.findFirst({
                                where: eq(programs.id, programId)
                        });

                        if (!program) throw new Error('Program not found');

                        // Update benefit amounts
                        await tx.update(programs).set({
                                minimumBenefit: sql`ROUND(${programs.minimumBenefit} * (1 + ${adjustmentRate}), 2)`,
                                maximumBenefit: sql`ROUND(${programs.maximumBenefit} * (1 + ${adjustmentRate}), 2)`,
                                updatedAt: sql`CURRENT_TIMESTAMP`
                        }).where(eq(programs.id, programId));

                        // Record the adjustment
                        await tx.insert(colaAdjustments).values({
                                programId,
                                adjustmentRate,
                                effectiveDate: new Date().toISOString(),
                                year: new Date().getFullYear()
                        });
                });

        } catch (error) {
                console.error('Error updating program benefits:', error);
                throw new Error('Failed to update program benefits');
        }
}

export async function getProgramDetails(programId: number): Promise<ProgramWithRelations> {
        const program = await db.query.programs.findFirst({
                where: eq(programs.id, programId),
                with: {
                        eligibilityRules: {
                                where: eq(eligibilityRules.active, 1)
                        },
                        benefitRules: {
                                where: eq(benefitRules.active, 1)
                        },
                        requiredDocuments: {
                                where: eq(requiredDocuments.active, 1),
                                with: {
                                        alternatives: true
                                }
                        },
                        geographicCoverage: {
                                where: eq(geographicCoverage.active, 1)
                        }
                }
        });

        if (!program) {
                throw new Error('Program not found');
        }

        return program;
}

/**
 * Interface representing a program with calculated metadata
 */
export interface EnhancedProgramResponse {
        program: ProgramWithRelations; // Using existing ProgramWithRelations type
        metadata: {
                documentationRequirements: {
                        total: number;
                        mandatoryCount: number;
                        allowsAlternatives: number;
                };
                eligibilityRules: {
                        total: number;
                        activeRules: number;
                        priorityRules: number;
                };
                benefits: {
                        minimumMonthly: number | null;
                        maximumMonthly: number | null;
                        reapplicationPeriod: number | null;
                };
                coverage: {
                        regions: string[];
                        coverageTypes: string[];
                };
        };
}

/**
 * Enhanced version of listAllPrograms that includes calculated metadata
 */
export const listEnhancedPrograms = cache(async (): Promise<EnhancedProgramResponse[]> => {
        try {
                // First fetch all programs with their relations using existing query structure
                const allPrograms = await db.query.programs.findMany({
                        where: eq(programs.active, 1),
                        with: {
                                eligibilityRules: {
                                        where: eq(eligibilityRules.active, 1),
                                },
                                benefitRules: {
                                        where: eq(benefitRules.active, 1),
                                },
                                requiredDocuments: {
                                        where: eq(requiredDocuments.active, 1),
                                        with: {
                                                alternatives: true
                                        }
                                },
                                geographicCoverage: {
                                        where: eq(geographicCoverage.active, 1)
                                }
                        }
                });

                // Transform each program to include metadata
                return allPrograms.map(program => ({
                        program,
                        metadata: {
                                documentationRequirements: {
                                        total: program.requiredDocuments.length,
                                        mandatoryCount: program.requiredDocuments.filter(doc => doc.isMandatory).length,
                                        allowsAlternatives: program.requiredDocuments.filter(doc => doc.alternativesAllowed).length
                                },
                                eligibilityRules: {
                                        total: program.eligibilityRules.length,
                                        activeRules: program.eligibilityRules.filter(rule => rule.active).length,
                                        priorityRules: program.eligibilityRules.filter(rule => rule.priority !== null).length
                                },
                                benefits: {
                                        minimumMonthly: program.minimumBenefit,
                                        maximumMonthly: program.maximumBenefit,
                                        reapplicationPeriod: program.reapplicationPeriod
                                },
                                coverage: {
                                        regions: Array.from(new Set(program.geographicCoverage.map(gc => gc.region))),
                                        coverageTypes: Array.from(new Set(program.geographicCoverage.map(gc => gc.coverageType)))
                                }
                        }
                }));

        } catch (error) {
                console.error('Error fetching enhanced programs:', error);
                throw new Error('Failed to fetch programs');
        }
});

/**
 * Helper function to calculate total number of documents across programs
 */
export function calculateTotalDocuments(programs: EnhancedProgramResponse[]): number {
        return programs.reduce((total, p) => total + p.metadata.documentationRequirements.total, 0);
}

/**
 * Helper function to get unique regions across all programs
 */
export function calculateUniqueRegions(programs: EnhancedProgramResponse[]): number {
        const allRegions = new Set(
                programs.flatMap(p => p.metadata.coverage.regions)
        );
        return allRegions.size;
}

export async function processEligibilityForm(formData: FormSubmissionData) {
        try {
                // Get eligible programs
                const eligiblePrograms = await getEligiblePrograms(formData);

                // Calculate benefits gap
                const benefitsGap = await calculateBenefitsGap(formData);

                // Return encoded results
                return encodeURIComponent(JSON.stringify({
                        eligiblePrograms,
                        benefitsGap
                }));
        } catch (error) {
                console.error('Error processing eligibility:', error);
                throw new Error('Failed to process eligibility');
        }
}
