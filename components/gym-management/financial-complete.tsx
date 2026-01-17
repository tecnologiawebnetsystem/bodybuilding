"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  QrCode,
  Users,
  AlertTriangle,
  Calendar,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileText,
  Clock,
  Plus,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  Wallet,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FinancialCompleteProps {
  gymId: number
}

export function FinancialComplete({ gymId }: FinancialCompleteProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [isAddingCharge, setIsAddingCharge] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estados financeiros
  const [financialData, setFinancialData] = useState({
    saldoAtual: 45780.5,
    receitaMes: 32450.0,
    despesasMes: 18670.0,
    lucroMes: 13780.0,
    previsaoProximoMes: 35000.0,
    inadimplentes: 12,
    totalInadimplencia: 4560.0,
    recebiveisAntecipacao: 15000.0,
  })

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "entrada",
      category: "Mensalidade",
      description: "Pagamento João Silva",
      amount: 149.9,
      method: "PIX",
      date: "2026-01-15",
    },
    {
      id: 2,
      type: "entrada",
      category: "Mensalidade",
      description: "Pagamento Maria Santos",
      amount: 199.9,
      method: "Cartão",
      date: "2026-01-15",
    },
    {
      id: 3,
      type: "saida",
      category: "Aluguel",
      description: "Aluguel do espaço",
      amount: 5000.0,
      method: "Boleto",
      date: "2026-01-10",
    },
    {
      id: 4,
      type: "saida",
      category: "Energia",
      description: "Conta de luz",
      amount: 1200.0,
      method: "Débito Automático",
      date: "2026-01-12",
    },
    {
      id: 5,
      type: "entrada",
      category: "Matrícula",
      description: "Nova matrícula Pedro Costa",
      amount: 99.0,
      method: "PIX",
      date: "2026-01-14",
    },
  ])

  const [inadimplentes, setInadimplentes] = useState([
    { id: 1, name: "Carlos Oliveira", amount: 299.8, daysLate: 15, plan: "Plano Mensal" },
    { id: 2, name: "Ana Paula", amount: 449.7, daysLate: 30, plan: "Plano Trimestral" },
    { id: 3, name: "Roberto Souza", amount: 149.9, daysLate: 7, plan: "Plano Mensal" },
  ])

  const [recurringCharges, setRecurringCharges] = useState([
    {
      id: 1,
      user: "João Silva",
      amount: 149.9,
      billingDay: 5,
      method: "PIX",
      status: "active",
      nextCharge: "2026-02-05",
    },
    {
      id: 2,
      user: "Maria Santos",
      amount: 199.9,
      billingDay: 10,
      method: "Cartão",
      status: "active",
      nextCharge: "2026-02-10",
    },
    {
      id: 3,
      user: "Pedro Costa",
      amount: 149.9,
      billingDay: 15,
      method: "Boleto",
      status: "active",
      nextCharge: "2026-02-15",
    },
  ])

  const [newTransaction, setNewTransaction] = useState({
    type: "entrada",
    category: "",
    description: "",
    amount: "",
    method: "PIX",
    date: new Date().toISOString().split("T")[0],
  })

  // DRE - Demonstrativo de Resultado do Exercício
  const dreData = {
    receitaBruta: 32450.0,
    deducoes: 1622.5,
    receitaLiquida: 30827.5,
    custoServicos: 8500.0,
    lucroBruto: 22327.5,
    despesasOperacionais: {
      administrativas: 3500.0,
      comerciais: 1200.0,
      pessoal: 8000.0,
      outras: 1970.0,
    },
    lucroOperacional: 7657.5,
    resultadoFinanceiro: -200.0,
    lucroAntesIR: 7457.5,
    impostos: 1118.63,
    lucroLiquido: 6338.87,
  }

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      toast({ title: "Preencha todos os campos", variant: "destructive" })
      return
    }

    const transaction = {
      id: transactions.length + 1,
      ...newTransaction,
      amount: Number.parseFloat(newTransaction.amount),
    }

    setTransactions([transaction, ...transactions])
    setIsAddingTransaction(false)
    setNewTransaction({
      type: "entrada",
      category: "",
      description: "",
      amount: "",
      method: "PIX",
      date: new Date().toISOString().split("T")[0],
    })

    toast({ title: "Transação registrada com sucesso!" })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Controle Financeiro</h2>
          <p className="text-gray-400">Gestão completa das finanças da sua academia</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddingTransaction(true)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-600/20 to-green-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Saldo Atual</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialData.saldoAtual)}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Receita do Mês</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialData.receitaMes)}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600/20 to-red-500/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Despesas do Mês</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialData.despesasMes)}</p>
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" /> -5% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Lucro Líquido</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialData.lucroMes)}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" /> Meta: {formatCurrency(15000)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <PiggyBank className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs do Sistema Financeiro */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10 p-1 flex-wrap h-auto">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="fluxo-caixa"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger
            value="cobrancas"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            Cobranças
          </TabsTrigger>
          <TabsTrigger
            value="inadimplentes"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            Inadimplentes
          </TabsTrigger>
          <TabsTrigger
            value="antecipacao"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            Antecipação
          </TabsTrigger>
          <TabsTrigger
            value="dre"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
          >
            DRE
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Métodos de Pagamento */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-400" />
                  Métodos de Recebimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <QrCode className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">PIX</p>
                      <p className="text-gray-400 text-sm">Recebimento instantâneo</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(15230.0)}</p>
                    <p className="text-green-400 text-sm">47%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Cartão de Crédito</p>
                      <p className="text-gray-400 text-sm">Parcelamento disponível</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(12120.0)}</p>
                    <p className="text-blue-400 text-sm">37%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Banknote className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Boleto Bancário</p>
                      <p className="text-gray-400 text-sm">Vencimento configurável</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(5100.0)}</p>
                    <p className="text-orange-400 text-sm">16%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previsão */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Previsão Próximos Meses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { month: "Fevereiro", receita: 35000, despesa: 19000 },
                  { month: "Março", receita: 38000, despesa: 20000 },
                  { month: "Abril", receita: 40000, despesa: 21000 },
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <p className="text-white font-medium">{item.month}</p>
                      <p className="text-green-400 font-bold">{formatCurrency(item.receita - item.despesa)}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400">
                        Receita: <span className="text-green-400">{formatCurrency(item.receita)}</span>
                      </span>
                      <span className="text-gray-400">
                        Despesa: <span className="text-red-400">{formatCurrency(item.despesa)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alertas */}
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Atenção: {financialData.inadimplentes} alunos inadimplentes</p>
                  <p className="text-gray-300 text-sm">
                    Total em aberto: {formatCurrency(financialData.totalInadimplencia)} - Clique em "Inadimplentes" para
                    gerenciar
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 bg-transparent"
                  onClick={() => setActiveTab("inadimplentes")}
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fluxo de Caixa */}
        <TabsContent value="fluxo-caixa" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Transações</CardTitle>
              <CardDescription className="text-gray-400">Entradas e saídas do caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "entrada" ? "bg-green-500/20" : "bg-red-500/20"}`}
                      >
                        {transaction.type === "entrada" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.method}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`font-bold ${transaction.type === "entrada" ? "text-green-400" : "text-red-400"}`}>
                      {transaction.type === "entrada" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cobranças Recorrentes */}
        <TabsContent value="cobrancas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Cobranças Automáticas</h3>
              <p className="text-gray-400">Configure cobranças recorrentes para seus alunos</p>
            </div>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Cobrança
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <RefreshCw className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{recurringCharges.length}</p>
                <p className="text-gray-400">Cobranças Ativas</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Calendar className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">15</p>
                <p className="text-gray-400">Cobranças este mês</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{formatCurrency(12500)}</p>
                <p className="text-gray-400">Previsão Receita</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-medium">Aluno</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Valor</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Dia Cobrança</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Método</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Próxima</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recurringCharges.map((charge) => (
                      <tr key={charge.id} className="border-t border-white/10">
                        <td className="p-4 text-white">{charge.user}</td>
                        <td className="p-4 text-white">{formatCurrency(charge.amount)}</td>
                        <td className="p-4 text-gray-300">Dia {charge.billingDay}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-white/20 text-gray-300">
                            {charge.method}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-300">{new Date(charge.nextCharge).toLocaleDateString("pt-BR")}</td>
                        <td className="p-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inadimplentes */}
        <TabsContent value="inadimplentes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-red-600/20 to-red-500/10 border-red-500/30">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{financialData.inadimplentes}</p>
                <p className="text-gray-400">Alunos Inadimplentes</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 border-orange-500/30">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{formatCurrency(financialData.totalInadimplencia)}</p>
                <p className="text-gray-400">Total em Aberto</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">18</p>
                <p className="text-gray-400">Dias Médio Atraso</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Lista de Inadimplentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inadimplentes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-400 font-bold">{item.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">{item.plan}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 font-bold">{formatCurrency(item.amount)}</p>
                    <p className="text-gray-400 text-sm">{item.daysLate} dias de atraso</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/50 text-green-400 hover:bg-green-500/20 bg-transparent"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      Gerar PIX
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 bg-transparent"
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      Boleto
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20 bg-transparent"
                    >
                      Notificar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Antecipação de Recebíveis */}
        <TabsContent value="antecipacao" className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Antecipação de Recebíveis</h3>
                  <p className="text-gray-300">Receba hoje os valores das vendas parceladas</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Disponível para antecipar</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(financialData.recebiveisAntecipacao)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Simular Antecipação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Valor a antecipar</Label>
                  <Input type="number" placeholder="R$ 0,00" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taxa de antecipação</span>
                    <span className="text-white">2,5% ao mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor líquido</span>
                    <span className="text-green-400 font-bold">{formatCurrency(14625)}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Solicitar Antecipação</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Histórico de Antecipações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { date: "10/01/2026", original: 5000, received: 4875, status: "completed" },
                  { date: "05/01/2026", original: 3000, received: 2925, status: "completed" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white">{item.date}</p>
                      <p className="text-gray-400 text-sm">Original: {formatCurrency(item.original)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">{formatCurrency(item.received)}</p>
                      <Badge className="bg-green-500/20 text-green-400">Concluído</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DRE */}
        <TabsContent value="dre" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                Demonstrativo de Resultado do Exercício (DRE)
              </CardTitle>
              <CardDescription className="text-gray-400">Janeiro 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Receita Bruta */}
                <div className="flex justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-white font-medium">Receita Bruta</span>
                  <span className="text-green-400 font-bold">{formatCurrency(dreData.receitaBruta)}</span>
                </div>

                {/* Deduções */}
                <div className="flex justify-between p-3 bg-white/5 rounded-lg ml-4">
                  <span className="text-gray-400">(-) Deduções e Impostos sobre Vendas</span>
                  <span className="text-red-400">{formatCurrency(dreData.deducoes)}</span>
                </div>

                {/* Receita Líquida */}
                <div className="flex justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-white font-medium">(=) Receita Líquida</span>
                  <span className="text-blue-400 font-bold">{formatCurrency(dreData.receitaLiquida)}</span>
                </div>

                {/* Custo dos Serviços */}
                <div className="flex justify-between p-3 bg-white/5 rounded-lg ml-4">
                  <span className="text-gray-400">(-) Custo dos Serviços Prestados</span>
                  <span className="text-red-400">{formatCurrency(dreData.custoServicos)}</span>
                </div>

                {/* Lucro Bruto */}
                <div className="flex justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-white font-medium">(=) Lucro Bruto</span>
                  <span className="text-green-400 font-bold">{formatCurrency(dreData.lucroBruto)}</span>
                </div>

                {/* Despesas Operacionais */}
                <div className="p-3 bg-white/5 rounded-lg ml-4 space-y-2">
                  <p className="text-gray-300 font-medium">(-) Despesas Operacionais</p>
                  <div className="flex justify-between ml-4">
                    <span className="text-gray-400">Administrativas</span>
                    <span className="text-red-400">{formatCurrency(dreData.despesasOperacionais.administrativas)}</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span className="text-gray-400">Comerciais</span>
                    <span className="text-red-400">{formatCurrency(dreData.despesasOperacionais.comerciais)}</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span className="text-gray-400">Pessoal</span>
                    <span className="text-red-400">{formatCurrency(dreData.despesasOperacionais.pessoal)}</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span className="text-gray-400">Outras</span>
                    <span className="text-red-400">{formatCurrency(dreData.despesasOperacionais.outras)}</span>
                  </div>
                </div>

                {/* Lucro Operacional */}
                <div className="flex justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <span className="text-white font-medium">(=) Lucro Operacional</span>
                  <span className="text-purple-400 font-bold">{formatCurrency(dreData.lucroOperacional)}</span>
                </div>

                {/* Resultado Financeiro */}
                <div className="flex justify-between p-3 bg-white/5 rounded-lg ml-4">
                  <span className="text-gray-400">(+/-) Resultado Financeiro</span>
                  <span className="text-red-400">{formatCurrency(dreData.resultadoFinanceiro)}</span>
                </div>

                {/* Lucro Antes IR */}
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">(=) Lucro Antes do IR</span>
                  <span className="text-white">{formatCurrency(dreData.lucroAntesIR)}</span>
                </div>

                {/* Impostos */}
                <div className="flex justify-between p-3 bg-white/5 rounded-lg ml-4">
                  <span className="text-gray-400">(-) IR e CSLL (15%)</span>
                  <span className="text-red-400">{formatCurrency(dreData.impostos)}</span>
                </div>

                {/* Lucro Líquido */}
                <div className="flex justify-between p-4 bg-gradient-to-r from-green-600/20 to-green-500/10 rounded-lg border-2 border-green-500/30">
                  <span className="text-white font-bold text-lg">(=) LUCRO LÍQUIDO</span>
                  <span className="text-green-400 font-bold text-lg">{formatCurrency(dreData.lucroLiquido)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Nova Transação */}
      <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Transação</DialogTitle>
            <DialogDescription className="text-gray-400">Registre uma entrada ou saída no caixa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Tipo</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, type: v })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Categoria</Label>
              <Select
                value={newTransaction.category}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, category: v })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {newTransaction.type === "entrada" ? (
                    <>
                      <SelectItem value="Mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="Matrícula">Matrícula</SelectItem>
                      <SelectItem value="Venda Produtos">Venda de Produtos</SelectItem>
                      <SelectItem value="Personal">Personal Trainer</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Aluguel">Aluguel</SelectItem>
                      <SelectItem value="Energia">Energia</SelectItem>
                      <SelectItem value="Água">Água</SelectItem>
                      <SelectItem value="Internet">Internet</SelectItem>
                      <SelectItem value="Salários">Salários</SelectItem>
                      <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Descrição</Label>
              <Input
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Descreva a transação"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-300">Valor</Label>
              <Input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                placeholder="0,00"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-300">Método de Pagamento</Label>
              <Select
                value={newTransaction.method}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, method: v })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Data</Label>
              <Input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingTransaction(false)}
              className="border-white/20 text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTransaction} className="bg-gradient-to-r from-orange-600 to-red-600">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
