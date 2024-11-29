CREATE TABLE `benefit_rules` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `condition_type` text NOT NULL,
    `operator` text NOT NULL,
    `threshold_value` text NOT NULL,
    `benefit_modifier` real NOT NULL,
    `modifier_type` text NOT NULL,
    `priority` integer,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `cola_adjustments` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `year` integer NOT NULL,
    `adjustment_rate` real NOT NULL,
    `effective_date` text NOT NULL,
    `approved_by` text,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `document_alternatives` (
    `id` integer PRIMARY KEY NOT NULL,
    `required_document_id` integer NOT NULL,
    `alternative_type` text NOT NULL,
    `description` text,
    `validation_process` text,
    FOREIGN KEY (`required_document_id`) REFERENCES `required_documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `eligibility_rules` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `rule_type` text NOT NULL,
    `operator` text NOT NULL,
    `value` text NOT NULL,
    `logic_group` integer,
    `priority` integer,
    `description` text,
    `error_message` text,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `geographic_coverage` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `region` text NOT NULL,
    `coverage_type` text NOT NULL,
    `special_requirements` text,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `meb_values` (
    `id` integer PRIMARY KEY NOT NULL,
    `country_code` text NOT NULL,
    `amount` real NOT NULL,
    `last_updated` text NOT NULL,
    `base_year` integer NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX `meb_values_country_code_unique` ON `meb_values` (`country_code`);
--> statement-breakpoint

CREATE TABLE `program_incompatibility` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `incompatible_program_id` integer NOT NULL,
    `reason` text,
    `allows_transition` integer DEFAULT 0 NOT NULL,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`incompatible_program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `required_documents` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `document_type` text NOT NULL,
    `description` text,
    `is_mandatory` integer DEFAULT 1 NOT NULL,
    `alternatives_allowed` integer DEFAULT 0 NOT NULL,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

-- Add new columns with DEFAULT values
ALTER TABLE `programs` ADD `code` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `programs` ADD `description` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `programs` ADD `country_code` text NOT NULL DEFAULT 'US';  -- Example default
--> statement-breakpoint
ALTER TABLE `programs` ADD `category` text NOT NULL DEFAULT 'General';
--> statement-breakpoint
ALTER TABLE `programs` ADD `type` text NOT NULL DEFAULT 'Standard';
--> statement-breakpoint
ALTER TABLE `programs` ADD `minimum_benefit` real;
--> statement-breakpoint
ALTER TABLE `programs` ADD `maximum_benefit` real;
--> statement-breakpoint
ALTER TABLE `programs` ADD `benefit_frequency` text NOT NULL DEFAULT 'Monthly';
--> statement-breakpoint
ALTER TABLE `programs` ADD `reapplication_period` integer;
--> statement-breakpoint
ALTER TABLE `programs` ADD `active` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `programs` ADD `created_at` text NOT NULL DEFAULT '1970-01-01 00:00:00';
--> statement-breakpoint
ALTER TABLE `programs` ADD `updated_at` text NOT NULL DEFAULT '1970-01-01 00:00:00';
--> statement-breakpoint

CREATE UNIQUE INDEX `programs_code_unique` ON `programs` (`code`);
--> statement-breakpoint

-- Drop old columns
ALTER TABLE `programs` DROP COLUMN `program_description`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `age_minimum`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `age_maximum`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `gender`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `number_of_dependents`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `type_of_dependents`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `employment_status`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `disability_status`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `chronic_illness_status`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `household_size`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `program_country`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `citizenship_required`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `cash_transfer`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `cash_transfer_monthly_amount`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `in_kind_transfer`;
--> statement-breakpoint
ALTER TABLE `programs` DROP COLUMN `in_kind_dollar_value_amt`;
--> statement-breakpoint

DROP TABLE `benefit_conditions`;
--> statement-breakpoint
