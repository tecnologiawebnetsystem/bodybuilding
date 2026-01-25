-- Adicionar coluna phone na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Adicionar coluna monthly_fee na tabela trainer_clients
ALTER TABLE trainer_clients ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) DEFAULT 350;

-- Adicionar coluna enable_calisthenics na tabela user_preferences (se nao existir)
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS enable_calisthenics BOOLEAN DEFAULT false;

-- Adicionar coluna injuries_limitations na tabela users para restricoes fisicas
ALTER TABLE users ADD COLUMN IF NOT EXISTS injuries_limitations TEXT;
