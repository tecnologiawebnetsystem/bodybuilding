"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function TrainerClientsManagement({ trainerId }: { trainerId: string }) {
  const [clients, setClients] = useState<any[]>([])
  const [isAddingClient, setIsAddingClient] = useState(false)
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Alunos</h2>
          <p className="text-gray-400 mt-1">Gerencie seus clientes e contratos</p>
        </div>
        <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Cadastrar Novo Aluno</DialogTitle>
              <DialogDescription className="text-gray-400">Preencha os dados do seu novo cliente</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-white">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="joao@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_fee" className="text-white">
                    Mensalidade (R$)
                  </Label>
                  <Input
                    id="monthly_fee"
                    type="number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="350.00"
                  />
                </div>
                <div>
                  <Label htmlFor="contract_start" className="text-white">
                    Início do Contrato
                  </Label>
                  <Input id="contract_start" type="date" className="bg-white/10 border-white/20 text-white" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar Aluno
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Lista de alunos será renderizada aqui */}
            <div className="text-center py-12 text-gray-400">
              <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aluno cadastrado ainda</p>
              <p className="text-sm mt-2">Clique em "Adicionar Aluno" para começar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
