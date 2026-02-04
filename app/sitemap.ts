import { MetadataRoute } from 'next'
import { neon } from '@neondatabase/serverless'

const baseUrl = 'https://fittransform.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Paginas estaticas principais
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/entrar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/precos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre-nos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Buscar posts do blog dinamicamente
  let blogPosts: MetadataRoute.Sitemap = []
  
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const posts = await sql`
      SELECT slug, updated_at, created_at 
      FROM blog_posts 
      WHERE published = true 
      ORDER BY created_at DESC
    `
    
    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Erro ao buscar posts para sitemap:', error)
  }

  // Paginas de categorias do blog
  const blogCategories: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog?categoria=academia-treino`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog?categoria=fit-transform`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog?categoria=nutricao`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog?categoria=suplementacao`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Paginas regionais (SEO local)
  const regionalPages: MetadataRoute.Sitemap = [
    'taubate',
    'cacapava', 
    'pindamonhangaba',
    'sao-jose-dos-campos',
    'jacarei',
    'guaratingueta',
    'lorena',
    'caraguatatuba',
    'ubatuba',
    'campos-do-jordao',
  ].map((cidade) => ({
    url: `${baseUrl}/academia/${cidade}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogCategories, ...blogPosts, ...regionalPages]
}
