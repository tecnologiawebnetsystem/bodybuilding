"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Dumbbell, MapPin, Clock, Droplets, Pill } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function TrainerWorkoutsManagement({ trainerId }: { trainerId: string }) {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false)
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestão de Treinos</h2>
          <p className="text-gray-400 mt-1">Crie treinos por modalidade e local de atendimento</p>
        </div>
        <Dialog open={isCreatingWorkout} onOpenChange={setIsCreatingWorkout}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Criar Novo Treino</DialogTitle>
            </DialogHeader>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Aluno</Label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione o aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Data do Treino</Label>
                  <Input type="date" className="bg-white/10 border-white/20 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" />
                    Modalidade
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Escolha a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="musculacao">Musculação</SelectItem>
                      <SelectItem value="corrida">Corrida/Cardio</SelectItem>
                      <SelectItem value="funcional">Treino Funcional</SelectItem>
                      <SelectItem value="casa">Treino em Casa</SelectItem>
                      <SelectItem value="crossfit">CrossFit</SelectItem>
                      <SelectItem value="pilates">Pilates</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Local de Atendimento
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Onde será o treino?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academia1">Academia SmartFit</SelectItem>
                      <SelectItem value="casa">Casa do Aluno</SelectItem>
                      <SelectItem value="parque">Parque Ibirapuera</SelectItem>
                      <SelectItem value="online">Online (Videochamada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duração (minutos)
                </Label>
                <Input
                  type="number"
                  placeholder="60"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Exercícios do Treino</Label>
                <Textarea
                  placeholder="Ex: Supino 3x12, Agachamento 4x10..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Meta de Água (Litros)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Suplementos
                  </Label>
                  <Input
                    placeholder="Ex: Whey, Creatina..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Observações</Label>
                <Textarea
                  placeholder="Anotações extras sobre o treino..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                Salvar Treino
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        <Card className="bg-white/5 border-white/10 text-center py-12">
          <CardContent>
            <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-400">Nenhum treino criado ainda</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Criar Treino" para começar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
