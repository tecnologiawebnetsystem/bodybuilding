"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

interface OnboardingData {
  // Etapa 1: Dados Básicos
  name: string
  age: number
  gender: string
  height: number
  currentWeight: number
  targetWeight: number

  // Etapa 2: Objetivo Principal
  primaryGoal: "lose_weight" | "gain_muscle" | "maintain" | "athletic"
  goalIntensity: "light" | "moderate" | "intense"
  targetDate: string // meses para atingir meta

  // Etapa 3: Equipamentos Disponíveis
  equipment: string[] // halteres, barra, elásticos, apenas_corpo, academia_completa
  trainingLocation: "home" | "gym" | "both"

  // Etapa 4: Frequência de Treino Academia
  gymFrequency: number // 0-7 vezes por semana
  preferredSplit: string // ABC, ABCD, Upper/Lower, Full Body
  sessionDuration: number // minutos por sessão

  // Etapa 5: Corrida/Cardio
  includeRunning: boolean
  runningLevel: "beginner" | "intermediate" | "advanced" | "none"
  runningFrequency: number // vezes por semana
  runningDuration: number // minutos por sessão

  // Etapa 6: Treino em Casa
  includeHomWorkouts: boolean
  homeFrequency: number
  homeDuration: number
  homeFocus: string[] // cardio, strength, flexibility, core

  // Etapa 7: Nutrição
  includeNutrition: boolean
  dietType: string // balanced, low_carb, keto, vegetarian, vegan
  mealsPerDay: number
  foodRestrictions: string[]

  // Etapa 8: Suplementação
  includeSupplements: boolean
  currentSupplements: string[]
  supplementBudget: string // low, medium, high

  // Etapa 9: Estilo de Vida
  activityLevel: string // sedentary, lightly_active, moderately_active, very_active
  sleepHours: number
  stressLevel: string // low, medium, high
  waterIntake: number // ml por dia

  // Etapa 10: Experiência
  trainingExperience: string // beginner, intermediate, advanced, professional
  injuriesLimitations: string
}

const TOTAL_STEPS = 10

export function OnboardingWizard({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Partial<OnboardingData>>({
    equipment: [],
    homeFocus: [],
    foodRestrictions: [],
    currentSupplements: [],
  })

  const progress = (step / TOTAL_STEPS) * 100

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    // Aqui será chamada a API que gera os planos personalizados
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onComplete(data as OnboardingData)
  }

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = (data[field as keyof OnboardingData] as string[]) || []
    if (currentArray.includes(value)) {
      updateData(
        field,
        currentArray.filter((item) => item !== value),
      )
    } else {
      updateData(field, [...currentArray, value])
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Cadastro Personalizado</CardTitle>
            <span className="text-sm text-muted-foreground">
              Passo {step} de {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ETAPA 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Vamos começar com suas informações básicas</CardDescription>

              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={data.name || ""}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={data.age || ""}
                    onChange={(e) => updateData("age", Number.parseInt(e.target.value))}
                    placeholder="25"
                  />
                </div>

                <div>
                  <Label>Sexo</Label>
                  <RadioGroup value={data.gender} onValueChange={(value) => updateData("gender", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={data.height || ""}
                    onChange={(e) => updateData("height", Number.parseInt(e.target.value))}
                    placeholder="170"
                  />
                </div>

                <div>
                  <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={data.currentWeight || ""}
                    onChange={(e) => updateData("currentWeight", Number.parseFloat(e.target.value))}
                    placeholder="80"
                  />
                </div>

                <div>
                  <Label htmlFor="targetWeight">Peso Meta (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    value={data.targetWeight || ""}
                    onChange={(e) => updateData("targetWeight", Number.parseFloat(e.target.value))}
                    placeholder="75"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Objetivo Principal */}
          {step === 2 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Qual é seu objetivo principal?</CardDescription>

              <RadioGroup value={data.primaryGoal} onValueChange={(value) => updateData("primaryGoal", value)}>
                <Card
                  className={`cursor-pointer transition-all ${data.primaryGoal === "lose_weight" ? "ring-2 ring-blue-500" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lose_weight" id="lose_weight" />
                      <div>
                        <Label htmlFor="lose_weight" className="cursor-pointer font-semibold">
                          Emagrecimento
                        </Label>
                        <p className="text-sm text-muted-foreground">Perder gordura e definir o corpo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${data.primaryGoal === "gain_muscle" ? "ring-2 ring-blue-500" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                      <div>
                        <Label htmlFor="gain_muscle" className="cursor-pointer font-semibold">
                          Ganho de Massa Muscular
                        </Label>
                        <p className="text-sm text-muted-foreground">Aumentar músculos e força</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${data.primaryGoal === "maintain" ? "ring-2 ring-blue-500" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <div>
                        <Label htmlFor="maintain" className="cursor-pointer font-semibold">
                          Manutenção e Saúde
                        </Label>
                        <p className="text-sm text-muted-foreground">Manter peso e melhorar saúde</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${data.primaryGoal === "athletic" ? "ring-2 ring-blue-500" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="athletic" id="athletic" />
                      <div>
                        <Label htmlFor="athletic" className="cursor-pointer font-semibold">
                          Performance Atlética
                        </Label>
                        <p className="text-sm text-muted-foreground">Aumentar resistência e desempenho</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>

              <div>
                <Label>Intensidade do Programa</Label>
                <Select value={data.goalIntensity} onValueChange={(value) => updateData("goalIntensity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a intensidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Leve - Progresso gradual</SelectItem>
                    <SelectItem value="moderate">Moderada - Equilibrado</SelectItem>
                    <SelectItem value="intense">Intensa - Resultados rápidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prazo para atingir sua meta</Label>
                <Select value={data.targetDate} onValueChange={(value) => updateData("targetDate", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quanto tempo?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mês</SelectItem>
                    <SelectItem value="2">2 meses</SelectItem>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ETAPA 3: Equipamentos Disponíveis */}
          {step === 3 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Quais equipamentos você tem acesso?</CardDescription>

              <div>
                <Label>Local de Treino</Label>
                <RadioGroup
                  value={data.trainingLocation}
                  onValueChange={(value) => updateData("trainingLocation", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Apenas em casa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gym" id="gym" />
                    <Label htmlFor="gym">Apenas academia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Casa e academia</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Equipamentos Disponíveis (selecione todos que tiver)</Label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "bodyweight", label: "Apenas peso corporal" },
                    { value: "dumbbells", label: "Halteres" },
                    { value: "barbell", label: "Barra e anilhas" },
                    { value: "resistance_bands", label: "Elásticos/Bandas" },
                    { value: "pull_up_bar", label: "Barra fixa" },
                    { value: "bench", label: "Banco de supino" },
                    { value: "kettlebells", label: "Kettlebells" },
                    { value: "machines", label: "Máquinas de academia" },
                    { value: "cardio_equipment", label: "Esteira/Bicicleta" },
                    { value: "full_gym", label: "Academia completa" },
                  ].map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.value}
                        checked={data.equipment?.includes(item.value)}
                        onCheckedChange={() => toggleArrayItem("equipment", item.value)}
                      />
                      <Label htmlFor={item.value} className="cursor-pointer text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: Frequência de Treino Academia */}
          {step === 4 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Frequência de treino na academia</CardDescription>

              <div>
                <Label>Quantas vezes por semana você pode treinar na academia?</Label>
                <div className="mt-4 space-y-2">
                  <Slider
                    value={[data.gymFrequency || 0]}
                    onValueChange={(value) => updateData("gymFrequency", value[0])}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0x</span>
                    <span className="font-semibold text-lg text-foreground">{data.gymFrequency || 0}x por semana</span>
                    <span>7x</span>
                  </div>
                </div>
              </div>

              {(data.gymFrequency || 0) > 0 && (
                <>
                  <div>
                    <Label>Divisão de Treino Preferida</Label>
                    <Select value={data.preferredSplit} onValueChange={(value) => updateData("preferredSplit", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha a divisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_body">Full Body (corpo todo)</SelectItem>
                        <SelectItem value="upper_lower">Upper/Lower (superior/inferior)</SelectItem>
                        <SelectItem value="abc">ABC (3 treinos diferentes)</SelectItem>
                        <SelectItem value="abcd">ABCD (4 treinos diferentes)</SelectItem>
                        <SelectItem value="ppl">Push/Pull/Legs</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Duração ideal por sessão (minutos)</Label>
                    <Slider
                      value={[data.sessionDuration || 60]}
                      onValueChange={(value) => updateData("sessionDuration", value[0])}
                      min={30}
                      max={120}
                      step={15}
                      className="w-full mt-4"
                    />
                    <div className="text-center mt-2 font-semibold">{data.sessionDuration || 60} minutos</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETAPA 5: Corrida/Cardio */}
          {step === 5 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Vamos falar sobre corrida/cardio</CardDescription>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRunning"
                  checked={data.includeRunning}
                  onCheckedChange={(checked) => updateData("includeRunning", checked)}
                />
                <Label htmlFor="includeRunning" className="cursor-pointer">
                  Quero incluir corrida no meu plano
                </Label>
              </div>

              {data.includeRunning && (
                <>
                  <div>
                    <Label>Seu nível atual em corrida</Label>
                    <RadioGroup value={data.runningLevel} onValueChange={(value) => updateData("runningLevel", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <div>
                          <Label htmlFor="beginner">Iniciante - Nunca corri ou estou começando</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <div>
                          <Label htmlFor="intermediate">Intermediário - Corro regularmente</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <div>
                          <Label htmlFor="advanced">Avançado - Corredor experiente</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Quantas vezes por semana?</Label>
                    <Slider
                      value={[data.runningFrequency || 3]}
                      onValueChange={(value) => updateData("runningFrequency", value[0])}
                      max={7}
                      step={1}
                      className="w-full mt-4"
                    />
                    <div className="text-center mt-2 font-semibold">{data.runningFrequency || 3}x por semana</div>
                  </div>

                  <div>
                    <Label>Duração por sessão (minutos)</Label>
                    <Slider
                      value={[data.runningDuration || 30]}
                      onValueChange={(value) => updateData("runningDuration", value[0])}
                      min={15}
                      max={90}
                      step={5}
                      className="w-full mt-4"
                    />
                    <div className="text-center mt-2 font-semibold">{data.runningDuration || 30} minutos</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETAPA 6: Treino em Casa */}
          {step === 6 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Treino em casa</CardDescription>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHomWorkouts"
                  checked={data.includeHomWorkouts}
                  onCheckedChange={(checked) => updateData("includeHomWorkouts", checked)}
                />
                <Label htmlFor="includeHomWorkouts" className="cursor-pointer">
                  Quero treinar em casa também
                </Label>
              </div>

              {data.includeHomWorkouts && (
                <>
                  <div>
                    <Label>Quantas vezes por semana?</Label>
                    <Slider
                      value={[data.homeFrequency || 3]}
                      onValueChange={(value) => updateData("homeFrequency", value[0])}
                      max={7}
                      step={1}
                      className="w-full mt-4"
                    />
                    <div className="text-center mt-2 font-semibold">{data.homeFrequency || 3}x por semana</div>
                  </div>

                  <div>
                    <Label>Tempo disponível por sessão (minutos)</Label>
                    <Slider
                      value={[data.homeDuration || 30]}
                      onValueChange={(value) => updateData("homeDuration", value[0])}
                      min={15}
                      max={60}
                      step={5}
                      className="w-full mt-4"
                    />
                    <div className="text-center mt-2 font-semibold">{data.homeDuration || 30} minutos</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Foco dos treinos em casa (selecione todos)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "cardio", label: "Cardio/Queima de gordura" },
                        { value: "strength", label: "Força muscular" },
                        { value: "flexibility", label: "Flexibilidade" },
                        { value: "core", label: "Core/Abdômen" },
                      ].map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.value}
                            checked={data.homeFocus?.includes(item.value)}
                            onCheckedChange={() => toggleArrayItem("homeFocus", item.value)}
                          />
                          <Label htmlFor={item.value} className="cursor-pointer text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETAPA 7: Nutrição */}
          {step === 7 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Plano nutricional</CardDescription>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeNutrition"
                  checked={data.includeNutrition}
                  onCheckedChange={(checked) => updateData("includeNutrition", checked)}
                />
                <Label htmlFor="includeNutrition" className="cursor-pointer">
                  Quero um plano nutricional
                </Label>
              </div>

              {data.includeNutrition && (
                <>
                  <div>
                    <Label>Tipo de dieta</Label>
                    <Select value={data.dietType} onValueChange={(value) => updateData("dietType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o tipo de dieta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanceada (equilibrada)</SelectItem>
                        <SelectItem value="low_carb">Low Carb</SelectItem>
                        <SelectItem value="keto">Cetogênica (Keto)</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="vegetarian">Vegetariana</SelectItem>
                        <SelectItem value="vegan">Vegana</SelectItem>
                        <SelectItem value="mediterranean">Mediterrânea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Refeições por dia</Label>
                    <RadioGroup
                      value={data.mealsPerDay?.toString()}
                      onValueChange={(value) => updateData("mealsPerDay", Number.parseInt(value))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="3meals" />
                        <Label htmlFor="3meals">3 refeições</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="4meals" />
                        <Label htmlFor="4meals">4 refeições</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="5meals" />
                        <Label htmlFor="5meals">5 refeições (recomendado)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6" id="6meals" />
                        <Label htmlFor="6meals">6 refeições</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Restrições alimentares</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "lactose", label: "Lactose" },
                        { value: "gluten", label: "Glúten" },
                        { value: "nuts", label: "Oleaginosas" },
                        { value: "seafood", label: "Frutos do mar" },
                        { value: "eggs", label: "Ovos" },
                        { value: "soy", label: "Soja" },
                      ].map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.value}
                            checked={data.foodRestrictions?.includes(item.value)}
                            onCheckedChange={() => toggleArrayItem("foodRestrictions", item.value)}
                          />
                          <Label htmlFor={item.value} className="cursor-pointer text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETAPA 8: Suplementação */}
          {step === 8 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Suplementação</CardDescription>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSupplements"
                  checked={data.includeSupplements}
                  onCheckedChange={(checked) => updateData("includeSupplements", checked)}
                />
                <Label htmlFor="includeSupplements" className="cursor-pointer">
                  Quero recomendações de suplementos
                </Label>
              </div>

              {data.includeSupplements && (
                <>
                  <div>
                    <Label>Orçamento para suplementação</Label>
                    <RadioGroup
                      value={data.supplementBudget}
                      onValueChange={(value) => updateData("supplementBudget", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low">Básico - Até R$150/mês</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Intermediário - R$150-300/mês</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high">Completo - Acima de R$300/mês</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Suplementos que já usa (se houver)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "whey", label: "Whey Protein" },
                        { value: "creatine", label: "Creatina" },
                        { value: "bcaa", label: "BCAA" },
                        { value: "pre_workout", label: "Pré-treino" },
                        { value: "multivitamin", label: "Multivitamínico" },
                        { value: "omega3", label: "Ômega 3" },
                      ].map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.value}
                            checked={data.currentSupplements?.includes(item.value)}
                            onCheckedChange={() => toggleArrayItem("currentSupplements", item.value)}
                          />
                          <Label htmlFor={item.value} className="cursor-pointer text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETAPA 9: Estilo de Vida */}
          {step === 9 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Seu estilo de vida</CardDescription>

              <div>
                <Label>Nível de atividade diária (fora dos treinos)</Label>
                <Select value={data.activityLevel} onValueChange={(value) => updateData("activityLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário - Pouco ou nenhum exercício</SelectItem>
                    <SelectItem value="lightly_active">Levemente ativo - Exercício leve 1-3x/semana</SelectItem>
                    <SelectItem value="moderately_active">
                      Moderadamente ativo - Exercício moderado 3-5x/semana
                    </SelectItem>
                    <SelectItem value="very_active">Muito ativo - Exercício intenso 6-7x/semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Horas de sono por noite</Label>
                <Slider
                  value={[data.sleepHours || 7]}
                  onValueChange={(value) => updateData("sleepHours", value[0])}
                  min={4}
                  max={12}
                  step={1}
                  className="w-full mt-4"
                />
                <div className="text-center mt-2 font-semibold">{data.sleepHours || 7} horas</div>
              </div>

              <div>
                <Label>Nível de estresse</Label>
                <RadioGroup value={data.stressLevel} onValueChange={(value) => updateData("stressLevel", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low_stress" />
                    <Label htmlFor="low_stress">Baixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium_stress" />
                    <Label htmlFor="medium_stress">Médio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high_stress" />
                    <Label htmlFor="high_stress">Alto</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Ingestão de água atual (ml/dia)</Label>
                <Slider
                  value={[data.waterIntake || 2000]}
                  onValueChange={(value) => updateData("waterIntake", value[0])}
                  min={1000}
                  max={4000}
                  step={250}
                  className="w-full mt-4"
                />
                <div className="text-center mt-2 font-semibold">
                  {data.waterIntake || 2000} ml ({((data.waterIntake || 2000) / 1000).toFixed(1)}L)
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 10: Experiência */}
          {step === 10 && (
            <div className="space-y-4">
              <CardDescription className="text-lg">Última etapa! Sua experiência com treinos</CardDescription>

              <div>
                <Label>Nível de experiência em treinos</Label>
                <RadioGroup
                  value={data.trainingExperience}
                  onValueChange={(value) => updateData("trainingExperience", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="exp_beginner" />
                    <div>
                      <Label htmlFor="exp_beginner">Iniciante - Menos de 6 meses de treino</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="exp_intermediate" />
                    <div>
                      <Label htmlFor="exp_intermediate">Intermediário - 6 meses a 2 anos de treino</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="exp_advanced" />
                    <div>
                      <Label htmlFor="exp_advanced">Avançado - Mais de 2 anos de treino consistente</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="exp_professional" />
                    <div>
                      <Label htmlFor="exp_professional">Profissional/Atleta</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="injuries">Lesões ou limitações físicas</Label>
                <Input
                  id="injuries"
                  value={data.injuriesLimitations || ""}
                  onChange={(e) => updateData("injuriesLimitations", e.target.value)}
                  placeholder="Ex: Dor no joelho, problema lombar (deixe em branco se não houver)"
                />
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Tudo pronto!</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Vamos processar suas informações e criar um plano completamente personalizado para você,
                        incluindo treinos, nutrição, suplementação e previsão de resultados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {step < TOTAL_STEPS ? (
              <Button onClick={nextStep}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando seu plano...
                  </>
                ) : (
                  <>
                    Finalizar Cadastro
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
