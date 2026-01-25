-- Tabela de planos de precos
CREATE TABLE IF NOT EXISTS pricing_plans (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_role VARCHAR(20) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2),
  max_students INT,
  max_trainers INT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  trial_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir os 4 planos
INSERT INTO pricing_plans (code, name, description, target_role, price_monthly, price_yearly, max_students, max_trainers, features, trial_days) VALUES
(
  'gym_pro',
  'Plano Academia',
  'Para academias de todos os portes. Gerencie alunos, trainers, financeiro e muito mais.',
  'gym_owner',
  299.99,
  2999.90,
  NULL,
  NULL,
  '["Alunos ilimitados", "Personal trainers ilimitados", "Treinos com IA", "Gestao financeira completa", "Check-in digital", "Relatorios avancados", "App personalizado", "Suporte prioritario", "Multi-unidades"]',
  7
),
(
  'trainer_pro',
  'Plano Personal',
  'Para personal trainers autonomos. Gerencie seus alunos com total controle.',
  'trainer',
  99.00,
  990.00,
  NULL,
  NULL,
  '["Alunos ilimitados", "Treinos com IA", "Agenda integrada", "Controle financeiro", "App para alunos", "Avaliacoes fisicas", "Suporte por email"]',
  7
),
(
  'student_premium',
  'Plano Aluno',
  'Para alunos independentes que querem treinar por conta propria.',
  'student',
  9.99,
  99.90,
  NULL,
  NULL,
  '["Treinos com IA", "Acompanhamento de progresso", "Biblioteca de exercicios", "Calculadoras fitness", "Historico completo", "Suporte por email"]',
  7
),
(
  'student_linked',
  'Aluno Vinculado',
  'Para alunos de academias ou personal trainers. Acesso gratuito atraves do seu instrutor.',
  'student_linked',
  0,
  0,
  NULL,
  NULL,
  '["Acesso ao app", "Treinos do instrutor", "Acompanhamento de progresso", "Check-in na academia", "Comunicacao com trainer"]',
  0
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  updated_at = NOW();
