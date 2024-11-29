

-- ----------------------------------------------
-- 1. Standardize 'country_of_residence' Values
-- ----------------------------------------------

-- Update all 'country_of_residence' condition_type entries to 'citizen_or_resident'
UPDATE eligibility_rules
SET value = 'citizen_or_resident'
WHERE rule_type = 'country_of_residence';

-- ----------------------------------------------
-- 2. Remove 'monthly_income' Rules for Program ID 10
-- ----------------------------------------------

-- Delete all 'monthly_income' condition_type entries for program_id = 10
DELETE FROM eligibility_rules
WHERE program_id = 10
  AND rule_type = 'monthly_income';

-- ----------------------------------------------
-- 3. Commit the Transaction
-- ----------------------------------------------
