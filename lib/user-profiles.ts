export interface UserProfile {
  id: string
  name: string
  age: number
  height: number
  initialWeight: number
  targetWeight: number
  startDate: string
  gender: "male" | "female"
  goals: string[]
  theme: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    gradient: {
      from: string
      via: string
      to: string
    }
  }
}

export const userProfiles: Record<string, UserProfile> = {
  kleber: {
    id: "kleber",
    name: "Kleber Gonçalves",
    age: 0,
    height: 180,
    initialWeight: 93,
    targetWeight: 78,
    startDate: "2026-01-06",
    gender: "male",
    goals: [
      "Perder 15kg de gordura",
      "Ganhar massa muscular magra",
      "Eliminar barriga de chopp",
      "Desenvolver ombros largos",
      "Definição corporal completa",
    ],
    theme: {
      primary: "#ff8c42",
      secondary: "#3d84f7",
      accent: "#00d4ff",
      success: "#00e5b8",
      warning: "#fbbf24",
      gradient: {
        from: "#f0f4ff",
        via: "#ffe5d9",
        to: "#e3f2ff",
      },
    },
  },
  pamela: {
    id: "pamela",
    name: "Pamela Gonçalves",
    age: 36,
    height: 172,
    initialWeight: 78,
    targetWeight: 70,
    startDate: "2026-01-06",
    gender: "female",
    goals: [
      "Perder 8kg de gordura",
      "Ganhar massa muscular magra",
      "Aumentar e tonificar glúteos",
      "Eliminar gordura abdominal pós-gravidez",
      "Evitar flacidez",
      "Melhorar definição corporal",
    ],
    theme: {
      primary: "#ff1a8c",
      secondary: "#a855f7",
      accent: "#ff6b35",
      success: "#06ffa5",
      warning: "#fb923c",
      gradient: {
        from: "#fef3f9",
        via: "#ffe5f4",
        to: "#f3e8ff",
      },
    },
  },
}
