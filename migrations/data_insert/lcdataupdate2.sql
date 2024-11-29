-- 1. Remove existing 'has_disability' eligibility rules for 'LC-CDG-2024'
DELETE FROM eligibility_rules
WHERE program_id = (SELECT id FROM programs WHERE code = 'LC-CDG-2024')
  AND rule_type = 'has_disability';

-- 2. Insert new eligibility rules with 'disability_status' for 'LC-CDG-2024'
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

