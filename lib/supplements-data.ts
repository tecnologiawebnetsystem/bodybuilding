export interface Supplement {
  name: string
  dosage: string
  timing: string
  purpose: string
}

// Suplementos para KLEBER - Foco em perda de gordura + massa muscular + energia
export const kleberSupplements: Supplement[] = [
  {
    name: "Whey Protein Isolado",
    dosage: "30g (1 scoop)",
    timing: "Pós-treino imediato",
    purpose: "Recuperação muscular e ganho de massa magra",
  },
  {
    name: "Creatina Monohidratada",
    dosage: "5g",
    timing: "Pós-treino ou qualquer horário fixo",
    purpose: "Força, resistência e ganho de massa muscular",
  },
  {
    name: "Cafeína",
    dosage: "200-300mg",
    timing: "30min antes do treino",
    purpose: "Energia, foco e queima de gordura",
  },
  {
    name: "Termogênico (com Cafeína + Chá Verde)",
    dosage: "Conforme fabricante",
    timing: "Manhã + 30min antes do treino",
    purpose: "Acelera metabolismo e queima gordura abdominal",
  },
  {
    name: "BCAA 2:1:1",
    dosage: "5g",
    timing: "Durante o treino",
    purpose: "Previne perda muscular e recuperação",
  },
  {
    name: "Ômega 3",
    dosage: "2-3g",
    timing: "Com refeições (2x ao dia)",
    purpose: "Saúde cardiovascular e anti-inflamatório",
  },
  {
    name: "Multivitamínico",
    dosage: "Conforme fabricante",
    timing: "Café da manhã",
    purpose: "Suprir necessidades nutricionais básicas",
  },
  {
    name: "L-Carnitina",
    dosage: "2g",
    timing: "30min antes do cardio",
    purpose: "Transporte de gordura para queima energética",
  },
  {
    name: "Glutamina",
    dosage: "5g",
    timing: "Antes de dormir",
    purpose: "Recuperação muscular e imunidade",
  },
  {
    name: "ZMA (Zinco + Magnésio)",
    dosage: "Conforme fabricante",
    timing: "Antes de dormir",
    purpose: "Melhora do sono e recuperação hormonal",
  },
]

// Suplementos para PAMELA - Foco em gordura, tonificação, energia e libido
export const pamelaSupplements: Supplement[] = [
  {
    name: "Whey Protein Isolado",
    dosage: "25g (1 scoop)",
    timing: "Pós-treino imediato",
    purpose: "Tonificação muscular sem flacidez",
  },
  {
    name: "Colágeno Hidrolisado",
    dosage: "10g",
    timing: "Manhã ou antes de dormir",
    purpose: "Firmeza da pele e prevenção de flacidez",
  },
  {
    name: "Creatina Monohidratada",
    dosage: "3g",
    timing: "Pós-treino",
    purpose: "Definição muscular (glúteos) sem inchaço",
  },
  {
    name: "Termogênico Feminino (sem estimulantes fortes)",
    dosage: "Conforme fabricante",
    timing: "Manhã",
    purpose: "Queima de gordura abdominal pós-gravidez",
  },
  {
    name: "Cafeína",
    dosage: "100-200mg",
    timing: "30min antes do treino",
    purpose: "Energia e foco para treinos intensos",
  },
  {
    name: "CLA (Ácido Linoleico Conjugado)",
    dosage: "3g",
    timing: "Com refeições (dividido)",
    purpose: "Redução de gordura corporal e definição",
  },
  {
    name: "Ômega 3",
    dosage: "2g",
    timing: "Com refeições",
    purpose: "Saúde hormonal e anti-inflamatório",
  },
  {
    name: "Multivitamínico Feminino",
    dosage: "Conforme fabricante",
    timing: "Café da manhã",
    purpose: "Equilíbrio nutricional e hormonal",
  },
  {
    name: "Maca Peruana",
    dosage: "1-3g",
    timing: "Manhã",
    purpose: "Aumento de energia, disposição e LIBIDO",
  },
  {
    name: "Tribulus Terrestris",
    dosage: "500-1000mg",
    timing: "Manhã ou pré-treino",
    purpose: "Aumento do LIBIDO e energia",
  },
  {
    name: "Vitamina D3",
    dosage: "2000-4000 UI",
    timing: "Manhã",
    purpose: "Saúde hormonal, imunidade e bem-estar",
  },
  {
    name: "Magnésio Quelado",
    dosage: "300-400mg",
    timing: "Antes de dormir",
    purpose: "Relaxamento, sono e equilíbrio hormonal",
  },
  {
    name: "Ferro (se necessário - verificar com exames)",
    dosage: "Conforme orientação médica",
    timing: "Conforme orientação",
    purpose: "Prevenção de anemia e mais energia",
  },
]

export const getSupplementsByUser = (userId: string): Supplement[] => {
  return userId === "kleber" ? kleberSupplements : pamelaSupplements
}
