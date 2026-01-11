import TrainerDashboard from "@/components/trainer-dashboard"

export default function TrainerPage() {
  // Em produção, o trainerId viria da sessão/autenticação
  const trainerId = "pt_carlos"

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Painel Personal Trainer</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus alunos e acompanhe o progresso</p>
      </div>

      <TrainerDashboard trainerId={trainerId} />
    </main>
  )
}
