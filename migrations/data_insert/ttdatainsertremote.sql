-- PATH Program
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
);

-- School Feeding Programme
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
    'TT-SFP-2024',
    'School Nutrition Programme',
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
);

-- Disability Assistance Grant
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
);

-- Public Assistance Grant 
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

-- School Supplies and Book Grant
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
    'TT-SSBG-2024',
    'School Supplies and Book Grant',
    'Financial assistance for purchasing school supplies and books for students from low-income families',
    'TT',
    'education',
    'cash',
    'Ministry of Education',
    1000.00,
    1000.00,
    'annual',
    12,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Emergency Repairs and Reconstruction Grant
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
    'TT-ERRG-2024',
    'Emergency Repairs and Reconstruction Grant',
    'Financial assistance for home repairs and reconstruction after natural disasters',
    'TT',
    'disaster_assistance',
    'cash',
    'National Commission for Self Help',
    NULL,
    25000.00,
    'one-time',
    60,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Household Items Grant
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
    'TT-HIG-2024',
    'Household Items Grant',
    'Financial assistance for replacement of household items damaged by disasters',
    'TT',
    'disaster_assistance',
    'cash',
    'Ministry of Social Development and Family Services',
    NULL,
    10000.00,
    'one-time',
    36,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Senior Citizens Pension Grant
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
    'TT-SCPG-2024',
    'Senior Citizens Pension Grant',
    'Monthly pension assistance for elderly citizens with limited income',
    'TT',
    'pension',
    'cash',
    'Ministry of Social Development and Family Services',
    500.00,
    3500.00,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Retirement Benefit
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
    'TT-RB-2024',
    'Retirement Benefit',
    'Contributory pension benefit for retired workers based on National Insurance contributions',
    'TT',
    'pension',
    'cash',
    'National Insurance Board',
    3000.00,
    NULL,
    'monthly',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
