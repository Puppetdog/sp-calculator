PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_benefit_conditions` (
	`id` integer PRIMARY KEY NOT NULL,
	`program_id` integer NOT NULL,
	`benefit_type` text NOT NULL,
	`condition_field` text NOT NULL,
	`condition_operator` text NOT NULL,
	`condition_value` text NOT NULL,
	`benefit_amount` integer NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_conditions`("id", "program_id", "benefit_type", "condition_field", "condition_operator", "condition_value", "benefit_amount") SELECT "id", "program_id", "benefit_type", "condition_field", "condition_operator", "condition_value", "benefit_amount" FROM `benefit_conditions`;--> statement-breakpoint
DROP TABLE `benefit_conditions`;--> statement-breakpoint
ALTER TABLE `__new_benefit_conditions` RENAME TO `benefit_conditions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_programs` (
	`id` integer PRIMARY KEY NOT NULL,
	`program_title` text NOT NULL,
	`responsible_organization` text NOT NULL,
	`program_description` text NOT NULL,
	`age_minimum` integer NOT NULL,
	`age_maximum` integer NOT NULL,
	`gender` text NOT NULL,
	`number_of_dependents` integer NOT NULL,
	`type_of_dependents` text NOT NULL,
	`employment_status` text NOT NULL,
	`disability_status` text NOT NULL,
	`chronic_illness_status` text NOT NULL,
	`household_size` integer NOT NULL,
	`program_country` text NOT NULL,
	`citizenship_required` integer NOT NULL,
	`cash_transfer` integer NOT NULL,
	`cash_transfer_monthly_amount` integer,
	`in_kind_transfer` integer NOT NULL,
	`in_kind_dollar_value_amt` integer
);
--> statement-breakpoint
INSERT INTO `__new_programs`("id", "program_title", "responsible_organization", "program_description", "age_minimum", "age_maximum", "gender", "number_of_dependents", "type_of_dependents", "employment_status", "disability_status", "chronic_illness_status", "household_size", "program_country", "citizenship_required", "cash_transfer", "cash_transfer_monthly_amount", "in_kind_transfer", "in_kind_dollar_value_amt") SELECT "id", "program_title", "responsible_organization", "program_description", "age_minimum", "age_maximum", "gender", "number_of_dependents", "type_of_dependents", "employment_status", "disability_status", "chronic_illness_status", "household_size", "program_country", "citizenship_required", "cash_transfer", "cash_transfer_monthly_amount", "in_kind_transfer", "in_kind_dollar_value_amt" FROM `programs`;--> statement-breakpoint
DROP TABLE `programs`;--> statement-breakpoint
ALTER TABLE `__new_programs` RENAME TO `programs`;