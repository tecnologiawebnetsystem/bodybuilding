import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export const maxDuration = 30;

// Palavras-chave permitidas (topicos relacionados a fitness)
const ALLOWED_TOPICS = [
  'treino', 'exercicio', 'musculacao', 'academia', 'workout', 'series', 'repeticoes',
  'carga', 'peso', 'haltere', 'barra', 'maquina', 'aparelho', 'alongamento', 'aquecimento',
  'cardio', 'aerobico', 'anaerobico', 'hiit', 'crossfit', 'funcional', 'calistenia',
  'flexao', 'agachamento', 'supino', 'rosca', 'puxada', 'remada', 'leg', 'abdominal',
  'gluteo', 'biceps', 'triceps', 'ombro', 'costas', 'peito', 'perna', 'panturrilha',
  'corrida', 'correr', 'caminhada', 'esteira', 'bike', 'bicicleta', 'natacao', 'nadar',
  'maratona', 'km', 'quilometro', 'pace', 'ritmo', 'esporte', 'futebol', 'volei',
  'nutricao', 'alimentacao', 'dieta', 'comida', 'alimento', 'refeicao', 'cafe da manha',
  'almoco', 'jantar', 'lanche', 'proteina', 'carboidrato', 'gordura', 'fibra', 'vitamina',
  'mineral', 'caloria', 'kcal', 'macro', 'micronutriente', 'frango', 'peixe', 'ovo',
  'arroz', 'batata', 'aveia', 'fruta', 'legume', 'verdura', 'salada', 'agua', 'hidratacao',
  'suplemento', 'suplementacao', 'whey', 'creatina', 'bcaa', 'glutamina', 'pre-treino',
  'pos-treino', 'hipercalorico', 'termogenico', 'cafeina', 'shake',
  'saude', 'saudavel', 'corpo', 'fisico', 'massa', 'magro', 'emagrecer',
  'engordar', 'ganhar', 'perder', 'definicao', 'hipertrofia', 'cutting', 'bulking',
  'metabolismo', 'imc', 'medida', 'cintura', 'braco', 'coxa', 'percentual', 'balanca',
  'evolucao', 'resultado', 'progresso', 'antes', 'depois', 'transformacao',
  'descanso', 'recuperacao', 'sono', 'dormir', 'overtraining', 'lesao', 'dor', 'muscular',
  'app', 'aplicativo', 'fittransform', 'fit transform', 'plano', 'assinatura', 'check-in',
  'personal', 'trainer', 'aluno', 'professor', 'instrutor', 'ficha', 'planilha',
  'motivacao', 'foco', 'disciplina', 'meta', 'objetivo', 'rotina', 'habito', 'consistencia',
  'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'obrigado', 'ajuda', 'ajudar'
];

const OFF_TOPIC_MESSAGE = `Desculpe, mas sou o FitBot e fui programado para ajudar apenas com assuntos relacionados a:

- Treinos e exercicios (musculacao, calistenia, cardio)
- Corrida e esportes
- Alimentacao e nutricao
- Suplementacao
- Saude e bem-estar fisico
- Uso do app FitTransform

Por favor, faca uma pergunta sobre algum desses temas e ficarei feliz em ajudar!

Exemplos de perguntas que posso responder:
- Como fazer um agachamento corretamente?
- O que comer antes do treino?
- Qual a dose recomendada de creatina?
- Como melhorar meu pace na corrida?`;

function isAllowedTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  return ALLOWED_TOPICS.some(topic => {
    const normalizedTopic = topic.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return lowerMessage.includes(normalizedTopic);
  });
}

function getUIMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return '';
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

const SYSTEM_PROMPT = `Voce e o FitBot, assistente virtual oficial da FitTransform.

IMPORTANTE: Voce so pode responder perguntas sobre:
- Treinos, exercicios e musculacao
- Corrida, caminhada e esportes
- Alimentacao, dieta e nutricao
- Suplementacao esportiva
- Saude fisica e bem-estar
- Uso do aplicativo FitTransform

Se o usuario perguntar sobre QUALQUER outro assunto (politica, religiao, programacao, matematica, historia, etc), voce DEVE responder educadamente que so pode ajudar com assuntos de fitness e saude.

Regras:
- Seja sempre amigavel, motivador e profissional
- Responda em portugues brasileiro
- Seja conciso mas completo nas respostas
- Para questoes medicas serias, sempre recomende consultar um profissional de saude`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    const lastMessageText = lastUserMessage ? getUIMessageText(lastUserMessage) : '';
    
    // Se a mensagem nao e sobre um topico permitido, usa prompt diferente
    const systemToUse = (lastMessageText && !isAllowedTopic(lastMessageText))
      ? `Voce DEVE responder exatamente com esta mensagem, sem alteracoes:\n\n${OFF_TOPIC_MESSAGE}`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: systemToUse,
      messages: await convertToModelMessages(messages),
      maxTokens: 1500,
      temperature: 0.7,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[v0] Erro no chat:', error);
    return Response.json(
      { error: 'Erro ao processar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
