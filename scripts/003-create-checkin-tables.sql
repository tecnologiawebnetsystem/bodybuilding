-- Nova tabela para checkin global (não por treino individual)
CREATE TABLE IF NOT EXISTS daily_checkins (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  checkin_date DATE NOT NULL,
  checkin_type VARCHAR(20) NOT NULL CHECK (checkin_type IN ('workout', 'running')),
  workout_name VARCHAR(100),
  distance DECIMAL(5,2),
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE (user_id, checkin_date, checkin_type)
);

-- Tabela para controle de progressão de treinos (troca a cada 3 meses)
CREATE TABLE IF NOT EXISTS workout_progressions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  cycle_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  difficulty_level INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_progressions_user_active ON workout_progressions(user_id, active);
