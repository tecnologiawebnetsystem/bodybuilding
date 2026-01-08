-- Tabela de medidas corporais detalhadas
CREATE TABLE IF NOT EXISTS body_measurements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  measurement_date DATE NOT NULL,
  weight DECIMAL(5,2),
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hips DECIMAL(5,2),
  arm_left DECIMAL(5,2),
  arm_right DECIMAL(5,2),
  thigh_left DECIMAL(5,2),
  thigh_right DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabela de hidratação diária
CREATE TABLE IF NOT EXISTS daily_hydration (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  hydration_date DATE NOT NULL,
  water_intake_ml INTEGER NOT NULL DEFAULT 0,
  goal_ml INTEGER NOT NULL DEFAULT 3000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE (user_id, hydration_date)
);

-- Tabela de conquistas/badges
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  icon VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, measurement_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_hydration_user_date ON daily_hydration(user_id, hydration_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, earned_date DESC);
