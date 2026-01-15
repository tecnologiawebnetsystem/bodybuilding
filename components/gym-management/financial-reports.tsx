"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function FinancialReports() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const loadReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)

      const res = await fetch(`/api/gym-admin/reports/financial?${params}`)
      const data = await res.json()

      if (data.success) {
        setReportData(data.data)
      } else {
        toast({
          title: "Erro ao carregar relatório",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar relatório",
        description: "Não foi possível gerar o relatório financeiro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório PDF está sendo gerado...",
    })
  }

  const calculateTotals = () => {
    if (!reportData) return { revenue: 0, expenses: 0, profit: 0 }

    const revenue = reportData.revenues.reduce((sum: number, r: any) => sum + Number(r.total_revenue || 0), 0)
    const expenses = reportData.expenses.reduce((sum: number, e: any) => sum + Number(e.total_expenses || 0), 0)
    const salaries = reportData.salaries.reduce((sum: number, s: any) => sum + Number(s.total_salaries || 0), 0)

    return {
      revenue,
      expenses: expenses + salaries,
      profit: revenue - (expenses + salaries),
    }
  }

  const totals = calculateTotals()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h2>
          <p className="text-muted-foreground">Análise completa de receitas, despesas e lucros</p>
        </div>
        <Button onClick={exportToPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
          <CardDescription>Selecione o período para análise financeira</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={loadReport} disabled={loading} className="w-full">
            {loading ? "Gerando relatório..." : "Gerar Relatório"}
          </Button>
        </CardContent>
      </Card>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totals.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {reportData.revenues.reduce((sum: number, r: any) => sum + Number(r.payments_count || 0), 0)}{" "}
                  pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totals.expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {reportData.expenses.reduce((sum: number, e: any) => sum + Number(e.expenses_count || 0), 0)} despesas
                  registradas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totals.profit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  R$ {totals.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Margem: {((totals.profit / totals.revenue) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Mensal</CardTitle>
              <CardDescription>Detalhamento mês a mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.revenues.map((revenue: any, index: number) => {
                  const expense = reportData.expenses.find((e: any) => e.month === revenue.month)
                  const salary = reportData.salaries.find((s: any) => s.month === revenue.month)
                  const totalExp = Number(expense?.total_expenses || 0) + Number(salary?.total_salaries || 0)
                  const profit = Number(revenue.total_revenue) - totalExp

                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          {new Date(revenue.month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                        </h4>
                        <span className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          R$ {profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Receita</p>
                          <p className="font-medium text-green-600">
                            R$ {Number(revenue.total_revenue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Despesas</p>
                          <p className="font-medium text-red-600">
                            R$ {totalExp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lucro</p>
                          <p className={`font-medium ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            R$ {profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
