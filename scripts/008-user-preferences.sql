-- Tabela para armazenar preferências e configurações personalizadas de cada usuário
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  
  -- Configurações de tema (cores)
  theme_primary VARCHAR(20) DEFAULT '#3b82f6',
  theme_secondary VARCHAR(20) DEFAULT '#1e40af',
  theme_accent VARCHAR(20) DEFAULT '#06b6d4',
  
  -- Configurações de funcionalidades (quais abas/recursos estão habilitados)
  enable_gym_checkin BOOLEAN DEFAULT TRUE,
  enable_gym_workouts BOOLEAN DEFAULT TRUE,
  enable_running BOOLEAN DEFAULT TRUE,
  enable_home_workouts BOOLEAN DEFAULT TRUE,
  enable_nutrition BOOLEAN DEFAULT TRUE,
  enable_supplements BOOLEAN DEFAULT TRUE,
  enable_measurements BOOLEAN DEFAULT TRUE,
  enable_hydration BOOLEAN DEFAULT TRUE,
  enable_stats BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Inserir preferências para Kleber (perfil completo, tema azul)
INSERT INTO user_preferences (
  user_id, 
  theme_primary, theme_secondary, theme_accent,
  enable_gym_checkin, enable_gym_workouts, enable_running, enable_home_workouts,
  enable_nutrition, enable_supplements, enable_measurements, enable_hydration, enable_stats
) VALUES (
  'kleber',
  '#3b82f6', '#1e40af', '#06b6d4',
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE
) ON CONFLICT (user_id) DO UPDATE SET
  theme_primary = EXCLUDED.theme_primary,
  theme_secondary = EXCLUDED.theme_secondary,
  theme_accent = EXCLUDED.theme_accent;

-- Inserir preferências para Pamela (perfil completo, tema rosa)
INSERT INTO user_preferences (
  user_id,
  theme_primary, theme_secondary, theme_accent,
  enable_gym_checkin, enable_gym_workouts, enable_running, enable_home_workouts,
  enable_nutrition, enable_supplements, enable_measurements, enable_hydration, enable_stats
) VALUES (
  'pamela',
  '#ec4899', '#be185d', '#f472b6',
  TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE
) ON CONFLICT (user_id) DO UPDATE SET
  theme_primary = EXCLUDED.theme_primary,
  theme_secondary = EXCLUDED.theme_secondary,
  theme_accent = EXCLUDED.theme_accent;

-- Inserir preferências para Juliana (tema verde oliva, sem academia nem suplementos)
INSERT INTO user_preferences (
  user_id,
  theme_primary, theme_secondary, theme_accent,
  enable_gym_checkin, enable_gym_workouts, enable_running, enable_home_workouts,
  enable_nutrition, enable_supplements, enable_measurements, enable_hydration, enable_stats
) VALUES (
  'juliana',
  '#84cc16', '#65a30d', '#a3e635',
  FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE
) ON CONFLICT (user_id) DO UPDATE SET
  theme_primary = EXCLUDED.theme_primary,
  theme_secondary = EXCLUDED.theme_secondary,
  theme_accent = EXCLUDED.theme_accent,
  enable_gym_checkin = EXCLUDED.enable_gym_checkin,
  enable_gym_workouts = EXCLUDED.enable_gym_workouts,
  enable_supplements = EXCLUDED.enable_supplements;
