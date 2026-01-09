-- Tabela para armazenar configurações de notificações e horários de treino
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  
  -- Notificações de hidratação
  water_notifications_enabled BOOLEAN DEFAULT TRUE,
  water_interval_hours INTEGER DEFAULT 2,
  water_start_time TIME DEFAULT '08:00:00',
  water_end_time TIME DEFAULT '22:00:00',
  
  -- Notificações de treino
  workout_notifications_enabled BOOLEAN DEFAULT TRUE,
  gym_time TIME,
  running_time TIME,
  home_workout_time TIME,
  
  -- Dias da semana para cada atividade (array de 0-6, domingo=0)
  gym_days INTEGER[],
  running_days INTEGER[],
  home_workout_days INTEGER[],
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Inserir configurações padrão para usuários existentes
INSERT INTO user_notification_settings (
  user_id, 
  water_notifications_enabled, 
  workout_notifications_enabled,
  gym_time,
  running_time,
  home_workout_time,
  gym_days,
  running_days,
  home_workout_days
) VALUES 
  ('kleber', TRUE, TRUE, '18:00:00', '06:00:00', NULL, 
   ARRAY[1,2,4,5], ARRAY[0,3,5], NULL),
  ('pamela', TRUE, TRUE, '17:00:00', '07:00:00', NULL,
   ARRAY[1,3,5], ARRAY[0,2,4,6], NULL),
  ('juliana', TRUE, TRUE, NULL, '07:00:00', '19:00:00',
   NULL, ARRAY[0,2,4,5], ARRAY[1,3,5])
ON CONFLICT (user_id) DO NOTHING;
