
PRAGMA defer_foreign_keys=TRUE;

-- Clear existing sequences to reset auto-incrementing IDs
DELETE FROM sqlite_sequence;

-- Create Unique Indexes if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS meb_values_country_code_unique ON meb_values (country_code);
CREATE UNIQUE INDEX IF NOT EXISTS programs_code_unique ON programs (code);

-- ----------------------------------------------
-- 1. Update Old Age Pension Program
-- ----------------------------------------------

-- Update the Old Age Pension program's benefit_frequency to 'monthly' and adjust minimum and maximum benefits if necessary
UPDATE programs
SET
    benefit_frequency = 'monthly', -- Change frequency to monthly
    updated_at = CURRENT_TIMESTAMP
WHERE code = 'DM-OAP-2024';

-- Remove existing benefit rules related to weeks in a month for Old Age Pension
DELETE FROM benefit_rules
WHERE program_id = (SELECT id FROM programs WHERE code = 'DM-OAP-2024')
  AND condition_type IN ('weeks_in_month');

-- Insert new benefit rules based on average earnings calculation
-- Rule 1: Base Pension - 30% of average earnings for first 500 weeks
INSERT INTO benefit_rules (
    program_id,
    condition_type,
    operator,
    threshold_value,
    benefit_modifier,
    modifier_type,
    priority,
    active
) VALUES (
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'contributions_weeks',
    '>=',
    '500',
    0.30, -- 30%
    'multiply', -- Multiplies by average earnings
    1,
    1
);

-- Rule 2: Additional Contributions - +1% per additional 50 weeks beyond 500, up to a maximum of 60%
-- Note: The current schema may not fully support iterative calculations. This rule serves as a placeholder.
INSERT INTO benefit_rules (
    program_id,
    condition_type,
    operator,
    threshold_value,
    benefit_modifier,
    modifier_type,
    priority,
    active
) VALUES (
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'additional_contributions_weeks',
    '>',
    '500',
    0.01, -- 1% per 50 weeks
    'add', -- Adds to the base percentage
    2,
    1
);

-- Rule 3: Maximum Pension Cap at 60%
INSERT INTO benefit_rules (
    program_id,
    condition_type,
    operator,
    threshold_value,
    benefit_modifier,
    modifier_type,
    priority,
    active
) VALUES (
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'pension_cap',
    '<=',
    '0.60',
    0.60, -- 60%
    'cap', -- Caps the pension percentage
    3,
    1
);

-- ----------------------------------------------
-- 2. Foster Care Programme Adjustments
-- ----------------------------------------------

-- Remove existing clothing_allowance rule if it exists to prevent duplicates
DELETE FROM benefit_rules
WHERE program_id = (SELECT id FROM programs WHERE code = 'DM-FCP-2024')
  AND condition_type = 'clothing_allowance';

-- Insert the annual clothing allowance benefit rule
INSERT INTO benefit_rules (
    program_id,
    condition_type,
    operator,
    threshold_value,
    benefit_modifier,
    modifier_type,
    priority,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'clothing_allowance',
    '===',
    'annual',
    500.00, -- $500 annually
    'set', -- Sets the allowance
    2,
    1
);

-- ----------------------------------------------
-- 3. Insert Missing Programs: School Feeding Program and Emergency/Fire Grant
-- ----------------------------------------------

-- Insert School Feeding Program if not already present
INSERT OR IGNORE INTO programs (
    code,
    program_title,
    description,
    country_code,
    category,
    type,
    responsible_organization,
    minimum_benefit,
    maximum_benefit,
    benefit_frequency,
    reapplication_period,
    active,
    created_at,
    updated_at
) VALUES (
    'DM-SFP-2024',
    'School Feeding Program',
    'Ensures that students in need of nutritional support receive meals to enhance learning and development',
    'DM',
    'education',
    'in-kind',
    'Ministry of Education and Social Services',
    NULL,  -- No direct financial benefit
    NULL,
    'per_meal', -- Benefit frequency per meal
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Emergency/Fire Grant if not already present
INSERT OR IGNORE INTO programs (
    code,
    program_title,
    description,
    country_code,
    category,
    type,
    responsible_organization,
    minimum_benefit,
    maximum_benefit,
    benefit_frequency,
    reapplication_period,
    active,
    created_at,
    updated_at
) VALUES (
    'DM-EFG-2024',
    'Emergency/Fire Grant',
    'Provides financial assistance to individuals affected by emergencies such as fires, hurricanes, floods, and other natural disasters',
    'DM',
    'emergency_assistance',
    'cash',
    'Ministry of Health, Wellness, and Social Services',
    NULL,  -- Variable amount
    NULL,
    'as_needed',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ----------------------------------------------
-- 4. Insert Eligibility Rules for New Programs
-- ----------------------------------------------

-- School Feeding Program Eligibility Rules
INSERT OR IGNORE INTO eligibility_rules (
    program_id,
    rule_type,
    operator,
    value,
    logic_group,
    priority,
    description,
    error_message,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-SFP-2024'),
    'school_enrollment',
    '===',
    'enrolled_in_participating_school',
    1,
    1,
    'Child must be enrolled in a participating school',
    'Child is not enrolled in a participating school',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-SFP-2024'),
    'economic_need',
    '===',
    'low_income_family',
    1,
    2,
    'Priority given to students from low-income families',
    'Family does not meet low-income criteria',
    1
);

-- Emergency/Fire Grant Eligibility Rules
INSERT OR IGNORE INTO eligibility_rules (
    program_id,
    rule_type,
    operator,
    value,
    logic_group,
    priority,
    description,
    error_message,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'residency',
    '===',
    'legal_resident',
    1,
    1,
    'Applicant must be a legal resident of Dominica',
    'Applicant must be a legal resident of Dominica',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'affected_by_emergency',
    '===',
    'yes',
    1,
    2,
    'Must be directly affected by a qualifying emergency or disaster',
    'Applicant not directly affected by a qualifying emergency',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'financial_need',
    '===',
    'demonstrated',
    1,
    3,
    'Must demonstrate financial need due to the emergency',
    'Financial need not demonstrated',
    1
);

-- ----------------------------------------------
-- 5. Insert Required Documents for New Programs
-- ----------------------------------------------

-- School Feeding Program Required Documents
INSERT OR IGNORE INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-SFP-2024'),
    'school_enrolment',
    'Proof of enrollment in a participating school',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-SFP-2024'),
    'economic_need',
    'Proof of low-income status of the family',
    1,
    0,
    1
);

-- Emergency/Fire Grant Required Documents
INSERT OR IGNORE INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'application_form',
    'Completed application form provided by the Ministry',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'proof_of_impact',
    'Evidence such as photos or reports of property damage',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-EFG-2024'),
    'financial_need',
    'Assessment of financial need due to the disaster',
    1,
    0,
    1
);

-- ----------------------------------------------
-- 6. Ensure MEB Value is Correctly Inserted
-- ----------------------------------------------

-- Remove existing MEB value for Dominica to prevent duplicates
DELETE FROM meb_values WHERE country_code = 'DM';

-- Insert updated MEB value
INSERT INTO meb_values (
    country_code,
    amount,
    last_updated,
    base_year
) VALUES (
    'DM',
    1428.38,
    '2023-10-01',  -- Last updated in October 2023
    2009
);

-- ----------------------------------------------
-- 7. Commit the Transaction to Save Changes
-- ----------------------------------------------
