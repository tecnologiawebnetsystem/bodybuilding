"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  ChevronRight,
  QrCode,
  UserPlus,
  Megaphone,
  CalendarCheck,
  Package,
  TrendingUp,
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
import { WorkoutManagement } from "@/components/gym-management/workout-management" // Importando componente de treinos
import { LeadsCRM } from "@/components/gym-management/leads-crm"
import { ClassesManagement } from "@/components/gym-management/classes-management"
import { MarketingCampaigns } from "@/components/gym-management/marketing-campaigns"
import { ContractsManagement } from "@/components/gym-management/contracts-management"
import { FinancialReports } from "@/components/gym-management/financial-reports"
import { BillingAutomation } from "@/components/gym-management/billing-automation"
import { QRCodeCheckin } from "@/components/gym-management/qr-code-checkin"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, User, Lock, Palette, FileText, Download, Upload } from "lucide-react"
import {
  GymDataDialog,
  ChangePasswordDialog,
  AutoMessagesDialog,
  ExportReportsDialog,
} from "@/components/gym-management/settings-dialogs"
import { toast } from "@/components/ui/use-toast"

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
  | "financial-reports" // Adicionando relatórios financeiros
  | "billing" // Adicionando cobrança automatizada
  | "checkin" // Adicionando checkin QR Code

export function AdminPanel({ adminUsername, onLogout }: { adminUsername: string; onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>("dashboard")
  const [notifications, setNotifications] = useState(3)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const [gymDataDialogOpen, setGymDataDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [autoMessagesDialogOpen, setAutoMessagesDialogOpen] = useState(false)
  const [exportReportsDialogOpen, setExportReportsDialogOpen] = useState(false)

  const menuSections = [
    {
      title: "VISÃO GERAL",
      items: [
        { id: "dashboard" as MenuOption, label: "Dashboard", icon: LayoutDashboard },
        { id: "checkin" as MenuOption, label: "Check-in QR Code", icon: QrCode }, // Novo menu
      ],
    },
    {
      title: "CRM & VENDAS",
      items: [
        { id: "leads" as MenuOption, label: "Leads & Prospects", icon: UserPlus },
        { id: "marketing" as MenuOption, label: "Campanhas Marketing", icon: Megaphone },
        { id: "contracts" as MenuOption, label: "Contratos Digitais", icon: FileText },
      ],
    },
    {
      title: "GESTÃO DE MEMBROS",
      items: [
        { id: "students" as MenuOption, label: "Alunos", icon: Users },
        { id: "workouts" as MenuOption, label: "Treinos", icon: Dumbbell },
        { id: "classes" as MenuOption, label: "Aulas Coletivas", icon: Calendar },
        { id: "attendance" as MenuOption, label: "Frequência", icon: CalendarCheck },
      ],
    },
    {
      title: "FINANCEIRO",
      items: [
        { id: "financial-reports" as MenuOption, label: "Relatórios Financeiros", icon: TrendingUp }, // Novo menu
        { id: "billing" as MenuOption, label: "Cobrança Automatizada", icon: CreditCard }, // Novo menu
        { id: "plans" as MenuOption, label: "Planos", icon: Package },
        { id: "student-payments" as MenuOption, label: "Pagamentos Alunos", icon: Receipt },
        { id: "payment-methods" as MenuOption, label: "Formas de Pagamento", icon: Wallet },
        { id: "expenses" as MenuOption, label: "Despesas", icon: TrendingDown },
      ],
    },
    {
      title: "RECURSOS HUMANOS",
      items: [{ id: "employees" as MenuOption, label: "Funcionários", icon: Briefcase }],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">FitTransform</h1>
            <p className="text-xs text-slate-600">Sistema de Gestão</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar alunos, funcionários, pagamentos..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Configurações da Academia</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer" onClick={() => setGymDataDialogOpen(true)}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Dados da Academia</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Funcionalidade em Desenvolvimento",
                    description: "Em breve você poderá editar seu perfil completo de administrador.",
                  })
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer" onClick={() => setChangePasswordDialogOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Alterar Senha/PIN</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Personalização</DropdownMenuLabel>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Personalização de Tema",
                    description: "Em breve você poderá personalizar cores e tema do sistema.",
                  })
                }}
              >
                <Palette className="mr-2 h-4 w-4" />
                <span>Tema e Cores</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Termos de Contrato",
                    description: "Em breve você poderá configurar os termos de contrato personalizados.",
                  })
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Termos de Contrato</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Dados</DropdownMenuLabel>

              <DropdownMenuItem className="cursor-pointer" onClick={() => setExportReportsDialogOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                <span>Exportar Relatórios</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Importar Dados",
                    description: "Em breve você poderá importar alunos e dados em massa via Excel.",
                  })
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Importar Dados</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Avatar className="w-9 h-9">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                {adminUsername.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-slate-900">Administrador FitTransform</p>
              <p className="text-xs text-slate-600">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          <nav className="flex-1 p-4 overflow-y-auto">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeMenu === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveMenu(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all group relative ${
                          isActive
                            ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium shadow-sm"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                            isActive ? "text-red-600" : "text-slate-500"
                          }`}
                        />
                        <span className="text-sm flex-1">{item.label}</span>
                        {isActive && (
                          <>
                            <ChevronRight className="w-4 h-4 text-red-600" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-full"></div>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50">
            <div className="px-4 py-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-1 font-medium">Academia Atual</p>
              <p className="text-sm font-semibold text-slate-900">FitTransform</p>
              <p className="text-xs text-slate-600 mt-1">São Paulo, SP</p>
            </div>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-8 min-h-full">
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
          </div>

          <footer className="bg-white border-t border-slate-200 px-8 py-4 mt-auto">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-6">
                <span>© 2026 FitTransform</span>
                <span>Sistema de Gestão de Academias</span>
                <span>v1.0.0</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Suporte
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Documentação
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Termos de Uso
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <GymDataDialog open={gymDataDialogOpen} onOpenChange={setGymDataDialogOpen} />
      <ChangePasswordDialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen} />
      <AutoMessagesDialog open={autoMessagesDialogOpen} onOpenChange={setAutoMessagesDialogOpen} />
      <ExportReportsDialog open={exportReportsDialogOpen} onOpenChange={setExportReportsDialogOpen} />
    </div>
  )
}
