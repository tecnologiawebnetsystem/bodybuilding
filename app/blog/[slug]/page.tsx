import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye, ArrowLeft, Tag, Clock, Share2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

// Imagens por categoria
const categoryImages: Record<string, string> = {
  "musculacao": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
  "calistenia": "https://images.unsplash.com/photo-1598971639058-a4fac2b09d8c?w=1200&q=80",
  "corrida": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
  "nutricao": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
  "suplementos": "https://images.unsplash.com/photo-1593095935967-1cb2f99b2d8b?w=1200&q=80",
  "personal-trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
  "academia": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80",
  "saude": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  "academia-e-treino": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
  "alimentacao": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
  "hidratacao": "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=1200&q=80",
  "saude-e-bem-estar": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/blog/posts/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const postImage = post.image_url || categoryImages[post.category?.slug] || categoryImages["academia"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <Image
          src={postImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft size={20} className="mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12 px-4 -mt-20 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-gradient-to-r from-red-600 to-orange-500 border-0 text-white">
                <Tag size={14} className="mr-1" />
                {post.category?.name || "Artigo"}
              </Badge>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Clock size={14} />
                5 min de leitura
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Eye size={14} />
                {post.views || 0} visualizacoes
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

            {/* Author */}
            <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                  {post.author?.charAt(0) || "F"}
                </div>
                <div>
                  <p className="text-white font-medium">{post.author || "Equipe Fit Transform"}</p>
                  <p className="text-gray-400 text-sm">Especialista em Fitness</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-gray-300 border-white/20 hover:bg-white/10 bg-transparent">
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* Excerpt */}
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-200 leading-relaxed italic">{post.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
              <span className="text-gray-400 text-sm mr-2">Tags:</span>
              <Badge variant="outline" className="text-gray-300 border-white/20">Fit Transform</Badge>
              <Badge variant="outline" className="text-gray-300 border-white/20">{post.category?.name}</Badge>
              <Badge variant="outline" className="text-gray-300 border-white/20">Fitness</Badge>
              <Badge variant="outline" className="text-gray-300 border-white/20">Saude</Badge>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tNiAwaDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Gostou do conteudo?</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                A Fit Transform e a plataforma completa para academias e personal trainers. 
                Gerencie alunos, treinos, financeiro e muito mais!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold w-full sm:w-auto">
                    Comecar Gratuitamente
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold w-full sm:w-auto bg-transparent">
                    Ver Mais Artigos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <SharedFooter />
    </div>
  )
}
