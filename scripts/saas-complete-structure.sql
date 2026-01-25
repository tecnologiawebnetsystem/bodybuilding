-- =====================================================
-- FIT TRANSFORM - ESTRUTURA SAAS COMPLETA
-- =====================================================
-- Perfis do Sistema:
-- 1. super_admin - Dono do sistema (voce)
-- 2. gym_owner - Dono de academia
-- 3. trainer - Personal Trainer (pode ser autonomo ou vinculado a academia)
-- 4. student - Aluno (pode ter multiplos vinculos ou ser independente)
-- =====================================================

-- TABELA: Planos SaaS (reorganizada)
DROP TABLE IF EXISTS saas_plans_new CASCADE;
CREATE TABLE saas_plans_new (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_role VARCHAR(20) NOT NULL, -- 'gym_owner', 'trainer', 'student'
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2),
  max_students INT,
  max_trainers INT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  trial_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: Super Admins (donos do sistema)
DROP TABLE IF EXISTS system_admins CASCADE;
CREATE TABLE system_admins (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  level VARCHAR(20) DEFAULT 'admin', -- 'super_admin', 'admin', 'support'
  permissions JSONB DEFAULT '["all"]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: Assinaturas SaaS (controle de pagamentos)
DROP TABLE IF EXISTS saas_subscriptions CASCADE;
CREATE TABLE saas_subscriptions (
  id SERIAL PRIMARY KEY,
  subscriber_type VARCHAR(20) NOT NULL, -- 'gym', 'trainer', 'student'
  subscriber_id VARCHAR(50) NOT NULL, -- ID da academia, trainer ou student
  plan_id INT,
  status VARCHAR(20) DEFAULT 'trial', -- 'trial', 'active', 'past_due', 'cancelled', 'expired'
  trial_ends_at TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method VARCHAR(50), -- 'credit_card', 'pix', 'boleto'
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: Historico de Pagamentos
DROP TABLE IF EXISTS saas_payment_history CASCADE;
CREATE TABLE saas_payment_history (
  id SERIAL PRIMARY KEY,
  subscription_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_method VARCHAR(50),
  payment_date TIMESTAMP,
  invoice_url TEXT,
  stripe_payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: Academias (melhorada)
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS owner_user_id VARCHAR(50);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS subscription_id INT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS social_facebook TEXT;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS business_hours JSONB;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]';
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP;

-- TABELA: Perfil do Trainer (melhorada)
DROP TABLE IF EXISTS trainer_profiles_new CASCADE;
CREATE TABLE trainer_profiles_new (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  subscription_id INT,
  bio TEXT,
  specialties JSONB DEFAULT '[]', -- ['musculacao', 'crossfit', 'pilates']
  certifications JSONB DEFAULT '[]',
  experience_years INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  availability JSONB, -- horarios disponiveis
  service_locations JSONB DEFAULT '[]', -- ['presencial', 'online', 'domicilio']
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  social_instagram TEXT,
  social_youtube TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: Vinculo Trainer-Academia (trainer pode trabalhar em varias academias)
DROP TABLE IF EXISTS gym_trainer_links CASCADE;
CREATE TABLE gym_trainer_links (
  id SERIAL PRIMARY KEY,
  gym_id INT NOT NULL,
  trainer_user_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  role VARCHAR(50) DEFAULT 'trainer',
  commission_percent DECIMAL(5,2) DEFAULT 0,
  hired_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(gym_id, trainer_user_id)
);

-- TABELA: Vinculo Aluno-Academia (aluno pode estar em varias academias)
DROP TABLE IF EXISTS gym_student_memberships CASCADE;
CREATE TABLE gym_student_memberships (
  id SERIAL PRIMARY KEY,
  gym_id INT NOT NULL,
  student_user_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  membership_type VARCHAR(50) DEFAULT 'standard',
  assigned_trainer_id VARCHAR(50),
  monthly_fee DECIMAL(10,2),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(gym_id, student_user_id)
);

-- TABELA: Vinculo Aluno-Trainer Particular (fora de academia)
DROP TABLE IF EXISTS private_training_links CASCADE;
CREATE TABLE private_training_links (
  id SERIAL PRIMARY KEY,
  trainer_user_id VARCHAR(50) NOT NULL,
  student_user_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  training_type VARCHAR(50) DEFAULT 'presencial',
  monthly_fee DECIMAL(10,2),
  sessions_per_week INT DEFAULT 2,
  session_duration_min INT DEFAULT 60,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  contract_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trainer_user_id, student_user_id)
);

-- TABELA: Perfil do Aluno Independente
DROP TABLE IF EXISTS independent_students CASCADE;
CREATE TABLE independent_students (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  subscription_id INT,
  subscription_status VARCHAR(20) DEFAULT 'free',
  trial_ends_at TIMESTAMP,
  features_enabled JSONB DEFAULT '["basic_workouts", "progress_tracking"]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Atualizar tabela users com novos campos
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_independent BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 0;

-- Criar indices para performance
CREATE INDEX IF NOT EXISTS idx_saas_subscriptions_subscriber ON saas_subscriptions(subscriber_type, subscriber_id);
CREATE INDEX IF NOT EXISTS idx_saas_subscriptions_status ON saas_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_gym_student_memberships_student ON gym_student_memberships(student_user_id);
CREATE INDEX IF NOT EXISTS idx_gym_student_memberships_gym ON gym_student_memberships(gym_id);
CREATE INDEX IF NOT EXISTS idx_private_training_links_trainer ON private_training_links(trainer_user_id);
CREATE INDEX IF NOT EXISTS idx_private_training_links_student ON private_training_links(student_user_id);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_gym_trainer_links_gym ON gym_trainer_links(gym_id);
CREATE INDEX IF NOT EXISTS idx_system_admins_user ON system_admins(user_id);

-- Inserir planos padroes
INSERT INTO saas_plans_new (code, name, description, target_role, price_monthly, price_yearly, max_students, max_trainers, features, trial_days) VALUES
-- Planos para Academia
('gym_starter', 'Academia Starter', 'Ideal para academias pequenas', 'gym_owner', 97.00, 970.00, 50, 3, 
  '["gestao_alunos", "check_in", "treinos_basicos", "relatorios_basicos", "suporte_email"]', 14),
('gym_pro', 'Academia Pro', 'Para academias em crescimento', 'gym_owner', 197.00, 1970.00, 200, 10, 
  '["gestao_alunos", "check_in", "treinos_ia", "financeiro", "relatorios_avancados", "app_personalizado", "suporte_prioritario"]', 14),
('gym_enterprise', 'Academia Enterprise', 'Solucao completa para grandes academias', 'gym_owner', 397.00, 3970.00, NULL, NULL, 
  '["gestao_alunos", "check_in", "treinos_ia", "financeiro", "relatorios_avancados", "app_personalizado", "multi_unidades", "api_acesso", "suporte_dedicado"]', 30),

-- Planos para Personal Trainer
('trainer_basic', 'Personal Basic', 'Para personal iniciante', 'trainer', 47.00, 470.00, 10, NULL, 
  '["gestao_clientes", "treinos_basicos", "agenda", "relatorios_basicos"]', 14),
('trainer_pro', 'Personal Pro', 'Para personal profissional', 'trainer', 97.00, 970.00, 50, NULL, 
  '["gestao_clientes", "treinos_ia", "agenda", "financeiro", "app_cliente", "relatorios_avancados", "suporte_prioritario"]', 14),
('trainer_premium', 'Personal Premium', 'Solucao completa', 'trainer', 147.00, 1470.00, NULL, NULL, 
  '["gestao_clientes", "treinos_ia", "agenda", "financeiro", "app_cliente", "relatorios_avancados", "marketing", "site_pessoal", "suporte_dedicado"]', 14),

-- Planos para Aluno Independente
('student_free', 'Aluno Free', 'Acesso basico gratuito', 'student', 0.00, 0.00, NULL, NULL, 
  '["treinos_basicos", "progress_tracking", "historico_limitado"]', 0),
('student_premium', 'Aluno Premium', 'Acesso completo', 'student', 29.90, 299.00, NULL, NULL, 
  '["treinos_ia", "nutricao", "suplementacao", "progress_tracking", "historico_completo", "estatisticas", "comunidade"]', 7)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  max_students = EXCLUDED.max_students,
  max_trainers = EXCLUDED.max_trainers,
  features = EXCLUDED.features,
  trial_days = EXCLUDED.trial_days;

-- Criar super admin inicial (voce pode alterar depois)
-- Para criar seu usuario como super admin, execute:
-- INSERT INTO system_admins (user_id, level, permissions) VALUES ('SEU_USER_ID', 'super_admin', '["all"]');
