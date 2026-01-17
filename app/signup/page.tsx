"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell, Building2, User, Mail, Phone, MapPin, CreditCard, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    gymName: "",
    ownerName: "",
    email: "",
    phone: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    planType: "trial",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/signup/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/onboarding?gymId=${data.gymId}&userId=${data.userId}&pin=${data.pin}`)
      } else {
        alert(data.error || "Erro ao criar conta")
      }
    } catch (error) {
      alert("Erro ao processar cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">FitTransform</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Comece Seu Teste Grátis</h1>
          <p className="text-gray-400 text-lg">14 dias grátis, sem cartão de crédito necessário</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400"}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="font-medium">Dados da Academia</span>
          </div>
          <div className="w-8 h-0.5 bg-white/10"></div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400"}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="font-medium">Endereço</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Nome da Academia *
                    </Label>
                    <Input
                      required
                      value={formData.gymName}
                      onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                      placeholder="Ex: FitTransform Academia"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome do Responsável *
                    </Label>
                    <Input
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Seu nome completo"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contato@suaacademia.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone *
                    </Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      CNPJ (opcional)
                    </Label>
                    <Input
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white"
                  size="lg"
                >
                  Continuar <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço *
                    </Label>
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, número"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2">Cidade *</Label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2">Estado *</Label>
                    <Input
                      required
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      placeholder="SP"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2">CEP *</Label>
                    <Input
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="00000-000"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Features included */}
                <div className="bg-white/5 rounded-xl p-6 space-y-3">
                  <h3 className="text-white font-semibold mb-4">Incluído no seu teste grátis:</h3>
                  {[
                    "Até 50 alunos",
                    "Todas as funcionalidades premium",
                    "Aplicativos mobile iOS e Android",
                    "Suporte por email",
                    "Sem compromisso, cancele quando quiser",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white"
                    size="lg"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white"
                    size="lg"
                  >
                    {loading ? "Criando conta..." : "Começar Teste Grátis"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-orange-500 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
