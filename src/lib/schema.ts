import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Programs Table
export const programs = sqliteTable('programs', {
        id: integer('id').primaryKey(),
        code: text('code').notNull().unique(),
        title: text('program_title').notNull(),
        description: text('description').notNull(),
        countryCode: text('country_code').notNull(),
        category: text('category').notNull(), // pension, disability, education, etc
        type: text('type').notNull(), // cash, in-kind, service
        responsibleOrganization: text('responsible_organization').notNull(),
        minimumBenefit: real('minimum_benefit'),
        maximumBenefit: real('maximum_benefit'),
        benefitFrequency: text('benefit_frequency').notNull(), // monthly, one-time, annual
        reapplicationPeriod: integer('reapplication_period'), // in months
        active: integer('active').notNull().default(1),
        createdAt: text('created_at').notNull(),
        updatedAt: text('updated_at').notNull(),
});

// Define relations for programs
export const programsRelations = relations(programs, ({ many }) => ({
        eligibilityRules: many(eligibilityRules),
        benefitRules: many(benefitRules),
        requiredDocuments: many(requiredDocuments),
        geographicCoverage: many(geographicCoverage),
        colaAdjustments: many(colaAdjustments),
        programIncompatibilities: many(programIncompatibility),
}));

// Eligibility Rules Table
export const eligibilityRules = sqliteTable('eligibility_rules', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        ruleType: text('rule_type').notNull(), // age, income, disability, residence
        operator: text('operator').notNull(), // >, <, >=, <=, =, IN
        value: text('value').notNull(),
        logicGroup: integer('logic_group'), // for AND/OR grouping
        priority: integer('priority'), // evaluation order
        description: text('description'),
        errorMessage: text('error_message'),
        active: integer('active').notNull().default(1),
});

// Define relations for eligibilityRules
export const eligibilityRulesRelations = relations(eligibilityRules, ({ one }) => ({
        program: one(programs, {
                fields: [eligibilityRules.programId],
                references: [programs.id],
        }),
}));

// Benefit Rules Table
export const benefitRules = sqliteTable('benefit_rules', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        conditionType: text('condition_type').notNull(), // household_size, disability_level, etc
        operator: text('operator').notNull(),
        thresholdValue: text('threshold_value').notNull(),
        benefitModifier: real('benefit_modifier').notNull(),
        modifierType: text('modifier_type').notNull(), // multiply, add, subtract, set
        priority: integer('priority'),
        active: integer('active').notNull().default(1),
});

// Define relations for benefitRules
export const benefitRulesRelations = relations(benefitRules, ({ one }) => ({
        program: one(programs, {
                fields: [benefitRules.programId],
                references: [programs.id],
        }),
}));

// Required Documents Table
export const requiredDocuments = sqliteTable('required_documents', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        documentType: text('document_type').notNull(),
        description: text('description'),
        isMandatory: integer('is_mandatory').notNull().default(1),
        alternativesAllowed: integer('alternatives_allowed').notNull().default(0),
        active: integer('active').notNull().default(1),
});

// Define relations for requiredDocuments
export const requiredDocumentsRelations = relations(requiredDocuments, ({ one, many }) => ({
        program: one(programs, {
                fields: [requiredDocuments.programId],
                references: [programs.id],
        }),
        alternatives: many(documentAlternatives),
}));

// Document Alternatives Table
export const documentAlternatives = sqliteTable('document_alternatives', {
        id: integer('id').primaryKey(),
        requiredDocumentId: integer('required_document_id').references(() => requiredDocuments.id).notNull(),
        alternativeType: text('alternative_type').notNull(),
        description: text('description'),
        validationProcess: text('validation_process'),
});

// Define relations for documentAlternatives
export const documentAlternativesRelations = relations(documentAlternatives, ({ one }) => ({
        requiredDocument: one(requiredDocuments, {
                fields: [documentAlternatives.requiredDocumentId],
                references: [requiredDocuments.id],
        }),
}));

// Geographic Coverage Table
export const geographicCoverage = sqliteTable('geographic_coverage', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        region: text('region').notNull(),
        coverageType: text('coverage_type').notNull(), // full, partial, excluded
        specialRequirements: text('special_requirements'),
        active: integer('active').notNull().default(1),
});

// Define relations for geographicCoverage
export const geographicCoverageRelations = relations(geographicCoverage, ({ one }) => ({
        program: one(programs, {
                fields: [geographicCoverage.programId],
                references: [programs.id],
        }),
}));

// Program Incompatibility Table
export const programIncompatibility = sqliteTable('program_incompatibility', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        incompatibleProgramId: integer('incompatible_program_id').references(() => programs.id).notNull(),
        reason: text('reason'),
        allowsTransition: integer('allows_transition').notNull().default(0),
        active: integer('active').notNull().default(1),
});

// Define relations for programIncompatibility
export const programIncompatibilityRelations = relations(programIncompatibility, ({ one }) => ({
        program: one(programs, {
                fields: [programIncompatibility.programId],
                references: [programs.id],
        }),
        incompatibleProgram: one(programs, {
                fields: [programIncompatibility.incompatibleProgramId],
                references: [programs.id],
        }),
}));

// COLA Adjustments Table
export const colaAdjustments = sqliteTable('cola_adjustments', {
        id: integer('id').primaryKey(),
        programId: integer('program_id').references(() => programs.id).notNull(),
        year: integer('year').notNull(),
        adjustmentRate: real('adjustment_rate').notNull(),
        effectiveDate: text('effective_date').notNull(),
        approvedBy: text('approved_by'),
        active: integer('active').notNull().default(1),
});

// Define relations for colaAdjustments
export const colaAdjustmentsRelations = relations(colaAdjustments, ({ one }) => ({
        program: one(programs, {
                fields: [colaAdjustments.programId],
                references: [programs.id],
        }),
}));

// MEB Values Table
export const mebValues = sqliteTable('meb_values', {
        id: integer('id').primaryKey(),
        countryCode: text('country_code').notNull().unique(),
        amount: real('amount').notNull(),
        lastUpdated: text('last_updated').notNull(),
        baseYear: integer('base_year').notNull(),
});

// No relations needed for mebValues
