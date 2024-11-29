PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS "programs" (
	`id` integer PRIMARY KEY NOT NULL,
	`program_title` text NOT NULL,
	`responsible_organization` text NOT NULL,
	`code` text NOT NULL DEFAULT '', `description` text NOT NULL DEFAULT '', `country_code` text NOT NULL DEFAULT 'US', `category` text NOT NULL DEFAULT 'General', `type` text NOT NULL DEFAULT 'Standard', `minimum_benefit` real, `maximum_benefit` real, `benefit_frequency` text NOT NULL DEFAULT 'Monthly', `reapplication_period` integer, `active` integer DEFAULT 1 NOT NULL, `created_at` text NOT NULL DEFAULT '1970-01-01 00:00:00', `updated_at` text NOT NULL DEFAULT '1970-01-01 00:00:00');
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
CREATE TABLE `document_alternatives` (
    `id` integer PRIMARY KEY NOT NULL,
    `required_document_id` integer NOT NULL,
    `alternative_type` text NOT NULL,
    `description` text,
    `validation_process` text,
    FOREIGN KEY (`required_document_id`) REFERENCES `required_documents`(`id`) ON UPDATE no action ON DELETE no action
);
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
CREATE TABLE `geographic_coverage` (
    `id` integer PRIMARY KEY NOT NULL,
    `program_id` integer NOT NULL,
    `region` text NOT NULL,
    `coverage_type` text NOT NULL,
    `special_requirements` text,
    `active` integer DEFAULT 1 NOT NULL,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `meb_values` (
    `id` integer PRIMARY KEY NOT NULL,
    `country_code` text NOT NULL,
    `amount` real NOT NULL,
    `last_updated` text NOT NULL,
    `base_year` integer NOT NULL
);
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
DELETE FROM sqlite_sequence;
CREATE UNIQUE INDEX `meb_values_country_code_unique` ON `meb_values` (`country_code`);
CREATE UNIQUE INDEX `programs_code_unique` ON `programs` (`code`);
