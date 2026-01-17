"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function TrainerSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    pin: "",
    confirmPin: "",
    businessName: "",
    cnpj: "",
    cref: "",
    specialties: "",
    bio: "",
  })

  const handleSubmit = async () => {
    if (formData.pin !== formData.confirmPin) {
      toast({ title: "Os PINs não coincidem", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/signup/trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: "Cadastro realizado com sucesso!" })
        router.push(`/trainer-onboarding?userId=${data.userId}`)
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
      <div className="max-w-2xl mx-auto py-12">
        <Button variant="ghost" onClick={() => router.push("/get-started")} className="mb-6 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-white/5 border-white/10 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cadastro Personal Trainer</h1>
          <p className="text-gray-400 mb-8">Passo {step} de 3</p>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Dados Pessoais</h2>

              <div>
                <Label className="text-white">Nome Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Telefone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">CPF</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-500"
                disabled={!formData.name || !formData.email || !formData.cpf}
              >
                Próximo
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Dados Profissionais</h2>

              <div>
                <Label className="text-white">Nome do Negócio (MEI)</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Ex: João Silva Personal Trainer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">CNPJ/MEI</Label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label className="text-white">CREF</Label>
                  <Input
                    value={formData.cref}
                    onChange={(e) => setFormData({ ...formData, cref: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="000000-G/SP"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Especialidades</Label>
                <Input
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Ex: Musculação, Funcional, Emagrecimento"
                />
              </div>

              <div>
                <Label className="text-white">Sobre Você</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Conte um pouco sobre sua experiência e método de trabalho"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/20 text-white">
                  Voltar
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-500">
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Crie seu PIN de Acesso</h2>

              <div>
                <Label className="text-white">PIN (6 dígitos)</Label>
                <Input
                  type="password"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="******"
                  maxLength={6}
                />
                <p className="text-sm text-gray-400 mt-1">Use este PIN para fazer login no app</p>
              </div>

              <div>
                <Label className="text-white">Confirme o PIN</Label>
                <Input
                  type="password"
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="******"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-white/20 text-white">
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-500"
                  disabled={loading || formData.pin.length !== 6}
                >
                  {loading ? "Cadastrando..." : "Finalizar Cadastro"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
