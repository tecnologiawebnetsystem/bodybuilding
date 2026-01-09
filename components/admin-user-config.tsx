"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface UserConfigProps {
  userId: string
  onClose: () => void
}

export function AdminUserConfig({ userId, onClose }: UserConfigProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<any>({
    features: {
      gym_checkin: true,
      gym_workouts: true,
      running: true,
      home_training: true,
      nutrition: true,
      supplements: true,
    },
    training: {},
    cardio: {},
    nutrition: {},
    supplements: {},
  })

  useEffect(() => {
    loadConfig()
  }, [userId])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/training-config?userId=${userId}`)
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error("Error loading config:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      setSaving(true)
      await fetch("/api/admin/training-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...config }),
      })
      alert("Configurações salvas com sucesso!")
      onClose()
    } catch (error) {
      console.error("Error saving config:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando configurações...</div>
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto z-50">
      <Card className="w-full max-w-6xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuração Detalhada - {userId}</CardTitle>
              <CardDescription>Personalize todas as funcionalidades e parâmetros</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="features">Funcionalidades</TabsTrigger>
              <TabsTrigger value="training">Academia</TabsTrigger>
              <TabsTrigger value="cardio">Corrida/Cardio</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrição</TabsTrigger>
              <TabsTrigger value="supplements">Suplementos</TabsTrigger>
            </TabsList>

            {/* ABA FUNCIONALIDADES */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Funcionalidades Ativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Check-in Academia</Label>
                      <p className="text-sm text-muted-foreground">Registrar presença na academia</p>
                    </div>
                    <Switch
                      checked={config.features?.gym_checkin ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, gym_checkin: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Treinos Academia</Label>
                      <p className="text-sm text-muted-foreground">Acesso aos treinos de musculação</p>
                    </div>
                    <Switch
                      checked={config.features?.gym_workouts ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, gym_workouts: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Corrida</Label>
                      <p className="text-sm text-muted-foreground">Plano de corrida e registro de treinos</p>
                    </div>
                    <Switch
                      checked={config.features?.running ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, running: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Treino em Casa</Label>
                      <p className="text-sm text-muted-foreground">Exercícios de calistenia</p>
                    </div>
                    <Switch
                      checked={config.features?.home_training ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, home_training: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Nutrição</Label>
                      <p className="text-sm text-muted-foreground">Plano alimentar e registro de refeições</p>
                    </div>
                    <Switch
                      checked={config.features?.nutrition ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, nutrition: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Suplementos</Label>
                      <p className="text-sm text-muted-foreground">Registro e acompanhamento de suplementação</p>
                    </div>
                    <Switch
                      checked={config.features?.supplements ?? true}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          features: { ...config.features, supplements: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA ACADEMIA */}
            <TabsContent value="training" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Treino Academia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Divisão e Frequência */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Divisão e Frequência</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Divisão de Treino</Label>
                        <Select
                          value={config.training?.split || "ABC"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, split: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AB">AB - 2 dias (Sup/Inf)</SelectItem>
                            <SelectItem value="ABC">ABC - 3 dias (Peito-Omb/Costas-Bíceps/Pernas)</SelectItem>
                            <SelectItem value="ABCD">ABCD - 4 dias</SelectItem>
                            <SelectItem value="ABCDE">ABCDE - 5 dias</SelectItem>
                            <SelectItem value="ABCDEF">ABCDEF - 6 dias</SelectItem>
                            <SelectItem value="Push/Pull/Legs">Push/Pull/Legs (PPL)</SelectItem>
                            <SelectItem value="Upper/Lower">Upper/Lower</SelectItem>
                            <SelectItem value="Full Body">Full Body</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Frequência Semanal</Label>
                        <Select
                          value={config.training?.frequency?.toString() || "3"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, frequency: Number.parseInt(v) },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5, 6, 7].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}x por semana
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Objetivo e Nível */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Objetivo e Experiência</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Objetivo Principal</Label>
                        <Select
                          value={config.training?.goal || "hypertrophy"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fat_loss">Perda de Gordura/Emagrecimento</SelectItem>
                            <SelectItem value="hypertrophy">Hipertrofia/Ganho de Massa</SelectItem>
                            <SelectItem value="strength">Força Máxima</SelectItem>
                            <SelectItem value="endurance">Resistência Muscular</SelectItem>
                            <SelectItem value="toning">Definição/Tonificação</SelectItem>
                            <SelectItem value="athletic">Performance Atlética</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Nível de Experiência</Label>
                        <Select
                          value={config.training?.level || "intermediate"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, level: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante (0-6 meses)</SelectItem>
                            <SelectItem value="intermediate">Intermediário (6-24 meses)</SelectItem>
                            <SelectItem value="advanced">Avançado (2+ anos)</SelectItem>
                            <SelectItem value="elite">Elite/Competidor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Séries e Repetições */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Volume de Treino</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Séries por Exercício</Label>
                        <Select
                          value={config.training?.sets || "3"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, sets: Number.parseInt(v) },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 séries</SelectItem>
                            <SelectItem value="3">3 séries</SelectItem>
                            <SelectItem value="4">4 séries</SelectItem>
                            <SelectItem value="5">5 séries</SelectItem>
                            <SelectItem value="6">6+ séries</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Faixa de Repetições</Label>
                        <Select
                          value={config.training?.reps || "8-12"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, reps: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 (Força Máxima)</SelectItem>
                            <SelectItem value="6-8">6-8 (Força/Hipertrofia)</SelectItem>
                            <SelectItem value="8-12">8-12 (Hipertrofia)</SelectItem>
                            <SelectItem value="12-15">12-15 (Hipertrofia/Resistência)</SelectItem>
                            <SelectItem value="15-20">15-20 (Resistência)</SelectItem>
                            <SelectItem value="20+">20+ (Resistência/Definição)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Intensidade (%1RM)</Label>
                        <Select
                          value={config.training?.intensity || "70-80"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, intensity: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50-60">50-60% (Leve)</SelectItem>
                            <SelectItem value="60-70">60-70% (Moderada)</SelectItem>
                            <SelectItem value="70-80">70-80% (Pesada)</SelectItem>
                            <SelectItem value="80-90">80-90% (Muito Pesada)</SelectItem>
                            <SelectItem value="90-100">90-100% (Máxima)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Tempo e Descanso */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Tempo e Descanso</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Duração do Treino</Label>
                        <Select
                          value={config.training?.duration || "45-60"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, duration: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30-45">30-45 min (Curto)</SelectItem>
                            <SelectItem value="45-60">45-60 min (Padrão)</SelectItem>
                            <SelectItem value="60-75">60-75 min (Longo)</SelectItem>
                            <SelectItem value="75-90">75-90 min (Muito Longo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Descanso Entre Séries</Label>
                        <Select
                          value={config.training?.rest_sets || "60-90"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, rest_sets: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30-45">30-45s (Curto)</SelectItem>
                            <SelectItem value="45-60">45-60s (Moderado)</SelectItem>
                            <SelectItem value="60-90">60-90s (Padrão)</SelectItem>
                            <SelectItem value="90-120">90-120s (Longo)</SelectItem>
                            <SelectItem value="120-180">2-3min (Muito Longo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Tempo Sob Tensão</Label>
                        <Select
                          value={config.training?.tempo || "2-1-2"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, tempo: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-0-1">1-0-1 (Explosivo)</SelectItem>
                            <SelectItem value="2-0-2">2-0-2 (Normal)</SelectItem>
                            <SelectItem value="2-1-2">2-1-2 (Padrão)</SelectItem>
                            <SelectItem value="3-1-3">3-1-3 (Controlado)</SelectItem>
                            <SelectItem value="4-2-4">4-2-4 (Lento)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Técnicas Avançadas */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Técnicas Avançadas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Drop Sets</Label>
                          <p className="text-xs text-muted-foreground">Reduzir peso após falha</p>
                        </div>
                        <Switch
                          checked={config.training?.drop_sets ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, drop_sets: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Super Sets</Label>
                          <p className="text-xs text-muted-foreground">2 exercícios sem descanso</p>
                        </div>
                        <Switch
                          checked={config.training?.super_sets ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, super_sets: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Giant Sets</Label>
                          <p className="text-xs text-muted-foreground">3+ exercícios em sequência</p>
                        </div>
                        <Switch
                          checked={config.training?.giant_sets ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, giant_sets: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Rest-Pause</Label>
                          <p className="text-xs text-muted-foreground">Pausas curtas para mais reps</p>
                        </div>
                        <Switch
                          checked={config.training?.rest_pause ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, rest_pause: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Pirâmide</Label>
                          <p className="text-xs text-muted-foreground">Variação de peso/reps</p>
                        </div>
                        <Switch
                          checked={config.training?.pyramid ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, pyramid: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Periodização */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Periodização</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Periodização</Label>
                        <Select
                          value={config.training?.periodization || "linear"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, periodization: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sem Periodização</SelectItem>
                            <SelectItem value="linear">Linear (progressão constante)</SelectItem>
                            <SelectItem value="ondulada">Ondulada (varia semanalmente)</SelectItem>
                            <SelectItem value="block">Block (fases específicas)</SelectItem>
                            <SelectItem value="conjugate">Conjugado (Westside)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Progressão de Carga</Label>
                        <Select
                          value={config.training?.progression || "2.5kg"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              training: { ...config.training, progression: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1kg">+1kg/semana (Conservador)</SelectItem>
                            <SelectItem value="2.5kg">+2.5kg/semana (Padrão)</SelectItem>
                            <SelectItem value="5kg">+5kg/semana (Agressivo)</SelectItem>
                            <SelectItem value="auto">Auto-regulação (por sensação)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA CORRIDA/CARDIO */}
            <TabsContent value="cardio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Corrida e Cardio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo e Frequência */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Tipo e Frequência</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Cardio Principal</Label>
                        <Select
                          value={config.cardio?.type || "running"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, type: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="running">Corrida (Outdoor/Esteira)</SelectItem>
                            <SelectItem value="cycling">Ciclismo</SelectItem>
                            <SelectItem value="swimming">Natação</SelectItem>
                            <SelectItem value="rowing">Remo</SelectItem>
                            <SelectItem value="elliptical">Elíptico</SelectItem>
                            <SelectItem value="walking">Caminhada</SelectItem>
                            <SelectItem value="hiit">HIIT</SelectItem>
                            <SelectItem value="mixed">Misto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Frequência Semanal</Label>
                        <Select
                          value={config.cardio?.frequency?.toString() || "3"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, frequency: Number.parseInt(v) },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Nenhuma</SelectItem>
                            <SelectItem value="1">1x por semana</SelectItem>
                            <SelectItem value="2">2x por semana</SelectItem>
                            <SelectItem value="3">3x por semana</SelectItem>
                            <SelectItem value="4">4x por semana</SelectItem>
                            <SelectItem value="5">5x por semana</SelectItem>
                            <SelectItem value="6">6x por semana</SelectItem>
                            <SelectItem value="7">Diariamente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Nível e Objetivo */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Nível e Objetivo</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nível de Corrida</Label>
                        <Select
                          value={config.cardio?.level || "beginner"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, level: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentário (Iniciando)</SelectItem>
                            <SelectItem value="beginner">Iniciante (0-3 meses)</SelectItem>
                            <SelectItem value="intermediate">Intermediário (3-12 meses)</SelectItem>
                            <SelectItem value="advanced">Avançado (1+ ano)</SelectItem>
                            <SelectItem value="athlete">Atleta/Competidor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Objetivo do Cardio</Label>
                        <Select
                          value={config.cardio?.goal || "general_fitness"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fat_loss">Queima de Gordura</SelectItem>
                            <SelectItem value="endurance">Resistência Aeróbica</SelectItem>
                            <SelectItem value="speed">Velocidade</SelectItem>
                            <SelectItem value="general_fitness">Condicionamento Geral</SelectItem>
                            <SelectItem value="recovery">Recuperação Ativa</SelectItem>
                            <SelectItem value="race_prep">Preparação para Prova</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Intensidade e Duração */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Intensidade e Duração</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Intensidade</Label>
                        <Select
                          value={config.cardio?.intensity || "moderate"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, intensity: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very_light">Muito Leve (50-60% FCM)</SelectItem>
                            <SelectItem value="light">Leve (60-70% FCM)</SelectItem>
                            <SelectItem value="moderate">Moderada (70-80% FCM)</SelectItem>
                            <SelectItem value="hard">Pesada (80-90% FCM)</SelectItem>
                            <SelectItem value="very_hard">Muito Pesada (90-95% FCM)</SelectItem>
                            <SelectItem value="interval">Intervalado (varia)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duração Mínima</Label>
                        <Select
                          value={config.cardio?.duration_min || "20"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, duration_min: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 min</SelectItem>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="20">20 min</SelectItem>
                            <SelectItem value="25">25 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duração Máxima</Label>
                        <Select
                          value={config.cardio?.duration_max || "40"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, duration_max: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="40">40 min</SelectItem>
                            <SelectItem value="50">50 min</SelectItem>
                            <SelectItem value="60">60 min</SelectItem>
                            <SelectItem value="90">90 min</SelectItem>
                            <SelectItem value="120">120+ min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Distância e Ritmo */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Distância e Ritmo (Corrida)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Distância Inicial</Label>
                        <Select
                          value={config.cardio?.distance_start || "3"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, distance_start: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 km</SelectItem>
                            <SelectItem value="2">2 km</SelectItem>
                            <SelectItem value="3">3 km</SelectItem>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="7">7 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Distância Meta</Label>
                        <Select
                          value={config.cardio?.distance_goal || "5"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, distance_goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="7">7 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                            <SelectItem value="15">15 km</SelectItem>
                            <SelectItem value="21">21 km (Meia Maratona)</SelectItem>
                            <SelectItem value="42">42 km (Maratona)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Ritmo Alvo</Label>
                        <Select
                          value={config.cardio?.pace || "6-7"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, pace: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8-10">8-10 min/km (Muito Leve)</SelectItem>
                            <SelectItem value="7-8">7-8 min/km (Leve)</SelectItem>
                            <SelectItem value="6-7">6-7 min/km (Moderado)</SelectItem>
                            <SelectItem value="5-6">5-6 min/km (Forte)</SelectItem>
                            <SelectItem value="4-5">4-5 min/km (Avançado)</SelectItem>
                            <SelectItem value="<4">&lt;4 min/km (Elite)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* HIIT */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Treino HIIT</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Trabalho (segundos)</Label>
                        <Select
                          value={config.cardio?.hiit_work || "30"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, hiit_work: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20">20s</SelectItem>
                            <SelectItem value="30">30s</SelectItem>
                            <SelectItem value="40">40s</SelectItem>
                            <SelectItem value="45">45s</SelectItem>
                            <SelectItem value="60">60s</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Descanso (segundos)</Label>
                        <Select
                          value={config.cardio?.hiit_rest || "30"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, hiit_rest: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10s</SelectItem>
                            <SelectItem value="20">20s</SelectItem>
                            <SelectItem value="30">30s</SelectItem>
                            <SelectItem value="45">45s</SelectItem>
                            <SelectItem value="60">60s</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Número de Rounds</Label>
                        <Select
                          value={config.cardio?.hiit_rounds || "8"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, hiit_rounds: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[4, 6, 8, 10, 12, 15, 20].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n} rounds
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Preferências */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Preferências</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Inclinar Esteira</Label>
                          <p className="text-xs text-muted-foreground">Usar inclinação para aumentar dificuldade</p>
                        </div>
                        <Switch
                          checked={config.cardio?.use_incline ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, use_incline: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Intervalado</Label>
                          <p className="text-xs text-muted-foreground">Alternar entre alta e baixa intensidade</p>
                        </div>
                        <Switch
                          checked={config.cardio?.use_intervals ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, use_intervals: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Fartlek</Label>
                          <p className="text-xs text-muted-foreground">Variações aleatórias de ritmo</p>
                        </div>
                        <Switch
                          checked={config.cardio?.use_fartlek ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              cardio: { ...config.cardio, use_fartlek: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA NUTRIÇÃO */}
            <TabsContent value="nutrition" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Nutrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Objetivo e Tipo de Dieta */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Objetivo e Tipo de Dieta</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Objetivo Calórico</Label>
                        <Select
                          value={config.nutrition?.caloric_goal || "maintain"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, caloric_goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aggressive_cut">Déficit Agressivo (-1000 kcal)</SelectItem>
                            <SelectItem value="cut">Déficit Moderado (-500 kcal)</SelectItem>
                            <SelectItem value="mild_cut">Déficit Leve (-300 kcal)</SelectItem>
                            <SelectItem value="maintain">Manutenção</SelectItem>
                            <SelectItem value="mild_bulk">Superávit Leve (+300 kcal)</SelectItem>
                            <SelectItem value="bulk">Superávit Moderado (+500 kcal)</SelectItem>
                            <SelectItem value="aggressive_bulk">Superávit Agressivo (+1000 kcal)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Tipo de Dieta</Label>
                        <Select
                          value={config.nutrition?.diet_type || "balanced"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, diet_type: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanceada</SelectItem>
                            <SelectItem value="low_carb">Low Carb</SelectItem>
                            <SelectItem value="keto">Cetogênica (Keto)</SelectItem>
                            <SelectItem value="high_protein">Alta Proteína</SelectItem>
                            <SelectItem value="paleo">Paleo</SelectItem>
                            <SelectItem value="mediterranean">Mediterrânea</SelectItem>
                            <SelectItem value="vegetarian">Vegetariana</SelectItem>
                            <SelectItem value="vegan">Vegana</SelectItem>
                            <SelectItem value="flexible">Flexível (IIFYM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Calorias */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Calorias Diárias</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Meta Calórica (kcal/dia)</Label>
                        <Input
                          type="number"
                          step="50"
                          value={config.nutrition?.daily_calories || 2000}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, daily_calories: Number.parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Cálculo Automático</Label>
                        <Select defaultValue="manual">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="harris">Harris-Benedict</SelectItem>
                            <SelectItem value="mifflin">Mifflin-St Jeor</SelectItem>
                            <SelectItem value="katch">Katch-McArdle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Macronutrientes */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Distribuição de Macronutrientes</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Preset de Macros</Label>
                        <Select
                          value={config.nutrition?.macro_preset || "balanced"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, macro_preset: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanceado (40/30/30)</SelectItem>
                            <SelectItem value="high_protein">Alta Proteína (40/40/20)</SelectItem>
                            <SelectItem value="low_carb">Low Carb (20/50/30)</SelectItem>
                            <SelectItem value="keto">Keto (5/30/65)</SelectItem>
                            <SelectItem value="endurance">Endurance (55/20/25)</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Proteína (g/dia)</Label>
                          <Input
                            type="number"
                            value={config.nutrition?.protein_grams || 150}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                nutrition: { ...config.nutrition, protein_grams: Number.parseInt(e.target.value) },
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(
                              (((config.nutrition?.protein_grams || 150) * 4) /
                                (config.nutrition?.daily_calories || 2000)) *
                              100
                            ).toFixed(0)}
                            % das calorias
                          </p>
                        </div>

                        <div>
                          <Label>Carboidratos (g/dia)</Label>
                          <Input
                            type="number"
                            value={config.nutrition?.carbs_grams || 200}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                nutrition: { ...config.nutrition, carbs_grams: Number.parseInt(e.target.value) },
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(
                              (((config.nutrition?.carbs_grams || 200) * 4) /
                                (config.nutrition?.daily_calories || 2000)) *
                              100
                            ).toFixed(0)}
                            % das calorias
                          </p>
                        </div>

                        <div>
                          <Label>Gorduras (g/dia)</Label>
                          <Input
                            type="number"
                            value={config.nutrition?.fats_grams || 60}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                nutrition: { ...config.nutrition, fats_grams: Number.parseInt(e.target.value) },
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(
                              (((config.nutrition?.fats_grams || 60) * 9) /
                                (config.nutrition?.daily_calories || 2000)) *
                              100
                            ).toFixed(0)}
                            % das calorias
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Refeições */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Frequência de Refeições</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Número de Refeições</Label>
                        <Select
                          value={config.nutrition?.meals_per_day || "5"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, meals_per_day: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 refeições (IF)</SelectItem>
                            <SelectItem value="3">3 refeições</SelectItem>
                            <SelectItem value="4">4 refeições</SelectItem>
                            <SelectItem value="5">5 refeições</SelectItem>
                            <SelectItem value="6">6 refeições</SelectItem>
                            <SelectItem value="7">7+ refeições</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Janela Alimentar</Label>
                        <Select
                          value={config.nutrition?.eating_window || "12-14"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, eating_window: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4-6">4-6 horas (OMAD)</SelectItem>
                            <SelectItem value="6-8">6-8 horas (IF 16/8)</SelectItem>
                            <SelectItem value="8-10">8-10 horas (IF 14/10)</SelectItem>
                            <SelectItem value="10-12">10-12 horas</SelectItem>
                            <SelectItem value="12-14">12-14 horas</SelectItem>
                            <SelectItem value="all_day">Dia todo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Hidratação */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Hidratação</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Meta de Água (ml/dia)</Label>
                        <Select
                          value={config.nutrition?.water_goal || "2000"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, water_goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1500">1.5L (1500ml)</SelectItem>
                            <SelectItem value="2000">2.0L (2000ml)</SelectItem>
                            <SelectItem value="2500">2.5L (2500ml)</SelectItem>
                            <SelectItem value="3000">3.0L (3000ml)</SelectItem>
                            <SelectItem value="3500">3.5L (3500ml)</SelectItem>
                            <SelectItem value="4000">4.0L (4000ml)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Cálculo por Peso</Label>
                        <Select defaultValue="35">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 ml/kg</SelectItem>
                            <SelectItem value="35">35 ml/kg (recomendado)</SelectItem>
                            <SelectItem value="40">40 ml/kg</SelectItem>
                            <SelectItem value="45">45 ml/kg (atleta)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Preferências Alimentares */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Preferências e Restrições</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Jejum Intermitente</Label>
                          <p className="text-xs text-muted-foreground">Protocolo de jejum</p>
                        </div>
                        <Switch
                          checked={config.nutrition?.intermittent_fasting ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, intermittent_fasting: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Ciclagem de Carboidratos</Label>
                          <p className="text-xs text-muted-foreground">Variar carbos por dia</p>
                        </div>
                        <Switch
                          checked={config.nutrition?.carb_cycling ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, carb_cycling: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Refeed/Cheat Meal</Label>
                          <p className="text-xs text-muted-foreground">Refeição livre semanal</p>
                        </div>
                        <Switch
                          checked={config.nutrition?.cheat_meal ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              nutrition: { ...config.nutrition, cheat_meal: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA SUPLEMENTOS */}
            <TabsContent value="supplements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Suplementação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Objetivo da Suplementação */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Objetivo e Nível</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Objetivo da Suplementação</Label>
                        <Select
                          value={config.supplements?.goal || "performance"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, goal: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health">Saúde Geral</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="muscle_gain">Ganho de Massa</SelectItem>
                            <SelectItem value="fat_loss">Perda de Gordura</SelectItem>
                            <SelectItem value="recovery">Recuperação</SelectItem>
                            <SelectItem value="energy">Energia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Nível de Suplementação</Label>
                        <Select
                          value={config.supplements?.level || "basic"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, level: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma</SelectItem>
                            <SelectItem value="basic">Básico (1-3 itens)</SelectItem>
                            <SelectItem value="intermediate">Intermediário (4-6 itens)</SelectItem>
                            <SelectItem value="advanced">Avançado (7+ itens)</SelectItem>
                            <SelectItem value="pro">Profissional/Competição</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Suplementos Essenciais */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Suplementos Essenciais</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Whey Protein</Label>
                          <p className="text-xs text-muted-foreground">Proteína de soro do leite</p>
                        </div>
                        <Switch
                          checked={config.supplements?.whey ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, whey: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Creatina</Label>
                          <p className="text-xs text-muted-foreground">Monohidratada 3-5g/dia</p>
                        </div>
                        <Switch
                          checked={config.supplements?.creatine ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, creatine: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>BCAA</Label>
                          <p className="text-xs text-muted-foreground">Aminoácidos de cadeia ramificada</p>
                        </div>
                        <Switch
                          checked={config.supplements?.bcaa ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, bcaa: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Glutamina</Label>
                          <p className="text-xs text-muted-foreground">Recuperação e imunidade</p>
                        </div>
                        <Switch
                          checked={config.supplements?.glutamine ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, glutamine: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Multivitamínico</Label>
                          <p className="text-xs text-muted-foreground">Vitaminas e minerais</p>
                        </div>
                        <Switch
                          checked={config.supplements?.multivitamin ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, multivitamin: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Ômega 3</Label>
                          <p className="text-xs text-muted-foreground">Saúde cardiovascular</p>
                        </div>
                        <Switch
                          checked={config.supplements?.omega3 ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, omega3: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pré-Treino */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Pré-Treino</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Cafeína</Label>
                          <p className="text-xs text-muted-foreground">Estimulante, foco e energia</p>
                        </div>
                        <Switch
                          checked={config.supplements?.caffeine ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, caffeine: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Beta-Alanina</Label>
                          <p className="text-xs text-muted-foreground">Resistência muscular</p>
                        </div>
                        <Switch
                          checked={config.supplements?.beta_alanine ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, beta_alanine: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Citrulina Malato</Label>
                          <p className="text-xs text-muted-foreground">Pump e vasodilatação</p>
                        </div>
                        <Switch
                          checked={config.supplements?.citrulline ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, citrulline: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Queima de Gordura */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Queima de Gordura</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Termogênico</Label>
                          <p className="text-xs text-muted-foreground">Acelerador metabólico</p>
                        </div>
                        <Switch
                          checked={config.supplements?.thermogenic ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, thermogenic: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>L-Carnitina</Label>
                          <p className="text-xs text-muted-foreground">Transporte de gordura</p>
                        </div>
                        <Switch
                          checked={config.supplements?.carnitine ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, carnitine: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>CLA</Label>
                          <p className="text-xs text-muted-foreground">Ácido linoleico conjugado</p>
                        </div>
                        <Switch
                          checked={config.supplements?.cla ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, cla: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Outros Suplementos */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Outros Suplementos</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>ZMA</Label>
                          <p className="text-xs text-muted-foreground">Zinco, Magnésio, B6 - Sono e recuperação</p>
                        </div>
                        <Switch
                          checked={config.supplements?.zma ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, zma: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Vitamina D</Label>
                          <p className="text-xs text-muted-foreground">Imunidade e saúde óssea</p>
                        </div>
                        <Switch
                          checked={config.supplements?.vitamin_d ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, vitamin_d: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Probióticos</Label>
                          <p className="text-xs text-muted-foreground">Saúde intestinal</p>
                        </div>
                        <Switch
                          checked={config.supplements?.probiotics ?? false}
                          onCheckedChange={(checked) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, probiotics: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Timing */}
                  <div>
                    <h3 className="font-semibold mb-4 text-base">Timing de Suplementação</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Janela Pré-Treino</Label>
                        <Select
                          value={config.supplements?.pre_timing || "30"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, pre_timing: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 min antes</SelectItem>
                            <SelectItem value="30">30 min antes</SelectItem>
                            <SelectItem value="45">45 min antes</SelectItem>
                            <SelectItem value="60">60 min antes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Janela Pós-Treino</Label>
                        <Select
                          value={config.supplements?.post_timing || "30"}
                          onValueChange={(v) =>
                            setConfig({
                              ...config,
                              supplements: { ...config.supplements, post_timing: v },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Imediatamente</SelectItem>
                            <SelectItem value="15">15 min depois</SelectItem>
                            <SelectItem value="30">30 min depois</SelectItem>
                            <SelectItem value="60">60 min depois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={saveConfig} disabled={saving} className="flex-1">
              {saving ? "Salvando..." : "Atualizar Usuário"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
