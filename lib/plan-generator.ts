// Motor inteligente que gera planos personalizados baseado nas respostas do usuário

export interface GeneratedPlan {
  userId: string

  // Previsão de Resultados
  predictions: {
    weightLoss: { min: number; max: number } // kg
    muscleGain: { min: number; max: number } // kg
    timelineMonths: number
    weeklyProgress: number // kg por semana
    finalWeight: number
    finalBMI: number
    caloriesPerDay: number
  }

  // Plano de Treino
  trainingPlan: {
    gymWorkouts: any[]
    homeWorkouts: any[]
    runningPlan: any[]
    weeklySchedule: any
  }

  // Plano Nutricional
  nutritionPlan: {
    dailyCalories: number
    macros: { protein: number; carbs: number; fats: number }
    meals: any[]
    hydration: number
  }

  // Suplementação
  supplementPlan: {
    recommended: any[]
    timing: any
    monthlyCost: number
  }
}

export function generatePersonalizedPlan(data: any): GeneratedPlan {
  // ALGORITMO DE CÁLCULO BASEADO EM CIÊNCIA

  const { currentWeight, targetWeight, height, age, gender, primaryGoal, targetDate } = data

  // 1. Calcular TMB (Taxa Metabólica Basal)
  let tmb = 0
  if (gender === "male") {
    tmb = 88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age
  } else {
    tmb = 447.593 + 9.247 * currentWeight + 3.098 * height - 4.33 * age
  }

  // 2. Fator de atividade
  const activityMultiplier =
    {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
    }[data.activityLevel] || 1.55

  // 3. TDEE (Total Daily Energy Expenditure)
  const tdee = tmb * activityMultiplier

  // 4. Déficit/Superávit calórico baseado no objetivo
  let dailyCalories = tdee
  let weeklyWeightChange = 0

  if (primaryGoal === "lose_weight") {
    // Déficit de 500-750 kcal/dia = 0.5-0.75kg/semana
    const intensity = { light: 400, moderate: 600, intense: 800 }[data.goalIntensity] || 600
    dailyCalories = tdee - intensity
    weeklyWeightChange = -((intensity * 7) / 7700) // 7700 kcal = 1kg de gordura
  } else if (primaryGoal === "gain_muscle") {
    // Superávit de 300-500 kcal/dia = 0.25-0.5kg/semana
    const intensity = { light: 250, moderate: 400, intense: 500 }[data.goalIntensity] || 400
    dailyCalories = tdee + intensity
    weeklyWeightChange = (intensity * 7) / 7700
  }

  // 5. Previsão de resultados
  const months = Number.parseInt(data.targetDate) || 3
  const weeks = months * 4.33
  const totalWeightChange = weeklyWeightChange * weeks
  const finalWeight = currentWeight + totalWeightChange
  const finalBMI = finalWeight / (height / 100) ** 2

  // 6. Distribuição de Macros
  let proteinPercent = 30
  let carbsPercent = 40
  let fatsPercent = 30

  if (primaryGoal === "lose_weight") {
    proteinPercent = 35
    carbsPercent = 35
    fatsPercent = 30
  } else if (primaryGoal === "gain_muscle") {
    proteinPercent = 30
    carbsPercent = 45
    fatsPercent = 25
  }

  const proteinGrams = Math.round((dailyCalories * proteinPercent) / 100 / 4)
  const carbsGrams = Math.round((dailyCalories * carbsPercent) / 100 / 4)
  const fatsGrams = Math.round((dailyCalories * fatsPercent) / 100 / 9)

  // 7. Gerar treinos baseado em equipamentos e frequência
  const trainingPlan = generateTrainingPlan(data)

  // 8. Gerar plano nutricional
  const nutritionPlan = generateNutritionPlan(data, dailyCalories, proteinGrams, carbsGrams, fatsGrams)

  // 9. Gerar suplementação
  const supplementPlan = generateSupplementPlan(data, primaryGoal)

  return {
    userId: "",
    predictions: {
      weightLoss:
        primaryGoal === "lose_weight"
          ? { min: Math.abs(totalWeightChange) * 0.8, max: Math.abs(totalWeightChange) * 1.2 }
          : { min: 0, max: 0 },
      muscleGain:
        primaryGoal === "gain_muscle"
          ? { min: totalWeightChange * 0.6, max: totalWeightChange * 0.8 }
          : // 60-80% do ganho é músculo
            { min: 0, max: 0 },
      timelineMonths: months,
      weeklyProgress: weeklyWeightChange,
      finalWeight: Math.round(finalWeight * 10) / 10,
      finalBMI: Math.round(finalBMI * 10) / 10,
      caloriesPerDay: Math.round(dailyCalories),
    },
    trainingPlan,
    nutritionPlan: {
      dailyCalories: Math.round(dailyCalories),
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams,
      },
      meals: nutritionPlan,
      hydration: data.currentWeight * 35, // 35ml por kg de peso corporal
    },
    supplementPlan,
  }
}

function generateTrainingPlan(data: any) {
  // Gerar treinos personalizados baseado em equipamentos, frequência, etc
  return {
    gymWorkouts: [],
    homeWorkouts: [],
    runningPlan: [],
    weeklySchedule: {},
  }
}

function generateNutritionPlan(data: any, calories: number, protein: number, carbs: number, fats: number) {
  // Gerar plano de refeições
  return []
}

function generateSupplementPlan(data: any, goal: string) {
  // Gerar recomendações de suplementos
  const supplements: any[] = []

  if (data.includeSupplements) {
    // Básico para todos
    supplements.push({
      name: "Multivitamínico",
      dosage: "1 cápsula/dia",
      timing: "Café da manhã",
      cost: 40,
    })

    if (goal === "gain_muscle" || goal === "lose_weight") {
      supplements.push({
        name: "Whey Protein",
        dosage: "30g",
        timing: "Pós-treino",
        cost: 80,
      })

      supplements.push({
        name: "Creatina",
        dosage: "5g/dia",
        timing: "Pós-treino",
        cost: 50,
      })
    }

    if (data.supplementBudget === "high") {
      supplements.push({
        name: "Pré-treino",
        dosage: "1 dose",
        timing: "30min antes do treino",
        cost: 70,
      })

      supplements.push({
        name: "Ômega 3",
        dosage: "2g/dia",
        timing: "Almoço",
        cost: 45,
      })
    }
  }

  const monthlyCost = supplements.reduce((sum, s) => sum + s.cost, 0)

  return {
    recommended: supplements,
    timing: {},
    monthlyCost,
  }
}
