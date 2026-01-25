-- Tabela de categorias do blog
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de artigos do blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  category_id INTEGER REFERENCES blog_categories(id),
  author VARCHAR(100) DEFAULT 'Equipe Fit Transform',
  tags TEXT[],
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  keywords TEXT[],
  reading_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias
INSERT INTO blog_categories (name, slug, description, icon) VALUES
('Musculacao', 'musculacao', 'Dicas e treinos de musculacao para ganho de massa e forca', 'dumbbell'),
('Calistenia', 'calistenia', 'Exercicios com peso corporal e treinos funcionais', 'person-standing'),
('Corrida', 'corrida', 'Guias de corrida, maratona e cardio', 'running'),
('Nutricao', 'nutricao', 'Alimentacao saudavel e dietas para resultados', 'apple'),
('Suplementacao', 'suplementacao', 'Guia completo de suplementos alimentares', 'pill'),
('Personal Trainer', 'personal-trainer', 'Vantagens e como escolher seu personal', 'user-check'),
('Saude e Bem-estar', 'saude-bem-estar', 'Qualidade de vida e saude mental', 'heart-pulse'),
('Academia', 'academia', 'Dicas para treinar na academia', 'building'),
('Fit Transform', 'fit-transform', 'Conheca nossa plataforma e servicos', 'sparkles')
ON CONFLICT (slug) DO NOTHING;

-- Criar indice para busca
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
