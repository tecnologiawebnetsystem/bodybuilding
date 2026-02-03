-- Migration: Inserir dados das refeicoes dos usuarios
-- Data: 2026-02-03
-- Executa APOS o script 020-meal-plans.sql

-- ========================================
-- PLANO DO KLEBER
-- ========================================

-- Cafe da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '06:30', 'Cafe da Manha - Alto em Proteina', 480, 'Proteina logo cedo acelera metabolismo e preserva massa muscular', 1
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '4 claras + 2 ovos inteiros (omelete com espinafre)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '06:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '2 fatias de pao integral ou tapioca', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '06:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 banana + 1 colher de pasta de amendoim', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '06:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Cafe preto sem acucar', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '06:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Multivitaminico + Omega 3', TRUE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '06:30';

-- Lanche da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '09:30', 'Lanche da Manha - Proteico', 280, 'Mantem anabolismo e evita catabolismo entre refeicoes', 2
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 scoop de Whey Protein com agua', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '09:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 porcao de oleaginosas (castanhas, amendoas - 30g)', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '09:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 maca ou pera', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '09:30';

-- Almoco
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '12:30', 'Almoco - Refeicao Principal', 620, 'Carboidrato moderado no almoco para energia sustentada', 3
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '180g de frango grelhado OU 150g de carne magra (patinho, acem)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 xicara de arroz integral ou batata doce (150g)', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde a vontade (alface, rucula, tomate, pepino)', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes refogados (brocolis, abobrinha, cenoura)', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 colher de sopa de azeite extra virgem', FALSE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Omega 3 (1 capsula)', TRUE, FALSE, 6
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '12:30';

-- Pre-Treino
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '15:30', 'Pre-Treino - Energia', 350, 'Carboidrato complexo 1-2h antes do treino para maximo desempenho', 4
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 batata doce media (150g) OU 1 banana com aveia', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '15:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 scoop de Whey Protein', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '15:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Cafeina 200mg + L-Carnitina 2g (30min antes)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '15:30';

-- Durante o Treino
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '18:00', 'Durante o Treino', 20, 'BCAA previne catabolismo e melhora recuperacao', 5
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '500ml de agua com BCAA (5g)', TRUE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '18:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Beba goles pequenos a cada 15 minutos', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '18:00';

-- Pos-Treino
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '19:00', 'Pos-Treino - Janela Anabolica', 250, 'Ate 30min apos treino - maxima absorcao de proteina', 6
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 scoop de Whey Protein Isolado (30g)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '19:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 banana grande', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '19:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Creatina 5g (misturar no shake)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '19:00';

-- Jantar
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '20:30', 'Jantar - Leve e Proteico', 350, 'Jantar leve favorece queima de gordura noturna', 7
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '180g de peixe grelhado (tilapia, salmao) OU frango', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '20:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes cozidos ou grelhados a vontade', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '20:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde com azeite e limao', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '20:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'SEM carboidratos pesados a noite', FALSE, TRUE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '20:30';

-- Ceia
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '22:00', 'Ceia - Recuperacao Noturna', 220, 'Caseina do iogurte libera proteina lentamente durante o sono', 8
FROM meal_plans WHERE user_id = 'kleber' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '200ml de iogurte grego natural (sem acucar)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '22:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 colher de pasta de amendoim ou chia', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '22:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'ZMA + Glutamina 5g (30min antes de dormir)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'kleber' AND m.time = '22:00';


-- ========================================
-- PLANO DA PAMELA
-- ========================================

-- Cafe da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '07:00', 'Cafe da Manha - Equilibrado', 380, 'Colageno em jejum ou com cafe - evita flacidez durante emagrecimento', 1
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '3 claras + 1 ovo inteiro (omelete com tomate)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '2 fatias de pao integral OU tapioca', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 fatia de queijo branco', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Cafe com leite desnatado ou cha verde', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Colageno 10g + Maca Peruana + Multivitaminico', TRUE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '07:00';

-- Lanche da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '10:00', 'Lanche da Manha - Leve', 180, 'Castanhas fornecem selenio - otimo para tireoide e energia', 2
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 iogurte natural desnatado', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '10:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 maca ou pera', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '10:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '5 castanhas do para', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '10:00';

-- Almoco
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '12:30', 'Almoco - Balanceado', 480, 'Prato colorido = mais nutrientes e vitaminas', 3
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '130g de frango grelhado OU 120g de peixe', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '3/4 xicara de arroz integral OU batata doce (100g)', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde a vontade com azeite', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes coloridos (brocolis, cenoura, abobrinha)', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Omega 3 + CLA (1 capsula cada)', TRUE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '12:30';

-- Pre-Treino
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '15:00', 'Pre-Treino - Energia', 280, 'Carboidrato antes do treino = mais energia para gluteo e pernas', 4
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 batata doce pequena (100g) OU 1 banana', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '15:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 scoop de Whey Protein (25g)', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '15:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Cafeina 100-200mg (se for treinar pesado)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '15:00';

-- Pos-Treino
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '18:00', 'Pos-Treino - Recuperacao', 220, 'Creatina na dose certa para mulher - definicao sem inchaco', 5
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 scoop de Whey Protein Isolado', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '18:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 banana pequena', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '18:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Creatina 3g (misturar no shake)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '18:00';

-- Jantar
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '20:00', 'Jantar - Proteico e Leve', 300, 'Sem carboidrato a noite acelera queima de gordura abdominal', 6
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '130g de peixe grelhado (tilapia, salmao) OU frango', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '20:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes grelhados ou cozidos a vontade', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '20:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde com limao e azeite', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '20:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'EVITAR carboidratos a noite', FALSE, TRUE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '20:00';

-- Ceia
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '22:00', 'Ceia - Relaxamento', 160, 'Magnesio melhora sono e ajuda com TPM e ansiedade', 7
FROM meal_plans WHERE user_id = 'pamela' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '150ml de iogurte grego natural', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '22:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 colher de chia ou linhaca', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '22:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Magnesio 300mg (30min antes de dormir)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'pamela' AND m.time = '22:00';


-- ========================================
-- PLANO DA JULIANA (somente emagrecimento, sem suplementacao)
-- ========================================

-- Cafe da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '07:00', 'Cafe da Manha - Leve e Nutritivo', 280, 'Colageno previne flacidez durante o emagrecimento', 1
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '2 claras + 1 ovo inteiro mexido', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 fatia de pao integral OU tapioca pequena', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 fruta (maca, pera ou mamao)', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Cha verde sem acucar', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '07:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Colageno 10g + Vitamina D3', TRUE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '07:00';

-- Lanche da Manha
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '09:30', 'Lanche da Manha - Saciedade', 130, 'Fibras aumentam saciedade e regulam intestino', 2
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 iogurte natural desnatado', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '09:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 porcao de frutas vermelhas ou morango', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '09:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Fibras (Psyllium 3g) com agua', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '09:30';

-- Almoco
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '12:30', 'Almoco - Equilibrado', 400, 'Coma devagar - 20 minutos para o cerebro sentir saciedade', 3
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '120g de frango grelhado OU 100g de peixe', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1/2 xicara de arroz integral OU batata doce (80g)', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde a vontade (alface, rucula, tomate, pepino)', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes cozidos ou grelhados', FALSE, FALSE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 colher de azeite', FALSE, FALSE, 5
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Omega 3 (1 capsula)', TRUE, FALSE, 6
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '12:30';

-- Lanche da Tarde
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '15:30', 'Lanche da Tarde - Controle da Fome', 160, 'Castanhas dao saciedade e gorduras boas', 4
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 fruta (maca ou pera)', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '15:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '10 castanhas ou amendoas', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '15:30';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Fibras (Psyllium 3g) + agua (antes se tiver muita fome)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '15:30';

-- Jantar
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '19:00', 'Jantar - Leve', 320, 'Jantar leve facilita digestao e queima gordura a noite', 5
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '120g de peixe OU frango grelhado', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '19:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Legumes refogados ou cozidos a vontade', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '19:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Salada verde com limao', FALSE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '19:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'SEM carboidratos - foco em proteina e vegetais', FALSE, TRUE, 4
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '19:00';

-- Ceia
INSERT INTO meal_plan_meals (meal_plan_id, time, name, calories, tip, sort_order)
SELECT id, '21:00', 'Ceia - Relaxamento (opcional)', 80, 'Cha e magnesio reduzem ansiedade noturna e compulsao', 6
FROM meal_plans WHERE user_id = 'juliana' AND is_active = TRUE LIMIT 1;

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '1 xicara de cha de camomila ou erva-doce', FALSE, FALSE, 1
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '21:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, '3 castanhas ou 1 colher de chia em agua', FALSE, FALSE, 2
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '21:00';

INSERT INTO meal_plan_foods (meal_id, food_description, is_supplement, is_avoid, sort_order)
SELECT m.id, 'Magnesio 200mg (ajuda no sono e ansiedade)', TRUE, FALSE, 3
FROM meal_plan_meals m JOIN meal_plans p ON m.meal_plan_id = p.id WHERE p.user_id = 'juliana' AND m.time = '21:00';
