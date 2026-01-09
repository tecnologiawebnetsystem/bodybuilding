"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { UserPlus, Edit, Trash2, LogOut } from "lucide-react"

interface User {
  user_id: string
  name: string
  pin: string
  height: number
  target_weight: number
  current_weight: number
  gender: string
  age: number
  theme_primary: string
  theme_secondary: string
  theme_accent: string
  enable_gym_checkin: boolean
  enable_gym_workouts: boolean
  enable_running: boolean
  enable_home_workouts: boolean
  enable_nutrition: boolean
  enable_supplements: boolean
  enable_measurements: boolean
  enable_hydration: boolean
  enable_stats: boolean
  workout_type: string
  workout_goal: string
  running_level: string
  nutrition_goal: string
  home_workout_focus: string
}

export function AdminPanel({ adminUsername, onLogout }: { adminUsername: string; onLogout: () => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    }
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({
      user_id: "",
      name: "",
      pin: "",
      height: 170,
      target_weight: 70,
      current_weight: 70,
      gender: "male",
      age: 25,
      theme_primary: "#3b82f6",
      theme_secondary: "#1e40af",
      theme_accent: "#06b6d4",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: true,
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
      workout_type: "hypertrophy",
      workout_goal: "maintain",
      running_level: "beginner",
      nutrition_goal: "maintain",
      home_workout_focus: "balanced",
    })
    setShowUserDialog(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData(user)
    setShowUserDialog(true)
  }

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminUsername,
            userId: editingUser.user_id,
            user: formData,
            preferences: formData,
          }),
        })
      } else {
        // Criar novo usuário
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminUsername,
            user: {
              ...formData,
              preferences: formData,
            },
          }),
        })
      }

      setShowUserDialog(false)
      loadUsers()
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      await fetch(`/api/admin/users?userId=${userId}&adminUsername=${adminUsername}`, {
        method: "DELETE",
      })
      loadUsers()
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
            <p className="text-slate-600">Gerenciar usuários do FitTransform</p>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-slate-600 flex items-center">
              Logado como: <strong className="ml-1">{adminUsername}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Botão Novo Usuário */}
        <div className="mb-6">
          <Button onClick={handleCreateUser} size="lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Lista de Usuários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.user_id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-600">@{user.user_id}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.user_id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">PIN:</span>
                  <span className="font-mono font-medium">{user.pin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gênero:</span>
                  <span className="font-medium">{user.gender === "male" ? "Masculino" : "Feminino"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Peso Atual:</span>
                  <span className="font-medium">{user.current_weight}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Meta:</span>
                  <span className="font-medium">{user.target_weight}kg</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Funcionalidades Ativas:</p>
                <div className="flex flex-wrap gap-1">
                  {user.enable_gym_workouts && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Academia</span>
                  )}
                  {user.enable_running && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Corrida</span>
                  )}
                  {user.enable_home_workouts && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Casa</span>
                  )}
                  {user.enable_nutrition && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Nutrição</span>
                  )}
                  {user.enable_supplements && (
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Suplementos</span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-1">
                <div className="w-1/3 h-2 rounded" style={{ backgroundColor: user.theme_primary }} />
                <div className="w-1/3 h-2 rounded" style={{ backgroundColor: user.theme_secondary }} />
                <div className="w-1/3 h-2 rounded" style={{ backgroundColor: user.theme_accent }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Dialog de Edição/Criação */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Dados Básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Username (ID)</Label>
                  <Input
                    value={formData.user_id || ""}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <Label>PIN (6 dígitos)</Label>
                  <Input
                    value={formData.pin || ""}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label>Gênero</Label>
                  <Select
                    value={formData.gender || "male"}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Altura (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height || 170}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Idade</Label>
                  <Input
                    type="number"
                    value={formData.age || 25}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Peso Atual (kg)</Label>
                  <Input
                    type="number"
                    value={formData.current_weight || 70}
                    onChange={(e) => setFormData({ ...formData, current_weight: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Peso Desejado (kg)</Label>
                  <Input
                    type="number"
                    value={formData.target_weight || 70}
                    onChange={(e) => setFormData({ ...formData, target_weight: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Tema de Cores */}
              <div>
                <h3 className="font-semibold mb-3">Tema de Cores</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Cor Primária</Label>
                    <Input
                      type="color"
                      value={formData.theme_primary || "#3b82f6"}
                      onChange={(e) => setFormData({ ...formData, theme_primary: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Cor Secundária</Label>
                    <Input
                      type="color"
                      value={formData.theme_secondary || "#1e40af"}
                      onChange={(e) => setFormData({ ...formData, theme_secondary: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Cor Destaque</Label>
                    <Input
                      type="color"
                      value={formData.theme_accent || "#06b6d4"}
                      onChange={(e) => setFormData({ ...formData, theme_accent: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Funcionalidades */}
              <div>
                <h3 className="font-semibold mb-3">Funcionalidades Ativas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Check-in Academia</Label>
                    <Switch
                      checked={formData.enable_gym_checkin || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_gym_checkin: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Treinos Academia</Label>
                    <Switch
                      checked={formData.enable_gym_workouts || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_gym_workouts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Corrida</Label>
                    <Switch
                      checked={formData.enable_running || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_running: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Treino em Casa</Label>
                    <Switch
                      checked={formData.enable_home_workouts || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_home_workouts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Nutrição</Label>
                    <Switch
                      checked={formData.enable_nutrition || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_nutrition: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Suplementos</Label>
                    <Switch
                      checked={formData.enable_supplements || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_supplements: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Configurações Avançadas */}
              <div>
                <h3 className="font-semibold mb-3">Configurações de Treino</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Treino</Label>
                    <Select
                      value={formData.workout_type || "hypertrophy"}
                      onValueChange={(value) => setFormData({ ...formData, workout_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                        <SelectItem value="weight_loss">Emagrecimento</SelectItem>
                        <SelectItem value="endurance">Resistência</SelectItem>
                        <SelectItem value="strength">Força</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Objetivo</Label>
                    <Select
                      value={formData.workout_goal || "maintain"}
                      onValueChange={(value) => setFormData({ ...formData, workout_goal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Perder Peso</SelectItem>
                        <SelectItem value="gain_weight">Ganhar Peso</SelectItem>
                        <SelectItem value="gain_muscle">Ganhar Massa</SelectItem>
                        <SelectItem value="maintain">Manter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nível de Corrida</Label>
                    <Select
                      value={formData.running_level || "beginner"}
                      onValueChange={(value) => setFormData({ ...formData, running_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Foco Casa</Label>
                    <Select
                      value={formData.home_workout_focus || "balanced"}
                      onValueChange={(value) => setFormData({ ...formData, home_workout_focus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="strength">Força</SelectItem>
                        <SelectItem value="flexibility">Flexibilidade</SelectItem>
                        <SelectItem value="balanced">Equilibrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveUser}>{editingUser ? "Atualizar" : "Criar"} Usuário</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
