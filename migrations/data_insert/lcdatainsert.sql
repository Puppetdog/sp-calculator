-- Insert into programs table with exact column names from your schema
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
) VALUES
-- Public Assistance Cash Transfer Grant
(
    'LC-PAP-CTG-2024',
    'Public Assistance Cash Transfer Grant',
    'Monthly financial support to households who qualify based on eligibility criteria',
    'LC',
    'social_assistance',
    'cash',
    'Government of Saint Lucia',
    215.00,
    465.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- School Feeding Programme
(
    'LC-SFP-2024',
    'School Feeding Programme',
    'Provision of lunch at $1.00 per child per day to needy students',
    'LC',
    'education',
    'in-kind',
    'Government of Saint Lucia',
    NULL,
    NULL,
    'daily',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Child Disability Grant
(
    'LC-CDG-2024',
    'Child Disability Grant',
    'Monthly financial support to recipients from ages 0-21 years with disabilities',
    'LC',
    'disability',
    'cash',
    'Government of Saint Lucia',
    200.00,
    200.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Fire & Emergency Grant
(
    'LC-FEG-2024',
    'Fire & Emergency Grant',
    'One-off financial assistance to individuals or households affected by house fires',
    'LC',
    'emergency_assistance',
    'cash',
    'Government of Saint Lucia',
    500.00,
    500.00,
    'one-time',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Private Sector Pension Scheme
(
    'LC-PSPS-2024',
    'Private Sector Pension Scheme',
    'Monthly financial amount to individuals who have contributed to the scheme and have attained the age of 65 years',
    'LC',
    'social_insurance',
    'pension',
    'Government of Saint Lucia',
    300.00,
    NULL,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert into eligibility_rules with exact column names from your schema
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
-- Eligibility Rules for Public Assistance Cash Transfer Grant
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'sl_net_score',
    '<=',
    '79',
    1,
    1,
    'Applicant must have an SL-NET score of 79 or less (Indigent or Poor)',
    'Applicant does not meet the SL-NET score criteria',
    1
),
-- Eligibility Rules for Child Disability Grant
(
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'age',
    '<=',
    '21',
    1,
    1,
    'Child must be aged 0-21 years',
    'Applicant does not meet the age criteria (0-21 years)',
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'has_disability',
    '===',
    'true',
    1,
    2,
    'Child must have a diagnosed disability',
    'Applicant must have a diagnosed disability',
    1
),
-- Eligibility Rules for Fire & Emergency Grant
(
    (SELECT id FROM programs WHERE code = 'LC-FEG-2024'),
    'fire_report_submitted',
    '===',
    'true',
    1,
    1,
    'Must submit a fire report from relevant authorities',
    'Applicant must submit a fire report',
    1
),
-- Eligibility Rules for Private Sector Pension Scheme
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'age',
    '>=',
    '65',
    1,
    1,
    'Must have attained the age of 65 years',
    'Applicant does not meet the age requirement (65 years or older)',
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'contribution_months',
    '>=',
    '180',
    1,
    2,
    'Must have contributed to the National Insurance for a minimum of 180 months',
    'Applicant does not meet the contribution months requirement',
    1
);

-- Insert into required_documents with exact column names from your schema
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES
-- Required Documents for Public Assistance Cash Transfer Grant
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'sl_net_assessment',
    'Completed SL-NET 3.1 Proxy Means Test assessment',
    1,
    0,
    1
),
-- Required Documents for Child Disability Grant
(
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'medical_assessment_report',
    'Report from a physician indicating the severity of the disability',
    1,
    0,
    1
),
-- Required Documents for Fire & Emergency Grant
(
    (SELECT id FROM programs WHERE code = 'LC-FEG-2024'),
    'fire_report',
    'Official fire report from Fire Service or NEMO',
    1,
    0,
    1
),
-- Required Documents for Private Sector Pension Scheme
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'valid_id',
    'Copy of valid ID (Passport, National ID)',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'birth_certificate',
    'Birth certificate or valid passport',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'proof_of_name_change',
    'Proof of name change if applicable (e.g., marriage certificate, deed poll)',
    0,
    0,
    1
);

-- Insert into benefit_rules with exact column names from your schema
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
-- Benefit Rules for Public Assistance Cash Transfer Grant
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'household_size',
    '===',
    '1',
    215.00,
    'set',
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'household_size',
    '===',
    '2',
    280.00,
    'set',
    2,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'household_size',
    '===',
    '3',
    340.00,
    'set',
    3,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'household_size',
    '===',
    '4',
    400.00,
    'set',
    4,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'household_size',
    '>=',
    '5',
    465.00,
    'set',
    5,
    1
),
-- Benefit Rule for Child Disability Grant
(
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'has_disability',
    '===',
    'true',
    200.00,
    'set',
    1,
    1
),
-- Benefit Rule for Fire & Emergency Grant
(
    (SELECT id FROM programs WHERE code = 'LC-FEG-2024'),
    'fire_report_submitted',
    '===',
    'true',
    500.00,
    'set',
    1,
    1
);

-- Insert into geographic_coverage with exact column names from your schema
INSERT INTO geographic_coverage (
    program_id,
    region,
    coverage_type,
    special_requirements,
    active
) VALUES
-- Geographic Coverage for all programs (National)
(
    (SELECT id FROM programs WHERE code = 'LC-PAP-CTG-2024'),
    'national',
    'full',
    NULL,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-SFP-2024'),
    'national',
    'full',
    'Must be enrolled in public primary school',
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'national',
    'full',
    NULL,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-FEG-2024'),
    'national',
    'full',
    NULL,
    1
),
(
    (SELECT id FROM programs WHERE code = 'LC-PSPS-2024'),
    'national',
    'full',
    NULL,
    1
);

-- Insert into meb_values with exact column names from your schema
INSERT INTO meb_values (
    country_code,
    amount,
    last_updated,
    base_year
) VALUES (
    'LC',
    1428.38,
    '2024-01-01',
    2024
);
