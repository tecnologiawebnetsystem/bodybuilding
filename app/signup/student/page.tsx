"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function StudentSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    age: "",
    gender: "",
    pin: "",
    confirmPin: "",
  })

  const handleSubmit = async () => {
    if (formData.pin !== formData.confirmPin) {
      toast({ title: "Os PINs não coincidem", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/signup/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: "Cadastro realizado com sucesso!" })
        router.push(`/app-mobile`)
      } else {
        toast({ title: data.message || "Erro ao cadastrar", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao cadastrar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-md mx-auto py-12">
        <Button variant="ghost" onClick={() => router.push("/get-started")} className="mb-6 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-white/5 border-white/10 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cadastro de Aluno</h1>
          <p className="text-gray-400 mb-8">Preencha seus dados para começar a treinar</p>

          <div className="space-y-4">
            <div>
              <Label className="text-white">Nome Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label className="text-white">CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label className="text-white">Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Idade</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label className="text-white">Gênero</Label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-10 rounded-md bg-white/10 border border-white/20 text-white px-3"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-white">PIN de Acesso (6 dígitos)</Label>
              <Input
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="******"
                maxLength={6}
              />
            </div>

            <div>
              <Label className="text-white">Confirme o PIN</Label>
              <Input
                type="password"
                value={formData.confirmPin}
                onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="******"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-600 to-red-500"
              disabled={loading || !formData.name || !formData.cpf || formData.pin.length !== 6}
            >
              {loading ? "Cadastrando..." : "Criar Conta"}
            </Button>

            <p className="text-sm text-gray-400 text-center mt-4">
              Depois você pode se vincular a uma academia ou personal trainer
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
