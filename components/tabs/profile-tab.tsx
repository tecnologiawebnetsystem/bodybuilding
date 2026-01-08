"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Scale, TrendingDown, Plus, UserIcon, Target, Activity, AlertTriangle } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"

interface ProfileTabProps {
  userId: string
  onLogout: () => void
}

function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weight / (heightM * heightM)
}

function getBMIClassification(bmi: number): {
  status: string
  color: string
  description: string
  risks: string[]
} {
  if (bmi < 18.5) {
    return {
      status: "Abaixo do Peso",
      color: "text-yellow-600",
      description: "Seu IMC está abaixo do recomendado",
      risks: [
        "Deficiências nutricionais",
        "Sistema imunológico enfraquecido",
        "Maior risco de osteoporose",
        "Perda de massa muscular",
      ],
    }
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      status: "Peso Normal",
      color: "text-green-600",
      description: "Seu IMC está na faixa saudável! Parabéns!",
      risks: ["Menor risco de doenças cardiovasculares", "Melhor qualidade de vida", "Energia e disposição adequadas"],
    }
  } else if (bmi >= 25 && bmi < 30) {
    return {
      status: "Sobrepeso",
      color: "text-orange-600",
      description: "Seu IMC indica sobrepeso. É hora de agir!",
      risks: [
        "Aumento do risco de diabetes tipo 2",
        "Maior pressão sobre articulações",
        "Risco elevado de doenças cardiovasculares",
        "Possível desenvolvimento de hipertensão",
      ],
    }
  } else {
    return {
      status: "Obesidade",
      color: "text-red-600",
      description: "Seu IMC indica obesidade. Atenção necessária!",
      risks: [
        "Alto risco de diabetes tipo 2",
        "Doenças cardiovasculares graves",
        "Problemas respiratórios",
        "Apneia do sono",
        "Problemas articulares",
        "Risco aumentado de alguns tipos de câncer",
      ],
    }
  }
}

export function ProfileTab({ userId, onLogout }: ProfileTabProps) {
  const profile = userProfiles[userId]
  const [weightHistory, setWeightHistory] = useState<Array<{ date: string; weight: number }>>([])
  const [newWeight, setNewWeight] = useState("")
  const [showAddWeight, setShowAddWeight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`weightHistory_${userId}`)
    if (stored) {
      setWeightHistory(JSON.parse(stored))
    } else {
      // Initialize with starting weight
      const initial = [{ date: profile.startDate, weight: profile.initialWeight }]
      setWeightHistory(initial)
      localStorage.setItem(`weightHistory_${userId}`, JSON.stringify(initial))
    }
  }, [userId, profile])

  const handleAddWeight = () => {
    if (!newWeight) return

    const today = new Date().toISOString().split("T")[0]
    const updatedHistory = [...weightHistory, { date: today, weight: Number.parseFloat(newWeight) }]

    setWeightHistory(updatedHistory)
    localStorage.setItem(`weightHistory_${userId}`, JSON.stringify(updatedHistory))
    setNewWeight("")
    setShowAddWeight(false)
    alert("✅ Peso atualizado com sucesso!")
  }

  const currentWeight =
    weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.initialWeight
  const weightLoss = profile.initialWeight - currentWeight
  const daysActive = Math.floor((new Date().getTime() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24))

  const currentBMI = calculateBMI(currentWeight, profile.height)
  const targetBMI = calculateBMI(profile.targetWeight, profile.height)
  const currentBMIInfo = getBMIClassification(currentBMI)
  const targetBMIInfo = getBMIClassification(targetBMI)

  const idealBMI = 22
  const idealWeight = (idealBMI * Math.pow(profile.height / 100, 2)).toFixed(1)

  const chartData = weightHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    weight: entry.weight,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Seu Perfil</h2>
          <p className="text-muted-foreground">Acompanhe sua evolução</p>
        </div>
        <Button onClick={onLogout} variant="outline">
          Trocar Perfil
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{profile.name}</h3>
            <p className="text-muted-foreground">
              {profile.age ? `${profile.age} anos` : ""} • {profile.height}cm
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Gênero</p>
            <p className="font-semibold">{profile.gender === "male" ? "Masculino" : "Feminino"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Início</p>
            <p className="font-semibold">{new Date(profile.startDate).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Análise de IMC Completa</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* IMC Atual */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-lg">IMC Atual</h4>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">{currentBMI.toFixed(1)}</span>
                <span className={`text-lg font-semibold ${currentBMIInfo.color}`}>{currentBMIInfo.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{currentBMIInfo.description}</p>

              <div className="space-y-2">
                <p className="font-semibold text-sm">⚠️ Atenção aos riscos:</p>
                <ul className="space-y-1">
                  {currentBMIInfo.risks.map((risk, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* IMC Meta */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-lg">IMC Meta</h4>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">{targetBMI.toFixed(1)}</span>
                <span className={`text-lg font-semibold ${targetBMIInfo.color}`}>{targetBMIInfo.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{targetBMIInfo.description}</p>

              <div className="space-y-2">
                <p className="font-semibold text-sm">✅ Benefícios ao alcançar:</p>
                <ul className="space-y-1">
                  {targetBMIInfo.risks.map((benefit, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Faixa de IMC Ideal */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Faixa de IMC Recomendada
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Abaixo do Peso</p>
              <p className="font-bold text-yellow-600">{"< 18.5"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Normal</p>
              <p className="font-bold text-green-600">18.5 - 24.9</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sobrepeso</p>
              <p className="font-bold text-orange-600">25.0 - 29.9</p>
            </div>
            <div>
              <p className="text-muted-foreground">Obesidade</p>
              <p className="font-bold text-red-600">≥ 30.0</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <Scale className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Peso Inicial</p>
          <p className="text-2xl font-bold">{profile.initialWeight}kg</p>
        </Card>
        <Card className="p-4">
          <Scale className="w-5 h-5 text-accent mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
          <p className="text-2xl font-bold">{currentWeight}kg</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
          <Target className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Peso Ideal</p>
          <p className="text-2xl font-bold text-green-600">{idealWeight}kg</p>
          <p className="text-xs text-muted-foreground mt-1">IMC 22 (saudável)</p>
        </Card>
        <Card className="p-4">
          <TrendingDown className="w-5 h-5 text-success mb-2" />
          <p className="text-sm text-muted-foreground">Perdidos</p>
          <p className="text-2xl font-bold">{weightLoss.toFixed(1)}kg</p>
        </Card>
      </div>

      {/* Goals */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Objetivos Pessoais</h3>
        <div className="space-y-2">
          {profile.goals.map((goal, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{goal}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Weight Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Progresso de Peso</h3>
          <Button onClick={() => setShowAddWeight(!showAddWeight)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Peso
          </Button>
        </div>

        {showAddWeight && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Ex: 91.5"
                className="flex-1"
              />
              <Button onClick={handleAddWeight}>Salvar</Button>
              <Button onClick={() => setShowAddWeight(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[profile.targetWeight - 2, profile.initialWeight + 2]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Body Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Dados Corporais</h3>
        <div className="grid gap-4">
          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Altura</span>
            <span className="font-bold">{profile.height} cm</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">IMC Atual</span>
            <span className="font-bold">{currentBMI.toFixed(1)}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">IMC Meta</span>
            <span className="font-bold text-success">{targetBMI.toFixed(1)}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <span className="text-muted-foreground font-semibold">Peso Ideal (IMC 22)</span>
            <span className="font-bold text-green-600">{idealWeight} kg</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Data de Início</span>
            <span className="font-bold">{new Date(profile.startDate).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="text-xl font-bold mb-4">Análise de Peso</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-background border-2">
            <p className="text-sm text-muted-foreground mb-1">Peso Meta</p>
            <p className="text-3xl font-bold text-primary">{profile.targetWeight}kg</p>
            <p className="text-xs text-muted-foreground mt-2">Sua meta pessoal</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
            <p className="text-sm text-muted-foreground mb-1">Peso Ideal (IMC 22)</p>
            <p className="text-3xl font-bold text-green-600">{idealWeight}kg</p>
            <p className="text-xs text-muted-foreground mt-2">Faixa mais saudável</p>
          </div>
          <div className="p-4 rounded-lg bg-background border-2">
            <p className="text-sm text-muted-foreground mb-1">A Perder Total</p>
            <p className="text-3xl font-bold text-orange-600">{(currentWeight - profile.targetWeight).toFixed(1)}kg</p>
            <p className="text-xs text-muted-foreground mt-2">Até sua meta</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
