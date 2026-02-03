import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
  }

  try {
    // Buscar plano ativo do usuario
    const plans = await sql`
      SELECT * FROM meal_plans 
      WHERE user_id = ${userId} AND is_active = TRUE 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (plans.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: null,
        message: "Nenhum plano alimentar encontrado"
      })
    }

    const plan = plans[0]

    // Buscar refeicoes do plano
    const meals = await sql`
      SELECT * FROM meal_plan_meals 
      WHERE meal_plan_id = ${plan.id} 
      ORDER BY sort_order ASC
    `

    // Buscar alimentos de cada refeicao
    const mealsWithFoods = await Promise.all(
      meals.map(async (meal) => {
        const foods = await sql`
          SELECT * FROM meal_plan_foods 
          WHERE meal_id = ${meal.id} 
          ORDER BY sort_order ASC
        `
        return {
          ...meal,
          foods: foods.map(f => ({
            description: f.food_description,
            isSupplement: f.is_supplement,
            isAvoid: f.is_avoid
          }))
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        id: plan.id,
        name: plan.name,
        goal: plan.goal,
        totalCalories: plan.total_calories,
        proteinGoal: plan.protein_goal,
        fatGoal: plan.fat_goal,
        carbGoal: plan.carb_goal,
        waterGoal: plan.water_goal,
        isAiGenerated: plan.is_ai_generated,
        meals: mealsWithFoods.map(m => ({
          id: m.id,
          time: m.time,
          name: m.name,
          calories: m.calories,
          tip: m.tip,
          foods: m.foods
        }))
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching meal plan:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar plano alimentar" },
      { status: 500 }
    )
  }
}

// Criar ou atualizar plano alimentar (para integracao com IA)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, goal, totalCalories, proteinGoal, fatGoal, carbGoal, waterGoal, meals, isAiGenerated, aiPrompt } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Desativar planos anteriores
    await sql`
      UPDATE meal_plans SET is_active = FALSE 
      WHERE user_id = ${userId}
    `

    // Criar novo plano
    const newPlan = await sql`
      INSERT INTO meal_plans (
        user_id, name, goal, total_calories, protein_goal, fat_goal, carb_goal, water_goal, is_ai_generated, ai_prompt
      ) VALUES (
        ${userId}, 
        ${name || 'Plano Personalizado'}, 
        ${goal || 'emagrecimento'}, 
        ${totalCalories || 0}, 
        ${proteinGoal || 0}, 
        ${fatGoal || 0}, 
        ${carbGoal || 0}, 
        ${waterGoal || 3.0}, 
        ${isAiGenerated || false}, 
        ${aiPrompt || null}
      )
      RETURNING *
    `

    const planId = newPlan[0].id

    // Inserir refeicoes
    if (meals && meals.length > 0) {
      for (let i = 0; i < meals.length; i++) {
        const meal = meals[i]
        
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
            const foodDescription = typeof food === 'string' ? food : food.description
            const isSupplement = typeof food === 'object' ? food.isSupplement : foodDescription.includes('SUPLEMENTO:')
            const isAvoid = typeof food === 'object' ? food.isAvoid : (foodDescription.startsWith('SEM ') || foodDescription.startsWith('EVITAR'))

            await sql`
              INSERT INTO meal_plan_foods (
                meal_id, food_description, is_supplement, is_avoid, sort_order
              ) VALUES (
                ${mealId}, 
                ${foodDescription.replace('SUPLEMENTO: ', '')}, 
                ${isSupplement}, 
                ${isAvoid}, 
                ${j + 1}
              )
            `
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { planId },
      message: "Plano alimentar criado com sucesso"
    })
  } catch (error) {
    console.error("[v0] Error creating meal plan:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar plano alimentar" },
      { status: 500 }
    )
  }
}

// Deletar plano alimentar
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const planId = searchParams.get("planId")

  if (!userId || !planId) {
    return NextResponse.json({ success: false, error: "userId and planId are required" }, { status: 400 })
  }

  try {
    await sql`
      DELETE FROM meal_plans 
      WHERE id = ${planId} AND user_id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: "Plano alimentar removido com sucesso"
    })
  } catch (error) {
    console.error("[v0] Error deleting meal plan:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao remover plano alimentar" },
      { status: 500 }
    )
  }
}
