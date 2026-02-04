import Link from "next/link"
import { Building2, Users, Award, TrendingUp, MapPin, Heart, Target, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

export default function SobreNosPage() {
  const clients = [
    "Petrobras",
    "Claro",
    "BS2",
    "Caixa Economica",
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

  const cidades = [
    "Taubate",
    "Sao Jose dos Campos",
    "Cacapava",
    "Pindamonhangaba",
    "Guaratingueta",
    "Jacarei",
    "Caraguatatuba",
    "Ubatuba",
    "Campos do Jordao",
    "Lorena",
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
                FitTransform
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A plataforma de gestao de academias mais completa do Vale do Paraiba e do Brasil
            </p>
          </div>

          {/* Historia */}
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="text-orange-500" size={32} />
                <CardTitle className="text-white text-2xl">Nossa Historia</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg leading-relaxed">
                A <strong className="text-white">FitTransform</strong> nasceu da experiencia da{" "}
                <strong className="text-white">Web NetSystem</strong>, empresa fundada em{" "}
                <strong className="text-white">2005</strong> com o objetivo de levar transformacao digital para empresas
                de todos os portes. Com mais de <strong className="text-white">20 anos de experiencia</strong> em
                desenvolvimento de sistemas, decidimos revolucionar o mercado fitness.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mt-4">
                Localizada no <strong className="text-orange-400">Vale do Paraiba</strong>, nossa equipe conhece de perto
                as necessidades das academias e personal trainers da regiao. Desenvolvemos o FitTransform para ser a
                solucao completa que faltava no mercado: <strong className="text-white">gestao de alunos, treinos com IA,
                controle financeiro e muito mais</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Missao, Visao, Valores */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <Target className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-xl">Missao</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Transformar a gestao de academias e personal trainers atraves da tecnologia,
                  proporcionando mais tempo para o que importa: os alunos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <Rocket className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-xl">Visao</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Ser a plataforma de gestao fitness mais utilizada do Brasil,
                  presente em todas as academias que buscam excelencia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <Heart className="text-orange-400 mb-2" size={40} />
                <CardTitle className="text-white text-xl">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Inovacao, compromisso com resultados, proximidade com o cliente
                  e paixao pelo universo fitness.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Numeros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader className="text-center">
                <Award className="text-orange-400 mb-2 mx-auto" size={40} />
                <CardTitle className="text-white text-4xl">500+</CardTitle>
                <CardDescription className="text-gray-300">Academias Ativas</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader className="text-center">
                <Users className="text-orange-400 mb-2 mx-auto" size={40} />
                <CardTitle className="text-white text-4xl">50k+</CardTitle>
                <CardDescription className="text-gray-300">Alunos Cadastrados</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader className="text-center">
                <TrendingUp className="text-orange-400 mb-2 mx-auto" size={40} />
                <CardTitle className="text-white text-4xl">98%</CardTitle>
                <CardDescription className="text-gray-300">Satisfacao dos Clientes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
              <CardHeader className="text-center">
                <MapPin className="text-orange-400 mb-2 mx-auto" size={40} />
                <CardTitle className="text-white text-4xl">10+</CardTitle>
                <CardDescription className="text-gray-300">Cidades no Vale</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Presenca Regional */}
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-orange-500" size={32} />
                <CardTitle className="text-white text-2xl">Presenca no Vale do Paraiba</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Atendemos academias em toda a regiao do Vale do Paraiba e Litoral Norte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {cidades.map((cidade) => (
                  <div
                    key={cidade}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center hover:bg-orange-500/20 transition"
                  >
                    <p className="text-white font-medium text-sm">{cidade}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">
                E expandindo para todo o Brasil!
              </p>
            </CardContent>
          </Card>

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
