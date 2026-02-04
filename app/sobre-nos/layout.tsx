import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nos - FitTransform | App de Academia do Vale do Paraiba",
  description: "Conheca a FitTransform, a plataforma de gestao de academias criada no Vale do Paraiba. Atendemos Taubate, Cacapava, Pindamonhangaba, Sao Jose dos Campos e todo o Brasil.",
  keywords: [
    "FitTransform",
    "sobre FitTransform",
    "empresa app academia",
    "Web NetSystem",
    "app academia Vale do Paraiba",
    "sistema academia Taubate",
    "software academia Sao Jose dos Campos",
  ],
  openGraph: {
    title: "Sobre a FitTransform - Nossa Historia e Missao",
    description: "Conheca a empresa por tras do melhor app de academia do Brasil. Presente no Vale do Paraiba e em todo o pais.",
    url: "https://fittransform.com.br/sobre-nos",
  },
  alternates: {
    canonical: "https://fittransform.com.br/sobre-nos",
  },
}

export default function SobreNosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
