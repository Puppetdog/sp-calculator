

-- ----------------------------------------------
-- 1. Update 'income' condition_type in program_id=1
-- ----------------------------------------------

-- Program ID 1: Update 'income' < '6.85' to '205.5' (monthly threshold)
UPDATE benefit_rules
SET value = '205.5'
WHERE program_id = 1
  AND condition_type = 'income'
  AND value = '6.85';

-- ----------------------------------------------
-- 2. Update 'monthly_income' condition_type in program_id=10
-- ----------------------------------------------

-- Program ID 10: Public Assistance Programme
-- Update 'monthly_income' < 'threshold' to '1428.38'
UPDATE benefit_rules
SET value = '1428.38'
WHERE program_id = 10
  AND condition_type = 'monthly_income'
  AND value = 'threshold';

-- ----------------------------------------------
-- 3. Update 'monthly_income' condition_type in program_id=14
-- ----------------------------------------------

-- Program ID 14: School Feeding Program
-- Update 'monthly_income' === 'low_income_family' to '714.19'
UPDATE benefit_rules
SET value = '714.19'
WHERE program_id = 14
  AND condition_type = 'monthly_income'
  AND value = 'low_income_family';

-- ----------------------------------------------
-- 4. Update 'monthly_income' condition_type in program_id=15
-- ----------------------------------------------

-- Program ID 15: Emergency/Fire Grant
-- Update 'monthly_income' === 'demonstrated' to '1428.38'
UPDATE benefit_rules
SET value = '1428.38'
WHERE program_id = 15
  AND condition_type = 'monthly_income'
  AND value = 'demonstrated';

-- ----------------------------------------------
-- 5. Ensure Other Numeric Condition Types Have Numeric Values
-- ----------------------------------------------

-- Program ID 13: Old Age Pension
-- 'age' >= '60' (already numeric, ensure it's correct)
UPDATE benefit_rules
SET value = '60'
WHERE program_id = 13
  AND condition_type = 'age'
  AND value = '60';

-- Program ID 13: Old Age Pension
-- 'contributions_weeks' >= '500' (already numeric, ensure it's correct)
UPDATE benefit_rules
SET value = '500'
WHERE program_id = 13
  AND condition_type = 'contributions_weeks'
  AND value = '500';

-- Program ID 13: Old Age Pension
-- 'additional_contributions_weeks' > '500' (already numeric, ensure it's correct)
UPDATE benefit_rules
SET value = '500'
WHERE program_id = 13
  AND condition_type = 'additional_contributions_weeks'
  AND value = '500';

-- Program ID 13: Old Age Pension
-- 'pension_cap' <= '0.60' (already numeric, ensure it's correct)
UPDATE benefit_rules
SET value = '0.60'
WHERE program_id = 13
  AND condition_type = 'pension_cap'
  AND value = '0.60';

-- Program ID 11: Foster Care Programme
-- 'age' >= '25' (already numeric, ensure it's correct)
UPDATE benefit_rules
SET value = '25'
WHERE program_id = 11
  AND condition_type = 'age'
  AND value = '25';

-- Program ID 11: Foster Care Programme
-- 'clothing_allowance' === 'annual' (string comparison, no update needed)

-- Program ID 4: Household Size (assuming 'household_size' is a string and correct)

-- ----------------------------------------------
-- 6. Remove Duplicate Rules (if any)
-- ----------------------------------------------

-- Example: Remove duplicate 'is_enrolled_in_school' rules for program_id=14
DELETE FROM benefit_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM benefit_rules
    WHERE program_id = 14
      AND condition_type = 'is_enrolled_in_school'
      AND value = 'enrolled_in_participating_school'
    GROUP BY program_id, condition_type, value
)
AND program_id = 14
  AND condition_type = 'is_enrolled_in_school';

-- Example: Remove duplicate 'monthly_income' rules for program_id=14
DELETE FROM benefit_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM benefit_rules
    WHERE program_id = 14
      AND condition_type = 'monthly_income'
      AND value = '714.19'
    GROUP BY program_id, condition_type, value
)
AND program_id = 14
  AND condition_type = 'monthly_income';

-- Example: Remove duplicate 'monthly_income' rules for program_id=15
DELETE FROM benefit_rules
WHERE id NOT IN (
    SELECT MIN(id)
    FROM benefit_rules
    WHERE program_id = 15
      AND condition_type = 'monthly_income'
      AND value = '1428.38'
    GROUP BY program_id, condition_type, value
)
AND program_id = 15
  AND condition_type = 'monthly_income';

-- ----------------------------------------------
-- 7. Commit the Transaction to Save Changes
-- ----------------------------------------------

