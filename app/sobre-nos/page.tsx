import Link from "next/link"
import { Building2, Users, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

export default function SobreNosPage() {
  const clients = [
    "Petrobras",
    "Claro",
    "BS2",
    "Caixa Econômica",
    "Globo.com",
    "Zurich",
    "HDI",
    "Generali",
    "Excelsior",
    "Ergondata",
    "Alelo",
    "Banco do Brasil Assets",
    "Liberty Seguros",
    "Mercado Livre",
    "JSL",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Content */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sobre a{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
                Web NetSystem
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desde 2005 desenvolvendo soluções tecnológicas inovadoras para grandes empresas
            </p>
          </div>

          {/* História */}
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="text-orange-500" size={32} />
                <CardTitle className="text-white text-2xl">Nossa História</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg leading-relaxed">
                A <strong className="text-white">Web NetSystem</strong> foi fundada em{" "}
                <strong className="text-white">2005</strong> com o objetivo de levar transformação digital para empresas
                de todos os portes. Com mais de <strong className="text-white">20 anos de experiência</strong>, nos
                consolidamos como referência em desenvolvimento de sistemas empresariais, aplicativos mobile e soluções
                SaaS personalizadas.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mt-4">
                Nossa expertise abrange diversos segmentos: energia, telecomunicações, financeiro, seguros, logística e
                agora, com o <strong className="text-orange-400">FitTransform</strong>, revolucionamos também o mercado
                fitness.
              </p>
            </CardContent>
          </Card>

          {/* Números */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader>
                <Award className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-4xl">20+</CardTitle>
                <CardDescription className="text-gray-300">Anos de Experiência</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader>
                <Users className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-4xl">15+</CardTitle>
                <CardDescription className="text-gray-300">Grandes Clientes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader>
                <TrendingUp className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-4xl">100%</CardTitle>
                <CardDescription className="text-gray-300">Satisfação dos Clientes</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Clientes */}
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Clientes que Confiam em Nós</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Empresas de grande porte que escolheram a Web NetSystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {clients.map((client) => (
                  <div
                    key={client}
                    className="bg-white/10 border border-white/20 rounded-lg p-4 text-center hover:bg-white/15 transition"
                  >
                    <p className="text-white font-semibold">{client}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Conheça o FitTransform</h2>
              <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
                Nossa mais recente inovação: uma plataforma completa de gestão para academias e personal trainers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold">
                    Experimentar Grátis
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 bg-transparent"
                  >
                    Falar com a Equipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}
