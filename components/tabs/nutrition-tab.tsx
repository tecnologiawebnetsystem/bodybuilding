"use client"

import { Card } from "@/components/ui/card"
import { Apple, Droplets, Pill, Flame, UtensilsCrossed, Clock } from "lucide-react"
import { getSupplementsByUser } from "@/lib/supplements-data"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface NutritionTabProps {
  userId: string
  preferences: UserPreferences
}

const mealPlans = {
  kleber: [
    {
      time: "07:00",
      name: "Café da Manhã",
      foods: [
        "4 claras de ovo + 1 ovo inteiro (mexido ou omelete)",
        "2 fatias de pão integral",
        "1 banana média",
        "Café preto sem açúcar",
      ],
      calories: 380,
    },
    {
      time: "10:00",
      name: "Lanche da Manhã",
      foods: ["1 scoop de Whey Protein", "1 porção de oleaginosas (castanhas, amêndoas)"],
      calories: 200,
    },
    {
      time: "12:30",
      name: "Almoço",
      foods: [
        "150g de frango grelhado ou carne magra",
        "1 xícara de arroz integral",
        "Salada verde à vontade (alface, rúcula, tomate)",
        "1 colher de azeite",
      ],
      calories: 550,
    },
    {
      time: "15:00",
      name: "Lanche da Tarde (Pré-Treino)",
      foods: ["1 batata doce média", "1 scoop de Whey Protein"],
      calories: 280,
    },
    {
      time: "18:30",
      name: "Pós-Treino",
      foods: ["1 scoop de Whey Protein", "1 banana", "5g de Creatina"],
      calories: 200,
    },
    {
      time: "20:00",
      name: "Jantar",
      foods: [
        "150g de peixe grelhado (tilápia, salmão)",
        "Legumes cozidos (brócolis, cenoura, vagem)",
        "Salada verde à vontade",
      ],
      calories: 300,
    },
    {
      time: "22:00",
      name: "Ceia",
      foods: ["200ml de iogurte grego natural", "1 colher de pasta de amendoim"],
      calories: 190,
    },
  ],
  pamela: [
    {
      time: "07:00",
      name: "Café da Manhã",
      foods: [
        "3 claras de ovo + 1 ovo inteiro (mexido ou omelete)",
        "2 fatias de pão integral",
        "1 fatia de queijo branco",
        "Café com leite desnatado",
      ],
      calories: 340,
    },
    {
      time: "10:00",
      name: "Lanche da Manhã",
      foods: ["1 scoop de Whey Protein", "1 maçã ou pera"],
      calories: 180,
    },
    {
      time: "12:30",
      name: "Almoço",
      foods: [
        "120g de frango grelhado",
        "3/4 xícara de arroz integral ou batata doce",
        "Salada verde à vontade",
        "1 colher de azeite",
      ],
      calories: 480,
    },
    {
      time: "15:00",
      name: "Lanche da Tarde (Pré-Treino)",
      foods: ["1 batata doce pequena", "1 scoop de Whey Protein"],
      calories: 250,
    },
    {
      time: "18:30",
      name: "Pós-Treino",
      foods: ["1 scoop de Whey Protein", "1 banana", "5g de Creatina"],
      calories: 200,
    },
    {
      time: "20:00",
      name: "Jantar",
      foods: [
        "120g de peixe ou frango grelhado",
        "Legumes cozidos (brócolis, abobrinha, cenoura)",
        "Salada verde à vontade",
      ],
      calories: 280,
    },
    {
      time: "22:00",
      name: "Ceia",
      foods: ["150ml de iogurte grego natural", "1 colher de chia ou linhaça"],
      calories: 150,
    },
  ],
  juliana: [
    {
      time: "07:00",
      name: "Café da Manhã",
      foods: [
        "2 claras de ovo + 1 ovo inteiro (mexido)",
        "1 fatia de pão integral",
        "1 fruta (maçã ou pera)",
        "Chá verde sem açúcar",
      ],
      calories: 280,
    },
    {
      time: "10:00",
      name: "Lanche da Manhã",
      foods: ["1 iogurte natural light", "1 porção de frutas vermelhas"],
      calories: 120,
    },
    {
      time: "12:30",
      name: "Almoço",
      foods: [
        "100g de frango grelhado ou peixe",
        "1/2 xícara de arroz integral",
        "Salada verde à vontade (alface, rúcula, tomate)",
        "Legumes cozidos",
      ],
      calories: 380,
    },
    {
      time: "15:30",
      name: "Lanche da Tarde",
      foods: ["1 fruta", "10 castanhas"],
      calories: 150,
    },
    {
      time: "19:00",
      name: "Jantar",
      foods: ["120g de peixe ou frango grelhado", "Legumes refogados", "Salada verde à vontade"],
      calories: 320,
    },
    {
      time: "21:00",
      name: "Ceia (opcional)",
      foods: ["1 xícara de chá de camomila", "3 castanhas"],
      calories: 80,
    },
  ],
}

export function NutritionTab({ userId, preferences }: NutritionTabProps) {
  const supplements = getSupplementsByUser(userId)
  const meals = mealPlans[userId as keyof typeof mealPlans] || []
  const totalCalories = meals.length > 0 ? meals.reduce((sum, meal) => sum + meal.calories, 0) : 0

  const showSupplements = userId !== "juliana"

  if (meals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Nutrição & Alimentação</h2>
          <p className="text-muted-foreground">Plano personalizado</p>
        </div>
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Nenhum plano alimentar configurado para este usuário.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Nutrição & Alimentação</h2>
        <p className="text-muted-foreground">Plano personalizado</p>
      </div>

      {/* Daily Targets */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <h3 className="text-xl font-bold mb-4">Metas Diárias</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold">{totalCalories}</p>
            <p className="text-sm text-muted-foreground">Calorias</p>
          </div>
          <div className="text-center">
            <Apple className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold">
              {userId === "pamela" ? "130g" : userId === "juliana" ? "100g" : "160g"}
            </p>
            <p className="text-sm text-muted-foreground">Proteína</p>
          </div>
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold">3L</p>
            <p className="text-sm text-muted-foreground">Água</p>
          </div>
          <div className="text-center">
            <Pill className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold">{userId === "pamela" ? "45g" : userId === "juliana" ? "35g" : "50g"}</p>
            <p className="text-sm text-muted-foreground">Gorduras</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Plano Alimentar Diário
        </h3>
        <div className="space-y-4">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border-2 hover:border-primary/40 transition-colors"
              style={{ borderColor: `${preferences.theme_primary}20` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${preferences.theme_primary}, ${preferences.theme_accent})`,
                  }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{meal.name}</h4>
                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: preferences.theme_primary }}>
                    {meal.calories} kcal
                  </p>
                </div>
              </div>
              <ul className="space-y-2 ml-2">
                {meal.foods.map((food, foodIdx) => (
                  <li key={foodIdx} className="text-sm flex items-start gap-2">
                    <span style={{ color: preferences.theme_primary }} className="mt-1">
                      •
                    </span>
                    <span className="flex-1">{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${preferences.theme_primary}10` }}>
          <p className="font-bold text-center text-lg">Total Diário: {totalCalories} calorias</p>
        </div>
      </Card>

      {/* Supplements */}
      {showSupplements && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Suplementação Recomendada</h3>
          <div className="space-y-4">
            {supplements.map((supp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: `${preferences.theme_primary}20` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: preferences.theme_primary }}
                  >
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{supp.name}</h4>
                    <p className="text-sm font-medium mb-2" style={{ color: preferences.theme_primary }}>
                      <strong>Dosagem:</strong> {supp.dosage}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Quando tomar:</strong> {supp.timing}
                    </p>
                    <p className="text-sm italic">{supp.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Important Notes */}
      <Card
        className="p-6"
        style={{ backgroundColor: `${preferences.theme_accent}10`, borderColor: `${preferences.theme_accent}20` }}
      >
        <h3 className="text-lg font-bold mb-3">⚠️ Notas Importantes</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Beba pelo menos 3 litros de água por dia</li>
          <li>• Evite carboidratos simples (açúcar, pão branco, refrigerantes)</li>
          <li>• Priorize proteínas magras em todas as refeições</li>
          <li>• Carboidratos concentrados no pré e pós-treino</li>
          <li>• Use temperos naturais (alho, cebola, ervas) ao invés de sal</li>
          <li>• Ajuste as porções conforme sua fome e energia</li>
          <li>• Consulte um nutricionista para personalizar seu plano</li>
          <li>
            • <strong>IMPORTANTE:</strong> Este é um plano base, ajuste conforme necessário
          </li>
        </ul>
      </Card>
    </div>
  )
}
