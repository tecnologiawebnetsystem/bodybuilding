// Mapeamento de exercicios para GIFs animados
// Fonte: fitnessprogramer.com (dominio publico)

export interface ExerciseMedia {
  gifUrl: string
  muscleTarget: string
  equipment: string
  instructions?: string[]
}

// Mapeamento de nomes de exercicios em portugues para GIFs
// GIFs de alta qualidade de fontes publicas
export const exerciseGifs: Record<string, ExerciseMedia> = {
  // PEITO
  "Supino Reto com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
    muscleTarget: "Peitoral",
    equipment: "Barra",
    instructions: [
      "Deite no banco com os pes apoiados no chao",
      "Segure a barra com pegada um pouco mais larga que os ombros",
      "Desça a barra ate tocar o peito",
      "Empurre de volta ate estender os bracos"
    ]
  },
  "Supino Inclinado com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif",
    muscleTarget: "Peitoral Superior",
    equipment: "Halteres",
    instructions: [
      "Ajuste o banco a 30-45 graus",
      "Segure os halteres na altura do peito",
      "Empurre para cima ate estender os bracos",
      "Desça controladamente"
    ]
  },
  "Supino Declinado com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Barbell-Bench-Press.gif",
    muscleTarget: "Peitoral Inferior",
    equipment: "Barra"
  },
  "Crucifixo Reto com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif",
    muscleTarget: "Peitoral",
    equipment: "Halteres"
  },
  "Crossover na Polia": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    muscleTarget: "Peitoral",
    equipment: "Polia"
  },
  "Flexão com Sobrecarga": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    muscleTarget: "Peitoral",
    equipment: "Peso Corporal"
  },

  // OMBROS
  "Desenvolvimento com Barra (Militar)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shoulder-Press.gif",
    muscleTarget: "Deltoides",
    equipment: "Barra",
    instructions: [
      "Fique em pe com a barra na altura dos ombros",
      "Empurre a barra para cima ate estender os bracos",
      "Desça controladamente ate a altura dos ombros"
    ]
  },
  "Elevação Lateral com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    muscleTarget: "Deltoide Lateral",
    equipment: "Halteres",
    instructions: [
      "Fique em pe com halteres nas laterais",
      "Eleve os bracos ate a altura dos ombros",
      "Mantenha os cotovelos levemente flexionados",
      "Desça controladamente"
    ]
  },
  "Elevação Frontal com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Front-Raise.gif",
    muscleTarget: "Deltoide Anterior",
    equipment: "Barra"
  },
  "Remada Alta com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Upright-Row.gif",
    muscleTarget: "Deltoides e Trapezio",
    equipment: "Barra"
  },

  // TRICEPS
  "Tríceps na Polia": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif",
    muscleTarget: "Triceps",
    equipment: "Polia"
  },
  "Tríceps na Polia (Corda)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Rope-Pushdown.gif",
    muscleTarget: "Triceps",
    equipment: "Polia com Corda"
  },
  "Tríceps Francês": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Triceps-Extension.gif",
    muscleTarget: "Triceps",
    equipment: "Halteres"
  },

  // COSTAS
  "Barra Fixa (Pegada Aberta)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-Up.gif",
    muscleTarget: "Dorsais",
    equipment: "Barra Fixa",
    instructions: [
      "Segure a barra com pegada pronada mais larga que os ombros",
      "Puxe o corpo para cima ate o queixo passar a barra",
      "Desça controladamente ate estender os bracos"
    ]
  },
  "Remada Curvada com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    muscleTarget: "Dorsais",
    equipment: "Barra"
  },
  "Remada Curvada com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    muscleTarget: "Dorsais",
    equipment: "Halteres"
  },
  "Remada Sentado na Polia": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Pulldown com Corda": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Straight-Arm-Pulldown.gif",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Puxada Frontal (Pegada Aberta)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Levantamento Terra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif",
    muscleTarget: "Costas e Pernas",
    equipment: "Barra",
    instructions: [
      "Fique em pe com a barra no chao",
      "Flexione os joelhos e quadril para pegar a barra",
      "Mantenha as costas retas durante todo o movimento",
      "Levante a barra estendendo quadril e joelhos"
    ]
  },
  "Pullover com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif",
    muscleTarget: "Dorsais e Peitoral",
    equipment: "Halter"
  },
  "Remada Unilateral com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    muscleTarget: "Dorsais",
    equipment: "Halter"
  },
  "Hiperextensão Lombar": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hyperextension.gif",
    muscleTarget: "Lombar",
    equipment: "Banco Romano"
  },

  // BICEPS
  "Rosca Direta com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
    muscleTarget: "Biceps",
    equipment: "Barra"
  },
  "Rosca Martelo": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
    muscleTarget: "Biceps e Braquial",
    equipment: "Halteres"
  },
  "Rosca Concentrada": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif",
    muscleTarget: "Biceps",
    equipment: "Halter"
  },

  // PERNAS
  "Agachamento Livre": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif",
    muscleTarget: "Quadriceps e Gluteos",
    equipment: "Barra",
    instructions: [
      "Posicione a barra nos ombros",
      "Pes na largura dos ombros",
      "Desça flexionando joelhos e quadril",
      "Mantenha as costas retas",
      "Suba estendendo as pernas"
    ]
  },
  "Agachamento Frontal": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Front-Squat.gif",
    muscleTarget: "Quadriceps",
    equipment: "Barra"
  },
  "Agachamento Sumô com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Sumo-Squat.gif",
    muscleTarget: "Gluteos e Adutores",
    equipment: "Halter"
  },
  "Leg Press 45°": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif",
    muscleTarget: "Quadriceps",
    equipment: "Leg Press"
  },
  "Leg Press 45° (Pés Altos)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif",
    muscleTarget: "Gluteos",
    equipment: "Leg Press"
  },
  "Hack Machine": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hack-Squat.gif",
    muscleTarget: "Quadriceps",
    equipment: "Hack Squat"
  },
  "Cadeira Extensora": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif",
    muscleTarget: "Quadriceps",
    equipment: "Maquina"
  },
  "Mesa Flexora": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif",
    muscleTarget: "Isquiotibiais",
    equipment: "Maquina"
  },
  "Stiff": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Stiff-Leg-Deadlift.gif",
    muscleTarget: "Isquiotibiais e Gluteos",
    equipment: "Barra"
  },
  "Stiff com Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Stiff-Leg-Deadlift.gif",
    muscleTarget: "Isquiotibiais e Gluteos",
    equipment: "Barra"
  },
  "Agachamento Búlgaro": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif",
    muscleTarget: "Quadriceps e Gluteos",
    equipment: "Halteres"
  },
  "Panturrilha em Pé": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
    muscleTarget: "Panturrilha",
    equipment: "Maquina"
  },
  "Panturrilha Sentada": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Calf-Raise.gif",
    muscleTarget: "Soleo",
    equipment: "Maquina"
  },

  // GLUTEOS
  "Hip Thrust na Barra": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif",
    muscleTarget: "Gluteos",
    equipment: "Barra",
    instructions: [
      "Apoie as costas no banco",
      "Posicione a barra sobre o quadril",
      "Empurre o quadril para cima",
      "Contraia os gluteos no topo",
      "Desça controladamente"
    ]
  },
  "Elevação Pélvica no Solo": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif",
    muscleTarget: "Gluteos",
    equipment: "Peso Corporal"
  },
  "Afundo com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif",
    muscleTarget: "Quadriceps e Gluteos",
    equipment: "Halteres"
  },
  "Abdução na Máquina": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Abduction-Machine.gif",
    muscleTarget: "Gluteo Medio",
    equipment: "Maquina"
  },
  "Adução na Máquina": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Adduction-Machine.gif",
    muscleTarget: "Adutores",
    equipment: "Maquina"
  },
  "Cadeira Adutora": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Adduction-Machine.gif",
    muscleTarget: "Adutores",
    equipment: "Maquina"
  },
  "Coice na Polia (Glute Kickback)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Glute-Kickback.gif",
    muscleTarget: "Gluteos",
    equipment: "Polia"
  },

  // ABDOMEN
  "Prancha Isométrica": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Plank.gif",
    muscleTarget: "Core",
    equipment: "Peso Corporal",
    instructions: [
      "Apoie os antebracos no chao",
      "Mantenha o corpo em linha reta",
      "Contraia o abdomen durante todo o tempo",
      "Nao deixe o quadril subir ou descer"
    ]
  },
  "Abdominal Supra (Crunch)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
    muscleTarget: "Reto Abdominal",
    equipment: "Peso Corporal"
  },
  "Abdominal Crunch": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
    muscleTarget: "Reto Abdominal",
    equipment: "Peso Corporal"
  },
  "Elevação de Pernas Suspenso": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif",
    muscleTarget: "Abdomen Inferior",
    equipment: "Barra Fixa"
  },
  "Abdominal Oblíquo na Polia": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Wood-Chop.gif",
    muscleTarget: "Obliquos",
    equipment: "Polia"
  },
  "Abdominal Oblíquo": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Oblique-Crunch.gif",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Abdominal na Polia Alta": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crunch.gif",
    muscleTarget: "Reto Abdominal",
    equipment: "Polia"
  },
  "Prancha com Elevação de Braço": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Arm-Reach.gif",
    muscleTarget: "Core",
    equipment: "Peso Corporal"
  },
  "Prancha Lateral": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Russian Twist com Anilha": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif",
    muscleTarget: "Obliquos",
    equipment: "Anilha"
  },
  "Mountain Climbers": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif",
    muscleTarget: "Core e Cardio",
    equipment: "Peso Corporal"
  },
  "Abdominal Infra (Elevação de Pernas)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif",
    muscleTarget: "Abdomen Inferior",
    equipment: "Peso Corporal"
  },
  "Abdominal Infra (Pernas Elevadas)": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif",
    muscleTarget: "Abdomen Inferior",
    equipment: "Peso Corporal"
  },
  "Abdominal Bicicleta": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Dead Bug": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif",
    muscleTarget: "Core",
    equipment: "Peso Corporal"
  },
  "Exercício de Kegel (Assoalho Pélvico)": {
    gifUrl: "",
    muscleTarget: "Assoalho Pelvico",
    equipment: "Nenhum"
  },

  // OUTROS
  "Supino Reto com Halteres": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif",
    muscleTarget: "Peitoral",
    equipment: "Halteres"
  },
  "Crucifixo Inclinado": {
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Fly.gif",
    muscleTarget: "Peitoral Superior",
    equipment: "Halteres"
  },
}

// Funcao para obter o GIF de um exercicio
export function getExerciseGif(exerciseName: string): ExerciseMedia | null {
  return exerciseGifs[exerciseName] || null
}

// Funcao para buscar GIF por nome parcial
export function searchExerciseGif(searchTerm: string): ExerciseMedia | null {
  const normalizedSearch = searchTerm.toLowerCase()
  
  for (const [name, media] of Object.entries(exerciseGifs)) {
    if (name.toLowerCase().includes(normalizedSearch)) {
      return media
    }
  }
  
  return null
}
