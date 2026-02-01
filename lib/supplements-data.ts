export interface Supplement {
  name: string
  dosage: string
  timing: string
  purpose: string
  howToUse: string
  tips: string[]
  category: "proteina" | "performance" | "saude" | "emagrecimento" | "hormonal" | "recuperacao"
}

// Suplementos para KLEBER - Foco em perda de gordura + massa muscular + energia
export const kleberSupplements: Supplement[] = [
  {
    name: "Whey Protein Isolado",
    dosage: "30g (1 scoop)",
    timing: "Pos-treino imediato",
    purpose: "Recuperacao muscular e ganho de massa magra",
    howToUse: "Misture 1 scoop (30g) em 200-300ml de agua gelada. Bata no shaker por 30 segundos ate dissolver completamente.",
    tips: [
      "Tome ate 30 minutos apos o treino para maxima absorcao",
      "Pode adicionar banana ou aveia para um shake mais completo",
      "Evite misturar com leite no pos-treino (digestao mais lenta)"
    ],
    category: "proteina"
  },
  {
    name: "Creatina Monohidratada",
    dosage: "5g",
    timing: "Pos-treino ou qualquer horario fixo",
    purpose: "Forca, resistencia e ganho de massa muscular",
    howToUse: "Dissolva 5g (1 colher de cha cheia) em 200ml de agua ou suco. Tome todos os dias, inclusive nos dias de descanso.",
    tips: [
      "Nao precisa fazer fase de carga - 5g/dia e suficiente",
      "Tome sempre no mesmo horario para criar habito",
      "Beba bastante agua ao longo do dia (minimo 3L)"
    ],
    category: "performance"
  },
  {
    name: "Cafeina",
    dosage: "200-300mg",
    timing: "30min antes do treino",
    purpose: "Energia, foco e queima de gordura",
    howToUse: "Tome 1 capsula (200mg) com agua, 30 minutos antes do treino. Em dias de treino pesado, pode usar 2 capsulas.",
    tips: [
      "Evite tomar apos as 16h para nao atrapalhar o sono",
      "Comece com dose menor se nao esta acostumado",
      "Alterne periodos de uso para nao criar tolerancia"
    ],
    category: "emagrecimento"
  },
  {
    name: "Termogenico (Cafeina + Cha Verde)",
    dosage: "Conforme fabricante",
    timing: "Manha + 30min antes do treino",
    purpose: "Acelera metabolismo e queima gordura abdominal",
    howToUse: "Tome 1 dose pela manha em jejum e outra 30min antes do treino. Nunca tome proximo ao horario de dormir.",
    tips: [
      "Use por ciclos de 8-12 semanas com pausa de 4 semanas",
      "Nao combine com cafe ou energeticos",
      "Beba muita agua para evitar desidratacao"
    ],
    category: "emagrecimento"
  },
  {
    name: "BCAA 2:1:1",
    dosage: "5g",
    timing: "Durante o treino",
    purpose: "Previne perda muscular e recuperacao",
    howToUse: "Dissolva 5g em 500ml de agua e va bebendo durante o treino. Pode usar saborizados para melhor sabor.",
    tips: [
      "Essencial em treinos longos (mais de 1 hora)",
      "Ajuda a manter energia durante o treino",
      "Pode ser tomado em jejum antes do cardio"
    ],
    category: "recuperacao"
  },
  {
    name: "Omega 3",
    dosage: "2-3g",
    timing: "Com refeicoes (2x ao dia)",
    purpose: "Saude cardiovascular e anti-inflamatorio",
    howToUse: "Tome 1-2 capsulas no almoco e 1-2 no jantar, sempre junto com a refeicao para melhor absorcao.",
    tips: [
      "Guarde na geladeira para evitar oxidacao",
      "Prefira versoes com EPA e DHA concentrados",
      "Tome com comida para evitar arrotos de peixe"
    ],
    category: "saude"
  },
  {
    name: "Multivitaminico",
    dosage: "Conforme fabricante",
    timing: "Cafe da manha",
    purpose: "Suprir necessidades nutricionais basicas",
    howToUse: "Tome 1 comprimido pela manha, junto com o cafe da manha. Nunca tome em jejum.",
    tips: [
      "Escolha formulas para homens ativos/atletas",
      "Nao substitui uma alimentacao equilibrada",
      "Tome sempre com comida para evitar enjoo"
    ],
    category: "saude"
  },
  {
    name: "L-Carnitina",
    dosage: "2g",
    timing: "30min antes do cardio",
    purpose: "Transporte de gordura para queima energetica",
    howToUse: "Tome 2g (liquido ou capsula) 30 minutos antes do aerobico. Funciona melhor em jejum ou com pouco carboidrato.",
    tips: [
      "Mais eficaz antes de exercicios aerobicos",
      "Combine com cafeina para potencializar efeito",
      "Versao liquida tem absorcao mais rapida"
    ],
    category: "emagrecimento"
  },
  {
    name: "Glutamina",
    dosage: "5g",
    timing: "Antes de dormir",
    purpose: "Recuperacao muscular e imunidade",
    howToUse: "Dissolva 5g em agua ou suco antes de dormir. Pode tambem dividir: 2.5g pos-treino e 2.5g antes de dormir.",
    tips: [
      "Essencial em periodos de treino intenso",
      "Ajuda na recuperacao do intestino",
      "Fortalece o sistema imunologico"
    ],
    category: "recuperacao"
  },
  {
    name: "ZMA (Zinco + Magnesio)",
    dosage: "Conforme fabricante",
    timing: "Antes de dormir",
    purpose: "Melhora do sono e recuperacao hormonal",
    howToUse: "Tome 30-60 minutos antes de dormir, de estomago vazio. Nao tome com calcio ou laticinios.",
    tips: [
      "Melhora significativamente a qualidade do sono",
      "Ajuda na producao natural de testosterona",
      "Pode causar sonhos vividos - e normal"
    ],
    category: "hormonal"
  },
]

// Suplementos para PAMELA - Foco em gordura, tonificacao, energia e libido
export const pamelaSupplements: Supplement[] = [
  {
    name: "Whey Protein Isolado",
    dosage: "25g (1 scoop)",
    timing: "Pos-treino imediato",
    purpose: "Tonificacao muscular sem flacidez",
    howToUse: "Misture 1 scoop (25g) em 200ml de agua gelada. Pode adicionar frutas para um shake mais gostoso.",
    tips: [
      "Tome ate 30 minutos apos o treino",
      "Escolha sabores que voce goste para manter consistencia",
      "Pode ser usado como lanche proteico entre refeicoes"
    ],
    category: "proteina"
  },
  {
    name: "Colageno Hidrolisado",
    dosage: "10g",
    timing: "Manha ou antes de dormir",
    purpose: "Firmeza da pele e prevencao de flacidez",
    howToUse: "Dissolva 10g em agua, suco ou cafe. Pode ser tomado quente ou frio. Consistencia e mais importante que horario.",
    tips: [
      "Tome por pelo menos 3 meses para ver resultados",
      "Combine com vitamina C para melhor absorcao",
      "Ajuda tambem nas articulacoes e cabelo"
    ],
    category: "saude"
  },
  {
    name: "Creatina Monohidratada",
    dosage: "3g",
    timing: "Pos-treino",
    purpose: "Definicao muscular (gluteos) sem inchaco",
    howToUse: "Dissolva 3g em agua apos o treino. Dose menor para mulheres evita retencao excessiva.",
    tips: [
      "Nao causa inchaco na dose correta para mulheres",
      "Ajuda a ganhar forca nos treinos de gluteo",
      "Tome todos os dias, mesmo sem treinar"
    ],
    category: "performance"
  },
  {
    name: "Termogenico Feminino",
    dosage: "Conforme fabricante",
    timing: "Manha",
    purpose: "Queima de gordura abdominal",
    howToUse: "Tome 1 dose pela manha, de preferencia antes do cafe da manha. Evite apos as 14h.",
    tips: [
      "Escolha formulas sem estimulantes fortes",
      "Use por ciclos de 6-8 semanas",
      "Hidrate-se muito bem durante o uso"
    ],
    category: "emagrecimento"
  },
  {
    name: "CLA (Acido Linoleico Conjugado)",
    dosage: "3g",
    timing: "Com refeicoes (dividido)",
    purpose: "Reducao de gordura corporal e definicao",
    howToUse: "Tome 1g em cada refeicao principal (cafe, almoco, jantar). Sempre com comida.",
    tips: [
      "Resultados aparecem apos 8-12 semanas de uso",
      "Ajuda especialmente na gordura abdominal",
      "Nao tem efeitos estimulantes"
    ],
    category: "emagrecimento"
  },
  {
    name: "Omega 3",
    dosage: "2g",
    timing: "Com refeicoes",
    purpose: "Saude hormonal e anti-inflamatorio",
    howToUse: "Tome 1 capsula no almoco e 1 no jantar, junto com a comida.",
    tips: [
      "Essencial para equilibrio hormonal feminino",
      "Ajuda na saude da pele e cabelo",
      "Guarde na geladeira"
    ],
    category: "saude"
  },
  {
    name: "Multivitaminico Feminino",
    dosage: "Conforme fabricante",
    timing: "Cafe da manha",
    purpose: "Equilibrio nutricional e hormonal",
    howToUse: "Tome 1 comprimido pela manha com o cafe da manha.",
    tips: [
      "Escolha formulas especificas para mulheres",
      "Deve conter ferro, acido folico e calcio",
      "Tome com comida para evitar enjoo"
    ],
    category: "saude"
  },
  {
    name: "Maca Peruana",
    dosage: "1-3g",
    timing: "Manha",
    purpose: "Aumento de energia, disposicao e LIBIDO",
    howToUse: "Tome 1-3g pela manha, pode ser em po misturado em vitaminas ou em capsulas.",
    tips: [
      "Comece com dose menor e aumente gradualmente",
      "Resultados para libido em 2-4 semanas",
      "Pode ser usada continuamente"
    ],
    category: "hormonal"
  },
  {
    name: "Tribulus Terrestris",
    dosage: "500-1000mg",
    timing: "Manha ou pre-treino",
    purpose: "Aumento do LIBIDO e energia",
    howToUse: "Tome 500-1000mg pela manha ou 30min antes do treino.",
    tips: [
      "Use por ciclos de 8-12 semanas",
      "Pode combinar com Maca para potencializar",
      "Efeitos aparecem em 2-3 semanas"
    ],
    category: "hormonal"
  },
  {
    name: "Vitamina D3",
    dosage: "2000-4000 UI",
    timing: "Manha",
    purpose: "Saude hormonal, imunidade e bem-estar",
    howToUse: "Tome 1 capsula pela manha, junto com uma refeicao que contenha gordura.",
    tips: [
      "Faca exame de sangue para verificar seus niveis",
      "Essencial para quem nao toma sol regularmente",
      "Ajuda no humor e disposicao"
    ],
    category: "saude"
  },
  {
    name: "Magnesio Quelado",
    dosage: "300-400mg",
    timing: "Antes de dormir",
    purpose: "Relaxamento, sono e equilibrio hormonal",
    howToUse: "Tome 1-2 capsulas 30-60 minutos antes de dormir.",
    tips: [
      "Melhora muito a qualidade do sono",
      "Ajuda com colicas e TPM",
      "Reduz ansiedade e estresse"
    ],
    category: "saude"
  },
]

// Suplementos para JULIANA - Foco em emagrecimento saudavel e bem-estar
export const julianaSupplements: Supplement[] = [
  {
    name: "Proteina Vegana ou Whey Isolado",
    dosage: "20-25g (1 scoop)",
    timing: "Pos-treino ou lanche",
    purpose: "Manter massa magra durante emagrecimento",
    howToUse: "Misture 1 scoop em 200ml de agua ou leite vegetal. Pode usar como lanche da tarde.",
    tips: [
      "Essencial para nao perder musculo ao emagrecer",
      "Pode substituir um lanche quando nao tiver tempo",
      "Escolha sabores naturais sem muito acucar"
    ],
    category: "proteina"
  },
  {
    name: "Colageno Hidrolisado",
    dosage: "10g",
    timing: "Manha",
    purpose: "Prevenir flacidez durante emagrecimento",
    howToUse: "Dissolva 10g em agua, suco ou cha pela manha.",
    tips: [
      "Fundamental para evitar flacidez ao perder peso",
      "Tome com vitamina C (suco de laranja/limao)",
      "Resultados visiveis em 2-3 meses"
    ],
    category: "saude"
  },
  {
    name: "Cha Verde em Capsulas",
    dosage: "500mg",
    timing: "Manha e antes do almoco",
    purpose: "Acelerar metabolismo naturalmente",
    howToUse: "Tome 1 capsula pela manha e 1 antes do almoco. Evite a noite.",
    tips: [
      "Termogenico natural e suave",
      "Rico em antioxidantes",
      "Nao causa agitacao como outros termogenicos"
    ],
    category: "emagrecimento"
  },
  {
    name: "Omega 3",
    dosage: "2g",
    timing: "Com refeicoes",
    purpose: "Saude cardiovascular e metabolismo",
    howToUse: "Tome 1 capsula no almoco e 1 no jantar.",
    tips: [
      "Ajuda no metabolismo das gorduras",
      "Melhora saude do coracao",
      "Beneficia pele e cabelo"
    ],
    category: "saude"
  },
  {
    name: "Multivitaminico",
    dosage: "Conforme fabricante",
    timing: "Cafe da manha",
    purpose: "Garantir nutrientes durante dieta restritiva",
    howToUse: "Tome 1 comprimido com o cafe da manha.",
    tips: [
      "Importante quando esta em deficit calorico",
      "Previne deficiencias nutricionais",
      "Mantem energia e disposicao"
    ],
    category: "saude"
  },
  {
    name: "Fibras (Psyllium ou Glucomannan)",
    dosage: "3-5g",
    timing: "30min antes das refeicoes principais",
    purpose: "Aumentar saciedade e regular intestino",
    howToUse: "Dissolva em um copo grande de agua e beba 30min antes de almocar e jantar.",
    tips: [
      "Beba MUITA agua junto - essencial!",
      "Ajuda muito a controlar a fome",
      "Regula o intestino naturalmente"
    ],
    category: "emagrecimento"
  },
  {
    name: "Vitamina D3",
    dosage: "2000 UI",
    timing: "Manha",
    purpose: "Energia, imunidade e bem-estar",
    howToUse: "Tome 1 capsula pela manha com o cafe da manha.",
    tips: [
      "Melhora humor e disposicao",
      "Essencial para metabolismo",
      "Faca exame para verificar niveis"
    ],
    category: "saude"
  },
  {
    name: "Magnesio",
    dosage: "200-300mg",
    timing: "Antes de dormir",
    purpose: "Sono de qualidade e reducao de ansiedade",
    howToUse: "Tome 1 capsula 30 minutos antes de dormir.",
    tips: [
      "Melhora qualidade do sono",
      "Reduz ansiedade que causa compulsao alimentar",
      "Ajuda na recuperacao muscular"
    ],
    category: "saude"
  },
]

export const getSupplementsByUser = (userId: string): Supplement[] => {
  switch (userId) {
    case "kleber":
      return kleberSupplements
    case "pamela":
      return pamelaSupplements
    case "juliana":
      return julianaSupplements
    default:
      return []
  }
}

// Categorias de suplementos para filtro
export const supplementCategories = {
  proteina: { name: "Proteinas", color: "#3b82f6" },
  performance: { name: "Performance", color: "#8b5cf6" },
  saude: { name: "Saude Geral", color: "#10b981" },
  emagrecimento: { name: "Emagrecimento", color: "#f97316" },
  hormonal: { name: "Hormonal", color: "#ec4899" },
  recuperacao: { name: "Recuperacao", color: "#06b6d4" },
}
