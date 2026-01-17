"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve.",
        })
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function sendWhatsApp() {
    const message = "Olá! Gostaria de saber mais sobre a FitTransform."
    window.open(`https://wa.me/5512992207444?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Content */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Entre em{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Estamos aqui para ajudar você a transformar seu negócio fitness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulário */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Envie uma Mensagem</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha o formulário e responderemos em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Seu nome"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Seu email"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Input
                      name="phone"
                      placeholder="Seu telefone (opcional)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Sua mensagem"
                      required
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90"
                  >
                    <Send size={20} className="mr-2" />
                    {loading ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contatos Diretos */}
            <div className="space-y-6">
              <Card
                className="bg-gradient-to-br from-green-600/20 to-green-500/20 border-green-500/30 cursor-pointer hover:scale-105 transition"
                onClick={sendWhatsApp}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-green-400" size={32} />
                    <div>
                      <CardTitle className="text-white">WhatsApp</CardTitle>
                      <CardDescription className="text-gray-300">(12) 99220-7444</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Fale conosco diretamente pelo WhatsApp</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="text-orange-400" size={32} />
                    <div>
                      <CardTitle className="text-white">E-mail</CardTitle>
                      <CardDescription className="text-gray-300">Resposta em até 24h</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Enviaremos sua mensagem por e-mail e responderemos em breve</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Phone className="text-orange-400" size={32} />
                    <div>
                      <CardTitle className="text-white">Atendimento</CardTitle>
                      <CardDescription className="text-gray-300">Segunda a Sexta, 9h às 18h</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Suporte dedicado para tirar todas as suas dúvidas</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}
