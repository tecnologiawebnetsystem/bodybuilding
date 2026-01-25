"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight, Clock, Eye } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  _count?: { posts: number }
}

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  created_at: string
  category: Category
  views: number
  image_url?: string
}

// Imagens por categoria para fallback
const categoryImages: Record<string, string> = {
  "musculacao": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "calistenia": "https://images.unsplash.com/photo-1598971639058-a4fac2b09d8c?w=800&q=80",
  "corrida": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "nutricao": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
  "suplementos": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
  "suplementacao": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
  "personal-trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "academia": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
  "academia-treino": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "academia-e-treino": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "saude": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "saude-bem-estar": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "saude-e-bem-estar": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "alimentacao": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
  "hidratacao": "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800&q=80",
  "fit-transform": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
}

const getPostImage = (post: Post) => {
  if (post.image_url) return post.image_url
  const categorySlug = post.category?.slug || "academia"
  return categoryImages[categorySlug] || categoryImages["academia"]
}

export default function BlogPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [categoriesRes, postsRes] = await Promise.all([
        fetch("/api/blog/categories"),
        fetch(`/api/blog/posts${selectedCategory ? `?category=${selectedCategory}` : ""}`),
      ])

      const categoriesData = await categoriesRes.json()
      const postsData = await postsRes.json()

      console.log("[v0] Blog API response - categories:", categoriesData)
      console.log("[v0] Blog API response - posts:", postsData)

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      }

      if (Array.isArray(postsData)) {
        setPosts(postsData)
      } else {
        console.log("[v0] Posts data is not an array:", typeof postsData, postsData)
        setError(postsData.error || "Erro ao carregar posts")
        setPosts([])
      }
    } catch (err) {
      console.error("Erro ao carregar blog:", err)
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Hero */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
            +90 artigos exclusivos
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Blog{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              Fit Transform
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Tudo sobre musculacao, calistenia, corrida, nutricao e suplementacao. 
            Transforme seu corpo e mente com conteudo de qualidade!
          </p>

          {/* Busca */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar artigos sobre treino, dieta, suplementos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">90+</p>
              <p className="text-gray-400 text-sm">Artigos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">6</p>
              <p className="text-gray-400 text-sm">Categorias</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">100%</p>
              <p className="text-gray-400 text-sm">Gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-6 sm:py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                !selectedCategory
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              Todas as Categorias
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === category.slug
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white"
                    : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {category.name} {category._count && `(${category._count.posts})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 px-4 pb-20">
        <div className="container mx-auto">
          {error && <div className="text-center text-red-400 mb-8 p-4 bg-red-500/10 rounded-lg">{error}</div>}

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-400">Carregando posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl mb-2">Nenhum post encontrado</p>
              <p className="text-sm">Tente buscar por outro termo ou selecione outra categoria</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-center mb-8">
                {filteredPosts.length} {filteredPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group overflow-hidden">
                      {/* Imagem */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getPostImage(post) || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 border-0 text-white">
                          {post.category?.name || "Sem categoria"}
                        </Badge>
                        {post.views > 100 && (
                          <Badge className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border-0 text-white">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("pt-BR") : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {post.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            5 min
                          </span>
                        </div>
                        <CardTitle className="text-white group-hover:text-orange-400 transition line-clamp-2 text-lg">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <User size={14} />
                            {post.author}
                          </span>
                          <span className="text-orange-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ler mais
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
