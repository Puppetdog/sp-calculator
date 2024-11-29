

-- ----------------------------------------------
-- 1. Revert 'rule_type' Fields
-- ----------------------------------------------

-- Program ID 10: Revert 'country_of_residence' back to 'residency'
UPDATE eligibility_rules
SET rule_type = 'residency'
WHERE program_id = 10
  AND rule_type = 'country_of_residence';

-- Program ID 10: Revert 'monthly_income' back to 'financial_need'
UPDATE eligibility_rules
SET rule_type = 'financial_need'
WHERE program_id = 10
  AND rule_type = 'monthly_income';

-- Program ID 14: Revert 'is_enrolled_in_school' back to 'school_enrollment'
UPDATE eligibility_rules
SET rule_type = 'school_enrollment'
WHERE program_id = 14
  AND rule_type = 'is_enrolled_in_school';

-- Program ID 14: Revert 'monthly_income' back to 'economic_need'
UPDATE eligibility_rules
SET rule_type = 'economic_need'
WHERE program_id = 14
  AND rule_type = 'monthly_income';

-- Program ID 11: Revert 'background_check_status' back to 'background_check'
UPDATE eligibility_rules
SET rule_type = 'background_check'
WHERE program_id = 11
  AND rule_type = 'background_check_status';

-- Program ID 15: Revert 'monthly_income' back to 'economic_need'
UPDATE eligibility_rules
SET rule_type = 'economic_need'
WHERE program_id = 15
  AND rule_type = 'monthly_income';

-- ----------------------------------------------
-- 2. Revert 'value' Fields
-- ----------------------------------------------

-- Program ID 1: Revert 'income' value back to '6.85'
UPDATE eligibility_rules
SET value = '6.85'
WHERE program_id = 1
  AND rule_type = 'income'
  AND value = '205.5';

-- Program ID 10: Revert 'monthly_income' value back to 'threshold'
UPDATE eligibility_rules
SET value = 'threshold'
WHERE program_id = 10
  AND rule_type = 'financial_need'
  AND value = '1428.38';

-- Program ID 14: Revert 'monthly_income' value back to 'low_income_family'
UPDATE eligibility_rules
SET value = 'low_income_family'
WHERE program_id = 14
  AND rule_type = 'economic_need'
  AND value = '714.19';

-- Program ID 15: Revert 'monthly_income' value back to 'demonstrated'
UPDATE eligibility_rules
SET value = 'demonstrated'
WHERE program_id = 15
  AND rule_type = 'economic_need'
  AND value = '1428.38';

-- ----------------------------------------------
-- 3. Remove Duplicate Eligibility Rules
-- ----------------------------------------------

-- Identify and remove duplicates based on program_id, rule_type, and value
DELETE FROM eligibility_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM eligibility_rules
    GROUP BY program_id, rule_type, value
)
AND program_id IN (1,10,11,13,14,15);

-- ----------------------------------------------
-- 4. Commit the Transaction
-- ----------------------------------------------

