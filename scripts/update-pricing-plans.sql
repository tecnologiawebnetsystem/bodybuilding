-- =====================================================
-- FIT TRANSFORM - PLANOS DE PRECOS SIMPLIFICADOS
-- =====================================================

-- Limpar planos antigos
DELETE FROM saas_plans_new;

-- Inserir novos planos simplificados
INSERT INTO saas_plans_new (
  code, 
  name, 
  description, 
  target_role, 
  price_monthly, 
  price_yearly, 
  max_students, 
  max_trainers, 
  features, 
  trial_days,
  is_active
) VALUES 

-- PLANO ACADEMIA: R$ 299,99/mes
(
  'gym_pro',
  'Plano Academia',
  'Ideal para academias de todos os portes. Gerencie seus alunos, treinos e financeiro em um so lugar.',
  'gym_owner',
  299.99,
  2999.90, -- 10 meses (2 meses gratis)
  NULL, -- alunos ilimitados
  NULL, -- trainers ilimitados
  '["alunos_ilimitados", "treinos_ia", "gestao_financeira", "check_in_digital", "relatorios_avancados", "suporte_prioritario", "app_personalizado", "multi_unidades"]',
  7,
  true
),

-- PLANO PERSONAL TRAINER: R$ 99,00/mes
(
  'trainer_pro',
  'Plano Personal',
  'Perfeito para personal trainers autonomos. Gerencie seus alunos particulares com facilidade.',
  'trainer',
  99.00,
  990.00, -- 10 meses (2 meses gratis)
  NULL, -- alunos ilimitados
  NULL,
  '["alunos_ilimitados", "treinos_ia", "agenda_online", "gestao_financeira", "relatorios", "suporte_email"]',
  7,
  true
),

-- PLANO ALUNO: R$ 9,99/mes
(
  'student_premium',
  'Plano Aluno',
  'Acesso completo ao app para treinar por conta propria. Treinos com IA, acompanhamento e muito mais.',
  'student',
  9.99,
  99.90, -- 10 meses (2 meses gratis)
  NULL,
  NULL,
  '["treinos_ia", "acompanhamento_progresso", "nutricao_basica", "historico_treinos", "suporte_email"]',
  7,
  true
),

-- PLANO GRATUITO (para alunos vinculados a academia/personal)
(
  'student_free',
  'Aluno Vinculado',
  'Acesso gratuito para alunos de academias ou personal trainers assinantes.',
  'student',
  0.00,
  0.00,
  NULL,
  NULL,
  '["treinos_ia", "acompanhamento_progresso", "historico_treinos"]',
  0,
  true
);

-- Verificar planos criados
SELECT code, name, target_role, price_monthly, price_yearly FROM saas_plans_new ORDER BY price_monthly DESC;
