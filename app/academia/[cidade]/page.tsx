import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { Dumbbell, Users, Zap, TrendingUp, CheckCircle, ArrowRight, MapPin, Phone, Star } from "lucide-react"

// Dados das cidades
const cidadesData: Record<string, { nome: string; estado: string; descricao: string; populacao: string }> = {
  "taubate": {
    nome: "Taubate",
    estado: "SP",
    descricao: "a maior cidade do Vale do Paraiba Paulista",
    populacao: "320 mil habitantes",
  },
  "cacapava": {
    nome: "Cacapava",
    estado: "SP", 
    descricao: "uma das cidades mais tradicionais do Vale",
    populacao: "100 mil habitantes",
  },
  "pindamonhangaba": {
    nome: "Pindamonhangaba",
    estado: "SP",
    descricao: "conhecida como Pinda, cidade em crescimento acelerado",
    populacao: "170 mil habitantes",
  },
  "sao-jose-dos-campos": {
    nome: "Sao Jose dos Campos",
    estado: "SP",
    descricao: "o principal polo tecnologico do Vale do Paraiba",
    populacao: "740 mil habitantes",
  },
  "jacarei": {
    nome: "Jacarei",
    estado: "SP",
    descricao: "cidade historica com forte desenvolvimento industrial",
    populacao: "240 mil habitantes",
  },
  "guaratingueta": {
    nome: "Guaratingueta",
    estado: "SP",
    descricao: "terra de Frei Galvao e importante polo educacional",
    populacao: "125 mil habitantes",
  },
  "lorena": {
    nome: "Lorena",
    estado: "SP",
    descricao: "cidade historica com rica cultura",
    populacao: "90 mil habitantes",
  },
  "caraguatatuba": {
    nome: "Caraguatatuba",
    estado: "SP",
    descricao: "principal cidade do Litoral Norte paulista",
    populacao: "120 mil habitantes",
  },
  "ubatuba": {
    nome: "Ubatuba",
    estado: "SP",
    descricao: "capital do surfe com mais de 100 praias",
    populacao: "90 mil habitantes",
  },
  "campos-do-jordao": {
    nome: "Campos do Jordao",
    estado: "SP",
    descricao: "a Suica brasileira, destino turistico de inverno",
    populacao: "55 mil habitantes",
  },
}

// Gerar parametros estaticos
export async function generateStaticParams() {
  return Object.keys(cidadesData).map((cidade) => ({
    cidade,
  }))
}

// Gerar metadata dinamica
export async function generateMetadata({ params }: { params: Promise<{ cidade: string }> }): Promise<Metadata> {
  const { cidade } = await params
  const cidadeData = cidadesData[cidade]
  
  if (!cidadeData) {
    return {
      title: "Cidade nao encontrada",
    }
  }

  return {
    title: `App de Academia em ${cidadeData.nome} | Sistema para Academias e Personal Trainers`,
    description: `FitTransform: o melhor app de academia e sistema de gestao para academias e personal trainers em ${cidadeData.nome}, ${cidadeData.estado}. Treinos com IA, gestao de alunos, controle financeiro. Teste gratis!`,
    keywords: [
      `academia ${cidadeData.nome}`,
      `app academia ${cidadeData.nome}`,
      `personal trainer ${cidadeData.nome}`,
      `sistema academia ${cidadeData.nome}`,
      `treino ${cidadeData.nome}`,
      `musculacao ${cidadeData.nome}`,
      `fitness ${cidadeData.nome}`,
      "app de academia",
      "sistema para academia",
      "gestao de academia",
    ],
    openGraph: {
      title: `FitTransform em ${cidadeData.nome} - App de Academia e Gestao Fitness`,
      description: `Transforme sua academia em ${cidadeData.nome} com o FitTransform. Treinos com IA, gestao completa e muito mais!`,
      url: `https://fittransform.com.br/academia/${cidade}`,
    },
  }
}

export default async function CidadePage({ params }: { params: Promise<{ cidade: string }> }) {
  const { cidade } = await params
  const cidadeData = cidadesData[cidade]

  if (!cidadeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Cidade nao encontrada</h1>
          <Link href="/" className="text-orange-500 hover:underline">Voltar para home</Link>
        </div>
      </div>
    )
  }

  const beneficios = [
    { icon: Users, title: "Gestao de Alunos", desc: "Controle completo de matriculas, presencas e evolucao" },
    { icon: Dumbbell, title: "Treinos com IA", desc: "Geracao automatica de treinos personalizados" },
    { icon: TrendingUp, title: "Financeiro", desc: "Cobrancas automaticas, relatorios e DRE" },
    { icon: Zap, title: "Check-in Rapido", desc: "QR Code e biometria para controle de acesso" },
  ]

  const depoimentos = [
    {
      nome: "Academia PowerFit",
      cidade: cidadeData.nome,
      texto: "O FitTransform revolucionou nossa gestao. Retencao de alunos aumentou 40%!",
      rating: 5,
    },
    {
      nome: "Studio Personal",
      cidade: cidadeData.nome,
      texto: "A geracao de treinos com IA economiza horas do meu dia. Recomendo!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Schema.org JSON-LD */}
      <LocalBusinessSchema cidade={cidadeData.nome} estado={cidadeData.estado} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fittransform.com.br" },
        { name: "Academias", url: "https://fittransform.com.br/academia" },
        { name: cidadeData.nome, url: `https://fittransform.com.br/academia/${cidade}` },
      ]} />

      <SharedHeader />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-orange-500 mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">{cidadeData.nome}, {cidadeData.estado}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            App de Academia em{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              {cidadeData.nome}
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            O FitTransform e o melhor sistema de gestao para academias e personal trainers em {cidadeData.nome}, 
            {cidadeData.descricao} com {cidadeData.populacao}. Transforme seu negocio fitness com tecnologia de ponta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-lg px-8">
              <Link href="/get-started" className="flex items-center gap-2">
                Comecar Gratis em {cidadeData.nome}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8">
              <Link href="/contato" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Falar com Consultor
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-gray-400 text-sm">Academias em {cidadeData.nome}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">5k+</p>
              <p className="text-gray-400 text-sm">Alunos ativos</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-gray-400 text-sm">Satisfacao</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">24h</p>
              <p className="text-gray-400 text-sm">Suporte local</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Por que academias de {cidadeData.nome} escolhem o FitTransform?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                    <beneficio.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{beneficio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{beneficio.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            O que dizem as academias de {cidadeData.nome}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {depoimentos.map((dep, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(dep.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{dep.texto}"</p>
                  <div>
                    <p className="text-white font-semibold">{dep.nome}</p>
                    <p className="text-gray-500 text-sm">{dep.cidade}, SP</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto para transformar sua academia em {cidadeData.nome}?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Junte-se as mais de 50 academias de {cidadeData.nome} que ja usam o FitTransform
          </p>
          <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-lg px-10">
            <Link href="/get-started" className="flex items-center gap-2">
              Comecar Gratis Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Cidades Proximas */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Tambem atendemos outras cidades do Vale do Paraiba
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(cidadesData)
              .filter(([key]) => key !== cidade)
              .slice(0, 6)
              .map(([key, data]) => (
                <Link
                  key={key}
                  href={`/academia/${key}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition text-sm"
                >
                  {data.nome}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
