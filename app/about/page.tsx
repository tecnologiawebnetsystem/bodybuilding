import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Sobre Nós</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nossa Missão</CardTitle>
            <CardDescription>Transformando ideias em realidade</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              Somos uma equipe dedicada a criar soluções inovadoras que fazem a diferença. Nosso foco está em
              desenvolver produtos de alta qualidade que atendam às necessidades dos nossos clientes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nossa Equipe</CardTitle>
            <CardDescription>Profissionais experientes e apaixonados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              Com anos de experiência no mercado, nossa equipe está preparada para enfrentar qualquer desafio e entregar
              resultados excepcionais.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
