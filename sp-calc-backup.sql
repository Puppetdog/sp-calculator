PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
INSERT INTO __drizzle_migrations VALUES(NULL,'f84aaf78cbe9047def8528e607c04f58c7c461763d2e38b178f14f40ab81d980',1728497225225);
INSERT INTO __drizzle_migrations VALUES(NULL,'218e66d17be678a687f2d88d520c83caaef362ec790a681111f2631be24d5304',1730156742867);
CREATE TABLE IF NOT EXISTS "benefit_conditions" (
	`id` integer PRIMARY KEY NOT NULL,
	`program_id` integer NOT NULL,
	`benefit_type` text NOT NULL,
	`condition_field` text NOT NULL,
	`condition_operator` text NOT NULL,
	`condition_value` text NOT NULL,
	`benefit_amount` integer NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO benefit_conditions VALUES(1,1,'cash','age','>=','18',150);
INSERT INTO benefit_conditions VALUES(2,1,'cash','age','<','18',127.5);
INSERT INTO benefit_conditions VALUES(3,1,'cash','householdSize','>','2',375);
INSERT INTO benefit_conditions VALUES(4,1,'cash','','===','',0);
INSERT INTO benefit_conditions VALUES(5,9,'cash','householdSize','===','1',1300);
INSERT INTO benefit_conditions VALUES(6,9,'cash','householdSize','===','2',1550);
INSERT INTO benefit_conditions VALUES(7,9,'cash','householdSize','===','3',1750);
INSERT INTO benefit_conditions VALUES(8,9,'cash','householdSize','>=','4',1900);
INSERT INTO benefit_conditions VALUES(9,9,'cash','','===','',0);
INSERT INTO benefit_conditions VALUES(10,11,'cash','householdSize','===','1',10000);
INSERT INTO benefit_conditions VALUES(11,11,'cash','','===','',0);
INSERT INTO benefit_conditions VALUES(12,14,'cash','householdSize','>=','4500',500);
INSERT INTO benefit_conditions VALUES(13,14,'cash','householdSize','>=','3500',1500);
INSERT INTO benefit_conditions VALUES(14,14,'cash','householdSize','>=','2500',2500);
INSERT INTO benefit_conditions VALUES(15,14,'cash','householdSize','<','2500',3500);
INSERT INTO benefit_conditions VALUES(16,14,'cash','','===','',0);
CREATE TABLE IF NOT EXISTS "programs" (
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
INSERT INTO programs VALUES(1,'Public Assistance Programme (PAP)','Department of Social Services ','Provides financial support to individuals and families in need in the Commonwealth of Dominica',0,150,'4',0,'3','5','4','4',1,'1',0,1,150,0,NULL);
INSERT INTO programs VALUES(2,'Pension Programme','Dominica Social Security',replace('Provides financial support to retirees ensuring they have a stable income in the Commonwealth of Dominica\n','\n',char(10)),60,150,'4',0,'3','5','4','4',1,'1',0,1,307.24,0,NULL);
INSERT INTO programs VALUES(3,'Foster Care Dominica','Ministry of Social Services','Provides temporary care and support to children unable to live with their biological families.',0,18,'4',0,'1','5','4','4',1,'1',1,1,220,0,NULL);
INSERT INTO programs VALUES(4,'School Feeding Program Dominica','Ministry of Education','Provides lunch to children in school.',0,18,'4',0,'1','5','4','4',1,'1',0,0,NULL,1,120);
INSERT INTO programs VALUES(5,'School Nutrition Programme','Ministry of Education','Free breakfast and lunch is provided to all government primary and secondary schools. ',5,20,'4',0,'3','5','4','4',1,'5',0,0,NULL,1,8.82);
INSERT INTO programs VALUES(6,'School Supplies and Book Grant ','Ministry of Education','This initiative is designed to address the financial challenges faced by students in acquiring essential supplies, thereby facilitating their attendance at primary and secondary schools. This is a seasonal grant, and is only offered once yearly. The application period is usually in the first quarter of the year. ',0,100,'4',1,'1','5','4','4',1,'5',1,1,1000,0,NULL);
INSERT INTO programs VALUES(7,'Disability Assistance Grant for Minors ','Ministry of Social Development and Family Services ','This programme provides cash assistance to the parent or legal guardian of a child who is permanently and completely disabled. ',0,18,'4',0,'3','5','3','4',1,'5',1,1,1500,0,NULL);
INSERT INTO programs VALUES(8,'Special Child Grant ','Ministry of Social Development and Family Services ','This grant provides cash assistance to the parent or legal guardian of a child who is moderately disabled ',0,18,'4',0,'3','5','2','2',1,'5',1,1,800,0,NULL);
INSERT INTO programs VALUES(9,'Public Assistance Grant ','Ministry of Social Development and Family Services ','This grant is provided to meet the needs of persons whose household income is deemed inadequate. ',0,100,'4',0,'3','5','4','4',1,'5',1,1,1625,0,NULL);
INSERT INTO programs VALUES(10,'Disability Assistance Grant ','Ministry of Social Development and Family Services ','This grant provides financial assistance to adults who are unable to earn a livelihood as a result of their disability. ',18,150,'4',0,'3','5','2','4',1,'5',1,1,2000,0,NULL);
INSERT INTO programs VALUES(11,'Household Items Grant ','Ministry of Social Development and Family Services ','This programme provides assistance to needy persons and persons who were victims of man-made or natural disasters ',18,150,'4',0,'3','5','4','4',1,'5',1,1,6000,0,8000);
INSERT INTO programs VALUES(12,'Emergency Repairs and Reconstruction Grant ','National Commission for Self Help ',replace('This grant is available to persons who are affected by natural disasters such as windstorms and tornadoes, as well as fires and structural damages due to flooding. \n','\n',char(10)),18,150,'4',0,'3','5','4','4',1,'5',1,0,NULL,1,25000);
INSERT INTO programs VALUES(13,'Retirement Benefit','National Insurance Board ','This is a contributory pension benefit that is provided to all insured persons after retirement age ',60,150,'4',0,'3','5','4','4',1,'5',0,1,3000,0,NULL);
INSERT INTO programs VALUES(14,'Senior Citizens Pension Grant ','Ministry of Social Development and Family Services ','This programme is available for eligible persons of age 65+ who require financial assistance ',65,150,'4',0,'3','5','4','4',1,'5',1,1,2000,0,NULL);
DELETE FROM sqlite_sequence;
