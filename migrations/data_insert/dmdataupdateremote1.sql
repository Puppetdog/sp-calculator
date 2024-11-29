PRAGMA defer_foreign_keys=TRUE;

-- Clear existing sequences to reset auto-incrementing IDs
DELETE FROM sqlite_sequence;

-- Create Unique Indexes if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS meb_values_country_code_unique ON meb_values (country_code);
CREATE UNIQUE INDEX IF NOT EXISTS programs_code_unique ON programs (code);

-- Update Old Age Pension Program to correct benefit frequency and amounts
UPDATE programs
SET
    minimum_benefit = 76.81,  -- Minimum Weekly Pension
    maximum_benefit = 76.81,  -- Assuming base weekly amount
    benefit_frequency = 'weekly',
    updated_at = CURRENT_TIMESTAMP
WHERE code = 'DM-OAP-2024';

-- Remove existing benefit rules for Old Age Pension (if any)
DELETE FROM benefit_rules
WHERE program_id = (SELECT id FROM programs WHERE code = 'DM-OAP-2024');

-- Insert corrected Benefit Rules for Old Age Pension
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
-- Base weekly pension amount
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'base_pension',
    '===',
    'weekly_minimum',
    76.81,
    'set',
    1,
    1
),
-- Monthly pension amounts based on weeks in the month
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'weeks_in_month',
    '===',
    '4',
    307.24,
    'set',
    2,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'weeks_in_month',
    '===',
    '5',
    384.05,
    'set',
    3,
    1
);

-- Update Foster Care Programme to include the annual clothing allowance
-- First, check if the annual clothing allowance benefit rule exists
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
    500.00,
    'set',
    2,
    1
);

-- Insert missing programs: School Feeding Program and Emergency/Fire Grant

-- School Feeding Program
INSERT INTO programs (
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
    'daily',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- School Feeding Program Eligibility Rules
INSERT INTO eligibility_rules (
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

-- Emergency/Fire Grant
INSERT INTO programs (
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
    'one-time',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Emergency/Fire Grant Eligibility Rules
INSERT INTO eligibility_rules (
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

-- Ensure MEB value is correctly inserted (if not already present)
-- First, check if MEB value for Dominica exists
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
    '2023-10-01',  -- Assuming last updated in October 2023
    2009
);

-- Correct any discrepancies in required documents for Old Age Pension

-- Delete existing required documents for Old Age Pension if they are incorrect
DELETE FROM required_documents
WHERE program_id = (SELECT id FROM programs WHERE code = 'DM-OAP-2024');

-- Insert correct required documents for Old Age Pension
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'proof_of_identity',
    'Valid identification (passport, national ID card, or birth certificate)',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'social_security_card',
    'Dominica Social Security card',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'proof_of_age',
    'Birth certificate or passport indicating age',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'employment_history',
    'Details of employment and contributions, including pay stubs or employer records',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'medical_certificate',
    'Required for invalidity pensions to confirm disability or incapacity to work',
    0,
    0,
    1
);

-- Update benefit frequency for Foster Care Programme if necessary
UPDATE programs
SET
    benefit_frequency = 'monthly',
    updated_at = CURRENT_TIMESTAMP
WHERE code = 'DM-FCP-2024';

-- Correct any discrepancies in the benefit amounts for the Disability Grant
-- Ensure that the benefit amount is accurately reflected

-- Delete existing benefit rules for Disability Grant if they are incorrect
DELETE FROM benefit_rules
WHERE program_id = (SELECT id FROM programs WHERE code = 'DM-DG-2024');

-- Insert correct benefit rules for Disability Grant
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
    (SELECT id FROM programs WHERE code = 'DM-DG-2024'),
    'grant_amount',
    '===',
    'monthly',
    300.00,
    'set',
    1,
    1
);

