CREATE TABLE `benefit_conditions` (
	`id` integer PRIMARY KEY NOT NULL,
	`program_id` integer,
	`benefit_type` text NOT NULL,
	`condition_field` text NOT NULL,
	`condition_operator` text NOT NULL,
	`condition_value` text NOT NULL,
	`benefit_amount` integer NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` integer PRIMARY KEY NOT NULL,
	`program_title` text NOT NULL,
	`responsible_organization` text NOT NULL,
	`program_description` text NOT NULL,
	`duration` integer NOT NULL,
	`age_minimum` integer NOT NULL,
	`age_maximum` integer NOT NULL,
	`gender` text NOT NULL,
	`number_of_dependents` integer NOT NULL,
	`type_of_dependents` text NOT NULL,
	`employment_status` text NOT NULL,
	`disability_status` text NOT NULL,
	`chronic_illness_status` text NOT NULL,
	`household_size` integer NOT NULL,
	`country_of_origin` text NOT NULL,
	`country_of_residence` text NOT NULL,
	`pre_requisite_programs` text,
	`cash_transfer_monthly` integer NOT NULL,
	`in_kind_dollar_value_amt` integer NOT NULL
);
