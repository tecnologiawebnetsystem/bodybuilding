import { generateObject } from 'ai';
import { z } from 'zod';
import { model } from "@/lib/ai-config";

export const maxDuration = 60;

const mealPlanSchema = z.object({
  dailyCalories: z.number().describe('Calorias diarias recomendadas'),
  macros: z.object({
    protein: z.number().describe('Gramas de proteina'),
    carbs: z.number().describe('Gramas de carboidratos'),
    fat: z.number().describe('Gramas de gordura'),
  }),
  meals: z.array(z.object({
    name: z.string().describe('Nome da refeicao (cafe, almoco, etc)'),
    time: z.string().describe('Horario sugerido'),
    calories: z.number(),
    foods: z.array(z.object({
      name: z.string(),
      portion: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })),
    tips: z.string().optional(),
  })),
  hydration: z.object({
    dailyWater: z.number().describe('Litros de agua por dia'),
    tips: z.array(z.string()),
  }),
  supplements: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    timing: z.string(),
    benefit: z.string(),
  })).optional(),
  generalTips: z.array(z.string()),
});

const mealSuggestionSchema = z.object({
  suggestion: z.object({
    name: z.string(),
    description: z.string(),
    ingredients: z.array(z.object({
      item: z.string(),
      quantity: z.string(),
    })),
    preparation: z.array(z.string()),
    nutritionInfo: z.object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    }),
    prepTime: z.string(),
    tips: z.array(z.string()),
  }),
});

export async function POST(req: Request) {
  try {
    const { type, goal, weight, height, age, gender, activityLevel, restrictions, preferences } = await req.json();

    if (type === 'meal-plan') {
      const prompt = `Voce e um nutricionista esportivo brasileiro especializado. Crie um plano alimentar personalizado em portugues:

OBJETIVO: ${goal || 'Manutencao de peso'}
PESO: ${weight || '70'}kg
ALTURA: ${height || '170'}cm
IDADE: ${age || '30'} anos
SEXO: ${gender || 'Masculino'}
NIVEL DE ATIVIDADE: ${activityLevel || 'Moderado'}
RESTRICOES ALIMENTARES: ${restrictions || 'Nenhuma'}
PREFERENCIAS: ${preferences || 'Sem preferencia especifica'}

Calcule as necessidades caloricas e de macronutrientes.
Crie um cardapio completo com 5-6 refeicoes diarias.
Inclua opcoes praticas e acessiveis no Brasil.
Adicione dicas de hidratacao e suplementacao se necessario.`;

      const { object } = await generateObject({
        model: model("openai/gpt-4o-mini"),
        schema: mealPlanSchema,
        prompt,
      });

      return Response.json({ mealPlan: object });
    }

    if (type === 'meal-suggestion') {
      const prompt = `Voce e um nutricionista esportivo brasileiro. Sugira uma refeicao em portugues para:

TIPO DE REFEICAO: ${preferences || 'Almoco'}
OBJETIVO: ${goal || 'Ganho de massa'}
RESTRICOES: ${restrictions || 'Nenhuma'}

Crie uma receita completa, saborosa e nutritiva com instrucoes de preparo.`;

      const { object } = await generateObject({
        model: model("openai/gpt-4o-mini"),
        schema: mealSuggestionSchema,
        prompt,
      });

      return Response.json({ suggestion: object.suggestion });
    }

    return Response.json({ error: 'Tipo de requisicao invalido' }, { status: 400 });
  } catch (error: any) {
    console.error('[v0] Erro no assistente de nutricao:', error);
    console.error('[v0] Detalhes do erro:', error?.message, error?.cause);
    return Response.json(
      { error: error?.message || 'Erro ao processar requisicao. Tente novamente.' },
      { status: 500 }
    );
  }
}
