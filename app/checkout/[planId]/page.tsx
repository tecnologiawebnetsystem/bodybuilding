"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  FileText, 
  Shield, 
  Check, 
  Loader2,
  Building2,
  User,
  Dumbbell,
  Lock
} from "lucide-react"

const plans: Record<string, {
  name: string
  description: string
  icon: any
  priceMonthly: number
  priceYearly: number
  color: string
}> = {
  gym_pro: {
    name: "Plano Academia",
    description: "Para academias de todos os portes",
    icon: Building2,
    priceMonthly: 299.99,
    priceYearly: 2999.90,
    color: "from-orange-500 to-red-600"
  },
  trainer_pro: {
    name: "Plano Personal",
    description: "Para personal trainers autonomos",
    icon: User,
    priceMonthly: 99.00,
    priceYearly: 990.00,
    color: "from-blue-500 to-cyan-500"
  },
  student_premium: {
    name: "Plano Aluno",
    description: "Para quem treina por conta propria",
    icon: Dumbbell,
    priceMonthly: 9.99,
    priceYearly: 99.90,
    color: "from-green-500 to-emerald-500"
  }
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const planId = params.planId as string
  const isYearly = searchParams.get('yearly') === 'true'
  const plan = plans[planId]

  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    // Dados do cartao
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    // Endereco
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  })

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Plano nao encontrado</h2>
          <Link href="/precos">
            <Button>Ver Planos Disponiveis</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const price = isYearly ? plan.priceYearly : plan.priceMonthly
  const monthlyPrice = isYearly ? plan.priceYearly / 12 : plan.priceMonthly
  const savings = isYearly ? (plan.priceMonthly * 12) - plan.priceYearly : 0

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1')
  }

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{2})\d+?$/, '$1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Redirecionar para sucesso
    router.push(`/checkout/sucesso?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/precos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4">
            <ArrowLeft size={20} />
            Voltar para planos
          </Link>
          <h1 className="text-3xl font-bold text-white">Finalizar Assinatura</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Dados Pessoais */}
              <Card className="bg-white/5 border-white/10 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Dados Pessoais</CardTitle>
                  <CardDescription>Informacoes para sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Nome completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-300">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forma de Pagamento */}
              <Card className="bg-white/5 border-white/10 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Forma de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition cursor-pointer ${
                      paymentMethod === 'credit_card' 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="text-gray-400" />
                        <div>
                          <p className="text-white font-medium">Cartao de Credito</p>
                          <p className="text-gray-400 text-sm">Parcele em ate 12x</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition cursor-pointer ${
                      paymentMethod === 'pix' 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                        <QrCode className="text-gray-400" />
                        <div>
                          <p className="text-white font-medium">PIX</p>
                          <p className="text-gray-400 text-sm">Aprovacao instantanea</p>
                        </div>
                        <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                          5% OFF
                        </Badge>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition cursor-pointer ${
                      paymentMethod === 'boleto' 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex items-center gap-3 cursor-pointer flex-1">
                        <FileText className="text-gray-400" />
                        <div>
                          <p className="text-white font-medium">Boleto Bancario</p>
                          <p className="text-gray-400 text-sm">Vencimento em 3 dias uteis</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Dados do Cartao */}
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-4">
                      <Separator className="bg-white/10" />
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-gray-300">Numero do cartao</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-gray-300">Nome no cartao</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => setFormData({...formData, cardName: e.target.value.toUpperCase()})}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="NOME COMO ESTA NO CARTAO"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry" className="text-gray-300">Validade</Label>
                          <Input
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData({...formData, cardExpiry: formatExpiry(e.target.value)})}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv" className="text-gray-300">CVV</Label>
                          <Input
                            id="cardCvv"
                            value={formData.cardCvv}
                            onChange={(e) => setFormData({...formData, cardCvv: e.target.value.replace(/\D/g, '')})}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="000"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PIX Info */}
                  {paymentMethod === 'pix' && (
                    <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-green-400 text-sm">
                        Apos confirmar, voce recebera um QR Code para pagamento via PIX. 
                        O acesso sera liberado instantaneamente apos a confirmacao.
                      </p>
                    </div>
                  )}

                  {/* Boleto Info */}
                  {paymentMethod === 'boleto' && (
                    <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm">
                        O boleto sera gerado apos a confirmacao. O acesso sera liberado 
                        em ate 3 dias uteis apos o pagamento.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Confirmar Assinatura - {formatPrice(paymentMethod === 'pix' ? price * 0.95 : price)}
                  </>
                )}
              </Button>

              <p className="text-center text-gray-500 text-sm mt-4">
                <Shield className="inline w-4 h-4 mr-1" />
                Pagamento 100% seguro. Seus dados estao protegidos.
              </p>
            </form>
          </div>

          {/* Resumo */}
          <div>
            <Card className="bg-white/5 border-white/10 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plano */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{plan.name}</p>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                    <Badge className="mt-2 bg-white/10 text-gray-300">
                      {isYearly ? 'Anual' : 'Mensal'}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Preco */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>{isYearly ? 'Plano anual' : 'Plano mensal'}</span>
                    <span>{formatPrice(price)}</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-green-400">
                      <span>Desconto PIX (5%)</span>
                      <span>-{formatPrice(price * 0.05)}</span>
                    </div>
                  )}
                  {isYearly && savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Economia anual</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-white/10" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(paymentMethod === 'pix' ? price * 0.95 : price)}
                    </p>
                    {isYearly && (
                      <p className="text-gray-400 text-sm">
                        ou {formatPrice(monthlyPrice)}/mes
                      </p>
                    )}
                  </div>
                </div>

                {/* Beneficios */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-gray-400 text-sm font-medium">Incluso no plano:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      7 dias de teste gratuito
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      Cancele quando quiser
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      Suporte por email
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
