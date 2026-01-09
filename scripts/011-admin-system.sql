-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Inserir admin padrão (senha: admin123)
INSERT INTO admins (username, password_hash, email) 
VALUES ('admin', 'admin123', 'admin@fittransform.com')
ON CONFLICT (username) DO NOTHING;

-- Melhorar tabela user_preferences com mais campos
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS workout_type VARCHAR(50) DEFAULT 'hypertrophy';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS workout_goal VARCHAR(50) DEFAULT 'maintain';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS running_level VARCHAR(50) DEFAULT 'beginner';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS nutrition_goal VARCHAR(50) DEFAULT 'maintain';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS home_workout_focus VARCHAR(50) DEFAULT 'balanced';

-- Tabela de histórico de alterações do admin
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id SERIAL PRIMARY KEY,
  admin_username VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_user_id VARCHAR(50),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentários nas colunas
COMMENT ON COLUMN user_preferences.workout_type IS 'Tipos: hypertrophy, weight_loss, endurance, strength';
COMMENT ON COLUMN user_preferences.workout_goal IS 'Objetivos: lose_weight, gain_weight, gain_muscle, maintain';
COMMENT ON COLUMN user_preferences.running_level IS 'Níveis: beginner, intermediate, advanced';
COMMENT ON COLUMN user_preferences.nutrition_goal IS 'Objetivos: lose_weight, gain_weight, maintain, muscle_gain';
COMMENT ON COLUMN user_preferences.home_workout_focus IS 'Foco: cardio, strength, flexibility, balanced';
