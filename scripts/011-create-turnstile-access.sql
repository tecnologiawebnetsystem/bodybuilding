-- Tabela de catracas cadastradas
CREATE TABLE IF NOT EXISTS turnstiles (
  id SERIAL PRIMARY KEY,
  gym_id VARCHAR(255) NOT NULL,
  turnstile_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(20) DEFAULT 'entry', -- entry, exit, both
  ip_address VARCHAR(45),
  api_key VARCHAR(255),
  brand VARCHAR(50), -- henry, controlid, topdata, dimep, generic
  model VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_ping TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tokens QR Code dos alunos (rotativo para seguranca)
CREATE TABLE IF NOT EXISTS user_access_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  access_token VARCHAR(255) UNIQUE NOT NULL,
  token_type VARCHAR(20) DEFAULT 'qrcode', -- qrcode, rfid, biometric_id
  rfid_card_number VARCHAR(100),
  biometric_template_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de acesso (cada passagem na catraca)
CREATE TABLE IF NOT EXISTS turnstile_access_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  turnstile_id INTEGER REFERENCES turnstiles(id),
  access_type VARCHAR(20) NOT NULL, -- entry, exit, denied
  auth_method VARCHAR(20), -- qrcode, rfid, biometric, pin, manual
  access_token_used VARCHAR(255),
  status VARCHAR(20) NOT NULL, -- granted, denied, error
  denial_reason VARCHAR(255),
  photo_url VARCHAR(500),
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configuracoes de acesso por plano
CREATE TABLE IF NOT EXISTS access_rules (
  id SERIAL PRIMARY KEY,
  gym_id VARCHAR(255) NOT NULL,
  plan_id INTEGER,
  rule_name VARCHAR(100) NOT NULL,
  allowed_days VARCHAR(50) DEFAULT '1,2,3,4,5,6,0', -- 0=domingo, 6=sabado
  start_time TIME DEFAULT '05:00',
  end_time TIME DEFAULT '23:00',
  max_entries_per_day INTEGER DEFAULT 2,
  require_exit_before_entry BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_access_logs_user ON turnstile_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_date ON turnstile_access_logs(accessed_at);
CREATE INDEX IF NOT EXISTS idx_access_tokens_user ON user_access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON user_access_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_turnstiles_gym ON turnstiles(gym_id);

-- Inserir catraca de exemplo
INSERT INTO turnstiles (gym_id, turnstile_code, name, location, type, brand)
VALUES 
  ('gym_allpfit', 'CAT-001', 'Catraca Principal', 'Entrada Principal', 'both', 'generic'),
  ('gym_allpfit', 'CAT-002', 'Catraca Secundaria', 'Entrada Estacionamento', 'both', 'generic')
ON CONFLICT (turnstile_code) DO NOTHING;

-- Inserir regra de acesso padrao
INSERT INTO access_rules (gym_id, rule_name, allowed_days, start_time, end_time)
VALUES ('gym_allpfit', 'Acesso Padrao', '1,2,3,4,5,6,0', '05:00', '23:00')
ON CONFLICT DO NOTHING;
