-- Adicionar coluna de peso atual na tabela users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS current_weight DECIMAL(5,2);

-- Atualizar peso atual com base no peso inicial para usuários existentes
UPDATE users
SET current_weight = initial_weight
WHERE current_weight IS NULL AND initial_weight IS NOT NULL;

-- Comentário: Esta coluna armazena o peso atual do usuário,
-- que pode ser atualizado pelo usuário a qualquer momento via perfil
