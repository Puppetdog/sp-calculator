

-- 1. Delete duplicate eligibility_rules based on program_id, rule_type, operator, and value
WITH duplicates AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY program_id, rule_type, operator, value
            ORDER BY id
        ) AS rn
    FROM eligibility_rules
)
DELETE FROM eligibility_rules
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- 2. Insert new eligibility rules for 'TT-DAG-2024' (Trinidad and Tobago Disability Assistance Grant)
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

-- 3. Insert new eligibility rules for 'LC-CDG-2024' (Saint Lucia Child Disability Grant)
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
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
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
    (SELECT id FROM programs WHERE code = 'LC-CDG-2024'),
    'age',
    '<=',
    '21',
    1,
    2,
    'Applicant must be aged 0-21 years',
    'Applicant is not within the eligible age range (0-21 years)',
    1
);

