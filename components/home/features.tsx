import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Zap } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Conteúdo de Qualidade",
    description: "Acesso a materiais educacionais de alta qualidade, criados por especialistas.",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description: "Conecte-se com outros estudantes e profissionais da sua área.",
  },
  {
    icon: Award,
    title: "Certificados",
    description: "Receba certificados reconhecidos ao concluir seus cursos.",
  },
  {
    icon: Zap,
    title: "Aprendizado Rápido",
    description: "Metodologia otimizada para maximizar seu aprendizado.",
  },
]

export function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Por que escolher o Academia?</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Oferecemos tudo que você precisa para acelerar seu desenvolvimento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <feature.icon className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
