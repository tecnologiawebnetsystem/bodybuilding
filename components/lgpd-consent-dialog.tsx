"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, FileText, Lock } from "lucide-react"
import Link from "next/link"

interface LGPDConsentDialogProps {
  userId: string
  onAccept: () => void
}

export function LGPDConsentDialog({ userId, onAccept }: LGPDConsentDialogProps) {
  const [open, setOpen] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já aceitou os termos
    checkConsents()
  }, [userId])

  const checkConsents = async () => {
    try {
      const response = await fetch(`/api/consents?userId=${userId}`)
      const data = await response.json()

      const hasTerms = data.consents?.some((c: any) => c.consent_type === "terms_of_use")
      const hasPrivacy = data.consents?.some((c: any) => c.consent_type === "privacy_policy")

      // Se não aceitou ambos, mostrar o dialog
      if (!hasTerms || !hasPrivacy) {
        setOpen(true)
      }
    } catch (error) {
      console.error("Error checking consents:", error)
      setOpen(true) // Em caso de erro, mostrar o dialog por segurança
    }
  }

  const handleAccept = async () => {
    if (!acceptTerms || !acceptPrivacy) return

    setLoading(true)

    try {
      // Capturar IP e User Agent
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()
      const ipAddress = ipData.ip

      // Registrar consentimento dos termos
      await fetch("/api/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consentType: "terms_of_use",
          version: "1.0",
          ipAddress,
          userAgent: navigator.userAgent,
        }),
      })

      // Registrar consentimento da política de privacidade
      await fetch("/api/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consentType: "privacy_policy",
          version: "1.0",
          ipAddress,
          userAgent: navigator.userAgent,
        }),
      })

      setOpen(false)
      onAccept()
    } catch (error) {
      console.error("Error saving consents:", error)
      alert("Erro ao salvar consentimentos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Termos e Privacidade</DialogTitle>
          </div>
          <DialogDescription>
            Para continuar usando o app, você precisa aceitar nossos termos e política de privacidade conforme a Lei
            Geral de Proteção de Dados (LGPD).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-6">
          {/* Termos de Uso */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Termos de Uso</h3>
                <p className="text-sm text-muted-foreground mb-3">Ao usar nosso app, você concorda em:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Usar o app apenas para fins pessoais e legais</li>
                  <li>Não compartilhar sua conta com terceiros</li>
                  <li>Manter seus dados de acesso seguros</li>
                </ul>
                <Link href="/terms" target="_blank" className="text-sm text-primary hover:underline inline-block mt-2">
                  Ler termos completos →
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e aceito os Termos de Uso
              </label>
            </div>
          </div>

          {/* Política de Privacidade */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Política de Privacidade</h3>
                <p className="text-sm text-muted-foreground mb-3">Coletamos e protegemos seus dados conforme a LGPD:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Dados pessoais: nome, email, telefone</li>
                  <li>Dados de saúde: peso, altura, medidas corporais</li>
                  <li>Dados de uso: treinos, check-ins, progresso</li>
                  <li>Você pode solicitar exclusão de seus dados a qualquer momento</li>
                </ul>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-sm text-primary hover:underline inline-block mt-2"
                >
                  Ler política completa →
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="privacy"
                checked={acceptPrivacy}
                onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
              />
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e aceito a Política de Privacidade
              </label>
            </div>
          </div>

          {/* Informação LGPD */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Seus direitos LGPD:</strong> Você tem direito a acessar, corrigir, deletar ou exportar seus dados
              pessoais a qualquer momento. Para exercer esses direitos, entre em contato através das configurações do
              app ou pelo email privacidade@academia.app
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAccept} disabled={!acceptTerms || !acceptPrivacy || loading} className="flex-1">
            {loading ? "Salvando..." : "Aceitar e Continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
