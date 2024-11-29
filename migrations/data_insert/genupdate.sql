

-- Delete all eligibility_rules where rule_type is 'disability_status' and operator is '==='
DELETE FROM eligibility_rules
WHERE rule_type = 'disability_status'
  AND operator = '>';

