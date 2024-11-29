

-- ----------------------------------------------
-- 1. Update 'monthly_income' condition types to have numeric values
-- ----------------------------------------------

-- Program ID 10: Public Assistance Programme
-- Replace 'threshold' with 1428.38 (MEB)
UPDATE eligibility_rules
SET value = '1428.38'
WHERE program_id = 10
  AND rule_type = 'monthly_income'
  AND value = 'threshold';

-- Program ID 14: School Feeding Program
-- Replace 'low_income_family' with 714.19 (50% of MEB)
UPDATE eligibility_rules
SET value = '714.19'
WHERE program_id = 14
  AND rule_type = 'monthly_income'
  AND value = 'low_income_family';

-- Program ID 15: Emergency/Fire Grant
-- Replace 'demonstrated' with 1428.38 (MEB) or appropriate value
UPDATE eligibility_rules
SET value = '1428.38'
WHERE program_id = 15
  AND rule_type = 'monthly_income'
  AND value = 'demonstrated';

-- ----------------------------------------------
-- 2. Ensure 'income' condition types have numeric values
-- ----------------------------------------------

-- Program ID 1: Public Assistance Programme
-- 'income' < 6.85 per day, assuming conversion to monthly income
-- 6.85 * 30 = 205.5 (Assumed monthly threshold)
UPDATE eligibility_rules
SET value = '205.5'
WHERE program_id = 1
  AND rule_type = 'income'
  AND value = '6.85';

-- ----------------------------------------------
-- 3. Verify and Update Other Numeric Condition Types
-- ----------------------------------------------

-- Program ID 13: Old Age Pension
-- 'age' >= 60 and 'contributions' >= 500 are already numeric, no action needed
-- Ensure values are numeric
UPDATE eligibility_rules
SET value = '60'
WHERE program_id = 13
  AND rule_type = 'age'
  AND value = '60';

UPDATE eligibility_rules
SET value = '500'
WHERE program_id = 13
  AND rule_type = 'contributions'
  AND value = '500';

-- Program ID 11: Foster Care Programme
-- 'age' >= 25 is already numeric, no action needed
UPDATE eligibility_rules
SET value = '25'
WHERE program_id = 11
  AND rule_type = 'age'
  AND value = '25';

-- ----------------------------------------------
-- 4. Ensure String-Based Condition Types Remain Unchanged
-- ----------------------------------------------

-- No updates needed for string-based condition types as they are already correctly set
-- Examples:
-- 'country_of_residence' = 'legal_resident', 'clean', etc.

-- ----------------------------------------------
-- 5. Additional Data Integrity Checks (Optional)
-- ----------------------------------------------

-- Remove any duplicate rules if necessary
-- Example: Ensure no duplicate 'is_enrolled_in_school' rules for program_id=14
DELETE FROM eligibility_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM eligibility_rules
    WHERE program_id = 14
      AND rule_type = 'is_enrolled_in_school'
    GROUP BY program_id, rule_type, value
)
AND program_id = 14
  AND rule_type = 'is_enrolled_in_school';

-- ----------------------------------------------
-- 6. Commit the Transaction
-- ----------------------------------------------


