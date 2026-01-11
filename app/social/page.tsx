import { SocialFeed } from "@/components/social-feed"

export default function SocialPage() {
  // Em produção, pegar o userId do contexto de autenticação
  const userId = "kleber"

  return (
    <main className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Feed Social</h1>
          <p className="text-muted-foreground">Veja o que seus amigos estão fazendo</p>
        </div>

        <SocialFeed userId={userId} />
      </div>
    </main>
  )
}
