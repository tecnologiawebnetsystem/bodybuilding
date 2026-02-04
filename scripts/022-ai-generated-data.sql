-- Tabela para planos de treino gerados por IA
CREATE TABLE IF NOT EXISTS ai_workout_plans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_type VARCHAR(10) NOT NULL, -- AB, ABC, ABCD, ABCDE, single
  plan_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para suplementos do usuario
CREATE TABLE IF NOT EXISTS user_supplements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  supplements JSONB NOT NULL,
  daily_schedule JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para planos nutricionais gerados por IA
CREATE TABLE IF NOT EXISTS ai_meal_plans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_ai_workout_plans_user ON ai_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_supplements_user ON user_supplements(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_meal_plans_user ON ai_meal_plans(user_id);
