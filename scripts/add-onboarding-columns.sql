-- Adicionar colunas para onboarding

-- Tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS fitness_goal VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50);

-- Tabela gyms
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS state VARCHAR(2);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS description TEXT;

-- Tabela trainer_profiles_new
ALTER TABLE trainer_profiles_new ADD COLUMN IF NOT EXISTS certifications TEXT;
ALTER TABLE trainer_profiles_new ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2);
