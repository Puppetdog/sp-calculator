-- Eligibility Rules for PATH Program
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
    'Must be a citizen or legal resident',
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

-- Required Documents for Disability Assistance Grant
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
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

-- Benefit Rules for Public Assistance Grant
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

-- Geographic Coverage for School Nutrition Programme
INSERT INTO geographic_coverage (
    program_id,
    region,
    coverage_type,
    special_requirements,
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

-- MEB Values
INSERT INTO meb_values (
    country_code,
    amount,
    last_updated,
    base_year
) VALUES (
    'TT',
    5753.00,
    '2024-01-01',
    2024
);

-- Document Alternatives for National ID
INSERT INTO document_alternatives (
    required_document_id,
    alternative_type,
    description,
    validation_process
) VALUES
(
    (SELECT id FROM required_documents WHERE document_type = 'national_id' 
     AND program_id = (SELECT id FROM programs WHERE code = 'TT-DAG-2024')),
    'drivers_permit',
    'Valid Driver''s Permit',
    'Verify authenticity with licensing office'
),
(
    (SELECT id FROM required_documents WHERE document_type = 'national_id'
     AND program_id = (SELECT id FROM programs WHERE code = 'TT-DAG-2024')),
    'passport',
    'Valid Passport',
    'Verify authenticity with immigration'
);

-- COLA Adjustments for Senior Citizens Pension
INSERT INTO cola_adjustments (
    program_id,
    year,
    adjustment_rate,
    effective_date,
    approved_by,
    active
) VALUES
(
    (SELECT id FROM programs WHERE code = 'TT-SCPG-2024'),
    2024,
    3.5,
    '2024-01-01',
    'Minister of Finance',
    1
);
