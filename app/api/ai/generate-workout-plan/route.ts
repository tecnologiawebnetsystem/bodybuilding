import { NextRequest, NextResponse } from "next/server"
import { model } from "@/lib/ai-config"
import { generateObject } from "ai"
import { z } from "zod"

const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.string(),
  rest: z.string(),
  muscleGroup: z.string(),
  instructions: z.string(),
  tips: z.string().optional(),
})

const warmupSchema = z.object({
  exercise: z.string(),
  duration: z.string(),
  instructions: z.string(),
})

const workoutSchema = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  difficulty: z.string(),
  warmup: z.array(warmupSchema),
  exercises: z.array(exerciseSchema),
  cooldown: z.array(warmupSchema),
  tips: z.array(z.string()),
})

const workoutPlanSchema = z.object({
  type: z.string(),
  description: z.string(),
  workouts: z.array(workoutSchema),
})

const splitDescriptions: Record<string, { count: number; description: string }> = {
  AB: { count: 2, description: "Divisao em 2 treinos: Superior (Peito, Costas, Ombros, Bracos) e Inferior (Pernas, Gluteos)" },
  ABC: { count: 3, description: "Divisao em 3 treinos: Push (Peito, Ombros, Triceps), Pull (Costas, Biceps), Legs (Pernas)" },
  ABCD: { count: 4, description: "Divisao em 4 treinos: Peito/Triceps, Costas/Biceps, Ombros/Abdomen, Pernas" },
  ABCDE: { count: 5, description: "Divisao em 5 treinos: Peito, Costas, Ombros, Bracos, Pernas" },
  single: { count: 1, description: "Treino unico de corpo inteiro" },
}

export async function POST(request: NextRequest) {
  try {
    const { goal, level, splitType, duration, equipment, restrictions } = await request.json()

    const split = splitDescriptions[splitType] || splitDescriptions.ABC
    const workoutCount = split.count

    const prompt = `Voce e um personal trainer profissional especializado em musculacao e bodybuilding.

Crie um plano de treino completo do tipo ${splitType} com ${workoutCount} treino(s) diferentes.

Informacoes do usuario:
- Objetivo: ${goal}
- Nivel: ${level}
- Duracao por treino: ${duration} minutos
- Equipamentos disponiveis: ${equipment}
${restrictions ? `- Restricoes: ${restrictions}` : ""}

Estrutura do plano ${splitType}:
${split.description}

Para CADA treino, inclua:
1. Nome descritivo do treino (ex: "Treino A - Push", "Treino B - Pull")
2. Descricao breve do foco muscular
3. Aquecimento especifico (3-5 exercicios)
4. Exercicios principais (5-8 exercicios por treino)
5. Volta a calma (2-3 exercicios de alongamento)
6. Dicas de execucao

Regras importantes:
- Cada exercicio deve ter instrucoes claras de execucao
- Series e repeticoes adequadas ao nivel (${level})
- Tempo de descanso apropriado entre series
- Exercicios variados e eficientes para o objetivo ${goal}

Responda em portugues brasileiro.`

    const result = await generateObject({
      model: model("openai/gpt-4o-mini"),
      schema: workoutPlanSchema,
      prompt,
    })

    return NextResponse.json({ plan: result.object })
  } catch (error) {
    console.error("Erro ao gerar plano de treino:", error)
    return NextResponse.json({ error: "Erro ao gerar plano de treino" }, { status: 500 })
  }
}
