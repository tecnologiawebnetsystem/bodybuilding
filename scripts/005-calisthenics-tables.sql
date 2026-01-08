-- Tabela de treinos de calistenia
CREATE TABLE IF NOT EXISTS calisthenics_workouts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  workout_date DATE NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  exercises_completed TEXT[], -- Array de exercícios completados
  difficulty_level VARCHAR(20) NOT NULL, -- beginner, intermediate, advanced
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_calisthenics_user_date ON calisthenics_workouts(user_id, workout_date DESC);
