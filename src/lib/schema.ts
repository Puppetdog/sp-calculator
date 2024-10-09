
import { sqliteTable, text, integer, SQLiteBoolean } from 'drizzle-orm/sqlite-core';

export const programs = sqliteTable('programs', {
        id: integer('id').primaryKey(),

        // General Information
        programTitle: text('program_title').notNull(),
        responsibleOrganization: text('responsible_organization').notNull(),
        programDescription: text('program_description').notNull(),

        // Eligibility Criteria
        ageMinimum: integer('age_minimum').notNull(),
        ageMaximum: integer('age_maximum').notNull(),
        gender: text('gender').notNull(),
        numberOfDependents: integer('number_of_dependents').notNull(),
        typeOfDependents: text('type_of_dependents').notNull(),
        employmentStatus: text('employment_status').notNull(),
        disabilityStatus: text('disability_status').notNull(),
        chronicIllnessStatus: text('chronic_illness_status').notNull(),
        householdSize: integer('household_size').notNull(),
        programCountry: text('program_country').notNull(),
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
        benefitType: text('benefit_type').notNull(),
        conditionField: text('condition_field').notNull(),
        conditionOperator: text('condition_operator').notNull(),
        conditionValue: text('condition_value').notNull(),
        benefitAmount: integer('benefit_amount').notNull(),
});
