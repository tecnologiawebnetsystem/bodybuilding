-- Migration: Criar tabelas para planos alimentares dinamicos
-- Data: 2026-02-03

-- Tabela principal de planos alimentares
CREATE TABLE IF NOT EXISTS meal_plans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),
  name VARCHAR(255) NOT NULL DEFAULT 'Plano Personalizado',
  goal VARCHAR(100) DEFAULT 'emagrecimento', -- emagrecimento, hipertrofia, manutencao
  total_calories INTEGER DEFAULT 0,
  protein_goal INTEGER DEFAULT 0,
  fat_goal INTEGER DEFAULT 0,
  carb_goal INTEGER DEFAULT 0,
  water_goal DECIMAL(3,1) DEFAULT 3.0,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT, -- Prompt usado para gerar o plano via IA
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de refeicoes (meals) dentro de cada plano
CREATE TABLE IF NOT EXISTS meal_plan_meals (
  id SERIAL PRIMARY KEY,
  meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  time VARCHAR(10) NOT NULL, -- Ex: "07:00"
  name VARCHAR(255) NOT NULL, -- Ex: "Cafe da Manha - Alto em Proteina"
  calories INTEGER DEFAULT 0,
  tip TEXT, -- Dica nutricional
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alimentos dentro de cada refeicao
CREATE TABLE IF NOT EXISTS meal_plan_foods (
  id SERIAL PRIMARY KEY,
  meal_id INTEGER NOT NULL REFERENCES meal_plan_meals(id) ON DELETE CASCADE,
  food_description TEXT NOT NULL, -- Ex: "4 claras + 2 ovos inteiros (omelete com espinafre)"
  is_supplement BOOLEAN DEFAULT FALSE, -- Se eh suplemento
  is_avoid BOOLEAN DEFAULT FALSE, -- Se eh algo a evitar
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_active ON meal_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meal_plan_meals_plan ON meal_plan_meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_foods_meal ON meal_plan_foods(meal_id);

-- Inserir plano do Kleber (emagrecimento + suplementacao)
INSERT INTO meal_plans (user_id, name, goal, total_calories, protein_goal, fat_goal, carb_goal, water_goal, is_ai_generated) 
VALUES ('kleber', 'Plano Emagrecimento + Suplementacao', 'emagrecimento', 2570, 160, 50, 250, 3.0, FALSE)
ON CONFLICT DO NOTHING;

-- Inserir plano da Pamela (emagrecimento + suplementacao)
INSERT INTO meal_plans (user_id, name, goal, total_calories, protein_goal, fat_goal, carb_goal, water_goal, is_ai_generated) 
VALUES ('pamela', 'Plano Emagrecimento + Suplementacao', 'emagrecimento', 2000, 130, 45, 180, 3.0, FALSE)
ON CONFLICT DO NOTHING;

-- Inserir plano da Juliana (somente emagrecimento)
INSERT INTO meal_plans (user_id, name, goal, total_calories, protein_goal, fat_goal, carb_goal, water_goal, is_ai_generated) 
VALUES ('juliana', 'Plano Emagrecimento Saudavel', 'emagrecimento', 1370, 100, 35, 120, 3.0, FALSE)
ON CONFLICT DO NOTHING;
