

-- ----------------------------------------------
-- 1. Update 'country_of_residence' Values
-- ----------------------------------------------

-- Program ID 1: Trinidad and Tobago Public Assistance Programme
UPDATE eligibility_rules
SET value = 'TT'
WHERE program_id = 1
  AND rule_type = 'country_of_residence';

-- Program IDs 10, 11, 12, 15: Dominica Public Assistance Programme
UPDATE eligibility_rules
SET value = 'DM'
WHERE program_id IN (10, 11, 12, 15)
  AND rule_type = 'country_of_residence';

-- ----------------------------------------------
-- 2. Remove Outdated 'country_of_residence' Values
-- ----------------------------------------------

DELETE FROM eligibility_rules
WHERE rule_type = 'country_of_residence'
  AND value NOT IN ('TT', 'DM');

-- ----------------------------------------------
-- 3. Remove 'monthly_income' Rules for Program ID 10
-- ----------------------------------------------

DELETE FROM eligibility_rules
WHERE program_id = 10
  AND rule_type = 'monthly_income';

-- ----------------------------------------------
-- 4. Update 'income' Rule for Program ID 1
-- ----------------------------------------------

-- Convert daily income threshold (6.85) to monthly (6.85 * 30 = 205.5)
UPDATE eligibility_rules
SET value = '205.5'
WHERE program_id = 1
  AND rule_type = 'income'
  AND value = '6.85';

-- ----------------------------------------------
-- 5. Remove Duplicates for 'country_of_residence'
-- ----------------------------------------------

-- Remove duplicate 'country_of_residence' rules for Program ID 1
DELETE FROM eligibility_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM eligibility_rules
    WHERE program_id = 1
      AND rule_type = 'country_of_residence'
      AND value = 'TT'
    GROUP BY program_id, rule_type, value
)
AND program_id = 1
  AND rule_type = 'country_of_residence';

-- Remove duplicate 'country_of_residence' rules for Program IDs 10, 11, 12, 15
DELETE FROM eligibility_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM eligibility_rules
    WHERE program_id IN (10, 11, 12, 15)
      AND rule_type = 'country_of_residence'
      AND value = 'DM'
    GROUP BY program_id, rule_type, value
)
AND program_id IN (10, 11, 12, 15)
  AND rule_type = 'country_of_residence';

-- ----------------------------------------------
-- 6. Commit the Transaction
-- ----------------------------------------------
