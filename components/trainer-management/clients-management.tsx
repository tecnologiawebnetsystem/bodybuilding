"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, UserPlus, ArrowLeft, ArrowRight, Loader2, CheckCircle, Trash2, Eye, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const WIZARD_STEPS = 6

export function TrainerClientsManagement({ trainerId }: { trainerId: string }) {
  const [clients, setClients] = useState<any[]>([])
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "", cpf: "", pin: "", email: "", phone: "", age: 25, gender: "Masculino",
    height: 170, currentWeight: 70, targetWeight: 70, primaryGoal: "gain_muscle",
    goalIntensity: "moderate", trainingExperience: "beginner", gymFrequency: 4,
    preferredSplit: "abc", sessionDuration: 60, includeHomeWorkouts: false,
    homeFrequency: 0, homeFocus: [] as string[], includeRunning: false, runningFrequency: 0,
    runningLevel: "beginner", includeSupplements: false, supplements: [] as string[],
    includeNutrition: false, dietType: "balanced", mealsPerDay: 4,
    foodRestrictions: [] as string[], injuriesLimitations: "", monthlyFee: 350,
  })

  useEffect(() => {
    loadClients()
  }, [trainerId])

  const loadClients = async () => {
    try {
      const res = await fetch(`/api/trainer/clients?trainerId=${trainerId}`)
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetNewClient = () => {
    setNewClient({
      name: "", cpf: "", pin: "", email: "", phone: "", age: 25, gender: "Masculino",
      height: 170, currentWeight: 70, targetWeight: 70, primaryGoal: "gain_muscle",
      goalIntensity: "moderate", trainingExperience: "beginner", gymFrequency: 4,
      preferredSplit: "abc", sessionDuration: 60, includeHomeWorkouts: false,
      homeFrequency: 0, homeFocus: [], includeRunning: false, runningFrequency: 0,
      runningLevel: "beginner", includeSupplements: false, supplements: [],
      includeNutrition: false, dietType: "balanced", mealsPerDay: 4,
      foodRestrictions: [], injuriesLimitations: "", monthlyFee: 350,
    })
  }

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = (newClient as any)[field] || []
    if (currentArray.includes(value)) {
      setNewClient({ ...newClient, [field]: currentArray.filter((item: string) => item !== value) })
    } else {
      setNewClient({ ...newClient, [field]: [...currentArray, value] })
    }
  }

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.cpf) {
      toast({ title: "Erro", description: "Nome e CPF sao obrigatorios", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/trainer/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newClient, trainerId }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: "Aluno cadastrado!", description: `PIN de acesso: ${data.pin}` })
        setIsAddingClient(false)
        setWizardStep(1)
        resetNewClient()
        loadClients()
      } else {
        throw new Error(data.message || "Erro ao cadastrar")
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClient = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return
    try {
      const res = await fetch(`/api/trainer/clients/${userId}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Sucesso", description: "Aluno excluido" })
        loadClients()
      }
    } catch (error) {
      toast({ title: "Erro", description: "Nao foi possivel excluir", variant: "destructive" })
    }
  }

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Alunos</h2>
          <p className="text-gray-400 mt-1">Gerencie seus clientes e contratos</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          onClick={() => setIsAddingClient(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aluno cadastrado ainda</p>
              <p className="text-sm mt-2">Clique em "Novo Aluno" para comecar</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client) => (
                <div key={client.user_id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                      {client.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{client.name}</p>
                      <p className="text-sm text-gray-400">{client.cpf}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteClient(client.user_id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* WIZARD DE NOVO ALUNO */}
      <Dialog open={isAddingClient} onOpenChange={(open) => { setIsAddingClient(open); if (!open) { setWizardStep(1); resetNewClient(); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Aluno</DialogTitle>
            <DialogDescription className="text-gray-400">Passo {wizardStep} de {WIZARD_STEPS}</DialogDescription>
            <Progress value={(wizardStep / WIZARD_STEPS) * 100} className="h-2 mt-2" />
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ETAPA 1: Dados Basicos */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Basicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome Completo *</Label>
                    <Input value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} placeholder="Nome do aluno" className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>CPF *</Label>
                    <Input value={newClient.cpf} onChange={(e) => setNewClient({...newClient, cpf: e.target.value})} placeholder="000.000.000-00" className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>PIN (6 digitos) - deixe vazio para gerar automatico</Label>
                    <Input value={newClient.pin} onChange={(e) => setNewClient({...newClient, pin: e.target.value})} placeholder="000000" maxLength={6} className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} placeholder="email@exemplo.com" type="email" className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} placeholder="(00) 00000-0000" className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Idade</Label>
                    <Input type="number" value={newClient.age} onChange={(e) => setNewClient({...newClient, age: Number(e.target.value)})} className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Sexo</Label>
                    <Select value={newClient.gender} onValueChange={(v) => setNewClient({...newClient, gender: v})}>
                      <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-gray-800 border-white/20">
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Altura (cm)</Label>
                    <Input type="number" value={newClient.height} onChange={(e) => setNewClient({...newClient, height: Number(e.target.value)})} className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Peso Atual (kg)</Label>
                    <Input type="number" value={newClient.currentWeight} onChange={(e) => setNewClient({...newClient, currentWeight: Number(e.target.value)})} className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Peso Meta (kg)</Label>
                    <Input type="number" value={newClient.targetWeight} onChange={(e) => setNewClient({...newClient, targetWeight: Number(e.target.value)})} className="bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <Label>Mensalidade (R$)</Label>
                    <Input type="number" value={newClient.monthlyFee} onChange={(e) => setNewClient({...newClient, monthlyFee: Number(e.target.value)})} className="bg-white/10 border-white/20" />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: Objetivo */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Objetivo e Experiencia</h3>
                <div>
                  <Label>Objetivo Principal</Label>
                  <RadioGroup value={newClient.primaryGoal} onValueChange={(v) => setNewClient({...newClient, primaryGoal: v})}>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[{v:"lose_weight",l:"Emagrecimento"},{v:"gain_muscle",l:"Ganho de Massa"},{v:"maintain",l:"Manutencao"},{v:"athletic",l:"Performance"}].map(({v,l}) => (
                        <div key={v} className="flex items-center space-x-2 p-3 border border-white/20 rounded-lg bg-white/5">
                          <RadioGroupItem value={v} id={v} />
                          <Label htmlFor={v}>{l}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Intensidade</Label>
                  <Select value={newClient.goalIntensity} onValueChange={(v) => setNewClient({...newClient, goalIntensity: v})}>
                    <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="light">Leve</SelectItem>
                      <SelectItem value="moderate">Moderada</SelectItem>
                      <SelectItem value="intense">Intensa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experiencia</Label>
                  <Select value={newClient.trainingExperience} onValueChange={(v) => setNewClient({...newClient, trainingExperience: v})}>
                    <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediario</SelectItem>
                      <SelectItem value="advanced">Avancado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* ETAPA 3: Treino */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Treino</h3>
                <div>
                  <Label>Frequencia Semanal: {newClient.gymFrequency}x</Label>
                  <Slider value={[newClient.gymFrequency]} onValueChange={(v) => setNewClient({...newClient, gymFrequency: v[0]})} max={7} min={1} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Divisao de Treino</Label>
                  <Select value={newClient.preferredSplit} onValueChange={(v) => setNewClient({...newClient, preferredSplit: v})}>
                    <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="full_body">Full Body</SelectItem>
                      <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                      <SelectItem value="abc">ABC</SelectItem>
                      <SelectItem value="abcd">ABCD</SelectItem>
                      <SelectItem value="ppl">Push/Pull/Legs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duracao: {newClient.sessionDuration} min</Label>
                  <Slider value={[newClient.sessionDuration]} onValueChange={(v) => setNewClient({...newClient, sessionDuration: v[0]})} min={30} max={120} step={15} className="mt-2" />
                </div>
              </div>
            )}

            {/* ETAPA 4: Calistenia e Corrida */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Calistenia / Treino em Casa</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newClient.includeHomeWorkouts} onCheckedChange={(c) => setNewClient({...newClient, includeHomeWorkouts: !!c})} />
                    <Label>Incluir treinos em casa</Label>
                  </div>
                  {newClient.includeHomeWorkouts && (
                    <>
                      <div>
                        <Label>Frequencia: {newClient.homeFrequency}x</Label>
                        <Slider value={[newClient.homeFrequency]} onValueChange={(v) => setNewClient({...newClient, homeFrequency: v[0]})} max={7} step={1} className="mt-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["Cardio", "Forca", "Flexibilidade", "Core"].map((f) => (
                          <div key={f} className="flex items-center space-x-2 p-2 border border-white/20 rounded bg-white/5">
                            <Checkbox checked={newClient.homeFocus.includes(f)} onCheckedChange={() => toggleArrayItem("homeFocus", f)} />
                            <Label>{f}</Label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4 border-t border-white/20 pt-4">
                  <h3 className="font-semibold text-lg">Corrida</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newClient.includeRunning} onCheckedChange={(c) => setNewClient({...newClient, includeRunning: !!c})} />
                    <Label>Incluir corrida</Label>
                  </div>
                  {newClient.includeRunning && (
                    <>
                      <div>
                        <Label>Nivel</Label>
                        <Select value={newClient.runningLevel} onValueChange={(v) => setNewClient({...newClient, runningLevel: v})}>
                          <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-gray-800 border-white/20">
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediario</SelectItem>
                            <SelectItem value="advanced">Avancado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Frequencia: {newClient.runningFrequency}x</Label>
                        <Slider value={[newClient.runningFrequency]} onValueChange={(v) => setNewClient({...newClient, runningFrequency: v[0]})} max={7} step={1} className="mt-2" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 5: Suplementacao */}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Suplementacao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newClient.includeSupplements} onCheckedChange={(c) => setNewClient({...newClient, includeSupplements: !!c})} />
                    <Label>Incluir suplementacao</Label>
                  </div>
                  {newClient.includeSupplements && (
                    <div className="grid grid-cols-2 gap-2">
                      {["Whey Protein", "Creatina", "BCAA", "Pre-Treino", "Glutamina", "Multivitaminico"].map((s) => (
                        <div key={s} className="flex items-center space-x-2 p-2 border border-white/20 rounded bg-white/5">
                          <Checkbox checked={newClient.supplements.includes(s)} onCheckedChange={() => toggleArrayItem("supplements", s)} />
                          <Label>{s}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4 border-t border-white/20 pt-4">
                  <h3 className="font-semibold text-lg">Nutricao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newClient.includeNutrition} onCheckedChange={(c) => setNewClient({...newClient, includeNutrition: !!c})} />
                    <Label>Incluir plano nutricional</Label>
                  </div>
                  {newClient.includeNutrition && (
                    <>
                      <div>
                        <Label>Tipo de Dieta</Label>
                        <Select value={newClient.dietType} onValueChange={(v) => setNewClient({...newClient, dietType: v})}>
                          <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-gray-800 border-white/20">
                            <SelectItem value="balanced">Equilibrada</SelectItem>
                            <SelectItem value="low_carb">Low Carb</SelectItem>
                            <SelectItem value="keto">Cetogenica</SelectItem>
                            <SelectItem value="vegetarian">Vegetariana</SelectItem>
                            <SelectItem value="vegan">Vegana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["Lactose", "Gluten", "Frutos do Mar", "Amendoim", "Ovo"].map((r) => (
                          <div key={r} className="flex items-center space-x-2 p-2 border border-white/20 rounded bg-white/5">
                            <Checkbox checked={newClient.foodRestrictions.includes(r)} onCheckedChange={() => toggleArrayItem("foodRestrictions", r)} />
                            <Label>{r}</Label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 6: Finalizacao */}
            {wizardStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Restricoes e Observacoes</h3>
                <div>
                  <Label>Lesoes ou Limitacoes</Label>
                  <Textarea 
                    value={newClient.injuriesLimitations} 
                    onChange={(e) => setNewClient({...newClient, injuriesLimitations: e.target.value})} 
                    placeholder="Descreva qualquer lesao ou limitacao..."
                    rows={3}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-2">Resumo</h4>
                  <div className="text-sm text-green-300 space-y-1">
                    <p><strong>Nome:</strong> {newClient.name}</p>
                    <p><strong>CPF:</strong> {newClient.cpf}</p>
                    <p><strong>Mensalidade:</strong> R$ {newClient.monthlyFee}</p>
                    <p><strong>Objetivo:</strong> {newClient.primaryGoal === "gain_muscle" ? "Ganho de Massa" : newClient.primaryGoal === "lose_weight" ? "Emagrecimento" : newClient.primaryGoal === "maintain" ? "Manutencao" : "Performance"}</p>
                    <p><strong>Frequencia:</strong> {newClient.gymFrequency}x/semana</p>
                    <p><strong>Divisao:</strong> {newClient.preferredSplit.toUpperCase()}</p>
                    {newClient.includeHomeWorkouts && <p><strong>Calistenia:</strong> {newClient.homeFrequency}x/semana</p>}
                    {newClient.includeRunning && <p><strong>Corrida:</strong> {newClient.runningFrequency}x/semana</p>}
                    {newClient.includeSupplements && <p><strong>Suplementos:</strong> {newClient.supplements.join(", ") || "Nenhum"}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setIsAddingClient(false)} className="border-white/20 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {wizardStep === 1 ? "Cancelar" : "Voltar"}
            </Button>
            {wizardStep < WIZARD_STEPS ? (
              <Button onClick={() => setWizardStep(wizardStep + 1)} className="bg-gradient-to-r from-orange-500 to-red-600">
                Proximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleAddClient} disabled={isSaving} className="bg-gradient-to-r from-green-500 to-emerald-600">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {isSaving ? "Salvando..." : "Cadastrar Aluno"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
