"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Phone, Send, MapPin, Clock, Building2, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const [assunto, setAssunto] = useState("")
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      assunto: assunto,
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
        setAssunto("")
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
    const message = "Ola! Gostaria de saber mais sobre a FitTransform."
    window.open(`https://wa.me/5512992207444?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Content */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Entre em{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Estamos aqui para ajudar voce a transformar seu negocio fitness.
              Atendemos academias em Taubate, Cacapava, Pindamonhangaba e todo o Vale do Paraiba.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <Card className="bg-white/5 border-white/10 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Envie uma Mensagem</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha o formulario e responderemos em ate 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Nome completo *</Label>
                      <Input
                        name="name"
                        placeholder="Seu nome"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">E-mail *</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Telefone / WhatsApp</Label>
                      <Input
                        name="phone"
                        placeholder="(12) 99999-9999"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Assunto *</Label>
                      <Select value={assunto} onValueChange={setAssunto} required>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academia">Sou dono de academia</SelectItem>
                          <SelectItem value="personal">Sou Personal Trainer</SelectItem>
                          <SelectItem value="aluno">Sou aluno</SelectItem>
                          <SelectItem value="parceria">Proposta de parceria</SelectItem>
                          <SelectItem value="suporte">Suporte tecnico</SelectItem>
                          <SelectItem value="outro">Outro assunto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Mensagem *</Label>
                    <Textarea
                      name="message"
                      placeholder="Como podemos ajudar voce?"
                      required
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 h-12"
                  >
                    <Send size={20} className="mr-2" />
                    {loading ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contatos Diretos */}
            <div className="space-y-4">
              <Card
                className="bg-gradient-to-br from-green-600/20 to-green-500/20 border-green-500/30 cursor-pointer hover:scale-105 transition"
                onClick={sendWhatsApp}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-green-400" size={28} />
                    <div>
                      <CardTitle className="text-white text-lg">WhatsApp</CardTitle>
                      <CardDescription className="text-gray-300">(12) 99220-7444</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm">Resposta imediata em horario comercial</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Mail className="text-orange-400" size={28} />
                    <div>
                      <CardTitle className="text-white text-lg">E-mail</CardTitle>
                      <CardDescription className="text-gray-300">contato@fittransform.com.br</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm">Resposta em ate 24 horas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Clock className="text-orange-400" size={28} />
                    <div>
                      <CardTitle className="text-white text-lg">Horario</CardTitle>
                      <CardDescription className="text-gray-300">Seg a Sex, 9h as 18h</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm">Suporte dedicado para voce</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-orange-400" size={28} />
                    <div>
                      <CardTitle className="text-white text-lg">Localizacao</CardTitle>
                      <CardDescription className="text-gray-300">Vale do Paraiba - SP</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm">Taubate, Cacapava, Pinda e regiao</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 border-purple-500/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Instagram className="text-pink-400" size={28} />
                    <div>
                      <CardTitle className="text-white text-lg">Instagram</CardTitle>
                      <CardDescription className="text-gray-300">@fittransform.app</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm">Siga-nos para novidades e dicas</p>
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
