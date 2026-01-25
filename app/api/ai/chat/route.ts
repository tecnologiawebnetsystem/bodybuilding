import { streamText } from 'ai';

export const maxDuration = 30;

// Palavras-chave permitidas (topicos relacionados a fitness)
const ALLOWED_TOPICS = [
  // Exercicios e treino
  'treino', 'exercicio', 'musculacao', 'academia', 'workout', 'series', 'repeticoes',
  'carga', 'peso', 'haltere', 'barra', 'maquina', 'aparelho', 'alongamento', 'aquecimento',
  'cardio', 'aerobico', 'anaerobico', 'hiit', 'crossfit', 'funcional', 'calistenia',
  'flexao', 'agachamento', 'supino', 'rosca', 'puxada', 'remada', 'leg', 'abdominal',
  'gluteo', 'biceps', 'triceps', 'ombro', 'costas', 'peito', 'perna', 'panturrilha',
  
  // Corrida e esportes
  'corrida', 'correr', 'caminhada', 'esteira', 'bike', 'bicicleta', 'natacao', 'nadar',
  'maratona', 'km', 'quilometro', 'pace', 'ritmo', 'esporte', 'futebol', 'volei',
  
  // Nutricao e alimentacao
  'nutricao', 'alimentacao', 'dieta', 'comida', 'alimento', 'refeicao', 'cafe da manha',
  'almoco', 'jantar', 'lanche', 'proteina', 'carboidrato', 'gordura', 'fibra', 'vitamina',
  'mineral', 'caloria', 'kcal', 'macro', 'micronutriente', 'frango', 'peixe', 'ovo',
  'arroz', 'batata', 'aveia', 'fruta', 'legume', 'verdura', 'salada', 'agua', 'hidratacao',
  
  // Suplementacao
  'suplemento', 'suplementacao', 'whey', 'creatina', 'bcaa', 'glutamina', 'pre-treino',
  'pos-treino', 'hipercalorico', 'termogenico', 'cafeina', 'proteina', 'shake',
  
  // Saude e corpo
  'saude', 'saudavel', 'corpo', 'fisico', 'peso', 'massa', 'gordura', 'magro', 'emagrecer',
  'engordar', 'ganhar', 'perder', 'definicao', 'hipertrofia', 'cutting', 'bulking',
  'metabolismo', 'imc', 'medida', 'cintura', 'braco', 'coxa', 'percentual', 'balanca',
  'evolucao', 'resultado', 'progresso', 'antes', 'depois', 'transformacao',
  
  // Descanso e recuperacao
  'descanso', 'recuperacao', 'sono', 'dormir', 'overtraining', 'lesao', 'dor', 'muscular',
  
  // App e sistema
  'app', 'aplicativo', 'fittransform', 'fit transform', 'plano', 'assinatura', 'check-in',
  'personal', 'trainer', 'aluno', 'professor', 'instrutor', 'ficha', 'planilha',
  
  // Motivacao
  'motivacao', 'foco', 'disciplina', 'meta', 'objetivo', 'rotina', 'habito', 'consistencia'
];

// Mensagem quando o assunto nao e permitido
const OFF_TOPIC_MESSAGE = `Desculpe, mas sou o **FitBot** e fui programado para ajudar apenas com assuntos relacionados a:

- **Treinos e exercicios** (musculacao, calistenia, cardio)
- **Corrida e esportes**
- **Alimentacao e nutricao**
- **Suplementacao**
- **Saude e bem-estar fisico**
- **Uso do app FitTransform**

Por favor, faca uma pergunta sobre algum desses temas e ficarei feliz em ajudar!

**Exemplos de perguntas que posso responder:**
- "Como fazer um agachamento corretamente?"
- "O que comer antes do treino?"
- "Qual a dose recomendada de creatina?"
- "Como melhorar meu pace na corrida?"`;

// Funcao para verificar se a mensagem e sobre um topico permitido
function isAllowedTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  
  // Verifica se alguma palavra-chave esta presente
  return ALLOWED_TOPICS.some(topic => {
    const normalizedTopic = topic.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return lowerMessage.includes(normalizedTopic);
  });
}

const SYSTEM_PROMPT = `Voce e o FitBot, assistente virtual oficial da FitTransform - a plataforma mais completa de gestao para academias do Brasil.

IMPORTANTE: Voce so pode responder perguntas sobre:
- Treinos, exercicios e musculacao
- Corrida, caminhada e esportes
- Alimentacao, dieta e nutricao
- Suplementacao esportiva
- Saude fisica e bem-estar
- Uso do aplicativo FitTransform

Se o usuario perguntar sobre QUALQUER outro assunto (politica, religiao, programacao, matematica, historia, etc), voce DEVE responder educadamente que so pode ajudar com assuntos de fitness e saude.

Seu papel e:
1. Ajudar alunos com duvidas sobre treinos, nutricao e uso do app
2. Auxiliar donos de academia com questoes sobre gestao e funcionalidades
3. Dar suporte a personal trainers sobre recursos da plataforma
4. Fornecer dicas de saude, fitness e bem-estar

Regras:
- Seja sempre amigavel, motivador e profissional
- Responda em portugues brasileiro
- Seja conciso mas completo nas respostas
- Se nao souber algo especifico do sistema, oriente a entrar em contato com suporte
- Para questoes medicas serias, sempre recomende consultar um profissional de saude
- Use formatacao com markdown quando apropriado (listas, negrito, etc)

Funcionalidades da FitTransform que voce conhece:
- App mobile para alunos (treinos, nutricao, check-in, medidas)
- Painel administrativo para academias (alunos, financeiro, relatorios)
- Portal do personal trainer (agenda, alunos, treinos personalizados)
- Geracao de treinos com IA
- Controle de pagamentos e cobrancas automaticas
- Check-in por QR Code
- Acompanhamento de evolucao fisica

Voce pode ajudar com:
- Duvidas sobre exercicios e execucao correta
- Sugestoes de treino e periodizacao
- Dicas de alimentacao pre e pos treino
- Como usar funcionalidades do app
- Motivacao e dicas de disciplina
- Esclarecimentos sobre planos e pagamentos`;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    // Verifica a ultima mensagem do usuario
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    
    if (lastUserMessage && !isAllowedTopic(lastUserMessage.content)) {
      // Retorna mensagem de assunto nao permitido como stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Formato do AI SDK data stream
          const data = `0:${JSON.stringify(OFF_TOPIC_MESSAGE)}\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    const systemMessage = context 
      ? `${SYSTEM_PROMPT}\n\nContexto adicional do usuario: ${context}`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: 'openai/gpt-5-mini',
      system: systemMessage,
      messages,
      maxTokens: 1500,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[v0] Erro no chat:', error);
    return Response.json(
      { error: 'Erro ao processar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
