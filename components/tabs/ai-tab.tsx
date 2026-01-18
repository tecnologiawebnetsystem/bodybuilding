"use client"

import { useState } from "react"
import { Sparkles, Dumbbell, Utensils } from "lucide-react"
import { WorkoutGenerator } from "@/components/ai/workout-generator"
import { NutritionAssistant } from "@/components/ai/nutrition-assistant"

interface AiTabProps {
  userId: string
  preferences: {
    theme_primary: string
    theme_secondary: string
    theme_accent: string
  }
}

export function AiTab({ userId, preferences }: AiTabProps) {
  const [activeSection, setActiveSection] = useState<"workout" | "nutrition">("workout")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Inteligencia Artificial</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Assistentes IA</h1>
        <p className="text-gray-400">Ferramentas inteligentes para potencializar seus resultados</p>
      </div>

      {/* Section Selector */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setActiveSection("workout")}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${
            activeSection === "workout"
              ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 text-white"
              : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            activeSection === "workout" 
              ? "bg-gradient-to-r from-orange-500 to-red-600" 
              : "bg-white/[0.05]"
          }`}>
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Gerador de Treinos</p>
            <p className="text-xs text-gray-500">Treinos personalizados com IA</p>
          </div>
        </button>

        <button
          onClick={() => setActiveSection("nutrition")}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${
            activeSection === "nutrition"
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-white"
              : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            activeSection === "nutrition" 
              ? "bg-gradient-to-r from-green-500 to-emerald-600" 
              : "bg-white/[0.05]"
          }`}>
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Assistente Nutricional</p>
            <p className="text-xs text-gray-500">Planos alimentares com IA</p>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeSection === "workout" && <WorkoutGenerator />}
        {activeSection === "nutrition" && <NutritionAssistant />}
      </div>
    </div>
  )
}
