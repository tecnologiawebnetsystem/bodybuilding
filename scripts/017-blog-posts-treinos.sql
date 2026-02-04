-- Script para adicionar posts do blog sobre treinos e Vale do Paraiba
-- Criado em: 2026

-- Primeiro, garantir que temos a categoria academia-treino
INSERT INTO blog_categories (name, slug, description, icon)
VALUES ('Academia e Treino', 'academia-treino', 'Dicas de treino e academia', 'dumbbell')
ON CONFLICT (slug) DO NOTHING;

-- Categoria sobre FitTransform
INSERT INTO blog_categories (name, slug, description, icon)
VALUES ('FitTransform', 'fit-transform', 'Novidades e dicas do FitTransform', 'sparkles')
ON CONFLICT (slug) DO NOTHING;

-- Obter IDs das categorias
-- Vamos usar subqueries para inserir

-- =====================================================
-- POSTS SOBRE TREINOS ESPECIFICOS
-- =====================================================

-- 1. Treino de Costas
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Guia Completo de Treino de Costas: Construa um Dorsal em V',
  'guia-completo-treino-costas-dorsal-v',
  'Aprenda os melhores exercicios para desenvolver costas largas e definidas. Dicas de personal trainers para hipertrofia das costas.',
  '<h2>Por que treinar costas e tao importante?</h2>
  <p>O treino de costas e fundamental para uma postura correta e um fisico equilibrado. Musculos fortes nas costas previnem lesoes e melhoram seu desempenho em outros exercicios.</p>
  
  <h3>Principais musculos das costas</h3>
  <ul>
    <li><strong>Latissimo do dorso (Lat)</strong> - responsavel pela largura das costas</li>
    <li><strong>Trapezio</strong> - da espessura e volume</li>
    <li><strong>Romboides</strong> - importantes para postura</li>
    <li><strong>Eretores da espinha</strong> - sustentacao da coluna</li>
  </ul>

  <h3>Top 5 exercicios para costas</h3>
  <ol>
    <li><strong>Puxada Frontal</strong> - 4x10-12 reps</li>
    <li><strong>Remada Curvada</strong> - 4x8-10 reps</li>
    <li><strong>Remada Unilateral</strong> - 3x10-12 cada lado</li>
    <li><strong>Pull-up (Barra Fixa)</strong> - 3x max reps</li>
    <li><strong>Pullover</strong> - 3x12-15 reps</li>
  </ol>

  <h3>Dicas do FitTransform</h3>
  <p>Use o app FitTransform para registrar seus treinos de costas e acompanhar sua evolucao. A IA do app pode gerar treinos personalizados baseados no seu nivel.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  245,
  'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 2. Treino de Ombros
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Ombros: Como Desenvolver Deltoides Impressionantes',
  'treino-ombros-deltoides-impressionantes',
  'Descubra os segredos para ombros 3D. Exercicios para deltoides anterior, lateral e posterior com tecnicas avancadas.',
  '<h2>Ombros largos: o diferencial de um fisico impressionante</h2>
  <p>Ombros bem desenvolvidos criam a ilusao de uma cintura mais fina e um fisico mais atletico. Sao 3 cabecas do deltoide que precisam ser trabalhadas.</p>
  
  <h3>Anatomia dos ombros</h3>
  <ul>
    <li><strong>Deltoide Anterior</strong> - frente do ombro</li>
    <li><strong>Deltoide Lateral</strong> - lado do ombro (largura)</li>
    <li><strong>Deltoide Posterior</strong> - parte de tras</li>
  </ul>

  <h3>Treino completo de ombros</h3>
  <ol>
    <li><strong>Desenvolvimento Militar</strong> - 4x8-10 reps</li>
    <li><strong>Elevacao Lateral</strong> - 4x12-15 reps</li>
    <li><strong>Elevacao Frontal</strong> - 3x12 reps</li>
    <li><strong>Crucifixo Invertido</strong> - 4x12-15 reps</li>
    <li><strong>Encolhimento (Trapezio)</strong> - 4x12 reps</li>
  </ol>

  <p>O FitTransform gera treinos de ombros personalizados considerando seus objetivos e nivel de experiencia.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  312,
  'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 3. Treino de Peito
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Peito Completo: Do Supino ao Crossover',
  'treino-peito-completo-supino-crossover',
  'Monte um treino de peito eficiente para hipertrofia. Aprenda a variar angulos e exercicios para peitoral superior, medio e inferior.',
  '<h2>Peitoral definido: o sonho de todo praticante</h2>
  <p>O treino de peito e um dos mais populares na academia. Para resultados maximos, e preciso trabalhar todas as porcoes do peitoral.</p>
  
  <h3>Divisao do peitoral</h3>
  <ul>
    <li><strong>Peitoral Superior (Clavicular)</strong> - exercicios inclinados</li>
    <li><strong>Peitoral Medio (Esternal)</strong> - supino reto</li>
    <li><strong>Peitoral Inferior</strong> - exercicios declinados</li>
  </ul>

  <h3>Treino completo de peito</h3>
  <ol>
    <li><strong>Supino Reto</strong> - 4x8-10 reps</li>
    <li><strong>Supino Inclinado Halter</strong> - 4x10-12 reps</li>
    <li><strong>Crossover (Cabo)</strong> - 3x12-15 reps</li>
    <li><strong>Flexao de Bracos</strong> - 3x max reps</li>
    <li><strong>Peck Deck</strong> - 3x12-15 reps</li>
  </ol>

  <h3>Dica importante</h3>
  <p>Controle a descida (fase excentrica) para maximizar a hipertrofia. O app FitTransform pode cronometrar suas series e descansos.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  428,
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 4. Treino de Biceps
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Biceps: Tecnicas para Bracos Maiores',
  'treino-biceps-tecnicas-bracos-maiores',
  'Maximize o crescimento dos biceps com exercicios e tecnicas comprovadas. Rosca direta, martelo, concentrada e muito mais.',
  '<h2>Biceps: o musculo mais desejado</h2>
  <p>Ter biceps bem desenvolvidos e o objetivo de muitos frequentadores de academia. Veja como otimizar seu treino.</p>
  
  <h3>Anatomia do biceps</h3>
  <ul>
    <li><strong>Cabeca Longa</strong> - pico do biceps</li>
    <li><strong>Cabeca Curta</strong> - largura interna</li>
    <li><strong>Braquial</strong> - empurra o biceps para cima</li>
  </ul>

  <h3>Melhores exercicios para biceps</h3>
  <ol>
    <li><strong>Rosca Direta com Barra</strong> - 4x10-12 reps</li>
    <li><strong>Rosca Alternada com Halter</strong> - 3x10-12 cada</li>
    <li><strong>Rosca Martelo</strong> - 3x12 reps</li>
    <li><strong>Rosca Concentrada</strong> - 3x12-15 reps</li>
    <li><strong>Rosca Scott</strong> - 3x10-12 reps</li>
  </ol>

  <p>Use o FitTransform para acompanhar a progressao de carga nos seus exercicios de biceps!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  356,
  'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 5. Treino de Triceps
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Triceps: 2/3 do Seu Braco',
  'treino-triceps-dois-tercos-braco',
  'O triceps representa a maior parte do braco. Aprenda exercicios para cabeca longa, lateral e medial do triceps.',
  '<h2>Triceps: o segredo de bracos grandes</h2>
  <p>Muitos focam apenas no biceps, mas o triceps representa cerca de 2/3 do volume do braco!</p>
  
  <h3>As 3 cabecas do triceps</h3>
  <ul>
    <li><strong>Cabeca Longa</strong> - a maior porcao</li>
    <li><strong>Cabeca Lateral</strong> - parte externa</li>
    <li><strong>Cabeca Medial</strong> - parte interna</li>
  </ul>

  <h3>Treino completo de triceps</h3>
  <ol>
    <li><strong>Triceps Testa</strong> - 4x10-12 reps</li>
    <li><strong>Triceps Pulley</strong> - 4x12-15 reps</li>
    <li><strong>Triceps Frances</strong> - 3x10-12 reps</li>
    <li><strong>Mergulho (Paralelas)</strong> - 3x max reps</li>
    <li><strong>Triceps Corda</strong> - 3x15 reps</li>
  </ol>

  <p>O FitTransform ajuda voce a manter a consistencia nos treinos de triceps com lembretes e progressao automatica.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  298,
  'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 6. Treino de Pernas
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Pernas Completo: Quadriceps, Posterior e Gluteos',
  'treino-pernas-completo-quadriceps-posterior-gluteos',
  'Nunca pule o dia de pernas! Guia completo para desenvolver quadriceps, posterior de coxa e gluteos com exercicios eficientes.',
  '<h2>Dia de pernas: o mais importante da semana</h2>
  <p>Treinar pernas libera mais hormonios anabolicos e ajuda no desenvolvimento do corpo inteiro. Nao pule!</p>
  
  <h3>Musculos das pernas</h3>
  <ul>
    <li><strong>Quadriceps</strong> - frente da coxa (4 cabecas)</li>
    <li><strong>Isquiotibiais</strong> - posterior da coxa</li>
    <li><strong>Gluteos</strong> - maior musculo do corpo</li>
    <li><strong>Panturrilhas</strong> - batata da perna</li>
  </ul>

  <h3>Treino completo de pernas</h3>
  <ol>
    <li><strong>Agachamento Livre</strong> - 4x8-10 reps</li>
    <li><strong>Leg Press 45</strong> - 4x12-15 reps</li>
    <li><strong>Cadeira Extensora</strong> - 3x12-15 reps</li>
    <li><strong>Mesa Flexora</strong> - 4x10-12 reps</li>
    <li><strong>Stiff</strong> - 3x10-12 reps</li>
    <li><strong>Panturrilha em Pe</strong> - 4x15-20 reps</li>
  </ol>

  <p>Registre seu treino de pernas no FitTransform e veja sua evolucao de forca ao longo do tempo!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  512,
  'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 7. Treino de Abdomen
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treino de Abdomen: Tanquinho em 8 Semanas',
  'treino-abdomen-tanquinho-8-semanas',
  'Descubra como definir o abdomen com exercicios eficientes e dieta adequada. Planks, abdominais e exercicios para obliquos.',
  '<h2>Abdomen definido: treino + dieta</h2>
  <p>O tanquinho e feito na cozinha, mas esculpido na academia. Veja os melhores exercicios para seu core.</p>
  
  <h3>Musculos do abdomen</h3>
  <ul>
    <li><strong>Reto Abdominal</strong> - o famoso tanquinho</li>
    <li><strong>Obliquos Externos</strong> - laterais</li>
    <li><strong>Obliquos Internos</strong> - estabilizacao</li>
    <li><strong>Transverso</strong> - musculo profundo</li>
  </ul>

  <h3>Treino de abdomen eficiente</h3>
  <ol>
    <li><strong>Prancha Frontal</strong> - 3x 45-60 segundos</li>
    <li><strong>Abdominal Crunch</strong> - 3x20 reps</li>
    <li><strong>Prancha Lateral</strong> - 3x30 seg cada lado</li>
    <li><strong>Elevacao de Pernas</strong> - 3x15 reps</li>
    <li><strong>Abdominal Bicicleta</strong> - 3x20 cada lado</li>
  </ol>

  <p>O FitTransform inclui treinos de abdomen nos seus planos personalizados!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  623,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- POSTS SOBRE FITTRANSFORM E VALE DO PARAIBA
-- =====================================================

-- 8. FitTransform em Taubate
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'FitTransform: O Melhor App de Academia em Taubate',
  'fittransform-melhor-app-academia-taubate',
  'Academias de Taubate estao transformando a gestao com o FitTransform. Descubra por que somos o app numero 1 da regiao.',
  '<h2>FitTransform chegou em Taubate!</h2>
  <p>Taubate, uma das principais cidades do Vale do Paraiba, agora conta com a tecnologia FitTransform para revolucionar suas academias.</p>
  
  <h3>Por que academias de Taubate escolhem o FitTransform?</h3>
  <ul>
    <li>Gestao completa de alunos e mensalidades</li>
    <li>Treinos personalizados com Inteligencia Artificial</li>
    <li>Check-in digital e controle de acesso</li>
    <li>App exclusivo para alunos</li>
    <li>Suporte local e personalizado</li>
  </ul>

  <h3>Academias parceiras em Taubate</h3>
  <p>Diversas academias da cidade ja utilizam o FitTransform para gerenciar seus negocios e oferecer a melhor experiencia para seus alunos.</p>

  <p><strong>Quer transformar sua academia em Taubate?</strong> Entre em contato conosco!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  189,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 9. FitTransform em Cacapava
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Academias de Cacapava Adotam FitTransform',
  'academias-cacapava-adotam-fittransform',
  'Cacapava investe em tecnologia fitness! Veja como o FitTransform esta ajudando academias e personal trainers da cidade.',
  '<h2>Cacapava na vanguarda do fitness digital</h2>
  <p>Cacapava, cidade vizinha a Taubate no Vale do Paraiba, esta adotando o FitTransform em suas principais academias.</p>
  
  <h3>Beneficios para academias de Cacapava</h3>
  <ul>
    <li>Reducao de ate 90% na inadimplencia</li>
    <li>Aumento de 40% na retencao de alunos</li>
    <li>Treinos com IA personalizados</li>
    <li>Relatorios financeiros completos</li>
  </ul>

  <h3>Personal Trainers de Cacapava</h3>
  <p>Personais autonomos tambem podem usar o FitTransform por apenas R$ 99/mes e gerenciar todos os seus alunos.</p>

  <p><strong>Faca parte da revolucao fitness em Cacapava!</strong></p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  156,
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 10. FitTransform em Pindamonhangaba
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'FitTransform Expande para Pindamonhangaba',
  'fittransform-expande-pindamonhangaba',
  'Pindamonhangaba recebe o FitTransform! Academias da cidade podem agora contar com gestao profissional e treinos com IA.',
  '<h2>Pindamonhangaba entra no mapa FitTransform</h2>
  <p>Mais uma cidade do Vale do Paraiba adota nossa plataforma. Pindamonhangaba agora faz parte da familia FitTransform!</p>
  
  <h3>O que oferecemos em Pindamonhangaba</h3>
  <ul>
    <li>Implantacao gratuita e suporte dedicado</li>
    <li>Treinamento para equipe da academia</li>
    <li>App personalizado com a marca da academia</li>
    <li>Integracao com sistemas de pagamento</li>
  </ul>

  <h3>Depoimento</h3>
  <blockquote>"O FitTransform transformou nossa academia. Agora temos controle total sobre financeiro e alunos." - Academia local de Pindamonhangaba</blockquote>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  178,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 11. App de Academia Vale do Paraiba
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Melhor App de Academia do Vale do Paraiba',
  'melhor-app-academia-vale-paraiba',
  'FitTransform e o aplicativo de gestao de academia mais usado no Vale do Paraiba. Taubate, SJC, Cacapava, Pinda e regiao.',
  '<h2>O Vale do Paraiba escolheu FitTransform</h2>
  <p>De Sao Jose dos Campos a Guaratingueta, academias de toda a regiao do Vale do Paraiba estao adotando o FitTransform.</p>
  
  <h3>Cidades atendidas no Vale do Paraiba</h3>
  <ul>
    <li>Sao Jose dos Campos</li>
    <li>Taubate</li>
    <li>Cacapava</li>
    <li>Pindamonhangaba</li>
    <li>Guaratingueta</li>
    <li>Jacarei</li>
    <li>Caraguatatuba</li>
    <li>Ubatuba</li>
  </ul>

  <h3>Por que somos lideres na regiao?</h3>
  <p>Conhecemos as necessidades das academias do interior paulista e oferecemos suporte proximo e personalizado.</p>

  <p><strong>Junte-se as centenas de academias do Vale que ja usam FitTransform!</strong></p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  234,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 12. Treinos com IA
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Treinos com Inteligencia Artificial: O Futuro do Fitness',
  'treinos-inteligencia-artificial-futuro-fitness',
  'Descubra como a IA esta revolucionando a criacao de treinos personalizados. FitTransform usa tecnologia de ponta.',
  '<h2>IA no mundo fitness</h2>
  <p>A Inteligencia Artificial chegou as academias para ficar. O FitTransform usa IA avancada para criar treinos unicos.</p>
  
  <h3>Como funciona a IA do FitTransform?</h3>
  <ul>
    <li>Analisa seus objetivos (hipertrofia, emagrecimento, etc)</li>
    <li>Considera seu nivel de experiencia</li>
    <li>Leva em conta lesoes e restricoes</li>
    <li>Adapta a frequencia de treino disponivel</li>
    <li>Evolui conforme seu progresso</li>
  </ul>

  <h3>Vantagens dos treinos com IA</h3>
  <ul>
    <li>Personalizacao em segundos</li>
    <li>Baseado em ciencia do exercicio</li>
    <li>Ajuste automatico de cargas</li>
    <li>Economia de tempo para personal trainers</li>
  </ul>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  445,
  'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 13. Gestao de Academia
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Gestao de Academia: Guia Completo para Donos',
  'gestao-academia-guia-completo-donos',
  'Tudo que voce precisa saber sobre gestao de academia. Financeiro, alunos, marketing e tecnologia em um so lugar.',
  '<h2>Gerir uma academia nao precisa ser dificil</h2>
  <p>Com as ferramentas certas, voce pode focar no que importa: seus alunos e resultados.</p>
  
  <h3>Pilares da gestao de academia</h3>
  <ul>
    <li><strong>Financeiro</strong> - controle de mensalidades e inadimplencia</li>
    <li><strong>Alunos</strong> - cadastro, treinos e acompanhamento</li>
    <li><strong>Equipe</strong> - gestao de personal trainers e funcionarios</li>
    <li><strong>Marketing</strong> - captacao e retencao de alunos</li>
  </ul>

  <h3>FitTransform resolve tudo isso</h3>
  <p>Nossa plataforma integra todas as areas da sua academia em um unico sistema facil de usar.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  378,
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 14. Personal Trainer App
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'App para Personal Trainer: Gerencie Seus Alunos',
  'app-personal-trainer-gerencie-alunos',
  'Personal Trainers precisam de um app profissional. FitTransform oferece gestao completa por apenas R$ 99/mes.',
  '<h2>Seja um Personal Trainer moderno</h2>
  <p>Seus alunos merecem o melhor acompanhamento. Com o FitTransform, voce oferece uma experiencia premium.</p>
  
  <h3>Funcionalidades para Personal Trainers</h3>
  <ul>
    <li>Cadastro ilimitado de alunos</li>
    <li>Treinos com IA personalizados</li>
    <li>Agenda online integrada</li>
    <li>Controle financeiro</li>
    <li>Chat com alunos</li>
    <li>Relatorios de progresso</li>
  </ul>

  <h3>Apenas R$ 99/mes</h3>
  <p>Invista no seu negocio e destaque-se da concorrencia com tecnologia de ponta.</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  289,
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 15. Tendencias Fitness 2026
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Tendencias Fitness 2026: O Que Esta em Alta',
  'tendencias-fitness-2026-alta',
  'Descubra as principais tendencias do mundo fitness em 2026. IA, apps, wearables e muito mais.',
  '<h2>O futuro do fitness ja chegou</h2>
  <p>2026 traz inovacoes incriveis para o mundo do exercicio fisico. Veja o que esta bombando!</p>
  
  <h3>Top 5 tendencias fitness 2026</h3>
  <ol>
    <li><strong>Treinos com IA</strong> - personalizacao automatica</li>
    <li><strong>Wearables avancados</strong> - monitoramento em tempo real</li>
    <li><strong>Apps de gestao</strong> - como o FitTransform</li>
    <li><strong>Treino funcional</strong> - movimentos naturais</li>
    <li><strong>Saude mental + exercicio</strong> - abordagem holistica</li>
  </ol>

  <h3>Fique na frente</h3>
  <p>Adote as tecnologias certas e destaque-se no mercado fitness!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'fit-transform'),
  true,
  567,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 16. Como Montar Treino
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Como Montar um Treino de Musculacao Eficiente',
  'como-montar-treino-musculacao-eficiente',
  'Aprenda a estruturar seu treino de musculacao para hipertrofia. Divisao ABC, ABCDE, Full Body e mais.',
  '<h2>Estruturando seu treino</h2>
  <p>Um bom treino precisa de planejamento. Veja as principais formas de dividir seus treinos.</p>
  
  <h3>Tipos de divisao de treino</h3>
  <ul>
    <li><strong>Full Body</strong> - corpo todo 3x/semana (iniciantes)</li>
    <li><strong>ABC</strong> - 3 treinos diferentes (intermediario)</li>
    <li><strong>ABCDE</strong> - 5 treinos diferentes (avancado)</li>
    <li><strong>Push/Pull/Legs</strong> - empurrar, puxar, pernas</li>
  </ul>

  <h3>Dica FitTransform</h3>
  <p>Nossa IA monta o treino ideal baseado na sua disponibilidade e objetivos. Experimente!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'academia-treino'),
  true,
  489,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;

-- 17. Suplementacao Basica
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, published, views, image_url)
SELECT 
  'Suplementacao Basica para Iniciantes na Academia',
  'suplementacao-basica-iniciantes-academia',
  'Quais suplementos realmente funcionam? Whey, creatina, BCAA - descubra o que vale a pena usar.',
  '<h2>Suplementos que funcionam</h2>
  <p>Nem todo suplemento e necessario. Veja quais realmente tem comprovacao cientifica.</p>
  
  <h3>Top 3 suplementos essenciais</h3>
  <ol>
    <li><strong>Whey Protein</strong> - proteina de alta qualidade</li>
    <li><strong>Creatina</strong> - aumenta forca e massa muscular</li>
    <li><strong>Cafeina</strong> - melhora performance no treino</li>
  </ol>

  <h3>Suplementos opcionais</h3>
  <ul>
    <li>BCAA (se nao comer proteina suficiente)</li>
    <li>Omega 3 (saude geral)</li>
    <li>Vitamina D (se tiver deficiencia)</li>
  </ul>

  <p>Registre sua suplementacao no app FitTransform!</p>',
  'Equipe FitTransform',
  (SELECT id FROM blog_categories WHERE slug = 'suplementacao'),
  true,
  678,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80'
ON CONFLICT (slug) DO NOTHING;
