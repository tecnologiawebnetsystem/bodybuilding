import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateText } from "ai"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Buscar dados do aluno
    const [user] = await sql`
      SELECT 
        name, age, gender, height, current_weight, target_weight, initial_weight
      FROM users 
      WHERE user_id = ${userId}
    `

    if (!user) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 })
    }

    // Gerar treino com IA
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Você é um personal trainer experiente. Crie um plano de treino semanal COMPLETO (7 dias) para:

Nome: ${user.name}
Idade: ${user.age} anos
Gênero: ${user.gender}
Altura: ${user.height}cm
Peso atual: ${user.current_weight}kg
Peso alvo: ${user.target_weight}kg
Peso inicial: ${user.initial_weight}kg

O plano deve incluir:
- Nome e descrição para cada dia da semana (0=Segunda, 1=Terça... 6=Domingo)
- Lista de exercícios com nome, séries, repetições min/max, tempo de descanso e observações técnicas
- Incluir dias de descanso ativo quando necessário
- Variar os grupos musculares adequadamente

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem comentários):
{
  "workoutPlan": [
    {
      "day_of_week": 0,
      "workout_name": "Peito e Tríceps",
      "description": "Foco em hipertrofia do peitoral e tríceps",
      "exercises": [
        {
          "exercise_name": "Supino Reto com Barra",
          "sets": 4,
          "reps_min": 8,
          "reps_max": 12,
          "rest_seconds": 90,
          "exercise_order": 1,
          "notes": "Manter escápulas retraídas, descer controlado até o peito"
        }
      ]
    }
  ]
}`,
    })

    // Parse da resposta da IA
    const aiResponse = JSON.parse(text)

    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error("Erro ao gerar treino com IA:", error)
    return NextResponse.json(
      {
        error: "Erro ao gerar treino com IA",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
