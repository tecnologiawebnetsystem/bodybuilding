"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Apple, Droplets, Pill, Flame, UtensilsCrossed, Clock, Share2, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle2 } from "lucide-react"
import { getSupplementsByUser, supplementCategories, type Supplement } from "@/lib/supplements-data"
import { useState } from "react"
import { FitnessPDFGenerator, sharePDF } from "@/lib/pdf-generator"

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
      time: "06:30",
      name: "Cafe da Manha - Alto em Proteina",
      foods: [
        "4 claras + 2 ovos inteiros (omelete com espinafre)",
        "2 fatias de pao integral ou tapioca",
        "1 banana + 1 colher de pasta de amendoim",
        "Cafe preto sem acucar",
        "SUPLEMENTO: Multivitaminico + Omega 3",
      ],
      calories: 480,
      tip: "Proteina logo cedo acelera metabolismo e preserva massa muscular"
    },
    {
      time: "09:30",
      name: "Lanche da Manha - Proteico",
      foods: [
        "1 scoop de Whey Protein com agua",
        "1 porcao de oleaginosas (castanhas, amendoas - 30g)",
        "1 maca ou pera"
      ],
      calories: 280,
      tip: "Mantem anabolismo e evita catabolismo entre refeicoes"
    },
    {
      time: "12:30",
      name: "Almoco - Refeicao Principal",
      foods: [
        "180g de frango grelhado OU 150g de carne magra (patinho, acem)",
        "1 xicara de arroz integral ou batata doce (150g)",
        "Salada verde a vontade (alface, rucula, tomate, pepino)",
        "Legumes refogados (brocolis, abobrinha, cenoura)",
        "1 colher de sopa de azeite extra virgem",
        "SUPLEMENTO: Omega 3 (1 capsula)",
      ],
      calories: 620,
      tip: "Carboidrato moderado no almoco para energia sustentada"
    },
    {
      time: "15:30",
      name: "Pre-Treino - Energia",
      foods: [
        "1 batata doce media (150g) OU 1 banana com aveia",
        "1 scoop de Whey Protein",
        "SUPLEMENTO: Cafeina 200mg + L-Carnitina 2g (30min antes)",
      ],
      calories: 350,
      tip: "Carboidrato complexo 1-2h antes do treino para maximo desempenho"
    },
    {
      time: "18:00",
      name: "Durante o Treino",
      foods: [
        "500ml de agua com BCAA (5g)",
        "Beba goles pequenos a cada 15 minutos",
      ],
      calories: 20,
      tip: "BCAA previne catabolismo e melhora recuperacao"
    },
    {
      time: "19:00",
      name: "Pos-Treino - Janela Anabolica",
      foods: [
        "1 scoop de Whey Protein Isolado (30g)",
        "1 banana grande",
        "SUPLEMENTO: Creatina 5g (misturar no shake)",
      ],
      calories: 250,
      tip: "Ate 30min apos treino - maxima absorcao de proteina"
    },
    {
      time: "20:30",
      name: "Jantar - Leve e Proteico",
      foods: [
        "180g de peixe grelhado (tilapia, salmao) OU frango",
        "Legumes cozidos ou grelhados a vontade",
        "Salada verde com azeite e limao",
        "SEM carboidratos pesados a noite",
      ],
      calories: 350,
      tip: "Jantar leve favorece queima de gordura noturna"
    },
    {
      time: "22:00",
      name: "Ceia - Recuperacao Noturna",
      foods: [
        "200ml de iogurte grego natural (sem acucar)",
        "1 colher de pasta de amendoim ou chia",
        "SUPLEMENTO: ZMA + Glutamina 5g (30min antes de dormir)",
      ],
      calories: 220,
      tip: "Caseina do iogurte libera proteina lentamente durante o sono"
    },
  ],
  pamela: [
    {
      time: "07:00",
      name: "Cafe da Manha - Equilibrado",
      foods: [
        "3 claras + 1 ovo inteiro (omelete com tomate)",
        "2 fatias de pao integral OU tapioca",
        "1 fatia de queijo branco",
        "Cafe com leite desnatado ou cha verde",
        "SUPLEMENTO: Colageno 10g + Maca Peruana + Multivitaminico",
      ],
      calories: 380,
      tip: "Colageno em jejum ou com cafe - evita flacidez durante emagrecimento"
    },
    {
      time: "10:00",
      name: "Lanche da Manha - Leve",
      foods: [
        "1 iogurte natural desnatado",
        "1 maca ou pera",
        "5 castanhas do para",
      ],
      calories: 180,
      tip: "Castanhas fornecem selenio - otimo para tireoide e energia"
    },
    {
      time: "12:30",
      name: "Almoco - Balanceado",
      foods: [
        "130g de frango grelhado OU 120g de peixe",
        "3/4 xicara de arroz integral OU batata doce (100g)",
        "Salada verde a vontade com azeite",
        "Legumes coloridos (brocolis, cenoura, abobrinha)",
        "SUPLEMENTO: Omega 3 + CLA (1 capsula cada)",
      ],
      calories: 480,
      tip: "Prato colorido = mais nutrientes e vitaminas"
    },
    {
      time: "15:00",
      name: "Pre-Treino - Energia",
      foods: [
        "1 batata doce pequena (100g) OU 1 banana",
        "1 scoop de Whey Protein (25g)",
        "SUPLEMENTO: Cafeina 100-200mg (se for treinar pesado)",
      ],
      calories: 280,
      tip: "Carboidrato antes do treino = mais energia para gluteo e pernas"
    },
    {
      time: "18:00",
      name: "Pos-Treino - Recuperacao",
      foods: [
        "1 scoop de Whey Protein Isolado",
        "1 banana pequena",
        "SUPLEMENTO: Creatina 3g (misturar no shake)",
      ],
      calories: 220,
      tip: "Creatina na dose certa para mulher - definicao sem inchaco"
    },
    {
      time: "20:00",
      name: "Jantar - Proteico e Leve",
      foods: [
        "130g de peixe grelhado (tilapia, salmao) OU frango",
        "Legumes grelhados ou cozidos a vontade",
        "Salada verde com limao e azeite",
        "EVITAR carboidratos a noite",
      ],
      calories: 300,
      tip: "Sem carboidrato a noite acelera queima de gordura abdominal"
    },
    {
      time: "22:00",
      name: "Ceia - Relaxamento",
      foods: [
        "150ml de iogurte grego natural",
        "1 colher de chia ou linhaca",
        "SUPLEMENTO: Magnesio 300mg (30min antes de dormir)",
      ],
      calories: 160,
      tip: "Magnesio melhora sono e ajuda com TPM e ansiedade"
    },
  ],
  juliana: [
    {
      time: "07:00",
      name: "Cafe da Manha - Leve e Nutritivo",
      foods: [
        "2 claras + 1 ovo inteiro mexido",
        "1 fatia de pao integral OU tapioca pequena",
        "1 fruta (maca, pera ou mamao)",
        "Cha verde sem acucar",
        "SUPLEMENTO: Colageno 10g + Vitamina D3",
      ],
      calories: 280,
      tip: "Colageno previne flacidez durante o emagrecimento"
    },
    {
      time: "09:30",
      name: "Lanche da Manha - Saciedade",
      foods: [
        "1 iogurte natural desnatado",
        "1 porcao de frutas vermelhas ou morango",
        "SUPLEMENTO: Fibras (Psyllium 3g) com agua",
      ],
      calories: 130,
      tip: "Fibras aumentam saciedade e regulam intestino"
    },
    {
      time: "12:30",
      name: "Almoco - Equilibrado",
      foods: [
        "120g de frango grelhado OU 100g de peixe",
        "1/2 xicara de arroz integral OU batata doce (80g)",
        "Salada verde a vontade (alface, rucula, tomate, pepino)",
        "Legumes cozidos ou grelhados",
        "1 colher de azeite",
        "SUPLEMENTO: Omega 3 (1 capsula)",
      ],
      calories: 400,
      tip: "Coma devagar - 20 minutos para o cerebro sentir saciedade"
    },
    {
      time: "15:30",
      name: "Lanche da Tarde - Controle da Fome",
      foods: [
        "1 fruta (maca ou pera)",
        "10 castanhas ou amendoas",
        "SUPLEMENTO: Fibras (Psyllium 3g) + agua (antes se tiver muita fome)",
      ],
      calories: 160,
      tip: "Castanhas dao saciedade e gorduras boas"
    },
    {
      time: "19:00",
      name: "Jantar - Leve",
      foods: [
        "120g de peixe OU frango grelhado",
        "Legumes refogados ou cozidos a vontade",
        "Salada verde com limao",
        "SEM carboidratos - foco em proteina e vegetais",
      ],
      calories: 320,
      tip: "Jantar leve facilita digestao e queima gordura a noite"
    },
    {
      time: "21:00",
      name: "Ceia - Relaxamento (opcional)",
      foods: [
        "1 xicara de cha de camomila ou erva-doce",
        "3 castanhas ou 1 colher de chia em agua",
        "SUPLEMENTO: Magnesio 200mg (ajuda no sono e ansiedade)",
      ],
      calories: 80,
      tip: "Cha e magnesio reduzem ansiedade noturna e compulsao"
    },
  ],
}

export function NutritionTab({ userId, preferences }: NutritionTabProps) {
  const supplements = getSupplementsByUser(userId)
  const meals = mealPlans[userId as keyof typeof mealPlans] || []
  const totalCalories = meals.length > 0 ? meals.reduce((sum, meal) => sum + meal.calories, 0) : 0

  const [isGeneratingNutritionPDF, setIsGeneratingNutritionPDF] = useState(false)
  const [isGeneratingSupplementsPDF, setIsGeneratingSupplementsPDF] = useState(false)
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredSupplements = selectedCategory 
    ? supplements.filter(s => s.category === selectedCategory)
    : supplements

  const handleExportNutritionPDF = async () => {
    setIsGeneratingNutritionPDF(true)
    try {
      const generator = new FitnessPDFGenerator()

      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      const blob = generator.generateNutritionPDF(userName, meals, totalCalories, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `plano-nutricao-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating nutrition PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingNutritionPDF(false)
    }
  }

  const handleExportSupplementsPDF = async () => {
    setIsGeneratingSupplementsPDF(true)
    try {
      const generator = new FitnessPDFGenerator()

      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      const blob = generator.generateSupplementsPDF(userName, supplements, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `plano-suplementos-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating supplements PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingSupplementsPDF(false)
    }
  }

  if (meals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nutrição & Alimentação</h2>
          <p className="text-gray-300">Plano personalizado</p>
        </div>
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Nenhum plano alimentar configurado para este usuário.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nutrição & Alimentação</h2>
          <p className="text-gray-300">Plano personalizado</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportNutritionPDF} disabled={isGeneratingNutritionPDF}>
          {isGeneratingNutritionPDF ? (
            <>Gerando...</>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Nutrição
            </>
          )}
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Metas Diárias</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold text-white">{totalCalories}</p>
            <p className="text-sm text-gray-300">Calorias</p>
          </div>
          <div className="text-center">
            <Apple className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold text-white">
              {userId === "pamela" ? "130g" : userId === "juliana" ? "100g" : "160g"}
            </p>
            <p className="text-sm text-gray-300">Proteína</p>
          </div>
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold text-white">3L</p>
            <p className="text-sm text-gray-300">Água</p>
          </div>
          <div className="text-center">
            <Pill className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold text-white">
              {userId === "pamela" ? "45g" : userId === "juliana" ? "35g" : "50g"}
            </p>
            <p className="text-sm text-gray-300">Gorduras</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Plano Alimentar Diário
        </h3>
        <div className="space-y-4">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border-2 hover:border-opacity-60 transition-all bg-white/5"
              style={{ borderColor: `${preferences.theme_primary}40` }}
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
                  <h4 className="font-bold text-lg text-white">{meal.name}</h4>
                  <p className="text-sm text-gray-300">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: preferences.theme_primary }}>
                    {meal.calories} kcal
                  </p>
                </div>
              </div>
              <ul className="space-y-2 ml-2">
                {meal.foods.map((food, foodIdx) => {
                  const isSupp = food.startsWith("SUPLEMENTO:")
                  const isAvoid = food.startsWith("SEM ") || food.startsWith("EVITAR")
                  return (
                    <li key={foodIdx} className="text-sm flex items-start gap-2">
                      <span 
                        style={{ color: isSupp ? "#8b5cf6" : isAvoid ? "#ef4444" : preferences.theme_primary }} 
                        className="mt-1"
                      >
                        {isSupp ? "+" : isAvoid ? "!" : "-"}
                      </span>
                      <span className={`flex-1 ${isSupp ? "text-purple-300 font-medium" : isAvoid ? "text-red-300" : "text-gray-200"}`}>
                        {food}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {/* Dica da Refeicao */}
              {(meal as any).tip && (
                <div className="mt-3 p-2 rounded bg-white/5 border-l-2" style={{ borderColor: preferences.theme_accent }}>
                  <p className="text-xs text-gray-400 italic">
                    <span className="text-yellow-500">Dica:</span> {(meal as any).tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${preferences.theme_primary}20` }}>
          <p className="font-bold text-center text-lg text-white">Total Diário: {totalCalories} calorias</p>
        </div>
      </Card>

      {/* Secao de Suplementos Completa */}
      {supplements.length > 0 && (
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Pill className="w-6 h-6" style={{ color: preferences.theme_primary }} />
              Suplementacao Recomendada
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSupplementsPDF}
              disabled={isGeneratingSupplementsPDF}
            >
              {isGeneratingSupplementsPDF ? (
                <>Gerando...</>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  PDF
                </>
              )}
            </Button>
          </div>

          {/* Filtro por Categoria */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              Todos ({supplements.length})
            </Badge>
            {Object.entries(supplementCategories).map(([key, cat]) => {
              const count = supplements.filter(s => s.category === key).length
              if (count === 0) return null
              return (
                <Badge 
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className="cursor-pointer"
                  style={selectedCategory === key ? { backgroundColor: cat.color } : {}}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                >
                  {cat.name} ({count})
                </Badge>
              )
            })}
          </div>

          <div className="space-y-4">
            {filteredSupplements.map((supp, idx) => {
              const isExpanded = expandedSupplement === supp.name
              const catInfo = supplementCategories[supp.category as keyof typeof supplementCategories]
              
              return (
                <div
                  key={idx}
                  className="rounded-lg border-2 overflow-hidden transition-all"
                  style={{ borderColor: `${catInfo?.color || preferences.theme_primary}40` }}
                >
                  {/* Header do Suplemento */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedSupplement(isExpanded ? null : supp.name)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: catInfo?.color || preferences.theme_primary }}
                      >
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg text-white">{supp.name}</h4>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: catInfo?.color, color: catInfo?.color }}>
                            {catInfo?.name}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium" style={{ color: preferences.theme_primary }}>
                          {supp.dosage} - {supp.timing}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">{supp.purpose}</p>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10">
                      {/* Como Tomar */}
                      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${catInfo?.color}15` }}>
                        <h5 className="font-semibold text-white flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4" style={{ color: catInfo?.color }} />
                          Como Tomar
                        </h5>
                        <p className="text-sm text-gray-300">{supp.howToUse}</p>
                      </div>

                      {/* Dicas */}
                      <div className="mt-4">
                        <h5 className="font-semibold text-white flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Dicas Importantes
                        </h5>
                        <ul className="space-y-2">
                          {supp.tips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-500 mt-0.5">&#10003;</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Guia Rapido de Horarios */}
      <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Guia Rapido de Horarios - Suplementos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Ao Acordar / Manha</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Multivitaminico (com cafe da manha)</li>
              <li>- Colageno (pode ser em jejum)</li>
              <li>- Termogenico (se usar)</li>
              <li>- Vitamina D3</li>
              {userId === "pamela" && <li>- Maca Peruana</li>}
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Pre-Treino (30min antes)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Cafeina (se usar)</li>
              <li>- L-Carnitina (antes do cardio)</li>
              {userId === "pamela" && <li>- Tribulus (se nao tomou de manha)</li>}
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Durante o Treino</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- BCAA (em 500ml de agua)</li>
              <li>- Agua (beba bastante!)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Pos-Treino (ate 30min)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Whey Protein (imediato)</li>
              <li>- Creatina (pode ser junto)</li>
              <li>- Carboidrato (banana, batata doce)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Com Refeicoes</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Omega 3 (almoco e jantar)</li>
              <li>- CLA (dividido nas refeicoes)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Antes de Dormir</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Magnesio/ZMA</li>
              <li>- Glutamina (opcional)</li>
              <li>- Colageno (alternativa)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Avisos sobre Suplementacao */}
      <Card
        className="p-6 border"
        style={{ backgroundColor: "#ef444415", borderColor: "#ef444440" }}
      >
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Avisos Importantes sobre Suplementacao
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Consulte um medico antes de iniciar qualquer suplementacao
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Suplementos NAO substituem uma alimentacao equilibrada
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Respeite as dosagens recomendadas - mais NAO e melhor
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Hidrate-se bem (minimo 3L de agua por dia)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Informe seu medico sobre todos os suplementos que usa
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Gestantes e lactantes devem evitar a maioria dos suplementos
          </li>
        </ul>
      </Card>

      {/* Notas de Nutricao */}
      <Card
        className="p-6 border"
        style={{ backgroundColor: `${preferences.theme_accent}10`, borderColor: `${preferences.theme_accent}30` }}
      >
        <h3 className="text-lg font-bold text-white mb-3">Dicas de Nutricao</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>- Beba pelo menos 3 litros de agua por dia</li>
          <li>- Evite carboidratos simples (acucar, pao branco, refrigerantes)</li>
          <li>- Priorize proteinas magras em todas as refeicoes</li>
          <li>- Carboidratos concentrados no pre e pos-treino</li>
          <li>- Use temperos naturais (alho, cebola, ervas) ao inves de sal</li>
          <li>- Ajuste as porcoes conforme sua fome e energia</li>
          <li>- Consulte um nutricionista para personalizar seu plano</li>
          <li className="text-white font-semibold">- IMPORTANTE: Este e um plano base, ajuste conforme necessario</li>
        </ul>
      </Card>
    </div>
  )
}
