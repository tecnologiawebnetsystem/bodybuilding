-- Adicionar campos de perfil aos usuários
ALTER TABLE users
ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS target_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female'));

-- Atualizar dados existentes
UPDATE users SET height = 180, target_weight = 78, gender = 'male' WHERE user_id = 'kleber';
UPDATE users SET height = 172, target_weight = 70, gender = 'female' WHERE user_id = 'pamela';

-- Adicionar campo de altura atual nas medidas corporais (caso o usuário mude de altura)
ALTER TABLE body_measurements
ADD COLUMN IF NOT EXISTS current_height DECIMAL(5,2);
