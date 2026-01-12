"use client"

import { PageLayout } from "@/components/page-layout"
import { PageContainer } from "@/components/page-container"
import { Shield, Lock, Eye, Download, Trash2, UserCheck } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <PageLayout backTo="more">
      <PageContainer
        title="Privacidade e LGPD"
        subtitle="Seus dados, seus direitos - Em conformidade com a Lei Geral de Proteção de Dados"
        badge="Legal"
        maxWidth="4xl"
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Seus Direitos</h3>
                  <p className="text-xs text-muted-foreground">Acesso, correção e exclusão de dados</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Segurança</h3>
                  <p className="text-xs text-muted-foreground">Criptografia e proteção total</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Transparência</h3>
                  <p className="text-xs text-muted-foreground">Sempre saiba o que coletamos</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. Dados Pessoais Coletados
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Dados de Cadastro</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Nome completo</li>
                    <li>• Email e telefone</li>
                    <li>• Data de nascimento</li>
                    <li>• Senha (criptografada)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Dados de Saúde e Fitness</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Peso, altura e medidas corporais</li>
                    <li>• Histórico de treinos e exercícios</li>
                    <li>• Frequência cardíaca e dados de corrida</li>
                    <li>• Objetivos de fitness e fotos de progresso</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Dados de Uso e Técnicos</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Acesso ao app e funcionalidades utilizadas</li>
                    <li>• Check-ins em academias</li>
                    <li>• Endereço IP e tipo de dispositivo</li>
                    <li>• Localização aproximada (se autorizado)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                2. Finalidade e Base Legal
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                Utilizamos seus dados para fornecer e melhorar nossos serviços, personalizar sua experiência, gerar
                relatórios de progresso, processar pagamentos e garantir segurança.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Base Legal (LGPD):</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Consentimento para dados de saúde e fitness</li>
                  <li>✓ Execução de contrato para fornecer o serviço</li>
                  <li>✓ Legítimo interesse para melhorias e segurança</li>
                  <li>✓ Obrigação legal quando exigido por lei</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                3. Segurança e Armazenamento
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                Seus dados são armazenados em servidores seguros com criptografia end-to-end. Implementamos medidas
                técnicas e organizacionais rigorosas para proteger contra acesso não autorizado.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Medidas de Segurança:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🔒 Criptografia de senhas (bcrypt)</li>
                  <li>🔒 Comunicação HTTPS segura</li>
                  <li>🔒 Backups automáticos diários</li>
                  <li>🔒 Acesso restrito a dados sensíveis</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                4. Seus Direitos LGPD
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Acesso e Portabilidade</p>
                    <p className="text-xs text-muted-foreground">Obtenha cópia de seus dados</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Correção</p>
                    <p className="text-xs text-muted-foreground">Corrija dados incorretos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Eliminação</p>
                    <p className="text-xs text-muted-foreground">Exclua seus dados</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Revogação</p>
                    <p className="text-xs text-muted-foreground">Retire consentimento</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border">
                <p className="text-sm font-semibold mb-2">Como Exercer Seus Direitos:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    📧 Email: <span className="text-primary font-medium">privacidade@academia.app</span>
                  </li>
                  <li>
                    📧 DPO: <span className="text-primary font-medium">dpo@academia.app</span>
                  </li>
                  <li>⏱️ Resposta em até 15 dias úteis</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">5. Compartilhamento de Dados</h2>

              <p className="text-sm text-muted-foreground mb-3">Podemos compartilhar seus dados apenas com:</p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Academia parceira:</strong> Se você estiver vinculado a uma
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Processadores de pagamento:</strong> Para assinaturas (dados mínimos necessários)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Provedores de serviço:</strong> Hospedagem, análise e suporte técnico
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Autoridades:</strong> Apenas quando legalmente obrigatório
                  </span>
                </li>
              </ul>

              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ Nunca vendemos seus dados pessoais para terceiros
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">6. Informações Adicionais</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-1">Retenção de Dados</h3>
                  <p className="text-muted-foreground">
                    Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão, alguns dados podem ser retidos
                    por até 5 anos para cumprimento de obrigações legais.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Cookies e Tecnologias</h3>
                  <p className="text-muted-foreground">
                    Usamos cookies para melhorar sua experiência e mantê-lo conectado. Você pode gerenciar preferências
                    nas configurações do navegador.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Menores de Idade</h3>
                  <p className="text-muted-foreground">
                    Nosso serviço requer autorização dos pais ou responsáveis para menores de 18 anos.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Alterações nesta Política</h3>
                  <p className="text-muted-foreground">
                    Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas.
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground py-4">
              <p>Última atualização: Janeiro de 2024</p>
              <p className="mt-2">Em conformidade com a LGPD (Lei 13.709/2018)</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </PageLayout>
  )
}
