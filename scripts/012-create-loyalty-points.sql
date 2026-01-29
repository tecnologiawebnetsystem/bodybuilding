-- Tabela de saldo de pontos do usuario
CREATE TABLE IF NOT EXISTS user_loyalty_points (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  current_level VARCHAR(50) DEFAULT 'Bronze',
  cashback_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historico de transacoes de pontos
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'redeem', 'expire', 'bonus', 'cashback'
  points INTEGER NOT NULL,
  description TEXT,
  reference_type VARCHAR(50), -- 'checkin', 'streak', 'challenge', 'reward', 'referral'
  reference_id VARCHAR(100),
  balance_after INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catalogo de recompensas
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'desconto', 'produto', 'servico', 'experiencia'
  points_required INTEGER NOT NULL,
  cashback_value DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT -1, -- -1 = ilimitado
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resgates de recompensas
CREATE TABLE IF NOT EXISTS loyalty_redemptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  reward_id INTEGER REFERENCES loyalty_rewards(id),
  points_spent INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'delivered', 'cancelled'
  redemption_code VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- Niveis do programa de fidelidade
CREATE TABLE IF NOT EXISTS loyalty_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_points INTEGER NOT NULL,
  points_multiplier DECIMAL(3,2) DEFAULT 1.00,
  cashback_percentage DECIMAL(5,2) DEFAULT 0,
  benefits TEXT[],
  badge_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Desafios e missoes
CREATE TABLE IF NOT EXISTS loyalty_challenges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'special'
  target_value INTEGER NOT NULL, -- ex: 5 checkins, 10km corrida
  target_metric VARCHAR(50), -- 'checkins', 'workouts', 'streak', 'distance'
  points_reward INTEGER NOT NULL,
  bonus_cashback DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso do usuario nos desafios
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  challenge_id INTEGER REFERENCES loyalty_challenges(id),
  current_value INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Inserir niveis padrao
INSERT INTO loyalty_levels (name, min_points, points_multiplier, cashback_percentage, benefits, badge_color) VALUES
('Bronze', 0, 1.00, 1.0, ARRAY['10 pontos por check-in', '1% cashback'], '#CD7F32'),
('Prata', 500, 1.25, 2.0, ARRAY['12.5 pontos por check-in', '2% cashback', 'Acesso prioritario a aulas'], '#C0C0C0'),
('Ouro', 1500, 1.50, 3.0, ARRAY['15 pontos por check-in', '3% cashback', 'Desconto 10% na loja', '1 aula experimental gratis/mes'], '#FFD700'),
('Platina', 5000, 2.00, 5.0, ARRAY['20 pontos por check-in', '5% cashback', 'Desconto 15% na loja', 'Personal 1x/mes gratis', 'Acesso VIP eventos'], '#E5E4E2'),
('Diamante', 15000, 2.50, 7.5, ARRAY['25 pontos por check-in', '7.5% cashback', 'Desconto 20% na loja', 'Personal 2x/mes gratis', 'Armario VIP exclusivo', 'Convite eventos especiais'], '#B9F2FF')
ON CONFLICT DO NOTHING;

-- Inserir recompensas padrao
INSERT INTO loyalty_rewards (name, description, category, points_required, cashback_value, image_url) VALUES
('Desconto R$10 na mensalidade', 'Abatimento de R$10 na proxima mensalidade', 'desconto', 100, 10.00, '/rewards/discount-10.png'),
('Desconto R$25 na mensalidade', 'Abatimento de R$25 na proxima mensalidade', 'desconto', 200, 25.00, '/rewards/discount-25.png'),
('Desconto R$50 na mensalidade', 'Abatimento de R$50 na proxima mensalidade', 'desconto', 350, 50.00, '/rewards/discount-50.png'),
('Camiseta Oficial', 'Camiseta exclusiva da academia', 'produto', 300, 0, '/rewards/tshirt.png'),
('Garrafa Termica', 'Garrafa termica 750ml personalizada', 'produto', 250, 0, '/rewards/bottle.png'),
('Toalha de Academia', 'Toalha esportiva de microfibra', 'produto', 150, 0, '/rewards/towel.png'),
('1 Sessao de Massagem', 'Sessao de massagem relaxante 30min', 'servico', 500, 0, '/rewards/massage.png'),
('Avaliacao Fisica Completa', 'Avaliacao com bioimpedancia e composicao corporal', 'servico', 200, 0, '/rewards/assessment.png'),
('1 Aula Personal', 'Sessao individual com personal trainer', 'servico', 400, 0, '/rewards/personal.png'),
('Day Pass para Amigo', 'Convide um amigo para treinar por 1 dia', 'experiencia', 100, 0, '/rewards/daypass.png'),
('Mes Gratis', 'Um mes de mensalidade gratis', 'desconto', 1000, 0, '/rewards/free-month.png')
ON CONFLICT DO NOTHING;

-- Inserir desafios padrao
INSERT INTO loyalty_challenges (name, description, challenge_type, target_value, target_metric, points_reward, bonus_cashback) VALUES
('Primeira Semana', 'Faca 3 check-ins na sua primeira semana', 'special', 3, 'checkins', 50, 5.00),
('Consistencia Semanal', 'Faca 4 check-ins esta semana', 'weekly', 4, 'checkins', 30, 0),
('Maratonista', 'Faca 20 check-ins este mes', 'monthly', 20, 'checkins', 150, 15.00),
('Sequencia de 7 Dias', 'Treine 7 dias seguidos', 'special', 7, 'streak', 100, 10.00),
('Sequencia de 30 Dias', 'Treine 30 dias seguidos', 'special', 30, 'streak', 500, 50.00),
('Corredor Iniciante', 'Corra 10km no total este mes', 'monthly', 10, 'distance', 80, 0),
('Corredor Avancado', 'Corra 50km no total este mes', 'monthly', 50, 'distance', 250, 25.00)
ON CONFLICT DO NOTHING;

-- Criar indices para performance
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_date ON loyalty_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_user ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_user ON loyalty_redemptions(user_id);
