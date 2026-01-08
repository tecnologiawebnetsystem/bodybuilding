import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-20">
      <div className="container mx-auto text-center">
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Bem-vindo ao <span className="text-primary">Academia</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Uma plataforma moderna e completa para gerenciar seu aprendizado e crescimento profissional. Explore recursos
          inovadores e alcance seus objetivos.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/contact">
              Comece Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Saiba Mais</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
