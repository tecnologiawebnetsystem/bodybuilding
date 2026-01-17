"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    height: "",
    currentWeight: "",
    goalWeight: "",
    gymCode: "",
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const handleChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      setError("Preencha todos os campos obrigatórios")
      return false
    }
    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      setError("CPF inválido")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Preencha a senha e confirmação")
      return false
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.gender || !formData.age || !formData.height || !formData.currentWeight || !formData.goalWeight) {
      setError("Preencha todos os campos")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      handleRegister()
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cpf: formData.cpf.replace(/\D/g, ""),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(4) // Sucesso
      } else {
        setError(data.error || "Erro ao cadastrar")
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-purple-500 to-blue-600 p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cadastro Concluído!</h2>
              <p className="text-muted-foreground mt-2">Bem-vindo ao FitTransform! Você já pode fazer login.</p>
            </div>
            <Button onClick={() => router.push("/app-mobile")} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-purple-500 to-blue-600 p-4">
      <div className="absolute inset-0 bg-[url('/abstract-fitness-pattern.png')] opacity-10 bg-repeat" />

      <button
        onClick={() => (step === 1 ? router.push("/app-mobile") : setStep(step - 1))}
        className="absolute top-4 left-4 z-20 px-4 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm flex items-center gap-2 transition-all text-white shadow-lg hover:shadow-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <Card className="w-full max-w-md relative z-10 bg-background/95 backdrop-blur border-4 border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cadastro de Aluno</h1>
            <p className="text-sm text-muted-foreground">Passo {step} de 3</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados Pessoais</h3>
              <div>
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <Label>CPF *</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div>
                <Label>Código da Academia (opcional)</Label>
                <Input
                  value={formData.gymCode}
                  onChange={(e) => handleChange("gymCode", e.target.value)}
                  placeholder="Digite o código se você tiver"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Criar Senha</h3>
              <div>
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <Label>Confirmar Senha *</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Digite a senha novamente"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Perfil Físico</h3>
              <div>
                <Label>Gênero *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Idade *</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label>Altura (cm) *</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="175"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Peso Atual (kg) *</Label>
                  <Input
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) => handleChange("currentWeight", e.target.value)}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label>Peso Meta (kg) *</Label>
                  <Input
                    type="number"
                    value={formData.goalWeight}
                    onChange={(e) => handleChange("goalWeight", e.target.value)}
                    placeholder="75"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-destructive text-sm font-medium text-center">{error}</p>}

          <Button onClick={handleNext} className="w-full" disabled={loading}>
            {loading ? "Cadastrando..." : step === 3 ? "Finalizar Cadastro" : "Próximo"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Já tem cadastro?{" "}
            <Link href="/app-mobile" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
