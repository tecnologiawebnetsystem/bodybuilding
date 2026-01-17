"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
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

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      }

      if (Array.isArray(postsData)) {
        setPosts(postsData)
      } else {
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
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              FitTransform
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Conteúdo de qualidade sobre gestão de academias, treinos, alimentação e saúde
          </p>

          {/* Busca */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-red-600 to-orange-500 border-0 text-white">
                            {post.category?.name || "Sem categoria"}
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("pt-BR") : ""}
                          </span>
                        </div>
                        <CardTitle className="text-white group-hover:text-orange-400 transition">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-2">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <User size={14} />
                            {post.author}
                          </span>
                          <ArrowRight className="text-orange-500 group-hover:translate-x-1 transition" size={20} />
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
