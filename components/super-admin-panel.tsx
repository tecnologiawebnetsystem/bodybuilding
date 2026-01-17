"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  HeadphonesIcon,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  Eye,
  Edit,
  Check,
  X,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  FileText,
  Download,
  MoreHorizontal,
  RefreshCw,
  Dumbbell,
  Megaphone,
  Database,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface SuperAdminPanelProps {
  onLogout: () => void
}

// Menu items do Super Admin
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
  { id: "academias", label: "Academias", icon: Building2, badge: "12" },
  { id: "trainers", label: "Personal Trainers", icon: Dumbbell, badge: "8" },
  { id: "planos", label: "Planos SaaS", icon: CreditCard, badge: null },
  { id: "financeiro", label: "Financeiro", icon: DollarSign, badge: null },
  { id: "suporte", label: "Suporte", icon: HeadphonesIcon, badge: "3", badgeColor: "red" },
  { id: "marketing", label: "Marketing", icon: Megaphone, badge: null },
  { id: "logs", label: "Logs & Auditoria", icon: FileText, badge: null },
  { id: "config", label: "Configurações", icon: Settings, badge: null },
]

export function SuperAdminPanel({ onLogout }: SuperAdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarCollapsed ? "w-20" : "w-72"} border-r border-white/[0.08] flex flex-col transition-all duration-300 bg-[#0a0a0a]`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-white/[0.08] flex items-center px-4 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-bold text-white">FitTransform</h1>
              <p className="text-[10px] text-orange-400 font-medium">SUPER ADMIN</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeMenu === item.id
                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      className={`${item.badgeColor === "red" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-gray-300"} text-xs`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
            {!sidebarCollapsed && <span className="text-sm">Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar academias, usuários..."
                className="w-80 pl-10 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500 focus:border-orange-500/50"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-white/[0.05] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-mono">{currentTime.toLocaleTimeString("pt-BR")}</span>

            <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <span className="text-sm font-bold">SA</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/[0.08]">
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/[0.05]">
                  <Settings className="w-4 h-4 mr-2" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.08]" />
                <DropdownMenuItem onClick={onLogout} className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeMenu === "dashboard" && <DashboardExecutivo />}
          {activeMenu === "academias" && <GestaoAcademias />}
          {activeMenu === "trainers" && <GestaoTrainers />}
          {activeMenu === "planos" && <GestaoPlanosSaaS />}
          {activeMenu === "financeiro" && <FinanceiroSistema />}
          {activeMenu === "suporte" && <SuporteTickets />}
          {activeMenu === "marketing" && <MarketingCRM />}
          {activeMenu === "logs" && <LogsAuditoria />}
          {activeMenu === "config" && <ConfiguracoesSistema />}
        </div>
      </main>
    </div>
  )
}

// ============================================
// 1. DASHBOARD EXECUTIVO
// ============================================
function DashboardExecutivo() {
  const metrics = [
    { label: "MRR", value: "R$ 24.890", change: "+12.5%", positive: true, icon: DollarSign },
    { label: "Academias Ativas", value: "12", change: "+2", positive: true, icon: Building2 },
    { label: "Total de Alunos", value: "1.847", change: "+156", positive: true, icon: Users },
    { label: "Taxa de Churn", value: "2.3%", change: "-0.5%", positive: true, icon: TrendingUp },
  ]

  const recentActivities = [
    { type: "new_gym", message: "Academia FitLife cadastrada", time: "2 min atrás" },
    { type: "payment", message: "Pagamento recebido - R$ 199,90", time: "15 min atrás" },
    { type: "ticket", message: "Novo ticket de suporte #127", time: "1 hora atrás" },
    { type: "upgrade", message: "Academia Corpo em Forma fez upgrade", time: "2 horas atrás" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Executivo</h1>
          <p className="text-gray-400 mt-1">Visão geral do seu negócio SaaS</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.05] bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{metric.value}</span>
              <span className={`flex items-center text-sm ${metric.positive ? "text-green-400" : "text-red-400"}`}>
                {metric.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Receita Mensal (MRR)</h3>
            <select className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-gray-300">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-3 px-4">
            {[65, 72, 78, 85, 90, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-orange-500/80 to-red-500/80 rounded-t-lg transition-all hover:from-orange-400 hover:to-red-400"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">{["Ago", "Set", "Out", "Nov", "Dez", "Jan"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-all">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "new_gym"
                      ? "bg-green-500/20 text-green-400"
                      : activity.type === "payment"
                        ? "bg-blue-500/20 text-blue-400"
                        : activity.type === "ticket"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {activity.type === "new_gym" && <Building2 className="w-4 h-4" />}
                  {activity.type === "payment" && <DollarSign className="w-4 h-4" />}
                  {activity.type === "ticket" && <HeadphonesIcon className="w-4 h-4" />}
                  {activity.type === "upgrade" && <Zap className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Academias */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Top Academias por Receita</h3>
          <div className="space-y-3">
            {[
              { name: "FitTransform", revenue: "R$ 4.990", students: 156 },
              { name: "Academia Força Total", revenue: "R$ 3.890", students: 128 },
              { name: "Corpo em Forma", revenue: "R$ 2.990", students: 98 },
              { name: "FitLife", revenue: "R$ 1.990", students: 65 },
            ].map((gym, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-all">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{gym.name}</p>
                  <p className="text-xs text-gray-500">{gym.students} alunos</p>
                </div>
                <span className="text-sm text-green-400 font-medium">{gym.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planos Distribuição */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Distribuição por Plano</h3>
          <div className="space-y-4">
            {[
              { name: "Empresarial", count: 2, percent: 17, color: "from-purple-500 to-pink-500" },
              { name: "Profissional", count: 5, percent: 42, color: "from-orange-500 to-red-500" },
              { name: "Básico", count: 3, percent: 25, color: "from-blue-500 to-cyan-500" },
              { name: "Gratuito", count: 2, percent: 16, color: "from-gray-500 to-gray-600" },
            ].map((plan, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{plan.name}</span>
                  <span className="text-gray-400">{plan.count} academias</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${plan.color} rounded-full transition-all`}
                    style={{ width: `${plan.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Métricas Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "LTV Médio", value: "R$ 2.890" },
              { label: "CAC", value: "R$ 320" },
              { label: "NPS Score", value: "72" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 2. GESTÃO DE ACADEMIAS
// ============================================
function GestaoAcademias() {
  const [selectedGym, setSelectedGym] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const academias = [
    {
      id: 1,
      name: "FitTransform",
      cnpj: "12.345.678/0001-90",
      plan: "Profissional",
      status: "active",
      students: 156,
      revenue: 4990,
      created: "2024-01-15",
    },
    {
      id: 2,
      name: "Academia Força Total",
      cnpj: "98.765.432/0001-10",
      plan: "Profissional",
      status: "active",
      students: 128,
      revenue: 3890,
      created: "2024-02-20",
    },
    {
      id: 3,
      name: "Corpo em Forma",
      cnpj: "55.666.777/0001-88",
      plan: "Básico",
      status: "active",
      students: 98,
      revenue: 2990,
      created: "2024-03-10",
    },
    {
      id: 4,
      name: "FitLife",
      cnpj: "11.222.333/0001-44",
      plan: "Básico",
      status: "active",
      students: 65,
      revenue: 1990,
      created: "2024-04-05",
    },
    {
      id: 5,
      name: "Gym Master",
      cnpj: "44.555.666/0001-77",
      plan: "Gratuito",
      status: "trial",
      students: 32,
      revenue: 0,
      created: "2024-06-01",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Academias</h1>
          <p className="text-gray-400 mt-1">Gerencie todas as academias cadastradas no sistema</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="w-4 h-4 mr-2" /> Nova Academia
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar academia..."
            className="pl-10 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500"
          />
        </div>
        <select className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 text-gray-300">
          <option value="">Todos os planos</option>
          <option value="free">Gratuito</option>
          <option value="basic">Básico</option>
          <option value="pro">Profissional</option>
          <option value="enterprise">Empresarial</option>
        </select>
        <select className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 text-gray-300">
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspenso</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Academia
              </th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Plano</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Alunos</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Receita/mês
              </th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cadastro
              </th>
              <th className="text-right px-5 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {academias.map((gym) => (
              <tr key={gym.id} className="hover:bg-white/[0.02] transition-all">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{gym.name}</p>
                      <p className="text-xs text-gray-500">{gym.cnpj}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    className={`${
                      gym.plan === "Empresarial"
                        ? "bg-purple-500/20 text-purple-400"
                        : gym.plan === "Profissional"
                          ? "bg-orange-500/20 text-orange-400"
                          : gym.plan === "Básico"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {gym.plan}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    className={`${
                      gym.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : gym.status === "trial"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {gym.status === "active" ? "Ativo" : gym.status === "trial" ? "Trial" : "Suspenso"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-gray-300">{gym.students}</td>
                <td className="px-5 py-4 text-green-400 font-medium">R$ {gym.revenue.toLocaleString("pt-BR")}</td>
                <td className="px-5 py-4 text-gray-400 text-sm">{new Date(gym.created).toLocaleDateString("pt-BR")}</td>
                <td className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.08]">
                      <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/[0.05]">
                        <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/[0.05]">
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/[0.08]" />
                      <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                        <X className="w-4 h-4 mr-2" /> Suspender
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// 3. GESTÃO DE PERSONAL TRAINERS
// ============================================
function GestaoTrainers() {
  const trainers = [
    { id: 1, name: "Carlos Silva", cref: "012345-G/SP", students: 15, revenue: 2250, status: "active" },
    { id: 2, name: "Ana Santos", cref: "067890-G/RJ", students: 12, revenue: 1800, status: "active" },
    { id: 3, name: "Pedro Lima", cref: "034567-G/MG", students: 8, revenue: 1200, status: "active" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Personal Trainers</h1>
          <p className="text-gray-400 mt-1">Gerencie os personal trainers independentes</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600">
          <Plus className="w-4 h-4 mr-2" /> Novo PT
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg font-bold">
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{trainer.name}</h3>
                  <p className="text-xs text-gray-500">CREF: {trainer.cref}</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/[0.03] rounded-lg">
                <p className="text-xs text-gray-500">Alunos</p>
                <p className="text-lg font-bold text-white">{trainer.students}</p>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-lg">
                <p className="text-xs text-gray-500">Receita/mês</p>
                <p className="text-lg font-bold text-green-400">R$ {trainer.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 4. GESTÃO DE PLANOS SAAS
// ============================================
function GestaoPlanosSaaS() {
  const [editPlan, setEditPlan] = useState<any>(null)

  const plans = [
    { id: 1, name: "Gratuito", price: 0, students: 50, features: ["Relatórios básicos", "App mobile"], gyms: 2 },
    {
      id: 2,
      name: "Básico",
      price: 99.9,
      students: 200,
      features: ["Tudo do Gratuito", "Treinos com IA", "Suporte email"],
      gyms: 3,
    },
    {
      id: 3,
      name: "Profissional",
      price: 199.9,
      students: 500,
      features: ["Tudo do Básico", "Marketing", "API", "Suporte prioritário"],
      gyms: 5,
    },
    {
      id: 4,
      name: "Empresarial",
      price: 499.9,
      students: null,
      features: ["Tudo ilimitado", "White label", "Suporte dedicado", "SLA 99.9%"],
      gyms: 2,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Planos SaaS</h1>
          <p className="text-gray-400 mt-1">Configure os planos e preços do sistema</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600">
          <Plus className="w-4 h-4 mr-2" /> Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white/[0.03] border rounded-xl p-5 transition-all ${
              plan.name === "Profissional"
                ? "border-orange-500/50 ring-1 ring-orange-500/20"
                : "border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            {plan.name === "Profissional" && (
              <Badge className="bg-orange-500/20 text-orange-400 mb-3">Mais Popular</Badge>
            )}
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-white">
                {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2).replace(".", ",")}`}
              </span>
              {plan.price > 0 && <span className="text-gray-500">/mês</span>}
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {plan.students ? `Até ${plan.students} alunos` : "Alunos ilimitados"}
            </p>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-white/[0.08]">
              <p className="text-xs text-gray-500">{plan.gyms} academias neste plano</p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.05] bg-transparent"
            >
              <Edit className="w-4 h-4 mr-2" /> Editar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 5. FINANCEIRO DO SISTEMA
// ============================================
function FinanceiroSistema() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financeiro do Sistema</h1>
          <p className="text-gray-400 mt-1">Controle total das finanças do seu SaaS</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.05] bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" /> Exportar DRE
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Faturamento Mensal", value: "R$ 24.890", icon: DollarSign, color: "green" },
          { label: "Custos Fixos", value: "R$ 8.500", icon: CreditCard, color: "red" },
          { label: "Lucro Líquido", value: "R$ 16.390", icon: TrendingUp, color: "green" },
          { label: "Inadimplência", value: "R$ 890 (3.5%)", icon: AlertTriangle, color: "yellow" },
        ].map((metric, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <metric.icon
                className={`w-5 h-5 ${
                  metric.color === "green"
                    ? "text-green-400"
                    : metric.color === "red"
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              />
            </div>
            <span
              className={`text-2xl font-bold ${
                metric.color === "green"
                  ? "text-green-400"
                  : metric.color === "red"
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Últimas Transações</h3>
        <div className="space-y-3">
          {[
            { gym: "FitTransform", type: "Mensalidade", value: 199.9, status: "paid", date: "15/01/2025" },
            { gym: "Academia Força Total", type: "Mensalidade", value: 199.9, status: "paid", date: "14/01/2025" },
            { gym: "Corpo em Forma", type: "Upgrade Plano", value: 100.0, status: "paid", date: "13/01/2025" },
            { gym: "FitLife", type: "Mensalidade", value: 99.9, status: "pending", date: "10/01/2025" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.status === "paid" ? "bg-green-500/20" : "bg-yellow-500/20"
                  }`}
                >
                  {tx.status === "paid" ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.gym}</p>
                  <p className="text-xs text-gray-500">{tx.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">R$ {tx.value.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 6. SUPORTE E TICKETS
// ============================================
function SuporteTickets() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const tickets = [
    {
      id: 127,
      gym: "FitLife",
      subject: "Erro ao gerar relatório",
      priority: "high",
      status: "open",
      date: "16/01/2025",
    },
    {
      id: 126,
      gym: "Corpo em Forma",
      subject: "Dúvida sobre integração PIX",
      priority: "normal",
      status: "open",
      date: "15/01/2025",
    },
    {
      id: 125,
      gym: "Academia Força Total",
      subject: "Solicitar mais usuários",
      priority: "low",
      status: "open",
      date: "14/01/2025",
    },
    {
      id: 124,
      gym: "FitTransform",
      subject: "Bug no check-in",
      priority: "high",
      status: "resolved",
      date: "13/01/2025",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Suporte & Tickets</h1>
          <p className="text-gray-400 mt-1">Gerencie as solicitações de suporte</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400">3 abertos</Badge>
          <Badge className="bg-green-500/20 text-green-400">12 resolvidos</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <Input
              placeholder="Buscar tickets..."
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500"
            />
          </div>
          <div className="divide-y divide-white/[0.05]">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id ? "bg-white/[0.03]" : ""
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500 text-sm">#{ticket.id}</span>
                      <Badge
                        className={`${
                          ticket.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.priority === "normal"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {ticket.priority === "high" ? "Alta" : ticket.priority === "normal" ? "Normal" : "Baixa"}
                      </Badge>
                    </div>
                    <h4 className="text-white font-medium">{ticket.subject}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {ticket.gym} • {ticket.date}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      ticket.status === "open" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {ticket.status === "open" ? "Aberto" : "Resolvido"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Ticket #{selectedTicket.id}</h3>
                <Badge
                  className={`${
                    selectedTicket.status === "open"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {selectedTicket.status === "open" ? "Aberto" : "Resolvido"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assunto</p>
                <p className="text-white">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Academia</p>
                <p className="text-white">{selectedTicket.gym}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Resposta</label>
                <Textarea
                  placeholder="Digite sua resposta..."
                  className="mt-1 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600">Enviar Resposta</Button>
                <Button variant="outline" className="border-white/[0.08] text-gray-300 bg-transparent">
                  Fechar Ticket
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Selecione um ticket para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 7. MARKETING E CRM
// ============================================
function MarketingCRM() {
  const leads = [
    {
      id: 1,
      name: "Academia Power Gym",
      email: "contato@powergym.com",
      phone: "(11) 99999-1111",
      status: "new",
      source: "Site",
    },
    {
      id: 2,
      name: "Studio Fitness",
      email: "studio@fitness.com",
      phone: "(21) 99999-2222",
      status: "contacted",
      source: "Indicação",
    },
    {
      id: 3,
      name: "CrossBox",
      email: "crossbox@email.com",
      phone: "(31) 99999-3333",
      status: "negotiation",
      source: "Google",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing & CRM</h1>
          <p className="text-gray-400 mt-1">Gerencie leads e campanhas de marketing</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600">
          <Plus className="w-4 h-4 mr-2" /> Novo Lead
        </Button>
      </div>

      {/* Funil */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { stage: "Novos", count: 5, color: "blue" },
          { stage: "Contatados", count: 3, color: "yellow" },
          { stage: "Em Negociação", count: 2, color: "orange" },
          { stage: "Fechados", count: 8, color: "green" },
        ].map((stage, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">{stage.stage}</p>
            <p
              className={`text-3xl font-bold mt-2 ${
                stage.color === "blue"
                  ? "text-blue-400"
                  : stage.color === "yellow"
                    ? "text-yellow-400"
                    : stage.color === "orange"
                      ? "text-orange-400"
                      : "text-green-400"
              }`}
            >
              {stage.count}
            </p>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Lead</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Contato</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Origem</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="text-right px-5 py-4 text-xs font-medium text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <p className="text-white font-medium">{lead.name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-300 text-sm">{lead.email}</p>
                  <p className="text-gray-500 text-xs">{lead.phone}</p>
                </td>
                <td className="px-5 py-4 text-gray-400">{lead.source}</td>
                <td className="px-5 py-4">
                  <Badge
                    className={`${
                      lead.status === "new"
                        ? "bg-blue-500/20 text-blue-400"
                        : lead.status === "contacted"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {lead.status === "new" ? "Novo" : lead.status === "contacted" ? "Contatado" : "Negociação"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// 8. LOGS E AUDITORIA
// ============================================
function LogsAuditoria() {
  const logs = [
    { id: 1, action: "Login", user: "superadmin", entity: "Sistema", ip: "189.40.xxx.xxx", date: "16/01/2025 14:30" },
    {
      id: 2,
      action: "Criou academia",
      user: "superadmin",
      entity: "FitLife",
      ip: "189.40.xxx.xxx",
      date: "16/01/2025 14:25",
    },
    {
      id: 3,
      action: "Alterou plano",
      user: "superadmin",
      entity: "Corpo em Forma",
      ip: "189.40.xxx.xxx",
      date: "16/01/2025 14:20",
    },
    {
      id: 4,
      action: "Respondeu ticket",
      user: "superadmin",
      entity: "Ticket #124",
      ip: "189.40.xxx.xxx",
      date: "16/01/2025 14:15",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Logs & Auditoria</h1>
          <p className="text-gray-400 mt-1">Histórico completo de ações no sistema</p>
        </div>
        <Button variant="outline" className="border-white/[0.08] text-gray-300 bg-transparent">
          <Download className="w-4 h-4 mr-2" /> Exportar Logs
        </Button>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Ação</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Usuário</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Entidade</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">IP</th>
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Data/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <Badge className="bg-white/10 text-gray-300">{log.action}</Badge>
                </td>
                <td className="px-5 py-4 text-white">{log.user}</td>
                <td className="px-5 py-4 text-gray-400">{log.entity}</td>
                <td className="px-5 py-4 text-gray-500 font-mono text-sm">{log.ip}</td>
                <td className="px-5 py-4 text-gray-400 text-sm">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// 9. CONFIGURAÇÕES DO SISTEMA
// ============================================
function ConfiguracoesSistema() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações do Sistema</h1>
        <p className="text-gray-400 mt-1">Gerencie as configurações globais do FitTransform</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Geral */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" /> Geral
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Nome da Plataforma</label>
              <Input defaultValue="FitTransform" className="mt-1 bg-white/[0.05] border-white/[0.08] text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email de Suporte</label>
              <Input
                defaultValue="suporte@fittransform.com"
                className="mt-1 bg-white/[0.05] border-white/[0.08] text-white"
              />
            </div>
          </div>
        </div>

        {/* Integrações */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-400" /> Integrações
          </h3>
          <div className="space-y-3">
            {[
              { name: "Stripe", status: "connected" },
              { name: "SendGrid", status: "connected" },
              { name: "WhatsApp API", status: "pending" },
            ].map((integration, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
                <span className="text-white">{integration.name}</span>
                <Badge
                  className={`${
                    integration.status === "connected"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {integration.status === "connected" ? "Conectado" : "Pendente"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-400" /> Segurança
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Autenticação 2FA</span>
              <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Logs de Auditoria</span>
              <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Backup Automático</span>
              <Badge className="bg-green-500/20 text-green-400">Diário</Badge>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" /> Notificações
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Novos cadastros</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Tickets de suporte</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
              <span className="text-gray-300">Pagamentos recebidos</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-orange-500 to-red-600">Salvar Configurações</Button>
      </div>
    </div>
  )
}
