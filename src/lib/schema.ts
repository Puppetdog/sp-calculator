import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const programs = sqliteTable('programs', {
        id: integer('id').primaryKey(),
        programTitle: text('program_title').notNull(),
        responsibleOrganization: text('responsible_organization').notNull(),
        programDescription: text('program_description').notNull(),
        duration: integer('duration').notNull(),
        ageMinimum: integer('age_minimum').notNull(),
        ageMaximum: integer('age_maximum').notNull(),
        gender: text('gender').notNull(),
        numberOfDependents: integer('number_of_dependents').notNull(),
        typeOfDependents: text('type_of_dependents').notNull(),
        employmentStatus: text('employment_status').notNull(),
        disabilityStatus: text('disability_status').notNull(),
        chronicIllnessStatus: text('chronic_illness_status').notNull(),
        householdSize: integer('household_size').notNull(),
        countryOfOrigin: text('country_of_origin').notNull(),
        countryOfResidence: text('country_of_residence').notNull(),
        preRequisitePrograms: text('pre_requisite_programs'),
        cashTransferMonthly: integer('cash_transfer_monthly').notNull(),
        inKindDollarValueAmt: integer('in_kind_dollar_value_amt').notNull(),
});

export const benefitConditions = sqliteTable('benefit_conditions', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id),
        benefitType: text('benefit_type').notNull(), // 'cash' or 'in-kind'
        conditionField: text('condition_field').notNull(), // e.g., 'householdSize'
        conditionOperator: text('condition_operator').notNull(), // e.g., '>', '<=', '=='
        conditionValue: text('condition_value').notNull(), // Value to compare against
        benefitAmount: integer('benefit_amount').notNull(),
});
