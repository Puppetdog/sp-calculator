import { type InferSelectModel } from 'drizzle-orm';
import { benefitRules, documentAlternatives, eligibilityRules, geographicCoverage, programs, requiredDocuments } from '../schema';

// Database model types
export type Program = InferSelectModel<typeof programs>;
export type EligibilityRule = InferSelectModel<typeof eligibilityRules>;
export type BenefitRule = InferSelectModel<typeof benefitRules>;
export type RequiredDocument = InferSelectModel<typeof requiredDocuments> & {
        alternatives?: DocumentAlternative[];
};
export type DocumentAlternative = InferSelectModel<typeof documentAlternatives>;
export type GeographicCoverage = InferSelectModel<typeof geographicCoverage>;

// Document types
export const DOCUMENT_TYPES = [
        'national_id',
        'passport',
        'birth_certificate',
        'proof_of_address',
        'income_statement',
        'medical_certificate',
        'school_enrollment',
        'marriage_certificate',
        'bank_statement',
        'tax_return',
        'utility_bill',
        'property_documents',
        'employment_letter',
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number];

// Extended program type with relationships
export type ProgramWithRelations = Program & {
        eligibilityRules: EligibilityRule[];
        benefitRules: BenefitRule[];
        requiredDocuments: (RequiredDocument & {
                alternatives: DocumentAlternative[];
        })[];
        geographicCoverage: GeographicCoverage[];
};
export type ProgramsResponse = {
        programs: ProgramWithRelations[];
        metadata: {
                totalPrograms: number;
                totalCountries: number;
                programsByCategory: Record<string, number>;
                programsByType: Record<string, number>;
        };
};

// Request and response types
export interface ProgramRequest {
        countryCode: string;
        category?: ProgramCategory;
        includeInactive?: boolean;
}

export interface ProgramResponse {
        program: ProgramWithRelations;
        eligibilityScore?: number;
        calculatedBenefit?: number;
        documentationStatus?: {
                [key in DocumentType]?: boolean;
        };
        geographicEligibility?: boolean;
}

// lib/types/enums.ts
export const PROGRAM_CATEGORIES = [
        'pension',
        'disability',
        'education',
        'social_assistance',
        'emergency',
        'health',
        'housing',
        'nutrition',
] as const;

export const BENEFIT_TYPES = [
        'cash',
        'in_kind',
        'service',
        'mixed',
] as const;

export const BENEFIT_FREQUENCIES = [
        'one_time',
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'annual',
] as const;

export const RULE_OPERATORS = [
        '>',
        '<',
        '>=',
        '<=',
        '===',
        'IN',
        'BETWEEN',
        'ANY',
] as const;

export const MODIFIER_TYPES = [
        'multiply',
        'add',
        'subtract',
        'set',
] as const;

export const COVERAGE_TYPES = [
        'full',
        'partial',
        'excluded',
] as const;

// Derived types
export type ProgramCategory = typeof PROGRAM_CATEGORIES[number];
export type BenefitType = typeof BENEFIT_TYPES[number];
export type BenefitFrequency = typeof BENEFIT_FREQUENCIES[number];
export type RuleOperator = typeof RULE_OPERATORS[number];
export type ModifierType = typeof MODIFIER_TYPES[number];
export type CoverageType = typeof COVERAGE_TYPES[number];
