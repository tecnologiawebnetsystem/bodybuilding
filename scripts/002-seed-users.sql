-- Insert initial users (Kleber and Pamela)
INSERT INTO users (user_id, pin, name, age, height, initial_weight, target_weight, start_date, gender)
VALUES 
  ('kleber', '080754', 'Kleber Gonçalves', 0, 180, 93, 78, '2026-01-06', 'male'),
  ('pamela', '191018', 'Pamela Gonçalves', 36, 172, 78, 70, '2026-01-06', 'female')
ON CONFLICT (user_id) DO NOTHING;

-- Insert initial weight logs
INSERT INTO weight_logs (user_id, weight, date, notes)
VALUES 
  ('kleber', 93, '2026-01-06', 'Peso inicial - Início da jornada!'),
  ('pamela', 78, '2026-01-06', 'Peso inicial - Vamos começar!')
ON CONFLICT DO NOTHING;
