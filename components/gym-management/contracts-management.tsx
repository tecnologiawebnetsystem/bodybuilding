"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Clock, AlertCircle, Download } from "lucide-react"

export function ContractsManagement() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      const response = await fetch("/api/gym-admin/contracts")
      if (response.ok) {
        const data = await response.json()
        setContracts(data.contracts || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar contratos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Ativo" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pendente" },
      expired: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Expirado" },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: AlertCircle, label: "Cancelado" },
    }
    const variant = variants[status as keyof typeof variants] || variants.pending
    const Icon = variant.icon
    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contratos Digitais</h1>
        <p className="text-slate-600">Gerencie contratos e assinaturas digitais dos alunos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 py-8">Carregando contratos...</p>
        ) : contracts.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum contrato encontrado</h3>
            <p className="text-slate-600">Os contratos serão criados automaticamente ao matricular alunos</p>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">{contract.student_name}</h3>
                  <p className="text-sm text-slate-600">{contract.contract_type}</p>
                </div>
                {getStatusBadge(contract.status)}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor Mensal:</span>
                  <span className="font-semibold">R$ {Number(contract.monthly_value).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Início:</span>
                  <span>{new Date(contract.start_date).toLocaleDateString()}</span>
                </div>
                {contract.end_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Término:</span>
                    <span>{new Date(contract.end_date).toLocaleDateString()}</span>
                  </div>
                )}
                {contract.signed_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assinado em:</span>
                    <span>{new Date(contract.signed_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Baixar Contrato
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
