import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contato FitTransform - Fale Conosco | Suporte e Vendas",
  description: "Entre em contato com a FitTransform. WhatsApp (12) 99220-7444. Atendimento para academias e personal trainers em Taubate, Cacapava, Pindamonhangaba e todo o Brasil.",
  keywords: [
    "contato FitTransform",
    "suporte academia",
    "whatsapp FitTransform",
    "telefone FitTransform",
    "falar com vendas academia",
    "suporte personal trainer",
  ],
  openGraph: {
    title: "Contato FitTransform - Fale com Nossa Equipe",
    description: "WhatsApp (12) 99220-7444 | Segunda a Sexta, 9h as 18h. Estamos prontos para ajudar!",
    url: "https://fittransform.com.br/contato",
  },
  alternates: {
    canonical: "https://fittransform.com.br/contato",
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
