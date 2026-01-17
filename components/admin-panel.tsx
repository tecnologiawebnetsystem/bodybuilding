"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Receipt,
  Briefcase,
  TrendingDown,
  Calendar,
  LogOut,
  Settings,
  Bell,
  Search,
  Dumbbell,
  QrCode,
  UserPlus,
  Megaphone,
  CalendarCheck,
  Package,
  DollarSign,
  Menu,
  ChevronDown,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { GymDashboard } from "@/components/gym-management/gym-dashboard"
import { StudentsManagementTable } from "@/components/gym-management/students-management-table"
import { PlansManagementTable } from "@/components/gym-management/plans-management-table"
import { PaymentMethodsManagementTable } from "@/components/gym-management/payment-methods-management-table"
import { StudentPaymentsManagementTable } from "@/components/gym-management/student-payments-management-table"
import { EmployeesManagementTable } from "@/components/gym-management/employees-management-table"
import { ExpensesManagementTable } from "@/components/gym-management/expenses-management-table"
import { AttendanceManagementTable } from "@/components/gym-management/attendance-management-table"
import { WorkoutManagement } from "@/components/gym-management/workout-management"
import { LeadsCRM } from "@/components/gym-management/leads-crm"
import { ClassesManagement } from "@/components/gym-management/classes-management"
import { MarketingCampaigns } from "@/components/gym-management/marketing-campaigns"
import { ContractsManagement } from "@/components/gym-management/contracts-management"
import { FinancialReports } from "@/components/gym-management/financial-reports"
import { BillingAutomation } from "@/components/gym-management/billing-automation"
import { QRCodeCheckin } from "@/components/gym-management/qr-code-checkin"
import { FinancialComplete } from "@/components/gym-management/financial-complete"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Lock, FileText, Download, HelpCircle, ExternalLink } from "lucide-react"
import {
  GymDataDialog,
  ChangePasswordDialog,
  AutoMessagesDialog,
  ExportReportsDialog,
} from "@/components/gym-management/settings-dialogs"

type MenuOption =
  | "dashboard"
  | "students"
  | "workouts"
  | "plans"
  | "payment-methods"
  | "student-payments"
  | "employees"
  | "expenses"
  | "attendance"
  | "leads"
  | "classes"
  | "marketing"
  | "contracts"
  | "financial-reports"
  | "billing"
  | "checkin"
  | "financial-complete"

export function AdminPanel({ adminUsername, onLogout }: { adminUsername: string; onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>("dashboard")
  const [notifications, setNotifications] = useState(3)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [gymDataDialogOpen, setGymDataDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [autoMessagesDialogOpen, setAutoMessagesDialogOpen] = useState(false)
  const [exportReportsDialogOpen, setExportReportsDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const menuSections = [
    {
      title: "OVERVIEW",
      items: [
        { id: "dashboard" as MenuOption, label: "Dashboard", icon: LayoutDashboard, badge: null },
        { id: "checkin" as MenuOption, label: "Check-in", icon: QrCode, badge: "Live" },
      ],
    },
    {
      title: "CRM & VENDAS",
      items: [
        { id: "leads" as MenuOption, label: "Leads", icon: UserPlus, badge: "12" },
        { id: "marketing" as MenuOption, label: "Marketing", icon: Megaphone, badge: null },
        { id: "contracts" as MenuOption, label: "Contratos", icon: FileText, badge: null },
      ],
    },
    {
      title: "GESTÃO",
      items: [
        { id: "students" as MenuOption, label: "Alunos", icon: Users, badge: null },
        { id: "workouts" as MenuOption, label: "Treinos", icon: Dumbbell, badge: "AI" },
        { id: "classes" as MenuOption, label: "Aulas", icon: Calendar, badge: null },
        { id: "attendance" as MenuOption, label: "Frequência", icon: CalendarCheck, badge: null },
      ],
    },
    {
      title: "FINANCEIRO",
      items: [
        { id: "financial-complete" as MenuOption, label: "Controle", icon: DollarSign, badge: null },
        { id: "financial-reports" as MenuOption, label: "Relatórios", icon: BarChart3, badge: null },
        { id: "billing" as MenuOption, label: "Cobrança", icon: CreditCard, badge: "Auto" },
        { id: "plans" as MenuOption, label: "Planos", icon: Package, badge: null },
        { id: "student-payments" as MenuOption, label: "Pagamentos", icon: Receipt, badge: "3" },
        { id: "payment-methods" as MenuOption, label: "Métodos", icon: Wallet, badge: null },
        { id: "expenses" as MenuOption, label: "Despesas", icon: TrendingDown, badge: null },
      ],
    },
    {
      title: "RH",
      items: [{ id: "employees" as MenuOption, label: "Equipe", icon: Briefcase, badge: null }],
    },
  ]

  const quickStats = [
    { label: "Alunos Ativos", value: "248", change: "+12%", up: true },
    { label: "Receita Mensal", value: "R$ 42.5k", change: "+8%", up: true },
    { label: "Check-ins Hoje", value: "67", change: "-3%", up: false },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarCollapsed ? "w-20" : "w-64"} bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col transition-all duration-300 fixed h-full z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-white text-sm">FitTransform</h1>
                <p className="text-[10px] text-gray-500">Pro Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Mini */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-white/[0.08]">
            <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-3 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium text-gray-300">Status Hoje</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">67</span>
                <span className="text-xs text-green-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  12%
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">check-ins realizados</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
              {!sidebarCollapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                        isActive ? "bg-white/[0.08] text-white" : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-r-full" />
                      )}
                      <Icon
                        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                          isActive ? "text-orange-500" : "text-gray-500 group-hover:text-gray-300"
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-[13px] flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                item.badge === "Live"
                                  ? "bg-green-500/20 text-green-400"
                                  : item.badge === "AI"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : item.badge === "Auto"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04]">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs">
                  {adminUsername.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">Admin</p>
                <p className="text-[10px] text-gray-500 truncate">FitTransform</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/[0.04] text-xs h-9"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300`}>
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white capitalize">
                {menuSections.flatMap((s) => s.items).find((i) => i.id === activeMenu)?.label || "Dashboard"}
              </h2>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white text-sm placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-white/[0.08] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 pl-3 border-l border-white/[0.08]">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/[0.04]"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/[0.04] relative"
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#141414] border-white/[0.08]">
                  <DropdownMenuLabel className="text-gray-400 text-xs">Configurações</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/[0.08]" />
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-white/[0.04] cursor-pointer"
                    onClick={() => setGymDataDialogOpen(true)}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Dados da Academia
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-white/[0.04] cursor-pointer"
                    onClick={() => setChangePasswordDialogOpen(true)}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar PIN
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.08]" />
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-white/[0.04] cursor-pointer"
                    onClick={() => setExportReportsDialogOpen(true)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Dados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs">
                  {adminUsername.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-[#0a0a0a] border-b border-white/[0.08] px-6 py-3">
          <div className="flex items-center gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-white">{stat.value}</span>
                    <span className={`text-[10px] flex items-center ${stat.up ? "text-green-400" : "text-red-400"}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
                {index < quickStats.length - 1 && <div className="w-px h-10 bg-white/[0.08] ml-4" />}
              </div>
            ))}
            <div className="flex-1" />
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 text-xs h-8"
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Novo Aluno
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-8rem)]">
          <div className="max-w-[1600px] mx-auto">
            {activeMenu === "dashboard" && <GymDashboard />}
            {activeMenu === "students" && <StudentsManagementTable />}
            {activeMenu === "workouts" && <WorkoutManagement />}
            {activeMenu === "leads" && <LeadsCRM />}
            {activeMenu === "classes" && <ClassesManagement />}
            {activeMenu === "marketing" && <MarketingCampaigns />}
            {activeMenu === "contracts" && <ContractsManagement />}
            {activeMenu === "plans" && <PlansManagementTable />}
            {activeMenu === "payment-methods" && <PaymentMethodsManagementTable />}
            {activeMenu === "student-payments" && <StudentPaymentsManagementTable />}
            {activeMenu === "employees" && <EmployeesManagementTable />}
            {activeMenu === "expenses" && <ExpensesManagementTable />}
            {activeMenu === "attendance" && <AttendanceManagementTable />}
            {activeMenu === "financial-reports" && <FinancialReports />}
            {activeMenu === "billing" && <BillingAutomation />}
            {activeMenu === "checkin" && <QRCodeCheckin />}
            {activeMenu === "financial-complete" && <FinancialComplete gymId={1} />}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>© 2026 FitTransform</span>
              <span className="text-gray-700">•</span>
              <span>Desenvolvido por Web NetSystem</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/blog" className="hover:text-white transition-colors flex items-center gap-1">
                Blog
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/contato" className="hover:text-white transition-colors">
                Suporte
              </a>
              <span className="text-gray-700">v2.0</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Dialogs */}
      <GymDataDialog open={gymDataDialogOpen} onOpenChange={setGymDataDialogOpen} />
      <ChangePasswordDialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen} />
      <AutoMessagesDialog open={autoMessagesDialogOpen} onOpenChange={setAutoMessagesDialogOpen} />
      <ExportReportsDialog open={exportReportsDialogOpen} onOpenChange={setExportReportsDialogOpen} />
    </div>
  )
}
