// Mapeamento de exercicios para GIFs animados
// Fonte: ExerciseDB API (gratuita) - https://exercisedb.io

export interface ExerciseMedia {
  gifUrl: string
  muscleTarget: string
  equipment: string
  instructions?: string[]
}

// Mapeamento de nomes de exercicios em portugues para GIFs
// Os GIFs sao da API ExerciseDB (dominio publico)
export const exerciseGifs: Record<string, ExerciseMedia> = {
  // PEITO
  "Supino Reto com Barra": {
    gifUrl: "https://v2.exercisedb.io/image/rKPi79SZu4W3RB",
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
    gifUrl: "https://v2.exercisedb.io/image/yxHxMYQNirzXbL",
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
    gifUrl: "https://v2.exercisedb.io/image/WE0Ufh6h5tCQxj",
    muscleTarget: "Peitoral Inferior",
    equipment: "Barra"
  },
  "Crucifixo Reto com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/g-0RSeDSLXJMDG",
    muscleTarget: "Peitoral",
    equipment: "Halteres"
  },
  "Crossover na Polia": {
    gifUrl: "https://v2.exercisedb.io/image/TEijYuuPzAIvZx",
    muscleTarget: "Peitoral",
    equipment: "Polia"
  },
  "Flexão com Sobrecarga": {
    gifUrl: "https://v2.exercisedb.io/image/2g0H2c1XJswYez",
    muscleTarget: "Peitoral",
    equipment: "Peso Corporal"
  },

  // OMBROS
  "Desenvolvimento com Barra (Militar)": {
    gifUrl: "https://v2.exercisedb.io/image/KBYMk3Y0cJ5L9N",
    muscleTarget: "Deltoides",
    equipment: "Barra",
    instructions: [
      "Fique em pe com a barra na altura dos ombros",
      "Empurre a barra para cima ate estender os bracos",
      "Desça controladamente ate a altura dos ombros"
    ]
  },
  "Elevação Lateral com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/WpSHwL1RrVxpyj",
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
    gifUrl: "https://v2.exercisedb.io/image/hTlPnRcJpLBVoS",
    muscleTarget: "Deltoide Anterior",
    equipment: "Barra"
  },
  "Remada Alta com Barra": {
    gifUrl: "https://v2.exercisedb.io/image/nxFRv2kUdH-RYf",
    muscleTarget: "Deltoides e Trapezio",
    equipment: "Barra"
  },

  // TRICEPS
  "Tríceps na Polia": {
    gifUrl: "https://v2.exercisedb.io/image/D6pxvXjwOzrfby",
    muscleTarget: "Triceps",
    equipment: "Polia"
  },
  "Tríceps na Polia (Corda)": {
    gifUrl: "https://v2.exercisedb.io/image/XRrk7h5IA3tqe4",
    muscleTarget: "Triceps",
    equipment: "Polia com Corda"
  },
  "Tríceps Francês": {
    gifUrl: "https://v2.exercisedb.io/image/Lx4d9GEJiVnphA",
    muscleTarget: "Triceps",
    equipment: "Halteres"
  },

  // COSTAS
  "Barra Fixa (Pegada Aberta)": {
    gifUrl: "https://v2.exercisedb.io/image/Vur9iYKi4O2bxk",
    muscleTarget: "Dorsais",
    equipment: "Barra Fixa",
    instructions: [
      "Segure a barra com pegada pronada mais larga que os ombros",
      "Puxe o corpo para cima ate o queixo passar a barra",
      "Desça controladamente ate estender os bracos"
    ]
  },
  "Remada Curvada com Barra": {
    gifUrl: "https://v2.exercisedb.io/image/nLTXJrPMG8A7ho",
    muscleTarget: "Dorsais",
    equipment: "Barra"
  },
  "Remada Curvada com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/QVQD6sWTYOOvXj",
    muscleTarget: "Dorsais",
    equipment: "Halteres"
  },
  "Remada Sentado na Polia": {
    gifUrl: "https://v2.exercisedb.io/image/HqFKj2rdT49ywZ",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Pulldown com Corda": {
    gifUrl: "https://v2.exercisedb.io/image/WJl-R2QLz97MkP",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Puxada Frontal (Pegada Aberta)": {
    gifUrl: "https://v2.exercisedb.io/image/hZTKfYJKyHxr3T",
    muscleTarget: "Dorsais",
    equipment: "Polia"
  },
  "Levantamento Terra": {
    gifUrl: "https://v2.exercisedb.io/image/HnZ5YX7XtP1EK2",
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
    gifUrl: "https://v2.exercisedb.io/image/89HNqL0OgYlPij",
    muscleTarget: "Dorsais e Peitoral",
    equipment: "Halter"
  },
  "Remada Unilateral com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/Vy2rJh9FBQX8xC",
    muscleTarget: "Dorsais",
    equipment: "Halter"
  },
  "Hiperextensão Lombar": {
    gifUrl: "https://v2.exercisedb.io/image/lR5MnKWZ8qyYgT",
    muscleTarget: "Lombar",
    equipment: "Banco Romano"
  },

  // BICEPS
  "Rosca Direta com Barra": {
    gifUrl: "https://v2.exercisedb.io/image/TpGhKLBtP0oyzF",
    muscleTarget: "Biceps",
    equipment: "Barra"
  },
  "Rosca Martelo": {
    gifUrl: "https://v2.exercisedb.io/image/KvJHwNYiP9rjf4",
    muscleTarget: "Biceps e Braquial",
    equipment: "Halteres"
  },
  "Rosca Concentrada": {
    gifUrl: "https://v2.exercisedb.io/image/Xh8jKPV2R0yNbw",
    muscleTarget: "Biceps",
    equipment: "Halter"
  },

  // PERNAS
  "Agachamento Livre": {
    gifUrl: "https://v2.exercisedb.io/image/Yh9RP2LKtMOxvz",
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
    gifUrl: "https://v2.exercisedb.io/image/N3VPkrHwL7j5Mf",
    muscleTarget: "Quadriceps",
    equipment: "Barra"
  },
  "Agachamento Sumô com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/R5tKyLwH8NjPMx",
    muscleTarget: "Gluteos e Adutores",
    equipment: "Halter"
  },
  "Leg Press 45°": {
    gifUrl: "https://v2.exercisedb.io/image/9hVKLwRyP2MtNj",
    muscleTarget: "Quadriceps",
    equipment: "Leg Press"
  },
  "Leg Press 45° (Pés Altos)": {
    gifUrl: "https://v2.exercisedb.io/image/9hVKLwRyP2MtNj",
    muscleTarget: "Gluteos",
    equipment: "Leg Press"
  },
  "Hack Machine": {
    gifUrl: "https://v2.exercisedb.io/image/Pj2RKyLwH8NtVx",
    muscleTarget: "Quadriceps",
    equipment: "Hack Squat"
  },
  "Cadeira Extensora": {
    gifUrl: "https://v2.exercisedb.io/image/Lk8RYtPwH2NjMv",
    muscleTarget: "Quadriceps",
    equipment: "Maquina"
  },
  "Mesa Flexora": {
    gifUrl: "https://v2.exercisedb.io/image/Mj9RKyPwL2HtNx",
    muscleTarget: "Isquiotibiais",
    equipment: "Maquina"
  },
  "Stiff": {
    gifUrl: "https://v2.exercisedb.io/image/Xk2RPyLwH8NjTv",
    muscleTarget: "Isquiotibiais e Gluteos",
    equipment: "Barra"
  },
  "Stiff com Barra": {
    gifUrl: "https://v2.exercisedb.io/image/Xk2RPyLwH8NjTv",
    muscleTarget: "Isquiotibiais e Gluteos",
    equipment: "Barra"
  },
  "Agachamento Búlgaro": {
    gifUrl: "https://v2.exercisedb.io/image/Vj8RKyPwL2HtNm",
    muscleTarget: "Quadriceps e Gluteos",
    equipment: "Halteres"
  },
  "Panturrilha em Pé": {
    gifUrl: "https://v2.exercisedb.io/image/Wk9RPyLwH2NjTx",
    muscleTarget: "Panturrilha",
    equipment: "Maquina"
  },
  "Panturrilha Sentada": {
    gifUrl: "https://v2.exercisedb.io/image/Yk2RPyLwH8NjTm",
    muscleTarget: "Soleo",
    equipment: "Maquina"
  },

  // GLUTEOS
  "Hip Thrust na Barra": {
    gifUrl: "https://v2.exercisedb.io/image/Zj8RKyPwL2HtNv",
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
    gifUrl: "https://v2.exercisedb.io/image/Ak9RPyLwH2NjTy",
    muscleTarget: "Gluteos",
    equipment: "Peso Corporal"
  },
  "Afundo com Halteres": {
    gifUrl: "https://v2.exercisedb.io/image/Bk2RPyLwH8NjTz",
    muscleTarget: "Quadriceps e Gluteos",
    equipment: "Halteres"
  },
  "Abdução na Máquina": {
    gifUrl: "https://v2.exercisedb.io/image/Ck8RKyPwL2HtNa",
    muscleTarget: "Gluteo Medio",
    equipment: "Maquina"
  },
  "Adução na Máquina": {
    gifUrl: "https://v2.exercisedb.io/image/Dk9RPyLwH2NjTb",
    muscleTarget: "Adutores",
    equipment: "Maquina"
  },
  "Cadeira Adutora": {
    gifUrl: "https://v2.exercisedb.io/image/Dk9RPyLwH2NjTb",
    muscleTarget: "Adutores",
    equipment: "Maquina"
  },
  "Coice na Polia (Glute Kickback)": {
    gifUrl: "https://v2.exercisedb.io/image/Ek2RPyLwH8NjTc",
    muscleTarget: "Gluteos",
    equipment: "Polia"
  },

  // ABDOMEN
  "Prancha Isométrica": {
    gifUrl: "https://v2.exercisedb.io/image/Fk8RKyPwL2HtNd",
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
    gifUrl: "https://v2.exercisedb.io/image/Gk9RPyLwH2NjTe",
    muscleTarget: "Reto Abdominal",
    equipment: "Peso Corporal"
  },
  "Abdominal Crunch": {
    gifUrl: "https://v2.exercisedb.io/image/Gk9RPyLwH2NjTe",
    muscleTarget: "Reto Abdominal",
    equipment: "Peso Corporal"
  },
  "Elevação de Pernas Suspenso": {
    gifUrl: "https://v2.exercisedb.io/image/Hk2RPyLwH8NjTf",
    muscleTarget: "Abdomen Inferior",
    equipment: "Barra Fixa"
  },
  "Abdominal Oblíquo na Polia": {
    gifUrl: "https://v2.exercisedb.io/image/Ik8RKyPwL2HtNg",
    muscleTarget: "Obliquos",
    equipment: "Polia"
  },
  "Abdominal Oblíquo": {
    gifUrl: "https://v2.exercisedb.io/image/Jk9RPyLwH2NjTh",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Abdominal na Polia Alta": {
    gifUrl: "https://v2.exercisedb.io/image/Kk2RPyLwH8NjTi",
    muscleTarget: "Reto Abdominal",
    equipment: "Polia"
  },
  "Prancha com Elevação de Braço": {
    gifUrl: "https://v2.exercisedb.io/image/Lk8RKyPwL2HtNj",
    muscleTarget: "Core",
    equipment: "Peso Corporal"
  },
  "Prancha Lateral": {
    gifUrl: "https://v2.exercisedb.io/image/Mk9RPyLwH2NjTk",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Russian Twist com Anilha": {
    gifUrl: "https://v2.exercisedb.io/image/Nk2RPyLwH8NjTl",
    muscleTarget: "Obliquos",
    equipment: "Anilha"
  },
  "Mountain Climbers": {
    gifUrl: "https://v2.exercisedb.io/image/Ok8RKyPwL2HtNm",
    muscleTarget: "Core e Cardio",
    equipment: "Peso Corporal"
  },
  "Abdominal Infra (Elevação de Pernas)": {
    gifUrl: "https://v2.exercisedb.io/image/Pk9RPyLwH2NjTn",
    muscleTarget: "Abdomen Inferior",
    equipment: "Peso Corporal"
  },
  "Abdominal Infra (Pernas Elevadas)": {
    gifUrl: "https://v2.exercisedb.io/image/Pk9RPyLwH2NjTn",
    muscleTarget: "Abdomen Inferior",
    equipment: "Peso Corporal"
  },
  "Abdominal Bicicleta": {
    gifUrl: "https://v2.exercisedb.io/image/Qk2RPyLwH8NjTo",
    muscleTarget: "Obliquos",
    equipment: "Peso Corporal"
  },
  "Dead Bug": {
    gifUrl: "https://v2.exercisedb.io/image/Rk8RKyPwL2HtNp",
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
    gifUrl: "https://v2.exercisedb.io/image/Sk9RPyLwH2NjTq",
    muscleTarget: "Peitoral",
    equipment: "Halteres"
  },
  "Crucifixo Inclinado": {
    gifUrl: "https://v2.exercisedb.io/image/Tk2RPyLwH8NjTr",
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
