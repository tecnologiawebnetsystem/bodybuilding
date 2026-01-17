import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, User, Eye, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
            >
              FitTransform
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Início
              </Link>
              <Link href="/blog" className="text-white font-semibold">
                Blog
              </Link>
              <Link href="/sobre-nos" className="text-gray-300 hover:text-white transition">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-gray-300 hover:text-white transition">
                Contato
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-gray-300 hover:text-white">
              <ArrowLeft size={20} className="mr-2" />
              Voltar ao Blog
            </Button>
          </Link>

          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-red-600 to-orange-500 border-0 mb-4">
              <Tag size={14} className="mr-1" />
              {post.category.name}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <User size={16} />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(post.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {post.views} visualizações
              </span>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <p className="text-xl text-gray-300 mb-6 leading-relaxed font-medium">{post.excerpt}</p>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Gostou do conteúdo?</h2>
            <p className="text-white/90 mb-6">
              Experimente a FitTransform gratuitamente e transforme a gestão da sua academia ou carreira como personal
              trainer!
            </p>
            <Link href="/get-started">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 bg-black/40 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2025 FitTransform. Todos os direitos reservados. | Desenvolvido por{" "}
            <Link href="/sobre-nos" className="text-orange-500 hover:underline">
              Web NetSystem
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
