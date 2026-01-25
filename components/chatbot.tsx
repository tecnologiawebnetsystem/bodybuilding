"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "bot" | "user"
  text: string
  timestamp: Date
  quickReplies?: string[]
}

// Base de conhecimento do chatbot
const knowledgeBase: Record<string, { answer: string; quickReplies?: string[] }> = {
  // Saudacoes
  "ola": {
    answer: "Ola! Bem-vindo a Fit Transform! Sou o assistente virtual e estou aqui para ajudar. Sobre o que voce gostaria de saber?",
    quickReplies: ["O que e a Fit Transform?", "Planos e precos", "Para academias", "Para personal trainers"]
  },
  "oi": {
    answer: "Oi! Que bom ter voce aqui! Como posso ajudar hoje?",
    quickReplies: ["Conhecer a plataforma", "Ver planos", "Sou personal trainer", "Tenho uma academia"]
  },
  "bom dia": {
    answer: "Bom dia! Seja bem-vindo a Fit Transform. Em que posso ajudar?",
    quickReplies: ["O que e a Fit Transform?", "Quero conhecer os planos", "Funcionalidades"]
  },
  "boa tarde": {
    answer: "Boa tarde! Fico feliz em ajudar. O que voce gostaria de saber sobre a Fit Transform?",
    quickReplies: ["Planos disponiveis", "Para quem e a plataforma?", "Recursos do sistema"]
  },
  "boa noite": {
    answer: "Boa noite! Estou aqui para tirar suas duvidas. Como posso ajudar?",
    quickReplies: ["Ver precos", "Conhecer funcionalidades", "Falar com suporte"]
  },

  // Sobre a plataforma
  "o que e a fit transform": {
    answer: "A Fit Transform e uma plataforma completa de gestao para academias e personal trainers. Oferecemos ferramentas para gerenciar alunos, criar treinos personalizados com IA, controlar financeiro, fazer check-in, acompanhar evolucao e muito mais. Tudo em um so lugar!",
    quickReplies: ["Quanto custa?", "Funcionalidades", "Como comecar?"]
  },
  "conhecer a plataforma": {
    answer: "A Fit Transform e um CRM completo para o mercado fitness! Com ela voce pode: gerenciar alunos e clientes, criar treinos com inteligencia artificial, controlar pagamentos e financeiro, fazer check-in automatico, acompanhar evolucao com graficos, e muito mais!",
    quickReplies: ["Ver precos", "Para academias", "Para personal trainers"]
  },
  "para quem e a plataforma": {
    answer: "A Fit Transform foi desenvolvida para 3 publicos principais:\n\n1. ACADEMIAS - Gestao completa de alunos, planos, financeiro e equipe\n2. PERSONAL TRAINERS - Gerenciamento de clientes, treinos e agenda\n3. ALUNOS - Acesso aos treinos, acompanhamento de evolucao e metas",
    quickReplies: ["Sou dono de academia", "Sou personal trainer", "Sou aluno"]
  },

  // Planos e Precos
  "planos": {
    answer: "Temos planos para todos os tamanhos de negocio:\n\nPLANO STARTER (Gratis)\n- Ate 10 alunos\n- Treinos basicos\n- Check-in\n\nPLANO PRO - R$ 97/mes\n- Ate 100 alunos\n- Treinos com IA\n- Financeiro completo\n\nPLANO BUSINESS - R$ 197/mes\n- Alunos ilimitados\n- Multi-unidades\n- API e integracoes\n- Suporte prioritario",
    quickReplies: ["Plano Gratis", "Plano Pro", "Plano Business", "Comparar planos"]
  },
  "precos": {
    answer: "Nossos precos sao muito competitivos:\n\nGRATIS - Plano Starter (ate 10 alunos)\nR$ 97/mes - Plano Pro (ate 100 alunos)\nR$ 197/mes - Plano Business (ilimitado)\n\nTodos os planos tem 7 dias de teste gratis!",
    quickReplies: ["Quero testar gratis", "Detalhes do Pro", "Detalhes do Business"]
  },
  "quanto custa": {
    answer: "O investimento na Fit Transform comeca GRATIS! Temos:\n\n- Plano Starter: GRATIS (ate 10 alunos)\n- Plano Pro: R$ 97/mes (ate 100 alunos)\n- Plano Business: R$ 197/mes (ilimitado)\n\nQuer comecar agora mesmo?",
    quickReplies: ["Comecar gratis", "Ver funcionalidades de cada plano"]
  },
  "plano gratis": {
    answer: "O Plano STARTER e 100% GRATIS e inclui:\n\n- Ate 10 alunos cadastrados\n- Criacao de treinos basicos\n- Sistema de check-in\n- App para alunos\n- Dashboard basico\n\nPerfeito para quem esta comecando!",
    quickReplies: ["Comecar agora", "Quero mais alunos", "Ver Plano Pro"]
  },
  "plano pro": {
    answer: "O Plano PRO custa R$ 97/mes e oferece:\n\n- Ate 100 alunos\n- Treinos gerados por IA\n- Controle financeiro completo\n- Relatorios avancados\n- Notificacoes automaticas\n- Suporte por email\n- 7 dias gratis para testar!",
    quickReplies: ["Testar Pro gratis", "Ver Plano Business", "Funcionalidades da IA"]
  },
  "plano business": {
    answer: "O Plano BUSINESS e o mais completo - R$ 197/mes:\n\n- Alunos ILIMITADOS\n- Gestao multi-unidades\n- API para integracoes\n- Relatorios personalizados\n- Suporte prioritario 24/7\n- Treinamento da equipe\n- Personalizacao com sua marca",
    quickReplies: ["Falar com vendas", "Comparar com Pro", "Agendar demonstracao"]
  },

  // Para Academias
  "academia": {
    answer: "Para ACADEMIAS, a Fit Transform oferece:\n\n- Gestao completa de alunos e matriculas\n- Controle de planos e mensalidades\n- Sistema de check-in com QR Code\n- Gestao de funcionarios e personal trainers\n- Relatorios financeiros detalhados\n- Dashboard com metricas em tempo real\n- Notificacoes automaticas para inadimplentes",
    quickReplies: ["Quanto custa para academia?", "Como funciona o check-in?", "Controle financeiro"]
  },
  "sou dono de academia": {
    answer: "Excelente! A Fit Transform vai revolucionar sua academia!\n\nCom nossa plataforma voce tera:\n- Controle total de alunos e planos\n- Financeiro automatizado\n- Check-in inteligente\n- Gestao de equipe\n- Relatorios gerenciais\n\nQuer ver uma demonstracao?",
    quickReplies: ["Agendar demonstracao", "Ver precos", "Funcionalidades"]
  },
  "para academias": {
    answer: "A Fit Transform e perfeita para academias de todos os tamanhos!\n\nRECURSOS PARA ACADEMIAS:\n- Cadastro ilimitado de alunos\n- Gestao de planos e mensalidades\n- Controle de acesso com check-in\n- Financeiro integrado\n- Gestao de personal trainers\n- App para alunos\n- Relatorios e dashboards",
    quickReplies: ["Precos para academia", "Agendar demo", "Falar com consultor"]
  },

  // Para Personal Trainers
  "personal trainer": {
    answer: "Para PERSONAL TRAINERS, oferecemos:\n\n- Gestao completa de clientes\n- Criacao de treinos com IA\n- Controle de agenda e horarios\n- Financeiro (mensalidades e pacotes)\n- Acompanhamento de evolucao do aluno\n- Comunicacao direta pelo app\n- Biblioteca de exercicios em video",
    quickReplies: ["Quanto custa para personal?", "Como funciona a IA?", "Gerenciar clientes"]
  },
  "sou personal trainer": {
    answer: "Perfeito! A Fit Transform e ideal para personal trainers!\n\nVoce vai poder:\n- Gerenciar todos seus clientes em um lugar\n- Criar treinos incriveis com ajuda da IA\n- Controlar pagamentos e agenda\n- Acompanhar evolucao de cada aluno\n- Ter seu proprio app personalizado\n\nO melhor: comeca GRATIS!",
    quickReplies: ["Comecar gratis", "Ver funcionalidades", "Como funciona a IA?"]
  },
  "para personal trainers": {
    answer: "Personal Trainers AMAM a Fit Transform!\n\nFUNCIONALIDADES:\n- Cadastro de clientes ilimitado\n- Criacao de treinos personalizados\n- Gerador de treinos com IA\n- Controle financeiro\n- Acompanhamento de evolucao\n- Comunicacao com alunos\n- Agenda integrada",
    quickReplies: ["Testar gratis", "Precos", "Criar treino com IA"]
  },

  // Para Alunos
  "sou aluno": {
    answer: "Ola, aluno! Na Fit Transform voce tem acesso a:\n\n- Seus treinos diarios no celular\n- Historico de todos os treinos\n- Acompanhamento de evolucao (peso, medidas)\n- Comunicacao com seu personal/academia\n- Check-in facil\n- Metas e conquistas\n\nBaixe o app e acesse com seu PIN!",
    quickReplies: ["Como acessar?", "Esqueci meu PIN", "Falar com academia"]
  },
  "como acessar": {
    answer: "Para acessar a Fit Transform como aluno:\n\n1. Acesse o site ou baixe o app\n2. Clique em 'Entrar'\n3. Selecione 'Sou Aluno'\n4. Digite seu CPF e PIN de 6 digitos\n5. Pronto! Acesse seus treinos\n\nSeu PIN e fornecido pela sua academia ou personal trainer.",
    quickReplies: ["Esqueci meu PIN", "Nao tenho cadastro", "Problemas no acesso"]
  },
  "esqueci meu pin": {
    answer: "Sem problemas! Para recuperar seu PIN:\n\n1. Entre em contato com sua academia ou personal trainer\n2. Eles podem gerar um novo PIN para voce\n3. Ou acesse 'Esqueci minha senha' na tela de login\n\nSe precisar de mais ajuda, fale com nosso suporte!",
    quickReplies: ["Falar com suporte", "Outros problemas"]
  },

  // Funcionalidades
  "funcionalidades": {
    answer: "A Fit Transform tem MUITAS funcionalidades:\n\n- Gestao de alunos e clientes\n- Criacao de treinos (manual ou com IA)\n- Controle financeiro\n- Sistema de check-in\n- Dashboard com metricas\n- App para alunos\n- Notificacoes automaticas\n- Relatorios detalhados\n- Biblioteca de exercicios\n- Acompanhamento de evolucao",
    quickReplies: ["Treinos com IA", "Controle financeiro", "Check-in", "App do aluno"]
  },
  "recursos": {
    answer: "Principais recursos da Fit Transform:\n\n1. GESTAO - Alunos, planos, equipe\n2. TREINOS - Criacao manual ou com IA\n3. FINANCEIRO - Mensalidades, relatorios\n4. CHECK-IN - QR Code, biometria\n5. EVOLUCAO - Graficos, fotos, medidas\n6. COMUNICACAO - Notificacoes, mensagens\n7. RELATORIOS - Dashboards em tempo real",
    quickReplies: ["Saber mais sobre IA", "Ver precos", "Agendar demo"]
  },

  // IA e Treinos
  "treinos com ia": {
    answer: "Nossa IA gera treinos PERSONALIZADOS em segundos!\n\nComo funciona:\n1. Informe o objetivo do aluno (hipertrofia, emagrecimento, etc)\n2. Defina frequencia e duracao\n3. Adicione restricoes ou lesoes\n4. A IA cria o treino completo!\n\nIncluimos series, repeticoes, descanso e videos demonstrativos.",
    quickReplies: ["Testar a IA", "E confiavel?", "Posso editar o treino?"]
  },
  "como funciona a ia": {
    answer: "A Inteligencia Artificial da Fit Transform analisa:\n\n- Objetivo do aluno\n- Nivel de experiencia\n- Frequencia de treino\n- Equipamentos disponiveis\n- Lesoes ou restricoes\n\nE gera um treino 100% personalizado em segundos! Voce pode revisar e ajustar antes de enviar ao aluno.",
    quickReplies: ["Experimentar agora", "Ver exemplo de treino"]
  },
  "gerador de treinos": {
    answer: "O Gerador de Treinos com IA e revolucionario!\n\n- Cria treinos em menos de 30 segundos\n- Considera objetivos e limitacoes\n- Inclui exercicios com videos\n- Define series, reps e descanso\n- Permite edicao e personalizacao\n- Salva no historico do aluno\n\nDisponivel nos planos Pro e Business!",
    quickReplies: ["Quero o Plano Pro", "Ver demonstracao"]
  },

  // Financeiro
  "controle financeiro": {
    answer: "O modulo FINANCEIRO da Fit Transform inclui:\n\n- Gestao de mensalidades\n- Controle de inadimplencia\n- Relatorios de receita\n- Alertas de vencimento\n- Historico de pagamentos\n- Dashboard financeiro\n- Exportacao de dados\n\nTudo automatizado para voce focar no que importa!",
    quickReplies: ["Ver precos", "Funciona com boleto?", "Integracao com pagamentos"]
  },
  "pagamento": {
    answer: "A Fit Transform facilita a gestao de pagamentos:\n\n- Controle de vencimentos\n- Alertas automaticos\n- Historico completo\n- Relatorios de inadimplencia\n- Dashboard financeiro\n\n*Integracao com gateways de pagamento em breve!",
    quickReplies: ["Controle de inadimplencia", "Relatorios financeiros"]
  },

  // Check-in
  "check-in": {
    answer: "O sistema de CHECK-IN da Fit Transform:\n\n- Check-in por QR Code\n- Check-in por PIN\n- Registro de horario de entrada\n- Historico de frequencia\n- Relatorios de presenca\n- Alertas de alunos inativos\n\nSimples, rapido e sem filas!",
    quickReplies: ["Como funciona o QR Code?", "Relatorios de frequencia"]
  },
  "como funciona o check-in": {
    answer: "O check-in e super facil:\n\n1. Aluno abre o app ou site\n2. Clica em 'Fazer Check-in'\n3. Mostra o QR Code ou digita o PIN\n4. Academia confirma a entrada\n5. Registro salvo automaticamente!\n\nA academia tem acesso a todos os registros em tempo real.",
    quickReplies: ["Precisa de equipamento especial?", "Relatorios de presenca"]
  },

  // Suporte
  "suporte": {
    answer: "Nosso suporte esta pronto para ajudar!\n\nCANAIS DE ATENDIMENTO:\n- Chat no site (voce esta aqui!)\n- Email: suporte@fittransform.com.br\n- WhatsApp: (11) 99999-9999\n- Central de Ajuda com tutoriais\n\nHorario: Seg a Sex, 9h as 18h",
    quickReplies: ["Falar por WhatsApp", "Tenho um problema", "Ver tutoriais"]
  },
  "falar com suporte": {
    answer: "Vou te conectar com nosso suporte!\n\nVoce pode:\n1. Enviar email para suporte@fittransform.com.br\n2. Chamar no WhatsApp: (11) 99999-9999\n3. Acessar a Central de Ajuda\n\nSe preferir, descreva seu problema aqui que tentarei ajudar!",
    quickReplies: ["Problema tecnico", "Duvida sobre planos", "Cancelamento"]
  },

  // Comecar
  "comecar": {
    answer: "Vamos comecar! E muito facil:\n\n1. Clique em 'Comecar Gratis' no site\n2. Preencha seus dados\n3. Escolha seu perfil (Academia ou Personal)\n4. Configure sua conta\n5. Comece a usar!\n\nVoce tem 7 dias gratis para testar todas as funcionalidades!",
    quickReplies: ["Ir para cadastro", "Tenho duvidas antes", "Falar com consultor"]
  },
  "como comecar": {
    answer: "Comecar na Fit Transform e simples:\n\n1. Acesse fittransform.com.br\n2. Clique em 'Comecar Gratis'\n3. Crie sua conta\n4. Siga o passo a passo de configuracao\n5. Pronto!\n\nO plano gratuito ja permite ate 10 alunos!",
    quickReplies: ["Cadastrar agora", "Ver planos pagos"]
  },
  "quero testar": {
    answer: "Otimo! Voce pode testar a Fit Transform GRATIS!\n\n- Plano Starter: Gratis para sempre (10 alunos)\n- Planos pagos: 7 dias de teste gratis\n\nSem compromisso, sem cartao de credito! Basta criar sua conta e comecar a usar.",
    quickReplies: ["Criar conta gratis", "Ver todos os planos"]
  },

  // Demonstracao
  "demonstracao": {
    answer: "Quer ver a Fit Transform em acao?\n\nAgende uma demonstracao gratuita com nosso time!\n\n- Apresentacao personalizada\n- Tiramos todas suas duvidas\n- Mostramos como usar cada funcionalidade\n- Duracao: ~30 minutos\n\nQuando seria melhor para voce?",
    quickReplies: ["Agendar para esta semana", "Prefiro testar sozinho", "Enviar por email"]
  },
  "agendar demonstracao": {
    answer: "Perfeito! Para agendar sua demonstracao:\n\n1. Acesse: fittransform.com.br/demo\n2. Ou envie email para: vendas@fittransform.com.br\n3. Ou WhatsApp: (11) 99999-9999\n\nNosso time entrara em contato para agendar o melhor horario!",
    quickReplies: ["Chamar no WhatsApp", "Testar por conta propria"]
  },

  // Outros
  "obrigado": {
    answer: "Eu que agradeco! Foi um prazer ajudar. Se tiver mais duvidas, estou por aqui. Sucesso na sua jornada fitness!",
    quickReplies: ["Tenho outra duvida", "Criar minha conta", "Ate mais!"]
  },
  "tchau": {
    answer: "Ate mais! Foi otimo conversar com voce. Quando precisar, e so chamar. Sucesso!",
    quickReplies: ["Voltar ao inicio"]
  },
  "ate mais": {
    answer: "Ate a proxima! Boa sorte e bons treinos! Se precisar, estarei aqui.",
    quickReplies: ["Voltar ao inicio"]
  }
}

// Funcao para encontrar resposta
function findAnswer(input: string): { answer: string; quickReplies?: string[] } {
  const normalizedInput = input.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

  // Busca exata
  if (knowledgeBase[normalizedInput]) {
    return knowledgeBase[normalizedInput]
  }

  // Busca por palavras-chave
  const keywords: Record<string, string[]> = {
    "planos": ["plano", "planos", "preco", "precos", "valor", "valores", "quanto custa", "mensalidade", "assinatura"],
    "o que e a fit transform": ["o que e", "o que eh", "sobre a fit", "conhecer", "explicar"],
    "academia": ["academia", "academias", "dono de academia", "minha academia"],
    "personal trainer": ["personal", "trainer", "personal trainer", "pt"],
    "sou aluno": ["aluno", "estudante", "treinar", "meu treino"],
    "funcionalidades": ["funcionalidade", "funcionalidades", "recursos", "o que faz", "o que tem"],
    "treinos com ia": ["ia", "inteligencia artificial", "gerar treino", "criar treino automatico"],
    "controle financeiro": ["financeiro", "financas", "dinheiro", "pagamento", "mensalidade"],
    "check-in": ["checkin", "check-in", "entrada", "frequencia", "presenca"],
    "suporte": ["ajuda", "suporte", "problema", "erro", "nao funciona", "bug"],
    "comecar": ["comecar", "iniciar", "cadastrar", "criar conta", "registrar"],
    "demonstracao": ["demo", "demonstracao", "apresentacao", "ver funcionando"]
  }

  for (const [key, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (normalizedInput.includes(word)) {
        return knowledgeBase[key]
      }
    }
  }

  // Resposta padrao
  return {
    answer: "Desculpe, nao entendi completamente sua pergunta. Posso ajudar com informacoes sobre planos, funcionalidades, precos, ou como comecar a usar a Fit Transform. O que voce gostaria de saber?",
    quickReplies: ["Ver planos", "Funcionalidades", "Para academias", "Para personal trainers", "Falar com suporte"]
  }
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem de boas-vindas
      setTimeout(() => {
        setMessages([{
          id: "welcome",
          type: "bot",
          text: "Ola! Eu sou o assistente virtual da Fit Transform. Como posso ajudar voce hoje?",
          timestamp: new Date(),
          quickReplies: ["O que e a Fit Transform?", "Ver planos e precos", "Sou dono de academia", "Sou personal trainer"]
        }])
      }, 500)
    }
  }, [isOpen, messages.length])

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Adiciona mensagem do usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simula tempo de resposta
    setTimeout(() => {
      const response = findAnswer(messageText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response.answer,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleQuickReply = (reply: string) => {
    handleSend(reply)
  }

  return (
    <>
      {/* Botao flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen 
            ? "bg-gray-800 text-white rotate-0" 
            : "bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Badge de notificacao */}
      {!isOpen && (
        <div className="fixed bottom-[88px] right-6 z-50 animate-bounce">
          <div className="bg-white rounded-lg shadow-xl px-4 py-2 text-sm font-medium text-gray-800 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" />
            Duvidas? Fale comigo!
            <ChevronDown size={14} />
          </div>
        </div>
      )}

      {/* Janela do chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-150px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">Assistente Fit Transform</h3>
                <p className="text-xs text-white/80">Online agora</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%]", message.type === "user" ? "order-1" : "order-2")}>
                  {message.type === "bot" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Bot size={14} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-500">Assistente</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm whitespace-pre-line",
                      message.type === "user"
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                    )}
                  >
                    {message.text}
                  </div>
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-full hover:bg-orange-50 transition"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-100 border-0 focus-visible:ring-orange-500"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
