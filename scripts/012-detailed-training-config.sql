-- Sistema completo de configuração detalhada de treinos por usuário
-- NOTA: As tabelas principais já foram criadas. Este script apenas insere dados padrão.

-- Corrigindo nomes de colunas para corresponder às tabelas criadas
INSERT INTO user_training_config (user_id, training_frequency, training_split, gym_series, gym_reps_min, gym_reps_max, gym_rest_seconds, intensity_level, use_dropsets, use_supersets)
VALUES 
  ('kleber', 5, 'ABC', 4, 8, 12, 90, 'heavy', true, true),
  ('pamela', 4, 'ABC', 3, 10, 15, 60, 'moderate', false, true),
  ('juliana', 0, 'none', 3, 12, 20, 45, 'light', false, false)
ON CONFLICT (user_id) DO UPDATE SET
  training_frequency = EXCLUDED.training_frequency,
  training_split = EXCLUDED.training_split,
  gym_series = EXCLUDED.gym_series,
  gym_reps_min = EXCLUDED.gym_reps_min,
  gym_reps_max = EXCLUDED.gym_reps_max,
  gym_rest_seconds = EXCLUDED.gym_rest_seconds,
  intensity_level = EXCLUDED.intensity_level,
  use_dropsets = EXCLUDED.use_dropsets,
  use_supersets = EXCLUDED.use_supersets;

-- Corrigindo nomes de colunas da tabela cardio
INSERT INTO user_cardio_config (user_id, cardio_frequency, cardio_duration_min, cardio_type, cardio_intensity, hiit_work_seconds, hiit_rest_seconds, hiit_rounds)
VALUES 
  ('kleber', 2, 30, 'running', 'moderate', 30, 30, 8),
  ('pamela', 3, 35, 'running', 'moderate', 30, 30, 8),
  ('juliana', 4, 40, 'walking', 'light', 20, 40, 6)
ON CONFLICT (user_id) DO UPDATE SET
  cardio_frequency = EXCLUDED.cardio_frequency,
  cardio_duration_min = EXCLUDED.cardio_duration_min,
  cardio_type = EXCLUDED.cardio_type,
  cardio_intensity = EXCLUDED.cardio_intensity,
  hiit_work_seconds = EXCLUDED.hiit_work_seconds,
  hiit_rest_seconds = EXCLUDED.hiit_rest_seconds,
  hiit_rounds = EXCLUDED.hiit_rounds;

-- Corrigindo nomes de colunas da tabela nutrition
INSERT INTO user_nutrition_config (user_id, daily_calories, protein_grams, carbs_grams, fats_grams, diet_type, caloric_goal, water_goal_ml)
VALUES 
  ('kleber', 2800, 180, 300, 75, 'high_protein', 'gain', 3000),
  ('pamela', 1800, 120, 180, 60, 'balanced', 'lose', 2500),
  ('juliana', 1500, 100, 120, 50, 'low_carb', 'lose', 2500)
ON CONFLICT (user_id) DO UPDATE SET
  daily_calories = EXCLUDED.daily_calories,
  protein_grams = EXCLUDED.protein_grams,
  carbs_grams = EXCLUDED.carbs_grams,
  fats_grams = EXCLUDED.fats_grams,
  diet_type = EXCLUDED.diet_type,
  caloric_goal = EXCLUDED.caloric_goal,
  water_goal_ml = EXCLUDED.water_goal_ml;
