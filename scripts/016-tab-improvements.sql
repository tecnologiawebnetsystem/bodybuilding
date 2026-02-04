-- =============================================
-- MELHORIAS: MEDIDAS, AGUA E CORRIDA
-- =============================================

-- 1. MEDIDAS - FOTOS DE PROGRESSO
-- =============================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20) DEFAULT 'front', -- front, side, back
  measurement_id INTEGER, -- opcional: vincular a uma medida
  notes TEXT,
  taken_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- MEDIDAS - METAS DE MEDIDAS
CREATE TABLE IF NOT EXISTS measurement_goals (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  measurement_type VARCHAR(50) NOT NULL, -- weight, waist, chest, etc
  target_value DECIMAL(10,2) NOT NULL,
  start_value DECIMAL(10,2),
  target_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  achieved_at TIMESTAMP,
  UNIQUE(user_id, measurement_type, is_active)
);

-- 2. AGUA - CONFIGURACOES PERSONALIZADAS
-- =============================================
CREATE TABLE IF NOT EXISTS hydration_settings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) UNIQUE NOT NULL,
  daily_goal_ml INTEGER DEFAULT 2000,
  ml_per_kg DECIMAL(5,2) DEFAULT 35, -- ml por kg de peso
  use_weight_calculation BOOLEAN DEFAULT true,
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_interval_hours INTEGER DEFAULT 2,
  reminder_start_time TIME DEFAULT '08:00',
  reminder_end_time TIME DEFAULT '22:00',
  climate_adjustment BOOLEAN DEFAULT false, -- ajustar por clima
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AGUA - TIPOS DE BEBIDAS
CREATE TABLE IF NOT EXISTS beverage_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  hydration_factor DECIMAL(3,2) DEFAULT 1.0, -- 1.0 = 100% hidratacao
  icon VARCHAR(50),
  color VARCHAR(20),
  is_default BOOLEAN DEFAULT false
);

-- AGUA - REGISTRO DE HIDRATACAO MELHORADO
CREATE TABLE IF NOT EXISTS hydration_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  amount_ml INTEGER NOT NULL,
  beverage_type_id INTEGER REFERENCES beverage_types(id),
  effective_ml INTEGER, -- amount_ml * hydration_factor
  logged_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- AGUA - STREAKS DE HIDRATACAO
CREATE TABLE IF NOT EXISTS hydration_streaks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_goal_met_date DATE,
  total_days_goal_met INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. CORRIDA - REGISTROS DETALHADOS
-- =============================================
CREATE TABLE IF NOT EXISTS running_sessions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  pace_min_km DECIMAL(5,2), -- minutos por km
  calories_burned INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  elevation_gain_m INTEGER,
  route_data JSONB, -- coordenadas GPS
  weather_temp INTEGER,
  weather_condition VARCHAR(50),
  terrain_type VARCHAR(50), -- asfalto, trilha, esteira
  notes TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CORRIDA - PLANOS DE TREINO
CREATE TABLE IF NOT EXISTS running_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  goal_type VARCHAR(50), -- 5k, 10k, half_marathon, marathon
  duration_weeks INTEGER,
  difficulty VARCHAR(20), -- beginner, intermediate, advanced
  sessions_per_week INTEGER,
  plan_data JSONB, -- estrutura detalhada das semanas
  is_default BOOLEAN DEFAULT false
);

-- CORRIDA - USUARIO X PLANO
CREATE TABLE IF NOT EXISTS user_running_plans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_id INTEGER REFERENCES running_plans(id),
  started_at DATE DEFAULT CURRENT_DATE,
  current_week INTEGER DEFAULT 1,
  current_session INTEGER DEFAULT 1,
  completed_sessions JSONB DEFAULT '[]',
  target_date DATE,
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMP
);

-- CORRIDA - DESAFIOS
CREATE TABLE IF NOT EXISTS running_challenges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50), -- monthly_distance, streak, pace_improvement
  target_value DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  reward_points INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true
);

-- CORRIDA - PARTICIPACAO EM DESAFIOS
CREATE TABLE IF NOT EXISTS user_running_challenges (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  challenge_id INTEGER REFERENCES running_challenges(id),
  current_progress DECIMAL(10,2) DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- CORRIDA - PRs (RECORDS PESSOAIS)
CREATE TABLE IF NOT EXISTS running_prs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  distance_type VARCHAR(20), -- 1km, 5km, 10km, half, full
  best_time_seconds INTEGER,
  best_pace DECIMAL(5,2),
  achieved_at DATE,
  session_id INTEGER REFERENCES running_sessions(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, distance_type)
);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Tipos de bebidas padrao
INSERT INTO beverage_types (name, hydration_factor, icon, color, is_default) VALUES
('Agua', 1.0, 'droplet', '#3b82f6', true),
('Agua com Gas', 1.0, 'sparkles', '#60a5fa', true),
('Cha', 0.9, 'leaf', '#22c55e', true),
('Cafe', 0.8, 'coffee', '#92400e', true),
('Suco Natural', 0.85, 'citrus', '#f97316', true),
('Isotônico', 1.1, 'zap', '#eab308', true),
('Agua de Coco', 1.05, 'palm-tree', '#84cc16', true),
('Leite', 0.9, 'milk', '#f5f5f4', true),
('Refrigerante', 0.5, 'cup-soda', '#dc2626', true),
('Cerveja', 0.3, 'beer', '#fbbf24', true)
ON CONFLICT DO NOTHING;

-- Planos de corrida padrao
INSERT INTO running_plans (name, description, goal_type, duration_weeks, difficulty, sessions_per_week, is_default, plan_data) VALUES
('Iniciante 5K', 'Plano de 8 semanas para correr seus primeiros 5km', '5k', 8, 'beginner', 3, true,
  '{"weeks": [
    {"week": 1, "sessions": [{"day": 1, "type": "walk_run", "duration": 20, "description": "Alternar 1min corrida / 2min caminhada"}, {"day": 3, "type": "walk_run", "duration": 20}, {"day": 5, "type": "walk_run", "duration": 25}]},
    {"week": 2, "sessions": [{"day": 1, "type": "walk_run", "duration": 25, "description": "Alternar 2min corrida / 1min caminhada"}, {"day": 3, "type": "walk_run", "duration": 25}, {"day": 5, "type": "walk_run", "duration": 30}]},
    {"week": 3, "sessions": [{"day": 1, "type": "run", "duration": 15, "description": "Corrida leve continua"}, {"day": 3, "type": "walk_run", "duration": 30}, {"day": 5, "type": "run", "duration": 20}]},
    {"week": 4, "sessions": [{"day": 1, "type": "run", "duration": 20}, {"day": 3, "type": "run", "duration": 20}, {"day": 5, "type": "run", "duration": 25}]},
    {"week": 5, "sessions": [{"day": 1, "type": "run", "duration": 25}, {"day": 3, "type": "intervals", "duration": 25, "description": "5x 3min forte / 2min leve"}, {"day": 5, "type": "run", "duration": 30}]},
    {"week": 6, "sessions": [{"day": 1, "type": "run", "duration": 30}, {"day": 3, "type": "intervals", "duration": 30}, {"day": 5, "type": "long_run", "duration": 35}]},
    {"week": 7, "sessions": [{"day": 1, "type": "run", "duration": 30}, {"day": 3, "type": "run", "duration": 25}, {"day": 5, "type": "long_run", "duration": 40}]},
    {"week": 8, "sessions": [{"day": 1, "type": "run", "duration": 20, "description": "Semana de reducao"}, {"day": 3, "type": "run", "duration": 15}, {"day": 5, "type": "race", "distance": 5, "description": "Dia da prova! Corra seus 5K!"}]}
  ]}'::jsonb),
('10K em 10 Semanas', 'Evolua dos 5K para os 10K', '10k', 10, 'intermediate', 4, true,
  '{"weeks": [
    {"week": 1, "sessions": [{"day": 1, "type": "easy_run", "distance": 5}, {"day": 3, "type": "intervals", "duration": 30}, {"day": 5, "type": "easy_run", "distance": 4}, {"day": 7, "type": "long_run", "distance": 6}]}
  ]}'::jsonb),
('Meia Maratona 12 Semanas', 'Prepare-se para correr 21.1km', 'half_marathon', 12, 'advanced', 4, true,
  '{"weeks": [
    {"week": 1, "sessions": [{"day": 1, "type": "easy_run", "distance": 8}, {"day": 3, "type": "tempo", "distance": 6}, {"day": 5, "type": "easy_run", "distance": 6}, {"day": 7, "type": "long_run", "distance": 12}]}
  ]}'::jsonb)
ON CONFLICT DO NOTHING;

-- Desafios de corrida
INSERT INTO running_challenges (name, description, challenge_type, target_value, start_date, end_date, reward_points, is_active) VALUES
('50km em Fevereiro', 'Corra 50km durante o mes de Fevereiro', 'monthly_distance', 50, '2026-02-01', '2026-02-28', 500, true),
('100km em Fevereiro', 'Desafio avancado: 100km no mes', 'monthly_distance', 100, '2026-02-01', '2026-02-28', 1000, true),
('Sequencia de 7 Dias', 'Corra pelo menos 2km por dia durante 7 dias seguidos', 'streak', 7, '2026-02-01', '2026-03-31', 300, true),
('Melhore seu Pace', 'Baixe seu pace medio em 30 segundos por km', 'pace_improvement', 30, '2026-02-01', '2026-03-31', 400, true)
ON CONFLICT DO NOTHING;

-- Indices
CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_measurement_goals_user ON measurement_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_hydration_log_user ON hydration_log(user_id);
CREATE INDEX IF NOT EXISTS idx_hydration_log_date ON hydration_log(logged_at);
CREATE INDEX IF NOT EXISTS idx_running_sessions_user ON running_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_running_sessions_date ON running_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_user_running_plans_user ON user_running_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_running_challenges_user ON user_running_challenges(user_id);
