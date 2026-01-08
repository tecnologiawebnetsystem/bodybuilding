export interface Exercise {
  name: string
  sets: string
  notes: string
}

export interface WorkoutPlan {
  name: string
  focus: string
  muscleGroups: string[]
  exercises: Exercise[]
}

// Treinos para KLEBER - Foco em ombros largos e perda de barriga
export const kleberWorkouts: WorkoutPlan[] = [
  {
    name: "Treino A",
    focus: "Peito e Ombros (Ênfase em Ombros Largos + Peito Firme)",
    muscleGroups: ["Peito", "Ombros", "Tríceps"],
    exercises: [
      {
        name: "Supino Reto com Barra",
        sets: "5 séries de 8-12 repetições",
        notes: "PRIORITÁRIO! Base para peito firme. Controle total na descida.",
      },
      {
        name: "Supino Inclinado com Halteres",
        sets: "4 séries de 10-12 repetições",
        notes: "Parte superior do peito. Evita flacidez.",
      },
      {
        name: "Supino Declinado com Barra",
        sets: "4 séries de 10-12 repetições",
        notes: "Parte inferior do peito. Preenche e firma.",
      },
      {
        name: "Crucifixo Reto com Halteres",
        sets: "4 séries de 12-15 repetições",
        notes: "Alongamento e firmeza do peito. Evita flacidez!",
      },
      {
        name: "Crossover na Polia",
        sets: "3 séries de 15 repetições",
        notes: "Definição e contração máxima do peito.",
      },
      {
        name: "Flexão com Sobrecarga",
        sets: "3 séries até a falha",
        notes: "Finalização. Firma todo o peitoral.",
      },
      {
        name: "Desenvolvimento com Barra (Militar)",
        sets: "5 séries de 8-10 repetições",
        notes: "Exercício principal para ombros largos. Postura ereta.",
      },
      {
        name: "Elevação Lateral com Halteres",
        sets: "4 séries de 12-15 repetições",
        notes: "Essencial para largura dos ombros. Controle total.",
      },
      {
        name: "Elevação Frontal com Barra",
        sets: "3 séries de 12 repetições",
        notes: "Desenvolvimento do ombro anterior.",
      },
      {
        name: "Remada Alta com Barra",
        sets: "4 séries de 10-12 repetições",
        notes: "Largura e definição dos ombros.",
      },
      {
        name: "Tríceps na Polia",
        sets: "3 séries de 12-15 repetições",
        notes: "Definição dos braços.",
      },
      {
        name: "Tríceps Francês",
        sets: "3 séries de 10-12 repetições",
        notes: "Volume dos tríceps.",
      },
    ],
  },
  {
    name: "Treino B",
    focus: "Costas e Bíceps",
    muscleGroups: ["Costas", "Bíceps", "Lombar"],
    exercises: [
      {
        name: "Barra Fixa (Pegada Aberta)",
        sets: "4 séries de 8-12 repetições",
        notes: "Costas largas em V. Use auxílio se necessário.",
      },
      {
        name: "Remada Curvada com Barra",
        sets: "4 séries de 8-12 repetições",
        notes: "Densidade das costas. Postura correta.",
      },
      {
        name: "Remada Sentado na Polia",
        sets: "4 séries de 10-12 repetições",
        notes: "Contração máxima das costas.",
      },
      {
        name: "Pulldown com Corda",
        sets: "3 séries de 12-15 repetições",
        notes: "Definição inferior das costas.",
      },
      {
        name: "Levantamento Terra",
        sets: "4 séries de 6-8 repetições",
        notes: "Exercício completo! Queima muita gordura abdominal.",
      },
      {
        name: "Rosca Direta com Barra",
        sets: "3 séries de 10-12 repetições",
        notes: "Volume dos bíceps.",
      },
      {
        name: "Rosca Martelo",
        sets: "3 séries de 12-15 repetições",
        notes: "Espessura dos braços.",
      },
    ],
  },
  {
    name: "Treino C",
    focus: "Pernas e Abdômen (Ênfase Abdominal + Pernas Fortes)",
    muscleGroups: ["Quadríceps", "Posterior", "Glúteos", "Abdômen"],
    exercises: [
      {
        name: "Agachamento Livre",
        sets: "5 séries de 8-12 repetições",
        notes: "PRIORITÁRIO! Exercício completo. Queima gordura da barriga!",
      },
      {
        name: "Agachamento Frontal",
        sets: "4 séries de 10-12 repetições",
        notes: "Mais ênfase nos quadríceps. Postura ereta.",
      },
      {
        name: "Leg Press 45°",
        sets: "5 séries de 12-15 repetições",
        notes: "Volume nas pernas. Descer até o máximo.",
      },
      {
        name: "Hack Machine",
        sets: "4 séries de 12-15 repetições",
        notes: "Desenvolvimento completo das coxas.",
      },
      {
        name: "Cadeira Extensora",
        sets: "4 séries de 12-15 repetições",
        notes: "Isolamento do quadríceps. Contração máxima.",
      },
      {
        name: "Mesa Flexora",
        sets: "4 séries de 12-15 repetições",
        notes: "Posterior da coxa. Músculo fundamental.",
      },
      {
        name: "Stiff",
        sets: "4 séries de 10-12 repetições",
        notes: "Isquiotibiais e glúteos. Pernas grossas!",
      },
      {
        name: "Agachamento Búlgaro",
        sets: "3 séries de 12 repetições (cada perna)",
        notes: "Isolamento unilateral. Corrige assimetrias.",
      },
      {
        name: "Panturrilha em Pé",
        sets: "4 séries de 15-20 repetições",
        notes: "Volume e definição das panturrilhas.",
      },
      {
        name: "Prancha Isométrica",
        sets: "4 séries de 60-90 segundos",
        notes: "ESSENCIAL! Reduz barriga e fortalece core.",
      },
      {
        name: "Abdominal Infra (Elevação de Pernas)",
        sets: "4 séries de 15-20 repetições",
        notes: "Ataca a parte inferior da barriga.",
      },
      {
        name: "Abdominal Supra (Crunch)",
        sets: "4 séries de 20-25 repetições",
        notes: "Parte superior do abdômen.",
      },
      {
        name: "Abdominal Oblíquo",
        sets: "3 séries de 20 repetições (cada lado)",
        notes: "Elimina gordura lateral (pochete).",
      },
      {
        name: "Mountain Climbers",
        sets: "3 séries de 30 segundos",
        notes: "Cardio + abdômen. Queima barriga!",
      },
    ],
  },
]

// Treinos para PAMELA - Foco em glúteos e abdômen pós-gravidez
export const pamelaWorkouts: WorkoutPlan[] = [
  {
    name: "Treino A",
    focus: "Glúteos e Pernas (Ênfase em Glúteos + Pernas Lindas)",
    muscleGroups: ["Glúteos", "Quadríceps", "Posterior"],
    exercises: [
      {
        name: "Hip Thrust na Barra",
        sets: "5 séries de 12-15 repetições",
        notes: "PRIORITÁRIO! Exercício #1 para glúteos! Contração máxima no topo.",
      },
      {
        name: "Agachamento Sumô com Halteres",
        sets: "4 séries de 12-15 repetições",
        notes: "Máxima ativação dos glúteos e interno das coxas.",
      },
      {
        name: "Stiff com Barra",
        sets: "4 séries de 12-15 repetições",
        notes: "Alongamento e fortalecimento dos glúteos.",
      },
      {
        name: "Leg Press 45° (Pés Altos)",
        sets: "4 séries de 15 repetições",
        notes: "Pés altos = mais glúteos. Descer bem.",
      },
      {
        name: "Agachamento Búlgaro",
        sets: "4 séries de 12 repetições (cada perna)",
        notes: "Glúteos inferiores. Formato arredondado perfeito.",
      },
      {
        name: "Afundo com Halteres",
        sets: "3 séries de 12 repetições (cada perna)",
        notes: "Tonifica e levanta os glúteos.",
      },
      {
        name: "Cadeira Extensora",
        sets: "3 séries de 15 repetições",
        notes: "Tonifica e define os quadríceps.",
      },
      {
        name: "Mesa Flexora",
        sets: "3 séries de 15 repetições",
        notes: "Posterior firme e tonificado.",
      },
      {
        name: "Abdução na Máquina",
        sets: "4 séries de 15-20 repetições",
        notes: "Glúteo médio. Dá formato arredondado.",
      },
      {
        name: "Adução na Máquina",
        sets: "3 séries de 15-20 repetições",
        notes: "Interno das coxas. Pernas harmoniosas.",
      },
      {
        name: "Coice na Polia (Glute Kickback)",
        sets: "3 séries de 15 repetições (cada perna)",
        notes: "Isolamento total dos glúteos.",
      },
      {
        name: "Panturrilha Sentada",
        sets: "3 séries de 15-20 repetições",
        notes: "Pernas completas e femininas.",
      },
    ],
  },
  {
    name: "Treino B",
    focus: "Peito, Costas e Braços",
    muscleGroups: ["Peito", "Costas", "Bíceps", "Tríceps"],
    exercises: [
      {
        name: "Supino Reto com Halteres",
        sets: "3 séries de 12-15 repetições",
        notes: "Tonificação do peitoral feminino.",
      },
      {
        name: "Crucifixo Inclinado",
        sets: "3 séries de 12-15 repetições",
        notes: "Alongamento e firmeza do peito.",
      },
      {
        name: "Remada Curvada com Halteres",
        sets: "3 séries de 12-15 repetições",
        notes: "Postura e definição das costas.",
      },
      {
        name: "Puxada Frontal (Pegada Aberta)",
        sets: "3 séries de 12-15 repetições",
        notes: "Costas em V feminino.",
      },
      {
        name: "Rosca Direta com Barra",
        sets: "3 séries de 12-15 repetições",
        notes: "Tonificação dos bíceps.",
      },
      {
        name: "Tríceps na Polia (Corda)",
        sets: "3 séries de 15 repetições",
        notes: "Evita flacidez nos braços.",
      },
      {
        name: "Prancha Lateral",
        sets: "3 séries de 45 segundos (cada lado)",
        notes: "Core e oblíquos.",
      },
    ],
  },
  {
    name: "Treino C",
    focus: "Glúteos Inferiores e Abdômen Pós-Gravidez",
    muscleGroups: ["Glúteos", "Abdômen", "Lombar"],
    exercises: [
      {
        name: "Agachamento Búlgaro",
        sets: "4 séries de 12 repetições (cada perna)",
        notes: "Glúteos inferiores e formato arredondado.",
      },
      {
        name: "Elevação Pélvica no Solo",
        sets: "4 séries de 20 repetições",
        notes: "Ativação e fortalecimento dos glúteos.",
      },
      {
        name: "Mesa Flexora",
        sets: "3 séries de 15 repetições",
        notes: "Posterior da coxa + glúteos.",
      },
      {
        name: "Cadeira Adutora",
        sets: "3 séries de 15-20 repetições",
        notes: "Interno das coxas.",
      },
      {
        name: "Prancha Isométrica",
        sets: "4 séries de 60 segundos",
        notes: "Recuperação do core pós-gravidez.",
      },
      {
        name: "Abdominal Infra (Pernas Elevadas)",
        sets: "4 séries de 15 repetições",
        notes: "Parte inferior - área afetada pela gravidez.",
      },
      {
        name: "Abdominal Crunch",
        sets: "4 séries de 20 repetições",
        notes: "Tonificação abdominal superior.",
      },
      {
        name: "Abdominal Bicicleta",
        sets: "3 séries de 20 repetições (cada lado)",
        notes: "Elimina gordura lateral pós-gravidez.",
      },
      {
        name: "Dead Bug",
        sets: "3 séries de 12 repetições",
        notes: "Reconexão abdominal pós-parto.",
      },
      {
        name: "Exercício de Kegel (Assoalho Pélvico)",
        sets: "3 séries de 15 contrações",
        notes: "Fortalecimento do assoalho pélvico pós-gravidez.",
      },
    ],
  },
]

export const getWorkoutsByUser = (userId: string): WorkoutPlan[] => {
  return userId === "kleber" ? kleberWorkouts : pamelaWorkouts
}
