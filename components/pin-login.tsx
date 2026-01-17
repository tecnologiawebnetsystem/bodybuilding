"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Dumbbell, ChevronRight, Shield, Fingerprint, Monitor } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PinLoginProps {
  onLogin: (userId: string) => void
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PinLogin({ onLogin }: PinLoginProps) {
  const [userType, setUserType] = useState<string>("student")
  const [cpf, setCpf] = useState<string>("")
  const [pin, setPin] = useState<string>("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showSuperAdmin, setShowSuperAdmin] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Capturar evento de instalação (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Verificar se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallPWA = async (platform: "android" | "ios" | "desktop") => {
    if (platform === "ios") {
      setShowIOSInstructions(true)
      return
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    } else {
      // Fallback: abrir em nova aba para adicionar à tela inicial manualmente
      alert(
        "Para instalar:\n\n1. Clique nos 3 pontos do navegador\n2. Selecione 'Instalar app' ou 'Adicionar à tela inicial'",
      )
    }
  }

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCPF = cpf.replace(/\D/g, "")

    if (cleanCPF.length !== 11) {
      setError("CPF inválido. Digite os 11 dígitos.")
      return
    }

    if (!pin || pin.length !== 6) {
      setError("PIN inválido. Digite 6 dígitos.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: cleanCPF,
          pin: pin,
          userType: userType,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem("userId", data.user.userId)

        if (data.user.role === "super_admin") {
          router.push("/super-admin")
        } else if (userType === "gym" || data.user.role === "gym_admin") {
          router.push("/admin")
        } else if (userType === "trainer" || data.user.role === "trainer") {
          router.push("/trainer")
        } else {
          onLogin(data.user.userId)
        }
      } else {
        setError(data.error || "CPF ou PIN incorretos")
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const userTypes = [
    { value: "student", label: "Aluno", icon: Dumbbell, desc: "Treinos" },
    { value: "gym", label: "Academia", icon: Shield, desc: "Gestão" },
    { value: "trainer", label: "Personal", icon: Fingerprint, desc: "Clientes" },
  ]

  const greeting = currentTime.getHours() < 12 ? "Bom dia" : currentTime.getHours() < 18 ? "Boa tarde" : "Boa noite"

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background com gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-6 safe-area-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">FitTransform</span>
          </div>

          {/* Botão Super Admin discreto */}
          <button
            onClick={() => {
              setShowSuperAdmin(!showSuperAdmin)
              if (!showSuperAdmin) {
                setUserType("superadmin")
                setCpf("000.000.000-00")
                setPin("999999")
              }
            }}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          </button>
        </header>

        {/* Conteúdo principal - centralizado */}
        <main className="flex-1 flex flex-col justify-center py-8">
          {/* Saudação - centralizada */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-1">{greeting}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Acesse sua{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">conta</span>
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {userTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setUserType(type.value)
                  setError("")
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  userType === type.value
                    ? "bg-gradient-to-b from-orange-500/20 to-red-500/20 border-orange-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    userType === type.value ? "bg-gradient-to-br from-orange-500 to-red-600" : "bg-white/10"
                  }`}
                >
                  <type.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{type.label}</p>
                  <p className="text-[10px] text-gray-500">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Formulário de login - centralizado */}
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            {/* Campo CPF */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-center"
                autoFocus
                inputMode="numeric"
              />
            </div>

            {/* Campo PIN */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">PIN de acesso</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    if (value.length <= 6) {
                      setPin(value)
                      setError("")
                    }
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full h-14 px-4 pr-14 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white tracking-[0.5em] text-center placeholder:text-gray-600 placeholder:tracking-[0.3em] focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  {showPin ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading || cpf.replace(/\D/g, "").length !== 11 || pin.length !== 6}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Link de cadastro - apenas para alunos */}
          {userType === "student" && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-3">Primeira vez aqui?</p>
              <Link
                href="/app-mobile/register"
                className="flex items-center justify-center gap-2 w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-medium transition-all"
              >
                Criar minha conta
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-center text-gray-500 text-sm mb-4">Instale o app no seu dispositivo</p>
            <div className="grid grid-cols-3 gap-3">
              {/* Android */}
              <button
                onClick={() => handleInstallPWA("android")}
                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341a.5.5 0 0 0 .477-.646l-1.08-3.287a.5.5 0 0 0-.477-.354H7.558a.5.5 0 0 0-.477.354l-1.08 3.287a.5.5 0 0 0 .477.646h11.046zM6.5 6.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v4H6.5v-4zm3.879-4.414a.5.5 0 0 1 .707 0l.914.914.914-.914a.5.5 0 0 1 .707.707l-.914.914.914.914a.5.5 0 0 1-.707.707l-.914-.914-.914.914a.5.5 0 0 1-.707-.707l.914-.914-.914-.914a.5.5 0 0 1 0-.707zM6.5 16.5v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2h-11z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-white">Android</p>
                  <p className="text-[10px] text-gray-500">Google Play</p>
                </div>
              </button>

              {/* iOS */}
              <button
                onClick={() => handleInstallPWA("ios")}
                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-gray-400/10 border border-white/10 hover:border-gray-400/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center group-hover:bg-gray-400/30 transition-all">
                  <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-white">iOS</p>
                  <p className="text-[10px] text-gray-500">App Store</p>
                </div>
              </button>

              {/* Desktop */}
              <button
                onClick={() => handleInstallPWA("desktop")}
                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                  <Monitor className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-white">Desktop</p>
                  <p className="text-[10px] text-gray-500">Windows/Mac</p>
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Footer com segurança */}
        <footer className="py-6 text-center safe-area-bottom">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <Shield className="w-4 h-4" />
            <span>Seus dados estão protegidos</span>
          </div>
        </footer>
      </div>

      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Instalar no iPhone/iPad</h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Toque no ícone de compartilhar</p>
                  <p className="text-xs text-gray-500 mt-1">Na barra inferior do Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Role e toque em "Adicionar à Tela de Início"</p>
                  <p className="text-xs text-gray-500 mt-1">Ícone com + ao lado</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Toque em "Adicionar"</p>
                  <p className="text-xs text-gray-500 mt-1">O app será instalado na sua tela inicial</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Modal Super Admin */}
      {showSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Acesso Super Admin</h3>
              <button
                onClick={() => setShowSuperAdmin(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-400">Credenciais preenchidas automaticamente. Clique em Entrar.</p>
            <div className="space-y-2 p-4 bg-white/5 rounded-xl">
              <p className="text-sm font-mono">
                <span className="text-gray-500">CPF:</span> 000.000.000-00
              </p>
              <p className="text-sm font-mono">
                <span className="text-gray-500">PIN:</span> 999999
              </p>
            </div>
            <button
              onClick={() => setShowSuperAdmin(false)}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-medium"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Safe area styles para iOS */}
      <style jsx global>{`
        .safe-area-top {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  )
}
