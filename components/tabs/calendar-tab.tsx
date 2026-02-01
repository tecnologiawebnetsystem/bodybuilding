"use client"

import { FitnessCalendar } from "@/components/calendar/fitness-calendar"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface CalendarTabProps {
  userId: string
  preferences: UserPreferences
}

export function CalendarTab({ userId, preferences }: CalendarTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Meu Calendario</h2>
        <p className="text-gray-400">Organize seus treinos, aulas e compromissos</p>
      </div>

      <FitnessCalendar 
        userId={userId} 
        preferences={{
          theme_primary: preferences.theme_primary,
          theme_accent: preferences.theme_accent
        }} 
      />
    </div>
  )
}
