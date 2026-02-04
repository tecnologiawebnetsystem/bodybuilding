import { Metadata } from "next"
import { FAQSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Precos e Planos FitTransform - Sistema para Academia e Personal Trainer",
  description: "Conheca os planos FitTransform: Academia a partir de R$299/mes, Personal Trainer R$99/mes, Aluno R$9,99/mes. 7 dias gratis para testar. Sem fidelidade!",
  keywords: [
    "preco sistema academia",
    "quanto custa app academia",
    "plano personal trainer",
    "software academia preco",
    "sistema gestao academia valor",
    "app fitness preco",
    "plataforma academia custo",
    "FitTransform planos",
  ],
  openGraph: {
    title: "Precos e Planos FitTransform - O Melhor Custo-Beneficio",
    description: "Planos a partir de R$9,99/mes. 7 dias gratis. Sem fidelidade. Cancele quando quiser.",
    url: "https://fittransform.com.br/precos",
    type: "website",
  },
  alternates: {
    canonical: "https://fittransform.com.br/precos",
  },
}

const faqsPrecos = [
  {
    question: "Quanto custa o FitTransform para academias?",
    answer: "O plano Academia custa R$299,99/mes ou R$2999,90/ano (equivalente a 2 meses gratis). Inclui alunos ilimitados, treinos com IA, gestao financeira completa e suporte prioritario."
  },
  {
    question: "Quanto custa o FitTransform para personal trainers?",
    answer: "O plano Personal Trainer custa R$99,00/mes ou R$990,00/ano. Inclui alunos ilimitados, treinos com IA, agenda online e gestao financeira."
  },
  {
    question: "O FitTransform tem plano gratuito?",
    answer: "Alunos vinculados a academias ou personal trainers que usam o FitTransform tem acesso gratuito. Oferecemos tambem 7 dias de teste gratis para todos os planos."
  },
]

export default function PrecosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FAQSchema faqs={faqsPrecos} />
      {children}
    </>
  )
}
