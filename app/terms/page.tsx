import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
          <h1>Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: Janeiro de 2024</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar este aplicativo de fitness, você aceita e concorda em ficar vinculado aos termos e
            condições deste acordo. Se você não concordar com qualquer parte destes termos, não deverá usar nosso
            serviço.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            Nosso app fornece ferramentas para acompanhamento de treinos, nutrição, progressão física e bem-estar. O
            serviço inclui funcionalidades como registro de exercícios, acompanhamento de peso, check-in em academias, e
            análises de progresso.
          </p>

          <h2>3. Registro e Conta</h2>
          <p>Para usar nosso serviço, você deve:</p>
          <ul>
            <li>Fornecer informações verdadeiras, precisas, atuais e completas</li>
            <li>Manter a segurança de sua senha e identificação</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
            <li>Ser responsável por todas as atividades que ocorrem sob sua conta</li>
          </ul>

          <h2>4. Uso Aceitável</h2>
          <p>Você concorda em usar o serviço apenas para fins legais e de acordo com estes Termos. Você não deve:</p>
          <ul>
            <li>Usar o serviço de maneira que viole qualquer lei ou regulamento aplicável</li>
            <li>Transmitir conteúdo ofensivo, difamatório ou ilegal</li>
            <li>Tentar obter acesso não autorizado ao serviço</li>
            <li>Interferir ou interromper o serviço ou servidores</li>
          </ul>

          <h2>5. Dados de Saúde</h2>
          <p>
            Você reconhece que os dados de fitness e saúde que você fornece são voluntários. Não somos profissionais de
            saúde e nosso app não substitui aconselhamento médico profissional. Consulte sempre um médico antes de
            iniciar qualquer programa de exercícios.
          </p>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo presente no app, incluindo mas não limitado a textos, gráficos, logos, ícones e software, é
            propriedade nossa ou de nossos licenciadores e está protegido por leis de direitos autorais.
          </p>

          <h2>7. Assinaturas e Pagamentos</h2>
          <p>
            Alguns recursos do app podem exigir assinatura paga. Você concorda em pagar todas as taxas aplicáveis. As
            assinaturas são renovadas automaticamente, a menos que canceladas antes da data de renovação.
          </p>

          <h2>8. Cancelamento</h2>
          <p>
            Você pode cancelar sua conta a qualquer momento através das configurações do app. Reservamo-nos o direito de
            suspender ou encerrar sua conta se você violar estes Termos.
          </p>

          <h2>9. Limitação de Responsabilidade</h2>
          <p>
            O serviço é fornecido no estado em que se encontra. Não garantimos que o serviço será ininterrupto, seguro
            ou livre de erros. Não seremos responsáveis por quaisquer danos diretos, indiretos ou consequenciais
            resultantes do uso do serviço.
          </p>

          <h2>10. Modificações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos você sobre mudanças
            significativas através do app ou por email. Seu uso continuado do serviço após as alterações constitui
            aceitação dos novos termos.
          </p>

          <h2>11. Lei Aplicável</h2>
          <p>
            Estes Termos serão regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
          </p>

          <h2>12. Contato</h2>
          <p>Para questões sobre estes Termos, entre em contato: suporte@academia.app</p>
        </div>
      </div>
    </div>
  )
}
