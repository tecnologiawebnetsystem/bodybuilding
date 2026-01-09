-- Criar tabela de cronograma de treinos semanal
CREATE TABLE IF NOT EXISTS weekly_workout_schedule (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Domingo, 6=Sábado
  workout_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, day_of_week),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Corrigido user_id de '1' para 'kleber'
-- Inserir cronograma padrão para Kleber
INSERT INTO weekly_workout_schedule (user_id, day_of_week, workout_name, description) VALUES
('kleber', 0, 'Peito e Tríceps', 'Supino, crucifixo, tríceps pulley'),
('kleber', 1, 'Costas e Bíceps', 'Pull-up, remada, rosca direta'),
('kleber', 2, 'Pernas', 'Agachamento, leg press, panturrilha'),
('kleber', 3, 'Descanso', 'Dia de recuperação'),
('kleber', 4, 'Ombros e Abdômen', 'Desenvolvimento, elevação lateral, prancha'),
('kleber', 5, 'Cardio', 'Corrida ou bicicleta'),
('kleber', 6, 'Descanso', 'Dia de recuperação')
ON CONFLICT (user_id, day_of_week) DO UPDATE SET
  workout_name = EXCLUDED.workout_name,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;

-- Corrigido user_id de '2' para 'pamela'
-- Inserir cronograma padrão para Pamela
INSERT INTO weekly_workout_schedule (user_id, day_of_week, workout_name, description) VALUES
('pamela', 0, 'Pernas e Glúteos', 'Agachamento, leg press, elevação pélvica'),
('pamela', 1, 'Braços e Abdômen', 'Rosca, tríceps, prancha lateral'),
('pamela', 2, 'Cardio', 'Corrida ou bike'),
('pamela', 3, 'Descanso', 'Dia de recuperação'),
('pamela', 4, 'Glúteos e Pernas', 'Stiff, cadeira abdutora, panturrilha'),
('pamela', 5, 'Corpo Inteiro', 'Circuito funcional'),
('pamela', 6, 'Descanso', 'Dia de recuperação')
ON CONFLICT (user_id, day_of_week) DO UPDATE SET
  workout_name = EXCLUDED.workout_name,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_schedule_user ON weekly_workout_schedule(user_id);
