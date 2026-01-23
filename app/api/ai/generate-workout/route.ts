import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const workoutSchema = z.object({
  name: z.string().describe('Nome do treino'),
  description: z.string().describe('Descricao breve do treino'),
  duration: z.string().describe('Duracao estimada em minutos'),
  difficulty: z.enum(['iniciante', 'intermediario', 'avancado']),
  warmup: z.array(z.object({
    exercise: z.string(),
    duration: z.string(),
    instructions: z.string(),
  })).describe('Exercicios de aquecimento'),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.string(),
    rest: z.string(),
    muscleGroup: z.string(),
    instructions: z.string(),
    tips: z.string().optional(),
  })).describe('Lista de exercicios principais'),
  cooldown: z.array(z.object({
    exercise: z.string(),
    duration: z.string(),
    instructions: z.string(),
  })).describe('Exercicios de volta a calma'),
  tips: z.array(z.string()).describe('Dicas gerais para o treino'),
});

export async function POST(req: Request) {
  try {
    const { goal, level, equipment, duration, restrictions, focusArea } = await req.json();

    const prompt = `Voce e um personal trainer especialista brasileiro. Crie um treino personalizado com as seguintes caracteristicas:

OBJETIVO: ${goal || 'Condicionamento geral'}
NIVEL: ${level || 'Intermediario'}
EQUIPAMENTOS DISPONIVEIS: ${equipment || 'Academia completa'}
DURACAO DESEJADA: ${duration || '60'} minutos
RESTRICOES/LESOES: ${restrictions || 'Nenhuma'}
AREA DE FOCO: ${focusArea || 'Corpo inteiro'}

Crie um treino completo, seguro e eficiente em portugues. Inclua:
- Aquecimento adequado (5-10 min)
- Exercicios principais com series, repeticoes e descanso
- Volta a calma/alongamento
- Dicas de execucao e seguranca

Seja especifico nas instrucoes e adapte para o nivel do aluno.`;

    const { object } = await generateObject({
      model: 'openai/gpt-5-mini',
      schema: workoutSchema,
      prompt,
      maxTokens: 4000,
      temperature: 0.7,
    });

    return Response.json({ workout: object });
  } catch (error) {
    console.error('[v0] Erro ao gerar treino:', error);
    return Response.json(
      { error: 'Erro ao gerar treino. Tente novamente.' },
      { status: 500 }
    );
  }
}
