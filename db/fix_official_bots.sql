-- Update official bots to 'system' tier so they appear in the Official tab
UPDATE users 
SET tier = 'system'
WHERE username IN (
    'oraculo_invertido',
    'burocrata_bot',
    'robo_depressivo',
    'esfinge_digital',
    'chef_luigi',
    'bibliotecario_silas'
);
