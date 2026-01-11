import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Política de Privacidade</h1>
          <p className="text-muted-foreground">
            Última atualização: Janeiro de 2024 | Em conformidade com a LGPD (Lei 13.709/2018)
          </p>

          <h2>1. Introdução</h2>
          <p>
            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais
            em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>

          <h2>2. Dados Pessoais Coletados</h2>

          <h3>2.1 Dados de Cadastro</h3>
          <ul>
            <li>Nome completo</li>
            <li>Email</li>
            <li>Telefone (opcional)</li>
            <li>Data de nascimento</li>
            <li>Senha (criptografada)</li>
          </ul>

          <h3>2.2 Dados de Saúde e Fitness</h3>
          <ul>
            <li>Peso, altura e medidas corporais</li>
            <li>Histórico de treinos e exercícios</li>
            <li>Frequência cardíaca e dados de corrida</li>
            <li>Objetivos de fitness</li>
            <li>Fotos de progresso (voluntárias)</li>
          </ul>

          <h3>2.3 Dados de Uso</h3>
          <ul>
            <li>Data e hora de acesso ao app</li>
            <li>Funcionalidades utilizadas</li>
            <li>Check-ins em academias</li>
            <li>Interações no app</li>
          </ul>

          <h3>2.4 Dados Técnicos</h3>
          <ul>
            <li>Endereço IP</li>
            <li>Tipo de dispositivo e sistema operacional</li>
            <li>Navegador utilizado</li>
            <li>Localização aproximada (se autorizado)</li>
          </ul>

          <h2>3. Finalidade do Uso dos Dados</h2>
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência no app</li>
            <li>Gerar relatórios e análises de progresso</li>
            <li>Enviar notificações sobre seu treino</li>
            <li>Processar pagamentos de assinaturas</li>
            <li>Prevenir fraudes e garantir segurança</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>4. Base Legal (LGPD)</h2>
          <p>Processamos seus dados com base em:</p>
          <ul>
            <li>
              <strong>Consentimento:</strong> Para dados de saúde e fitness
            </li>
            <li>
              <strong>Execução de contrato:</strong> Para fornecer o serviço
            </li>
            <li>
              <strong>Legítimo interesse:</strong> Para melhorias e segurança
            </li>
            <li>
              <strong>Obrigação legal:</strong> Quando exigido por lei
            </li>
          </ul>

          <h2>5. Compartilhamento de Dados</h2>
          <p>Podemos compartilhar seus dados com:</p>
          <ul>
            <li>
              <strong>Academia parceira:</strong> Se você estiver vinculado a uma
            </li>
            <li>
              <strong>Processadores de pagamento:</strong> Para assinaturas
            </li>
            <li>
              <strong>Provedores de serviço:</strong> Hospedagem, análise, suporte
            </li>
            <li>
              <strong>Autoridades:</strong> Quando legalmente obrigatório
            </li>
          </ul>
          <p>Nunca vendemos seus dados pessoais para terceiros.</p>

          <h2>6. Armazenamento e Segurança</h2>
          <p>
            Seus dados são armazenados em servidores seguros com criptografia. Implementamos medidas técnicas e
            organizacionais para proteger contra acesso não autorizado, perda ou destruição.
          </p>
          <p>Senhas são criptografadas e nunca são armazenadas em texto simples.</p>

          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer serviços. Após a
            exclusão da conta, alguns dados podem ser retidos por até 5 anos para cumprimento de obrigações legais.
          </p>

          <h2>8. Seus Direitos LGPD</h2>
          <p>Você tem direito a:</p>
          <ul>
            <li>
              <strong>Confirmação:</strong> Saber se processamos seus dados
            </li>
            <li>
              <strong>Acesso:</strong> Obter cópia de seus dados
            </li>
            <li>
              <strong>Correção:</strong> Corrigir dados incompletos ou incorretos
            </li>
            <li>
              <strong>Anonimização/Bloqueio:</strong> Limitar o uso de seus dados
            </li>
            <li>
              <strong>Eliminação:</strong> Excluir dados desnecessários
            </li>
            <li>
              <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
            </li>
            <li>
              <strong>Revogação:</strong> Retirar consentimento a qualquer momento
            </li>
            <li>
              <strong>Oposição:</strong> Opor-se ao tratamento de seus dados
            </li>
          </ul>

          <h2>9. Como Exercer Seus Direitos</h2>
          <p>Para exercer seus direitos LGPD:</p>
          <ul>
            <li>Acesse as Configurações do app → Privacidade e Dados</li>
            <li>Envie email para: privacidade@academia.app</li>
            <li>Responderemos em até 15 dias úteis</li>
          </ul>

          <h2>10. Cookies e Tecnologias Similares</h2>
          <p>
            Usamos cookies para melhorar sua experiência, manter você conectado e analisar o uso do app. Você pode
            gerenciar preferências de cookies nas configurações do seu navegador.
          </p>

          <h2>11. Menores de Idade</h2>
          <p>
            Nosso serviço não é destinado a menores de 18 anos. Se você tiver menos de 18 anos, precisa de autorização
            dos pais ou responsáveis para usar o app.
          </p>

          <h2>12. Transferência Internacional</h2>
          <p>
            Seus dados podem ser transferidos e processados em servidores localizados fora do Brasil, sempre com
            garantias adequadas de proteção conforme a LGPD.
          </p>

          <h2>13. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas através do
            app ou email. Continue revisando para estar informado.
          </p>

          <h2>14. Encarregado de Dados (DPO)</h2>
          <p>
            Nosso Encarregado de Proteção de Dados pode ser contatado em:
            <br />
            Email: dpo@academia.app
            <br />
            Responderemos todas as solicitações relacionadas à LGPD.
          </p>

          <h2>15. Contato</h2>
          <p>
            Para dúvidas sobre esta Política de Privacidade:
            <br />
            Email: privacidade@academia.app
            <br />
            Telefone: (11) 9999-9999
          </p>
        </div>
      </div>
    </div>
  )
}
