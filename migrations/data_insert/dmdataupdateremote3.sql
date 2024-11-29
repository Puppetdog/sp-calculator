
-- SQL script to update eligibility_rules to fit the keys in EligibilityParams

PRAGMA defer_foreign_keys=TRUE;
-- Update 'residency' to 'country_of_residence'
UPDATE eligibility_rules
SET rule_type = 'country_of_residence'
WHERE rule_type = 'residency';

-- Update 'financial_need' and 'economic_need' to 'monthly_income'
UPDATE eligibility_rules
SET rule_type = 'monthly_income'
WHERE rule_type IN ('financial_need', 'economic_need');

-- Update 'school_enrollment' to 'is_enrolled_in_school'
UPDATE eligibility_rules
SET rule_type = 'is_enrolled_in_school'
WHERE rule_type = 'school_enrollment';

-- Update 'affected_by_emergency' to 'affected_by_emergency' (assuming 'affectedByEmergency' is added)
-- Since the snake_case matches, no change is needed unless you want consistency
-- UPDATE eligibility_rules
-- SET condition_type = 'affected_by_emergency'
-- WHERE condition_type = 'affected_by_emergency';

-- Update 'contributions_weeks' to 'contributions_weeks' (assuming 'contributionsWeeks' is added)
-- Since the snake_case matches, no change is needed
-- UPDATE eligibility_rules
-- SET condition_type = 'contributions_weeks'
-- WHERE condition_type = 'contributions_weeks';

-- Update 'background_check' to 'background_check_status'
UPDATE eligibility_rules
SET rule_type = 'background_check_status'
WHERE rule_type = 'background_check';

-- Commit the transaction
