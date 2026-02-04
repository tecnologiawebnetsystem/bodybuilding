"use client"

import { useState, useEffect } from "react"
import { Sparkles, Dumbbell, Utensils, History, ChevronRight, Pill } from "lucide-react"
import { WorkoutGenerator } from "@/components/ai/workout-generator"
import { NutritionAssistant } from "@/components/ai/nutrition-assistant"
import { SupplementsAssistant } from "@/components/ai/supplements-assistant"
import { Card, CardContent } from "@/components/ui/card"

interface UserProfile {
  height?: number
  current_weight?: number
  target_weight?: number
  gender?: string
  age?: number
}

interface AiTabProps {
  userId: string
  preferences: {
    theme_primary: string
    theme_secondary: string
    theme_accent: string
  }
}

export function AiTab({ userId, preferences }: AiTabProps) {
  const [activeSection, setActiveSection] = useState<"workout" | "nutrition" | "supplements" | "history">("workout")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [history, setHistory] = useState<Array<{
    id: string
    type: "workout" | "nutrition" | "supplements"
    title: string
    date: string
    data: unknown
  }>>([])

  // Carregar perfil do usuario
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/user-profile?userId=${userId}`)
        const data = await response.json()
        if (data.success && data.data) {
          setUserProfile(data.data)
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }
    
    // Carregar historico do localStorage
    const savedHistory = localStorage.getItem(`ai-history-${userId}`)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    
    loadProfile()
  }, [userId])

  // Funcao para salvar no historico
  const saveToHistory = (type: "workout" | "nutrition" | "supplements", title: string, data: unknown) => {
    const newEntry = {
      id: Date.now().toString(),
      type,
      title,
      date: new Date().toLocaleDateString("pt-BR"),
      data,
    }
    const newHistory = [newEntry, ...history].slice(0, 10) // Manter apenas 10 ultimos
    setHistory(newHistory)
    localStorage.setItem(`ai-history-${userId}`, JSON.stringify(newHistory))
  }

  return (
    <div className="space-y-6">
      {/* Header Compacto */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Assistentes IA</h1>
        <p className="text-gray-400 text-sm">Ferramentas inteligentes para seus resultados</p>
      </div>

      {/* Seletor Compacto - Responsivo */}
      <div className="flex gap-2 p-1.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
        <button
          onClick={() => setActiveSection("workout")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
            activeSection === "workout"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="hidden sm:inline">Treinos</span>
        </button>

        <button
          onClick={() => setActiveSection("nutrition")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
            activeSection === "nutrition"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="hidden sm:inline">Nutricao</span>
        </button>

        <button
          onClick={() => setActiveSection("supplements")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
            activeSection === "supplements"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Pill className="w-5 h-5" />
          <span className="hidden sm:inline">Suplementos</span>
        </button>

        <button
          onClick={() => setActiveSection("history")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
            activeSection === "history"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">Historico</span>
          {history.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div>
        {activeSection === "workout" && (
          <WorkoutGenerator 
            userId={userId}
            userProfile={userProfile} 
            onSave={(title, data) => saveToHistory("workout", title, data)}
          />
        )}
        {activeSection === "nutrition" && (
          <NutritionAssistant 
            userProfile={userProfile}
            onSave={(title, data) => saveToHistory("nutrition", title, data)}
          />
        )}
        {activeSection === "supplements" && (
          <SupplementsAssistant 
            userId={userId}
            userProfile={userProfile}
            onSave={(title, data) => saveToHistory("supplements", title, data)}
          />
        )}
        {activeSection === "history" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Historico de Geracoes</h2>
            {history.length === 0 ? (
              <Card className="bg-white/[0.03] border-white/[0.08] border-dashed">
                <CardContent className="p-8 text-center">
                  <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhuma geracao salva ainda</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Seus treinos e planos alimentares salvos aparecerao aqui
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <Card 
                    key={item.id} 
                    className="bg-white/[0.03] border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveSection(item.type)
                    }}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === "workout" 
                          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20" 
                          : item.type === "supplements"
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                            : "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                      }`}>
                        {item.type === "workout" ? (
                          <Dumbbell className="w-5 h-5 text-orange-400" />
                        ) : item.type === "supplements" ? (
                          <Pill className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Utensils className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-gray-500 text-sm">{item.date}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
