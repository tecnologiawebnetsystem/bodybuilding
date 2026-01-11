import { AchievementsGrid } from "@/components/achievements-grid"

export default function AchievementsPage() {
  // TODO: Get userId from session/auth
  const userId = "kleber"

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Conquistas</h1>
        <p className="text-muted-foreground">
          Complete desafios e desbloqueie conquistas para ganhar pontos e badges exclusivos
        </p>
      </div>

      <AchievementsGrid userId={userId} />
    </div>
  )
}
