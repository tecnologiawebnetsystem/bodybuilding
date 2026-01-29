"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell, ArrowRight, Loader2, Delete, Shield, ChevronLeft } from "lucide-react"

export default function EntrarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"cpf" | "pin">("cpf")
  const [cpf, setCpf] = useState("")
  const [pin, setPin] = useState("")
  const [userName, setUserName] = useState("")
  const [greeting, setGreeting] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite")
  }, [])

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

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
    setError("")
  }

  const handleContinue = async () => {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11) {
      setError("CPF invalido. Digite os 11 digitos.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Verificar se o CPF existe
      const res = await fetch("/api/auth/check-cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cleanCPF })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "CPF nao encontrado")
        return
      }

      setUserName(data.name || "")
      setStep("pin")
    } catch (err) {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit
      setPin(newPin)
      setError("")
      
      // Auto submit when PIN is complete
      if (newPin.length === 6) {
        handleLogin(newPin)
      }
    }
  }

  const handlePinDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1))
      setError("")
    }
  }

  const handleLogin = async (finalPin: string) => {
    const cleanCPF = cpf.replace(/\D/g, "")
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/unified-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier: cleanCPF,
          pin: finalPin 
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "PIN incorreto")
        setPin("")
        return
      }

      // Salvar dados no sessionStorage
      // Usar o primeiro nome (ex: "Kleber" de "Kleber Goncalves") para compatibilidade com preferencias
      const firstName = data.user.name.split(" ")[0]
      sessionStorage.setItem("userId", firstName)
      sessionStorage.setItem("currentUser", firstName)
      sessionStorage.setItem("userName", data.user.name)
      sessionStorage.setItem("userRole", data.user.role)
      sessionStorage.setItem("userUUID", data.user.userId || data.user.id)
      if (data.user.gymId) {
        sessionStorage.setItem("gymId", data.user.gymId.toString())
      }

      // Redirecionar baseado no tipo
      if (data.user.role === "super_admin") {
        router.push("/super-admin")
      } else if (data.user.role === "gym_admin") {
        router.push("/admin")
      } else if (data.user.role === "trainer") {
        router.push("/trainer")
      } else {
        router.push("/app-mobile")
      }
    } catch (err) {
      setError("Erro de conexao. Tente novamente.")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep("cpf")
    setPin("")
    setError("")
  }

  const numpadButtons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "", "0", "del"
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">FitTransform</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-center py-4">
          {step === "cpf" ? (
            /* CPF Step */
            <div className="space-y-8">
              <div className="text-center">
                {greeting && <p className="text-gray-500 text-sm mb-1">{greeting}</p>}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Bem-vindo de{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">volta</span>
                </h1>
                <p className="text-gray-400 mt-2">Digite seu CPF para continuar</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-center tracking-wider"
                    autoFocus
                    inputMode="numeric"
                  />
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={loading || cpf.replace(/\D/g, "").length !== 11}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm mb-3">Primeira vez aqui?</p>
                <Link
                  href="/cadastro"
                  className="text-orange-400 hover:text-orange-300 font-medium text-sm"
                >
                  Criar minha conta gratis
                </Link>
              </div>
            </div>
          ) : (
            /* PIN Step */
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>

              <div className="text-center">
                {userName && (
                  <p className="text-orange-400 text-sm mb-1">Ola, {userName.split(" ")[0]}!</p>
                )}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Digite seu{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PIN</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">CPF: {cpf}</p>
              </div>

              {/* PIN Display */}
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                      pin.length > index
                        ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {pin.length > index && (
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500" />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span className="text-gray-400 text-sm">Verificando...</span>
                </div>
              )}

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {numpadButtons.map((btn, index) => (
                  <div key={index}>
                    {btn === "" ? (
                      <div className="w-20 h-16" />
                    ) : btn === "del" ? (
                      <button
                        onClick={handlePinDelete}
                        disabled={loading}
                        className="w-20 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Delete className="w-6 h-6 text-gray-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePinInput(btn)}
                        disabled={loading || pin.length >= 6}
                        className="w-20 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/30 text-2xl font-semibold transition-all active:scale-95 disabled:opacity-50"
                      >
                        {btn}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-500 text-xs">
                  Esqueceu o PIN? Fale com sua academia ou personal
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <Shield className="w-4 h-4" />
            <span>Seus dados estao protegidos</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
