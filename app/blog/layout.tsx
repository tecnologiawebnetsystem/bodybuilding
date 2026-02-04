import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog FitTransform - Dicas de Treino, Nutricao e Gestao de Academia",
  description: "Blog completo sobre fitness, musculacao, treinos de costas, ombros, peito, pernas, nutricao e gestao de academias. Dicas para personal trainers e donos de academia no Vale do Paraiba.",
  keywords: [
    "blog fitness",
    "dicas de treino",
    "treino de costas",
    "treino de ombros",
    "treino de peito",
    "treino de pernas",
    "treino de biceps",
    "treino de triceps",
    "treino de abdomen",
    "nutricao academia",
    "suplementacao",
    "personal trainer",
    "gestao de academia",
    "app de academia",
    "academia Taubate",
    "academia Vale do Paraiba",
  ],
  openGraph: {
    title: "Blog FitTransform - Tudo sobre Fitness e Gestao de Academia",
    description: "Dicas de treino, nutricao, suplementacao e gestao para academias e personal trainers.",
    url: "https://fittransform.com.br/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://fittransform.com.br/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
