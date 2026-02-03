import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { generateText } from "ai"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, goal, restrictions, preferences } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Buscar dados do usuario para personalizar
    const users = await sql`
      SELECT name, height, target_weight, current_weight, gender, age 
      FROM users WHERE user_id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario nao encontrado" }, { status: 404 })
    }

    const user = users[0]
    
    // Calcular TMB (Taxa Metabolica Basal) usando Harris-Benedict
    let tmb = 0
    if (user.gender === 'M' || user.gender === 'masculino') {
      tmb = 88.362 + (13.397 * (user.current_weight || 70)) + (4.799 * (user.height || 170)) - (5.677 * (user.age || 30))
    } else {
      tmb = 447.593 + (9.247 * (user.current_weight || 60)) + (3.098 * (user.height || 160)) - (4.330 * (user.age || 30))
    }

    // Ajustar calorias baseado no objetivo
    let targetCalories = Math.round(tmb * 1.55) // Moderadamente ativo
    if (goal === 'emagrecimento') {
      targetCalories = Math.round(targetCalories * 0.80) // Deficit de 20%
    } else if (goal === 'hipertrofia') {
      targetCalories = Math.round(targetCalories * 1.15) // Superavit de 15%
    }

    // Calcular macros
    const proteinGoal = Math.round(user.current_weight * 2) // 2g por kg
    const fatGoal = Math.round(targetCalories * 0.25 / 9) // 25% das calorias
    const carbGoal = Math.round((targetCalories - (proteinGoal * 4) - (fatGoal * 9)) / 4)

    const prompt = `Voce e um nutricionista especializado em ${goal === 'emagrecimento' ? 'emagrecimento saudavel' : goal === 'hipertrofia' ? 'hipertrofia muscular' : 'manutencao de peso'}.

Crie um plano alimentar detalhado para:
- Nome: ${user.name}
- Peso atual: ${user.current_weight || 'nao informado'}kg
- Peso meta: ${user.target_weight || 'nao informado'}kg
- Altura: ${user.height || 'nao informado'}cm
- Idade: ${user.age || 'nao informado'} anos
- Genero: ${user.gender === 'M' ? 'Masculino' : 'Feminino'}
- Calorias alvo: ${targetCalories} kcal/dia
- Proteina alvo: ${proteinGoal}g
- Gordura alvo: ${fatGoal}g
- Carboidrato alvo: ${carbGoal}g

${restrictions ? `Restricoes alimentares: ${restrictions}` : ''}
${preferences ? `Preferencias: ${preferences}` : ''}

Responda APENAS com um JSON valido no seguinte formato (sem markdown, sem explicacoes):
{
  "meals": [
    {
      "time": "07:00",
      "name": "Cafe da Manha",
      "calories": 400,
      "tip": "Dica nutricional aqui",
      "foods": [
        {"description": "Descricao do alimento 1", "isSupplement": false, "isAvoid": false},
        {"description": "Nome do suplemento", "isSupplement": true, "isAvoid": false}
      ]
    }
  ]
}

Crie 6-7 refeicoes equilibradas ao longo do dia. Inclua dicas nutricionais em cada refeicao.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 3000,
    })

    // Parsear resposta da IA
    let mealPlan
    try {
      // Limpar resposta de markdown se houver
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      mealPlan = JSON.parse(cleanedText)
    } catch {
      console.error("[v0] Error parsing AI response:", text)
      return NextResponse.json({ 
        success: false, 
        error: "Erro ao processar resposta da IA" 
      }, { status: 500 })
    }

    // Desativar planos anteriores
    await sql`
      UPDATE meal_plans SET is_active = FALSE 
      WHERE user_id = ${userId}
    `

    // Criar novo plano no banco
    const newPlan = await sql`
      INSERT INTO meal_plans (
        user_id, name, goal, total_calories, protein_goal, fat_goal, carb_goal, water_goal, is_ai_generated, ai_prompt
      ) VALUES (
        ${userId}, 
        ${`Plano ${goal === 'emagrecimento' ? 'Emagrecimento' : goal === 'hipertrofia' ? 'Hipertrofia' : 'Manutencao'} - IA`}, 
        ${goal || 'emagrecimento'}, 
        ${targetCalories}, 
        ${proteinGoal}, 
        ${fatGoal}, 
        ${carbGoal}, 
        3.0, 
        TRUE, 
        ${prompt}
      )
      RETURNING *
    `

    const planId = newPlan[0].id

    // Inserir refeicoes
    if (mealPlan.meals && mealPlan.meals.length > 0) {
      for (let i = 0; i < mealPlan.meals.length; i++) {
        const meal = mealPlan.meals[i]
        
        const newMeal = await sql`
          INSERT INTO meal_plan_meals (
            meal_plan_id, time, name, calories, tip, sort_order
          ) VALUES (
            ${planId}, 
            ${meal.time}, 
            ${meal.name}, 
            ${meal.calories || 0}, 
            ${meal.tip || null}, 
            ${i + 1}
          )
          RETURNING *
        `

        const mealId = newMeal[0].id

        // Inserir alimentos
        if (meal.foods && meal.foods.length > 0) {
          for (let j = 0; j < meal.foods.length; j++) {
            const food = meal.foods[j]

            await sql`
              INSERT INTO meal_plan_foods (
                meal_id, food_description, is_supplement, is_avoid, sort_order
              ) VALUES (
                ${mealId}, 
                ${food.description}, 
                ${food.isSupplement || false}, 
                ${food.isAvoid || false}, 
                ${j + 1}
              )
            `
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { 
        planId,
        targetCalories,
        proteinGoal,
        fatGoal,
        carbGoal
      },
      message: "Plano alimentar gerado com sucesso pela IA"
    })
  } catch (error) {
    console.error("[v0] Error generating AI meal plan:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao gerar plano alimentar" },
      { status: 500 }
    )
  }
}
