export const nutritionPlan = {
  dailyCalories: 2000,
  protein: 160, // gramas
  carbs: 180, // gramas
  fats: 50, // gramas
  meals: [
    {
      name: "Café da Manhã (7h)",
      time: "7:00",
      foods: [
        "4 claras + 2 ovos inteiros mexidos",
        "2 fatias de pão integral",
        "1 banana média",
        "1 colher de pasta de amendoim",
        "Café sem açúcar",
      ],
    },
    {
      name: "Lanche da Manhã (10h)",
      time: "10:00",
      foods: ["1 scoop de whey protein", "1 porção de oleaginosas (castanhas/amêndoas)", "1 fruta (maçã ou pera)"],
    },
    {
      name: "Almoço (13h)",
      time: "13:00",
      foods: [
        "150g de frango grelhado ou peixe",
        "5 colheres de arroz integral",
        "Salada verde à vontade",
        "3 colheres de feijão ou lentilha",
        "1 porção de legumes cozidos",
      ],
    },
    {
      name: "Pré-Treino (15h30)",
      time: "15:30",
      foods: ["1 batata doce média", "1 scoop de whey protein", "1 banana", "Opcional: café preto ou pré-treino"],
    },
    {
      name: "Pós-Treino (18h30)",
      time: "18:30",
      foods: ["1 scoop de whey protein", "1 fruta (banana ou melancia)", "Opcional: 5g de creatina"],
    },
    {
      name: "Jantar (20h)",
      time: "20:00",
      foods: [
        "150g de carne vermelha magra ou frango",
        "Salada verde generosa",
        "1 porção de legumes",
        "2 colheres de arroz integral (opcional)",
        "Azeite extra virgem",
      ],
    },
    {
      name: "Ceia (22h)",
      time: "22:00",
      foods: ["200g de iogurte grego natural", "1 scoop de caseína ou whey", "Opcional: 1 colher de chia"],
    },
  ],
}

export const supplements = [
  {
    name: "Whey Protein",
    dosage: "2-3 scoops por dia (60-90g)",
    timing: "Pós-treino e lanches",
    benefit: "Essencial para atingir meta de proteína e recuperação muscular",
  },
  {
    name: "Creatina Monohidratada",
    dosage: "5g por dia",
    timing: "Pós-treino ou qualquer horário fixo",
    benefit: "Aumenta força, performance e ganho de massa magra",
  },
  {
    name: "Multivitamínico",
    dosage: "1 dose por dia",
    timing: "Café da manhã",
    benefit: "Supre deficiências nutricionais e melhora saúde geral",
  },
  {
    name: "Ômega 3",
    dosage: "2-3g por dia",
    timing: "Com refeições principais",
    benefit: "Anti-inflamatório, melhora recuperação e saúde cardiovascular",
  },
  {
    name: "Cafeína (Pré-Treino)",
    dosage: "200-300mg",
    timing: "30 minutos antes do treino",
    benefit: "Aumenta energia, foco e performance no treino",
  },
  {
    name: "BCAA",
    dosage: "5-10g",
    timing: "Durante treino",
    benefit: "Reduz catabolismo e melhora recuperação (opcional se já usa whey)",
  },
  {
    name: "Termogênico Natural",
    dosage: "Conforme fabricante",
    timing: "Pela manhã e pré-treino",
    benefit: "Acelera metabolismo e auxilia na queima de gordura",
  },
]
