import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CallToAction() {
  return (
    <section className="bg-primary/5 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Pronto para começar sua jornada?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Junte-se a milhares de estudantes que já estão transformando suas carreiras
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Entrar em Contato</Link>
        </Button>
      </div>
    </section>
  )
}
