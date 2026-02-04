-- ===========================================
-- SAAS GYM - ESTRUTURA COMPLETA DE TABELAS
-- ===========================================

-- 1. GESTAO MULTI-ACADEMIA
-- ===========================================
CREATE TABLE IF NOT EXISTS gym_networks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  owner_id VARCHAR(100) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gym_units (
  id SERIAL PRIMARY KEY,
  network_id INTEGER REFERENCES gym_networks(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(200),
  max_capacity INTEGER DEFAULT 100,
  opening_hours JSONB, -- {"mon": "06:00-22:00", "tue": "06:00-22:00", ...}
  amenities TEXT[], -- ["piscina", "sauna", "spinning"]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. PLANOS E PAGAMENTOS
-- ===========================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  gym_unit_id INTEGER REFERENCES gym_units(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_quarterly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features TEXT[], -- ["musculacao", "spinning", "natacao"]
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_quarterly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_id INTEGER REFERENCES subscription_plans(id),
  gym_unit_id INTEGER REFERENCES gym_units(id),
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active, cancelled, past_due, trialing
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  subscription_id INTEGER REFERENCES user_subscriptions(id),
  stripe_payment_intent_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'succeeded', -- succeeded, pending, failed
  payment_method VARCHAR(50),
  description TEXT,
  paid_at TIMESTAMP DEFAULT NOW()
);

-- 3. AVALIACAO FISICA DIGITAL
-- ===========================================
CREATE TABLE IF NOT EXISTS physical_assessments (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  assessor_id VARCHAR(100), -- personal/avaliador
  assessment_date DATE NOT NULL,
  
  -- Dados Basicos
  height DECIMAL(5,2), -- em cm
  weight DECIMAL(5,2), -- em kg
  body_fat_percentage DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  bone_mass DECIMAL(5,2),
  water_percentage DECIMAL(5,2),
  metabolic_age INTEGER,
  basal_metabolic_rate INTEGER, -- calorias
  
  -- Circunferencias (cm)
  neck DECIMAL(5,2),
  shoulders DECIMAL(5,2),
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hips DECIMAL(5,2),
  left_arm DECIMAL(5,2),
  right_arm DECIMAL(5,2),
  left_forearm DECIMAL(5,2),
  right_forearm DECIMAL(5,2),
  left_thigh DECIMAL(5,2),
  right_thigh DECIMAL(5,2),
  left_calf DECIMAL(5,2),
  right_calf DECIMAL(5,2),
  
  -- Dobras Cutaneas (mm)
  triceps_fold DECIMAL(5,2),
  biceps_fold DECIMAL(5,2),
  subscapular_fold DECIMAL(5,2),
  suprailiac_fold DECIMAL(5,2),
  abdominal_fold DECIMAL(5,2),
  thigh_fold DECIMAL(5,2),
  calf_fold DECIMAL(5,2),
  
  -- Testes Fisicos
  flexibility_test DECIMAL(5,2), -- banco de Wells em cm
  push_ups_count INTEGER,
  sit_ups_count INTEGER,
  plank_time INTEGER, -- segundos
  vo2_max DECIMAL(5,2),
  resting_heart_rate INTEGER,
  
  -- Anamnese
  health_conditions TEXT[],
  injuries TEXT[],
  medications TEXT[],
  allergies TEXT[],
  goals TEXT[],
  activity_level VARCHAR(50), -- sedentario, leve, moderado, intenso
  sleep_quality VARCHAR(50),
  stress_level VARCHAR(50),
  
  -- Fotos (URLs)
  photo_front TEXT,
  photo_side TEXT,
  photo_back TEXT,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. GAMIFICACAO
-- ===========================================
-- Renomear tabela achievements existente se houver conflito
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'achievements') THEN
    ALTER TABLE achievements RENAME TO achievements_old;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS gym_achievements (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- nome do icone
  category VARCHAR(50), -- frequencia, forca, cardio, social
  points INTEGER DEFAULT 10,
  requirement_type VARCHAR(50), -- check_ins, workouts, streak, challenge
  requirement_value INTEGER,
  badge_color VARCHAR(20),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS gym_user_achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  achievement_id INTEGER REFERENCES gym_achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  gym_unit_id INTEGER REFERENCES gym_units(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50), -- individual, team, gym_wide
  metric_type VARCHAR(50), -- check_ins, workouts, distance, weight_lifted
  target_value INTEGER,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  prize_description TEXT,
  points_reward INTEGER DEFAULT 100,
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_rankings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  gym_unit_id INTEGER REFERENCES gym_units(id),
  period VARCHAR(20), -- weekly, monthly, yearly, all_time
  total_points INTEGER DEFAULT 0,
  total_check_ins INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  rank_position INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, gym_unit_id, period)
);

-- 5. SISTEMA DE COMUNICACAO
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  type VARCHAR(50), -- reminder, promotion, achievement, system, chat
  title VARCHAR(200) NOT NULL,
  message TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_conversations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  trainer_id VARCHAR(100), -- personal trainer
  gym_unit_id INTEGER REFERENCES gym_units(id),
  status VARCHAR(20) DEFAULT 'open', -- open, closed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(100) NOT NULL,
  sender_type VARCHAR(20), -- user, trainer, system
  message TEXT NOT NULL,
  attachments JSONB, -- [{"type": "image", "url": "..."}]
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- 6. CONTROLE DE ACESSO
-- ===========================================
CREATE TABLE IF NOT EXISTS access_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  gym_unit_id INTEGER REFERENCES gym_units(id),
  access_type VARCHAR(20), -- entry, exit
  access_method VARCHAR(50), -- qr_code, card, biometric
  device_id VARCHAR(100),
  access_time TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_cards (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  gym_unit_id INTEGER REFERENCES gym_units(id),
  card_number VARCHAR(50) UNIQUE,
  qr_code_hash VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ===========================================
-- INDICES PARA PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_physical_assessments_user ON physical_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON gym_user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rankings_user ON user_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);

-- ===========================================
-- DADOS INICIAIS - CONQUISTAS
-- ===========================================
INSERT INTO gym_achievements (code, name, description, icon, category, points, requirement_type, requirement_value, badge_color) VALUES
('first_checkin', 'Primeiro Passo', 'Fez seu primeiro check-in na academia', 'footprints', 'frequencia', 10, 'check_ins', 1, 'green'),
('week_warrior', 'Guerreiro da Semana', 'Treinou 5 dias em uma semana', 'sword', 'frequencia', 50, 'streak', 5, 'blue'),
('month_master', 'Mestre do Mes', 'Treinou 20 dias no mes', 'crown', 'frequencia', 100, 'check_ins', 20, 'gold'),
('streak_7', 'Sequencia de 7', 'Manteve 7 dias consecutivos de treino', 'fire', 'frequencia', 70, 'streak', 7, 'orange'),
('streak_30', 'Imbativel', 'Manteve 30 dias consecutivos de treino', 'trophy', 'frequencia', 300, 'streak', 30, 'purple'),
('early_bird', 'Madrugador', 'Treinou antes das 7h', 'sunrise', 'frequencia', 20, 'special', 1, 'yellow'),
('night_owl', 'Coruja', 'Treinou depois das 21h', 'moon', 'frequencia', 20, 'special', 1, 'indigo'),
('social_butterfly', 'Social', 'Convidou um amigo para a academia', 'users', 'social', 50, 'referral', 1, 'pink'),
('century', 'Centenario', 'Completou 100 check-ins', 'medal', 'frequencia', 500, 'check_ins', 100, 'gold'),
('transformation', 'Transformacao', 'Completou 3 avaliacoes fisicas', 'trending-up', 'evolucao', 100, 'assessments', 3, 'green')
ON CONFLICT (code) DO NOTHING;
