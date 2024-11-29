-- Public Assistance Program
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
    'DM-PAP-2024',
    'Public Assistance Programme',
    'Financial support to individuals and families in need based on assessment of financial need, residency, age, disability, and health status',
    'DM',
    'social_assistance',
    'cash',
    'Ministry of Health, Wellness, and Social Services',
    150.00,
    375.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Eligibility Rules for Public Assistance Program
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
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'residency',
    '===',
    'legal_resident',
    1,
    1,
    'Must be a legal resident of Dominica',
    'Applicant must be a legal resident of Dominica',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'financial_need',
    '<',
    'threshold',
    1,
    2,
    'Must demonstrate income and assets fall below defined threshold',
    'Income exceeds maximum threshold',
    1
);

-- Required Documents for Public Assistance Program
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'identification',
    'Valid ID',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'proof_of_residence',
    'Utility bills, rental agreements, or documents confirming address',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'income_proof',
    'Recent pay slips, bank statements, or proof of unemployment',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'medical_documentation',
    'Medical certificates for disabilities or health conditions',
    0,
    1,
    1
);

-- Benefit Rules for Public Assistance Program
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
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'recipient_type',
    '===',
    'adult',
    150.00,
    'set',
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'recipient_type',
    '===',
    'child',
    127.50,
    'set',
    2,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-PAP-2024'),
    'household_size',
    '>=',
    '1',
    375.00,
    'max',
    3,
    1
);

-- Foster Care Program
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
    'DM-FCP-2024',
    'Foster Care Programme',
    'Program to support the placement of children in stable, nurturing foster homes with financial assistance and support services',
    'DM',
    'child_welfare',
    'cash',
    'Ministry of Health, Wellness, and Social Services',
    220.00,
    220.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Eligibility Rules for Foster Care Program
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
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'age',
    '>=',
    '25',
    1,
    1,
    'Foster parents must be at least 25 years old',
    'Applicant does not meet minimum age requirement',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'residency',
    '===',
    'legal_resident',
    1,
    2,
    'Must be a legal resident of Dominica',
    'Applicant must be a legal resident of Dominica',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'background_check',
    '===',
    'clean',
    1,
    3,
    'Must have clean criminal record',
    'Background check requirements not met',
    1
);

-- Required Documents for Foster Care Program
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'identification',
    'Valid ID',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'background_check',
    'Police record for all adult household members',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'health_certificate',
    'Medical certificate showing physical and mental fitness',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'reference_letters',
    'Two reference letters (personal and professional)',
    1,
    0,
    1
);

-- Benefit Rules for Foster Care Program
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
    'base_stipend',
    '===',
    'monthly',
    220.00,
    'set',
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-FCP-2024'),
    'clothing_allowance',
    '===',
    'annual',
    500.00,
    'add',
    2,
    1
);

-- Disability Grant
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
    'DM-DG-2024',
    'Disability Grant',
    'Financial assistance program for persons with disabilities to support their basic needs and medical expenses',
    'DM',
    'disability',
    'cash',
    'Ministry of Health, Wellness, and Social Services',
    300.00,
    300.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Required Documents for Disability Grant
INSERT INTO required_documents (
    program_id,
    document_type,
    description,
    is_mandatory,
    alternatives_allowed,
    active
) VALUES 
(
    (SELECT id FROM programs WHERE code = 'DM-DG-2024'),
    'identification',
    'Valid ID and proof of residency',
    1,
    1,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-DG-2024'),
    'medical_certification',
    'Medical certification of disability from qualified professional',
    1,
    0,
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-DG-2024'),
    'income_proof',
    'Proof of financial need',
    1,
    1,
    1
);

-- Old Age Pension
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
    'DM-OAP-2024',
    'Old Age Pension',
    'Pension program for elderly citizens providing regular financial support based on contributions',
    'DM',
    'pension',
    'cash',
    'Dominica Social Security',
    152.00,
    370.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Eligibility Rules for Old Age Pension
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
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'age',
    '>=',
    '60',
    1,
    1,
    'Must be at least 60 years old',
    'Applicant does not meet minimum age requirement',
    1
),
(
    (SELECT id FROM programs WHERE code = 'DM-OAP-2024'),
    'contributions',
    '>=',
    '500',
    1,
    2,
    'Must have at least 500 weeks of contributions',
    'Insufficient contribution weeks',
    1
);

-- MEB Values for Dominica
INSERT INTO meb_values (
    country_code,
    amount,
    last_updated,
    base_year
) VALUES (
    'DM',
    1428.38,
    '2024-01-01',
    2009
);
