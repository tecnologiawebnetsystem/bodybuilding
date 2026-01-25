-- =====================================================
-- CRIAR SUPER ADMIN DO SISTEMA
-- =====================================================
-- Execute este script para criar o usuario dono do sistema

-- 1. Criar usuario super admin
INSERT INTO users (
  user_id,
  name,
  email,
  pin,
  role,
  account_type,
  email_verified,
  profile_complete,
  age,
  gender,
  height,
  initial_weight,
  target_weight,
  current_weight,
  start_date,
  created_at
) VALUES (
  'super_admin_001',
  'Administrador Fit Transform',
  'admin@fittransform.com.br',
  '999999',
  'admin',
  'super_admin',
  true,
  true,
  30,
  'Masculino',
  175,
  75,
  75,
  75,
  CURRENT_DATE,
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  account_type = 'super_admin',
  role = 'admin';

-- 2. Registrar na tabela de system_admins
INSERT INTO system_admins (user_id, level, permissions)
VALUES ('super_admin_001', 'super_admin', '["all", "manage_gyms", "manage_trainers", "manage_students", "manage_subscriptions", "manage_billing", "view_reports", "system_settings"]')
ON CONFLICT DO NOTHING;

-- 3. Verificar se foi criado
SELECT 
  u.user_id,
  u.name,
  u.email,
  u.account_type,
  u.role,
  sa.level,
  sa.permissions
FROM users u
LEFT JOIN system_admins sa ON sa.user_id = u.user_id
WHERE u.account_type = 'super_admin';
