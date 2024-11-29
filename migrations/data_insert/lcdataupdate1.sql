
DELETE FROM eligibility_rules WHERE rule_type = 'sl_net_score';

-- 2. Insert new eligibility rules based on EligibilityParams

-- Eligibility Rules for 'TT-PATH-2024' (Programme of Advancement Through Health and Education - PATH)
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
    'is_vulnerable',
    '===',
    'true',
    1,
    1,
    'Applicant must be considered vulnerable',
    'Applicant is not considered vulnerable',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PATH-2024'),
    'country_of_residence',
    '===',
    'TT',
    1,
    2,
    'Applicant must be a resident of Trinidad and Tobago',
    'Applicant must be a resident of Trinidad and Tobago',
    1
);

-- Eligibility Rules for 'TT-SFP-2024' (School Feeding Programme)
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
    (SELECT id FROM programs WHERE code = 'TT-SFP-2024'),
    'is_enrolled_in_school',
    '===',
    'true',
    1,
    1,
    'Applicant must be enrolled in a public primary or secondary school',
    'Applicant is not enrolled in a public primary or secondary school',
    1
);

-- Eligibility Rules for 'TT-DAG-2024' (Disability Assistance Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'disability_status',
    '>',
    '1',
    1,
    1,
    'Applicant must have a diagnosed disability',
    'Applicant does not have a diagnosed disability',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-DAG-2024'),
    'age',
    '>=',
    '18',
    1,
    2,
    'Applicant must be at least 18 years old',
    'Applicant must be at least 18 years old',
    1
);

-- Eligibility Rules for 'TT-PAP-2024' (Public Assistance Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'country_of_residence',
    '===',
    'TT',
    1,
    1,
    'Applicant must be a resident of Trinidad and Tobago',
    'Applicant must be a resident of Trinidad and Tobago',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-PAP-2024'),
    'monthly_income',
    '<',
    '1900',
    1,
    2,
    'Household monthly income must be less than $1900',
    'Household monthly income exceeds the maximum threshold',
    1
);

-- Eligibility Rules for 'TT-SSBG-2024' (School Supplies and Book Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-SSBG-2024'),
    'is_enrolled_in_school',
    '===',
    'true',
    1,
    1,
    'Applicant must be enrolled in a public primary or secondary school',
    'Applicant is not enrolled in a public primary or secondary school',
    1
);

-- Eligibility Rules for 'TT-ERRG-2024' (Emergency Repairs and Reconstruction Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-ERRG-2024'),
    'affected_by_emergency',
    '===',
    'true',
    1,
    1,
    'Applicant must be affected by an emergency or fire',
    'Applicant has not been affected by an emergency or fire',
    1
);

-- Eligibility Rules for 'TT-HIG-2024' (Household Items Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-HIG-2024'),
    'affected_by_emergency',
    '===',
    'true',
    1,
    1,
    'Applicant must be affected by an emergency or fire',
    'Applicant has not been affected by an emergency or fire',
    1
);

-- Eligibility Rules for 'TT-SCPG-2024' (Senior Citizens Pension Grant)
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
    (SELECT id FROM programs WHERE code = 'TT-SCPG-2024'),
    'age',
    '>=',
    '65',
    1,
    1,
    'Applicant must be at least 65 years old',
    'Applicant must be at least 65 years old',
    1
);

-- Eligibility Rules for 'TT-RB-2024' (Retirement Benefit)
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
    (SELECT id FROM programs WHERE code = 'TT-RB-2024'),
    'age',
    '>=',
    '65',
    1,
    1,
    'Applicant must be at least 65 years old',
    'Applicant must be at least 65 years old',
    1
),
(
    (SELECT id FROM programs WHERE code = 'TT-RB-2024'),
    'contributions_weeks',
    '>=',
    '180',
    1,
    2,
    'Applicant must have contributed to the National Insurance for at least 180 weeks',
    'Applicant does not meet the contribution weeks requirement',
    1
);
