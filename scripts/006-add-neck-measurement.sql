-- Adicionar coluna de pescoço para cálculo de % de gordura
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS neck DECIMAL(5,2);
