import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

// Define the allowed values as const arrays
export const GENDER_VALUES = ['1', '2', '3', '4'] as const; // 1: Male, 2: Female, 3: Other, 4: All
export const TYPE_OF_DEPENDENTS_VALUES = ['1', '2', '3', '4'] as const; // Define your values
export const EMPLOYMENT_STATUS_VALUES = ['1', '2', '3', '4', '5'] as const;
export const DISABILITY_STATUS_VALUES = ['1', '2', '3', '4'] as const;
export const CHRONIC_ILLNESS_VALUES = ['1', '2', '3', '4'] as const;
export const COUNTRY_VALUES = ['1', '2', '3', '4', '5'] as const;

// Type definitions for the enum-like values
export type Gender = typeof GENDER_VALUES[number];
export type TypeOfDependents = typeof TYPE_OF_DEPENDENTS_VALUES[number];
export type EmploymentStatus = typeof EMPLOYMENT_STATUS_VALUES[number];
export type DisabilityStatus = typeof DISABILITY_STATUS_VALUES[number];
export type ChronicIllnessStatus = typeof CHRONIC_ILLNESS_VALUES[number];
export type CountryCode = typeof COUNTRY_VALUES[number];

export const programs = sqliteTable('programs', {
        id: integer('id').primaryKey(),
        // General Information
        programTitle: text('program_title').notNull(),
        responsibleOrganization: text('responsible_organization').notNull(),
        programDescription: text('program_description').notNull(),
        // Eligibility Criteria
        ageMinimum: integer('age_minimum').notNull(),
        ageMaximum: integer('age_maximum').notNull(),
        gender: text('gender', { enum: GENDER_VALUES }).notNull(),
        numberOfDependents: integer('number_of_dependents').notNull(),
        typeOfDependents: text('type_of_dependents', { enum: TYPE_OF_DEPENDENTS_VALUES }).notNull(),
        employmentStatus: text('employment_status', { enum: EMPLOYMENT_STATUS_VALUES }).notNull(),
        disabilityStatus: text('disability_status', { enum: DISABILITY_STATUS_VALUES }).notNull(),
        chronicIllnessStatus: text('chronic_illness_status', { enum: CHRONIC_ILLNESS_VALUES }).notNull(),
        householdSize: integer('household_size').notNull(),
        programCountry: text('program_country', { enum: COUNTRY_VALUES }).notNull(),
        citizenshipRequired: integer('citizenship_required').notNull(),
        // Benefit Information
        cashTransfer: integer('cash_transfer').notNull(),
        cashTransferMonthlyAmount: integer('cash_transfer_monthly_amount'),
        inKindTransfer: integer('in_kind_transfer').notNull(),
        inKindDollarValueAmt: integer('in_kind_dollar_value_amt'),
});

export const benefitConditions = sqliteTable('benefit_conditions', {
        id: integer('id').primaryKey(),
        programId: integer('program_id')
                .references(() => programs.id)
                .notNull(),
        benefitType: text('benefit_type', { enum: ['cash', 'in-kind'] }).notNull(),
        conditionField: text('condition_field').notNull(),
        conditionOperator: text('condition_operator', {
                enum: ['>', '<', '>=', '<=', '===', '!==']
        }).notNull(),
        conditionValue: text('condition_value').notNull(),
        benefitAmount: integer('benefit_amount').notNull(),
});

// Export interface for eligibility parameters that matches the form data
export interface EligibilityParams {
        age: string;
        gender: Gender;
        numberOfDependents: string;
        typeOfDependents: TypeOfDependents;
        employmentStatus: EmploymentStatus;
        disabilityStatus: DisabilityStatus;
        chronicIllnessStatus: ChronicIllnessStatus;
        householdSize: string;
        countryOfOrigin: CountryCode;
        countryOfResidence: CountryCode;
}

// Zod schema for program validation
export const ProgramSchema = z.object({
        id: z.number(),
        programTitle: z.string(),
        responsibleOrganization: z.string(),
        programDescription: z.string(),
        ageMinimum: z.number(),
        ageMaximum: z.number(),
        gender: z.enum(GENDER_VALUES),
        numberOfDependents: z.number(),
        typeOfDependents: z.enum(TYPE_OF_DEPENDENTS_VALUES),
        employmentStatus: z.enum(EMPLOYMENT_STATUS_VALUES),
        disabilityStatus: z.enum(DISABILITY_STATUS_VALUES),
        chronicIllnessStatus: z.enum(CHRONIC_ILLNESS_VALUES),
        householdSize: z.number(),
        programCountry: z.enum(COUNTRY_VALUES),
        citizenshipRequired: z.number(),
        cashTransfer: z.number(),
        cashTransferMonthlyAmount: z.number().nullable(),
        inKindTransfer: z.number(),
        inKindDollarValueAmt: z.number().nullable(),
});

// Export the inferred types
export type Program = typeof programs.$inferInsert;
export type ProgramSelect = typeof programs.$inferSelect;
export type BenefitCondition = typeof benefitConditions.$inferInsert;
export type BenefitConditionSelect = typeof benefitConditions.$inferSelect;
