import { NextRequest, NextResponse } from "next/server"
import { model } from "@/lib/ai-config"
import { generateObject } from "ai"
import { z } from "zod"

const supplementSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  timing: z.string(),
  benefits: z.array(z.string()),
  warnings: z.string().optional(),
  brand_suggestion: z.string().optional(),
})

const supplementPlanSchema = z.object({
  goal: z.string(),
  supplements: z.array(supplementSchema),
  daily_schedule: z.object({
    morning: z.array(z.string()),
    pre_workout: z.array(z.string()),
    post_workout: z.array(z.string()),
    evening: z.array(z.string()),
  }),
  total_investment: z.string(),
  tips: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const { goal, budget, experience, weight, trainingFrequency, restrictions } = await request.json()

    const budgetMap: Record<string, string> = {
      economico: "ate R$150 por mes",
      moderado: "entre R$150 e R$300 por mes",
      completo: "acima de R$300 por mes",
    }

    const prompt = `Voce e um nutricionista esportivo especializado em suplementacao.
    
Crie um protocolo de suplementos personalizado com base nas seguintes informacoes:
- Objetivo: ${goal}
- Orcamento: ${budgetMap[budget] || budget}
- Experiencia com suplementos: ${experience}
- Peso: ${weight}kg
- Frequencia de treino: ${trainingFrequency} dias por semana
${restrictions ? `- Restricoes/Alergias: ${restrictions}` : ""}

Regras:
1. Recomende apenas suplementos seguros e com eficacia comprovada cientificamente
2. Adapte as dosagens ao peso do usuario
3. Respeite o orcamento informado
4. Para iniciantes, comece com suplementos basicos (whey, creatina)
5. Inclua avisos importantes sobre cada suplemento
6. O cronograma deve ser pratico e facil de seguir
7. Inclua dicas de como maximizar os resultados

Responda em portugues brasileiro.`

    const result = await generateObject({
      model: model("openai/gpt-4o-mini"),
      schema: supplementPlanSchema,
      prompt,
    })

    return NextResponse.json({ plan: result.object })
  } catch (error) {
    console.error("Erro ao gerar suplementos:", error)
    return NextResponse.json({ error: "Erro ao gerar protocolo de suplementos" }, { status: 500 })
  }
}
