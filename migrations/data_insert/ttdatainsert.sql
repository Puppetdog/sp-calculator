-- Programs table with exact column names from schema
INSERT INTO programs (
    code,
    program_title,  -- Changed from title
    description,
    country_code,   -- Changed from countryCode
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
-- PATH Program
(
    'TT-PATH-2024',
    'Programme of Advancement Through Health and Education (PATH)',
    'A conditional cash transfer program targeting vulnerable populations including children, elderly, persons with disabilities, pregnant women, and unemployed adults',
    'TT',
    'social_assistance',
    'cash',
    'Ministry of Labor and Social Security',
    NULL,
    NULL,
    'monthly',
    48,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- School Feeding Programme
(
    'TT-SFP-2024',
    'School Feeding Programme',
    'Program providing nutritional support through meals to students in primary and secondary schools',
    'TT',
    'education',
    'in-kind',
    'National Schools Dietary Services Limited',
    7.63,
    10.00,
    'daily',
    12,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Disability Grant for Adults
(
    'TT-DAG-2024',
    'Disability Assistance Grant',
    'Financial assistance for adults with disabilities who are unable to earn a livelihood',
    'TT',
    'disability',
    'cash',
    'Ministry of Social Development and Family Services',
    2000.00,
    2000.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Public Assistance Program
(
    'TT-PAP-2024',
    'Public Assistance Grant',
    'Financial support for individuals and households determined to have inadequate means of support',
    'TT',
    'social_assistance',
    'cash',
    'Ministry of Social Development and Family Services',
    1300.00,
    1900.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Eligibility rules with exact column names from schema
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
    (SELECT id FROM programs WHERE code = 'TT-PATH-2024'),
    'residency',
    '===',
    'citizen_or_resident',
    1,
    1,
    'Must be a Jamaican citizen or legal resident',
    'Applicant must be a citizen or legal resident of Trinidad and Tobago',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PATH-2024'),
    'income',
    '<',
    '6.85',
    1,
    2,
    'Must be below the poverty line of $6.85 per day',
    'Household income exceeds maximum threshold',
    1
);

-- Required documents with exact column names from schema
INSERT INTO required_documents (
    program_id,
    document_type,   -- Changed from documentType
    description,
    is_mandatory,    -- Changed from isMandatory
    alternatives_allowed,  -- Changed from alternativesAllowed
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'national_id',
    'National Identification Card',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'medical_report',
    'Medical Report from a Government Medical Officer',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'bank_info',
    'Bank Account Information or Passbook',
    1,
    1,
    1
);

-- Benefit rules with exact column names from schema
INSERT INTO benefit_rules (
    program_id,
    condition_type,    -- Changed from conditionType
    operator,
    threshold_value,   -- Changed from thresholdValue
    benefit_modifier,  -- Changed from benefitModifier
    modifier_type,     -- Changed from modifierType
    priority,
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'household_size',
    '===',
    '1',
    1300.00,
    'set',
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'household_size',
    '===',
    '2',
    1550.00,
    'set',
    2,
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'household_size',
    '===',
    '3',
    1750.00,
    'set',
    3,
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'household_size',
    '>=',
    '4',
    1900.00,
    'set',
    4,
    1
);

-- Geographic coverage with exact column names from schema
INSERT INTO geographic_coverage (
    program_id,
    region,
    coverage_type,    -- Changed from coverageType
    special_requirements,  -- Changed from specialRequirements
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'TT-SFP-2024'),
    'national',
    'full',
    'Must be enrolled in government primary or secondary school',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'national',
    'full',
    NULL,
    1
);

-- MEB values with exact column names from schema
INSERT INTO meb_values (
    country_code,    -- Changed from countryCode
    amount,
    last_updated,    -- Changed from lastUpdated
    base_year        -- Changed from baseYear
) VALUES (
    'TT',
    5753.00,
    '2024-01-01',
    2024
);
