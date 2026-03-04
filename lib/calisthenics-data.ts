export interface CalisthenicsExercise {
  name: string
  sets: number
  reps: string
  rest: string
  tips: string
  benefits: string[]
}

export interface CalisthenicsWorkout {
  id: string
  day: string
  duration: string
  time: string
  focus: string[]
  exercises: CalisthenicsExercise[]
  warmup: string[]
  cooldown: string[]
}

// Programa adaptado para Kleber: sem uso de mãos/antebraços (esquerdo e direito)
// Foco em: perda de gordura abdominal, core e pés/pernas
// Abdominais permitidos: apenas os que não exigem apoio das duas mãos simultaneamente
export const weeklyCalProgram: CalisthenicsWorkout[] = [
  {
    id: "cal_monday",
    day: "Segunda-feira",
    duration: "30 minutos",
    time: "12:00 - 12:30",
    focus: ["Abdômen", "Core", "Perda de barriga"],
    warmup: [
      "Marcha no lugar (elevando joelhos) - 2 min",
      "Rotação de quadril - 1 min",
      "Mobilidade de tornozelo - 2 min",
    ],
    exercises: [
      {
        name: "Abdominal Crunch (mãos apoiadas no peito ou ao lado do corpo)",
        sets: 4,
        reps: "20-25",
        rest: "45s",
        tips: "Cruze os braços no peito ou deixe ao lado do corpo. Eleve só os ombros do chão, contraindo o abdômen",
        benefits: ["Abdômen superior", "Core"],
      },
      {
        name: "Elevação de Pernas Deitado",
        sets: 4,
        reps: "15-20",
        rest: "45s",
        tips: "Deitado, braços ao lado do corpo. Eleve as pernas retas até 90 graus, desça devagar",
        benefits: ["Abdômen inferior", "Hip flexors"],
      },
      {
        name: "Bicicleta no Ar (sem apoio de mão na cabeça)",
        sets: 3,
        reps: "30 (15 cada lado)",
        rest: "30s",
        tips: "Deitado, braços ao longo do corpo. Leve joelho ao peito alternando, simulando pedalada",
        benefits: ["Oblíquos", "Abdômen completo"],
      },
      {
        name: "Agachamento Livre",
        sets: 4,
        reps: "20-25",
        rest: "60s",
        tips: "Desça bem profundo, joelhos alinhados com pés, braços estendidos à frente para equilíbrio",
        benefits: ["Pernas", "Glúteos", "Queima de gordura"],
      },
      {
        name: "Agachamento Isométrico (Cadeira no Ar)",
        sets: 3,
        reps: "40-60s",
        rest: "45s",
        tips: "Encoste as costas na parede, joelhos a 90 graus. Mantenha a posição",
        benefits: ["Pernas", "Resistência muscular", "Queima de gordura"],
      },
    ],
    cooldown: [
      "Alongamento de abdômen (deitado, braços ao longo do corpo, arqueie levemente) - 2 min",
      "Alongamento de pernas - 2 min",
      "Respiração profunda - 1 min",
    ],
  },
  {
    id: "cal_tuesday",
    day: "Terça-feira",
    duration: "30 minutos",
    time: "12:00 - 12:30",
    focus: ["Pernas", "Glúteos", "Cardio", "Queima de gordura"],
    warmup: ["Corrida estacionária - 2 min", "Agachamento sem peso - 10x", "Mobilidade de quadril - 2 min"],
    exercises: [
      {
        name: "Agachamento Livre",
        sets: 4,
        reps: "20-25",
        rest: "60s",
        tips: "Desça bem profundo, joelhos alinhados com pés",
        benefits: ["Pernas", "Glúteos", "Core"],
      },
      {
        name: "Afundo (Lunges)",
        sets: 3,
        reps: "12 cada perna",
        rest: "45s",
        tips: "Passo largo para frente, desça até joelho quase tocar o chão, braços relaxados ao lado",
        benefits: ["Pernas", "Glúteos"],
      },
      {
        name: "Elevação de Calcanhar em Pé (Panturrilha)",
        sets: 4,
        reps: "25-30",
        rest: "30s",
        tips: "Em pé, suba nas pontas dos pés, desça devagar. Trabalha panturrilha e pés",
        benefits: ["Panturrilha", "Pés", "Equilíbrio"],
      },
      {
        name: "Jump Squats (Agachamento com Salto)",
        sets: 3,
        reps: "15-20",
        rest: "60s",
        tips: "Agachamento explosivo com salto no final. Aterrisse suave nas pontas dos pés",
        benefits: ["Explosão", "Cardio", "Pernas", "Queima gordura"],
      },
      {
        name: "Marcha no Lugar com Elevação de Joelhos",
        sets: 3,
        reps: "60s",
        rest: "30s",
        tips: "Eleve os joelhos o mais alto possível, ritmo acelerado. Queima calorias eficientemente",
        benefits: ["Cardio", "Core", "Queima de gordura"],
      },
    ],
    cooldown: ["Alongamento de pernas - 3 min", "Alongamento de glúteos - 2 min"],
  },
  {
    id: "cal_wednesday",
    day: "Quarta-feira",
    duration: "30 minutos",
    time: "12:00 - 12:30",
    focus: ["Oblíquos", "Abdômen lateral", "Core"],
    warmup: ["Rotação de quadril - 2 min", "Marcha no lugar - 1 min", "Mobilidade de coluna - 2 min"],
    exercises: [
      {
        name: "Torção Abdominal (sem apoio de mãos)",
        sets: 4,
        reps: "30 (15 cada lado)",
        rest: "30s",
        tips: "Sentado no chão, pés elevados, braços cruzados no peito. Gire o tronco de um lado ao outro",
        benefits: ["Oblíquos", "Abdômen lateral"],
      },
      {
        name: "Abdominal Bicicleta com Cotovelo no Joelho",
        sets: 3,
        reps: "30 (15 cada lado)",
        rest: "45s",
        tips: "Deitado, mão apenas apoiada levemente atrás da cabeça de um lado. Leve cotovelo ao joelho oposto alternando",
        benefits: ["Oblíquos", "Abdômen completo"],
      },
      {
        name: "Agachamento Búlgaro (perna elevada em cadeira)",
        sets: 3,
        reps: "12 cada perna",
        rest: "60s",
        tips: "Perna de trás apoiada em cadeira. Desça devagar. Muito efetivo para pernas e glúteos",
        benefits: ["Pernas", "Glúteos", "Equilíbrio"],
      },
      {
        name: "Superman (deitado de barriga)",
        sets: 3,
        reps: "15-20",
        rest: "45s",
        tips: "Deitado de barriga, eleve pernas e tronco simultaneamente. Fortalece lombar e postura",
        benefits: ["Lombar", "Postura", "Core posterior"],
      },
      {
        name: "Agachamento Isométrico Lateral (Sumo Squat)",
        sets: 3,
        reps: "20-25",
        rest: "45s",
        tips: "Pés bem abertos, pontas dos pés para fora, desça profundo. Trabalha face interna das coxas",
        benefits: ["Adutores", "Pernas", "Glúteos"],
      },
    ],
    cooldown: ["Alongamento lateral de tronco - 2 min", "Mobilidade de coluna - 2 min", "Respiração - 1 min"],
  },
  {
    id: "cal_thursday",
    day: "Quinta-feira",
    duration: "DESCANSO",
    time: "-",
    focus: ["Recuperação"],
    warmup: [],
    exercises: [],
    cooldown: [],
  },
  {
    id: "cal_friday",
    day: "Sexta-feira",
    duration: "30 minutos",
    time: "12:00 - 12:30",
    focus: ["Abdômen", "Core", "Queima de gordura"],
    warmup: ["Marcha com joelhos altos - 1 min", "Mobilidade de quadril - 2 min", "Rotação de tronco - 2 min"],
    exercises: [
      {
        name: "Elevação de Pernas Deitado",
        sets: 4,
        reps: "20",
        rest: "45s",
        tips: "Deitado no chão, braços ao lado do corpo. Eleve as pernas retas. Abdômen inferior trabalhando",
        benefits: ["Abdômen inferior", "Hip flexors"],
      },
      {
        name: "Crunch Abdominal (mãos no peito)",
        sets: 4,
        reps: "25-30",
        rest: "30s",
        tips: "Mãos cruzadas no peito. Eleve apenas os ombros, contraindo forte o abdômen",
        benefits: ["Abdômen superior", "Core"],
      },
      {
        name: "Abdominal Invertido (Reverse Crunch)",
        sets: 3,
        reps: "15-20",
        rest: "45s",
        tips: "Deitado, braços ao lado do corpo. Puxe os joelhos em direção ao peito levantando o quadril do chão",
        benefits: ["Abdômen inferior", "Core profundo"],
      },
      {
        name: "Agachamento Livre com Pausa",
        sets: 3,
        reps: "15",
        rest: "60s",
        tips: "Desça e segure embaixo por 2 segundos. Aumenta a queima e a força muscular",
        benefits: ["Pernas", "Glúteos", "Queima gordura"],
      },
      {
        name: "Corrida no Lugar (High Knees)",
        sets: 4,
        reps: "45s",
        rest: "30s",
        tips: "Eleve os joelhos o mais alto possível em ritmo acelerado para queima máxima",
        benefits: ["Cardio", "Queima gordura", "Pernas"],
      },
    ],
    cooldown: ["Alongamento de abdômen - 2 min", "Alongamento de pernas - 2 min", "Respiração profunda - 1 min"],
  },
  {
    id: "cal_saturday",
    day: "Sábado",
    duration: "60 minutos",
    time: "Horário livre",
    focus: ["Full Body", "Queima máxima de gordura", "Abdômen", "Pernas e Pés"],
    warmup: [
      "Marcha com joelhos altos - 3 min",
      "Agachamento sem peso - 15x",
      "Rotação de quadril - 2 min",
      "Mobilidade de tornozelo e pés - 3 min",
    ],
    exercises: [
      {
        name: "Agachamento Livre",
        sets: 5,
        reps: "25-30",
        rest: "60s",
        tips: "Descida profunda, subida explosiva. Motor principal da queima calórica",
        benefits: ["Pernas", "Glúteos", "Queima gordura"],
      },
      {
        name: "Elevação de Pernas Deitado",
        sets: 5,
        reps: "20-25",
        rest: "45s",
        tips: "Braços ao lado do corpo. Pernas retas. Controle total no movimento de descida",
        benefits: ["Abdômen inferior", "Core"],
      },
      {
        name: "Afundos Caminhando",
        sets: 4,
        reps: "20 (10 cada perna)",
        rest: "60s",
        tips: "Caminhe fazendo afundos pelo espaço disponível, braços ao lado do corpo",
        benefits: ["Pernas", "Glúteos", "Equilíbrio"],
      },
      {
        name: "Crunch Abdominal (mãos no peito)",
        sets: 4,
        reps: "30",
        rest: "45s",
        tips: "Mãos cruzadas no peito. Série longa para máxima queima de gordura abdominal",
        benefits: ["Abdômen superior", "Core"],
      },
      {
        name: "Torção Abdominal Sentado (braços cruzados no peito)",
        sets: 4,
        reps: "40 (20 cada lado)",
        rest: "30s",
        tips: "Sentado, pés levemente elevados, braços cruzados no peito. Gire o tronco ao máximo",
        benefits: ["Oblíquos", "Abdômen lateral"],
      },
      {
        name: "Elevação de Calcanhar em Pé",
        sets: 4,
        reps: "30",
        rest: "30s",
        tips: "Suba nas pontas dos pés bem alto, desça lentamente. Fortalece panturrilha e pés",
        benefits: ["Panturrilha", "Pés", "Equilíbrio"],
      },
      {
        name: "Jump Squats (Agachamento com Salto)",
        sets: 4,
        reps: "20",
        rest: "60s",
        tips: "Explosão máxima, aterrisse suave. Cardio intenso integrado",
        benefits: ["Pernas", "Cardio", "Queima gordura"],
      },
      {
        name: "High Knees FINALIZADOR",
        sets: 4,
        reps: "60s",
        rest: "45s",
        tips: "Corrida no lugar com joelhos bem altos. Máxima intensidade para finalizar o treino",
        benefits: ["Cardio explosivo", "Queima máxima"],
      },
    ],
    cooldown: [
      "Alongamento completo de pernas e pés - 5 min",
      "Alongamento de abdômen - 3 min",
      "Respiração e relaxamento - 2 min",
    ],
  },
  {
    id: "cal_sunday",
    day: "Domingo",
    duration: "DESCANSO",
    time: "-",
    focus: ["Recuperação total", "Descanso ativo (caminhada leve opcional)"],
    warmup: [],
    exercises: [],
    cooldown: [],
  },
]
