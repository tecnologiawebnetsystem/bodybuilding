"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Trophy, Star, Gift, TrendingUp, Flame, Target, 
  Coins, Crown, Award, Zap, Check, ShoppingBag,
  Ticket, Dumbbell, Sparkles, ChevronRight, Clock
} from "lucide-react"

interface LoyaltyTabProps {
  userId: string
  preferences: any
}

interface LoyaltyData {
  points: {
    total_points: number
    lifetime_points: number
    current_streak: number
    longest_streak: number
    total_checkins: number
    current_level: string
    cashback_balance: number
  }
  currentLevel: {
    name: string
    points_multiplier: number
    cashback_percentage: number
    badge_color: string
    benefits: string[]
  }
  nextLevel: {
    name: string
    min_points: number
    benefits: string[]
  } | null
  pointsToNextLevel: number
  levelProgress: number
  recentTransactions: any[]
  challenges: any[]
}

interface Reward {
  id: number
  name: string
  description: string
  category: string
  points_required: number
  cashback_value: number
  stock: number
  image_url: string
}

export function LoyaltyTab({ userId, preferences }: LoyaltyTabProps) {
  const [loading, setLoading] = useState(true)
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [redeemSuccess, setRedeemSuccess] = useState<{code: string, reward: string} | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [loyaltyRes, rewardsRes] = await Promise.all([
        fetch(`/api/loyalty?userId=${userId}`),
        fetch(`/api/loyalty/rewards?userId=${userId}`)
      ])

      const loyaltyJson = await loyaltyRes.json()
      const rewardsJson = await rewardsRes.json()

      if (loyaltyJson.success) {
        setLoyaltyData(loyaltyJson.data)
      }

      if (rewardsJson.success) {
        setRewards(rewardsJson.data.rewards)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async () => {
    if (!selectedReward) return

    setRedeeming(true)
    try {
      const response = await fetch("/api/loyalty/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rewardId: selectedReward.id })
      })

      const data = await response.json()

      if (data.success) {
        setRedeemSuccess({ code: data.data.redemptionCode, reward: data.data.reward })
        loadData() // Recarregar dados
      } else {
        alert(data.error || "Erro ao resgatar")
      }
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setRedeeming(false)
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "bronze": return <Award className="w-6 h-6" />
      case "prata": return <Star className="w-6 h-6" />
      case "ouro": return <Crown className="w-6 h-6" />
      case "platina": return <Sparkles className="w-6 h-6" />
      case "diamante": return <Zap className="w-6 h-6" />
      default: return <Trophy className="w-6 h-6" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "desconto": return <Ticket className="w-5 h-5" />
      case "produto": return <ShoppingBag className="w-5 h-5" />
      case "servico": return <Dumbbell className="w-5 h-5" />
      case "experiencia": return <Sparkles className="w-5 h-5" />
      default: return <Gift className="w-5 h-5" />
    }
  }

  const filteredRewards = activeCategory === "all" 
    ? rewards 
    : rewards.filter(r => r.category === activeCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: preferences.theme_primary }} />
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Erro ao carregar dados de fidelidade</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 pb-24">
      {/* Header com nivel e pontos */}
      <Card 
        className="p-6 text-white overflow-hidden relative"
        style={{ 
          background: `linear-gradient(135deg, ${loyaltyData.currentLevel.badge_color} 0%, ${loyaltyData.currentLevel.badge_color}dd 50%, ${preferences.theme_primary} 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Trophy className="w-full h-full" />
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {getLevelIcon(loyaltyData.currentLevel.name)}
          </div>
          <div>
            <p className="text-white/70 text-sm">Seu nivel</p>
            <h2 className="text-2xl font-bold">{loyaltyData.currentLevel.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4" />
              <span className="text-sm text-white/70">Pontos</span>
            </div>
            <p className="text-3xl font-bold">{loyaltyData.points.total_points.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm text-white/70">Cashback</span>
            </div>
            <p className="text-3xl font-bold">R${loyaltyData.points.cashback_balance.toFixed(2)}</p>
          </div>
        </div>

        {loyaltyData.nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Proximo nivel: {loyaltyData.nextLevel.name}</span>
              <span className="font-medium">{loyaltyData.pointsToNextLevel} pts</span>
            </div>
            <Progress value={loyaltyData.levelProgress} className="h-2 bg-white/20" />
          </div>
        )}
      </Card>

      {/* Stats rapidos */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: "#ef4444" }} />
          <p className="text-2xl font-bold">{loyaltyData.points.current_streak}</p>
          <p className="text-xs text-muted-foreground">Sequencia atual</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2" style={{ color: "#f59e0b" }} />
          <p className="text-2xl font-bold">{loyaltyData.points.total_checkins}</p>
          <p className="text-xs text-muted-foreground">Check-ins totais</p>
        </Card>
        <Card className="p-4 text-center">
          <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "#8b5cf6" }} />
          <p className="text-2xl font-bold">{loyaltyData.points.lifetime_points.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pontos totais</p>
        </Card>
      </div>

      {/* Beneficios do nivel */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5" style={{ color: loyaltyData.currentLevel.badge_color }} />
          Beneficios do nivel {loyaltyData.currentLevel.name}
        </h3>
        <div className="space-y-2">
          {loyaltyData.currentLevel.benefits?.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Desafios Ativos */}
      {loyaltyData.challenges.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: preferences.theme_primary }} />
            Desafios Ativos
          </h3>
          <div className="space-y-3">
            {loyaltyData.challenges.slice(0, 3).map((challenge) => (
              <div 
                key={challenge.id} 
                className={`p-3 rounded-lg border ${challenge.is_completed ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{challenge.name}</p>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Badge variant={challenge.is_completed ? "default" : "secondary"}>
                    +{challenge.points_reward} pts
                  </Badge>
                </div>
                {!challenge.is_completed && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{challenge.current_value}/{challenge.target_value}</span>
                      <span>{Math.round((challenge.current_value / challenge.target_value) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(challenge.current_value / challenge.target_value) * 100} 
                      className="h-1.5"
                    />
                  </div>
                )}
                {challenge.is_completed && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    Completado!
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Catalogo de Recompensas */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" style={{ color: preferences.theme_primary }} />
          Resgatar Recompensas
        </h3>

        {/* Filtro de categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {["all", "desconto", "produto", "servico", "experiencia"].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap"
              style={activeCategory === cat ? { background: preferences.theme_primary } : {}}
            >
              {cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Lista de recompensas */}
        <div className="space-y-3">
          {filteredRewards.map((reward) => {
            const canRedeem = loyaltyData.points.total_points >= reward.points_required

            return (
              <div 
                key={reward.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${canRedeem ? 'hover:border-primary' : 'opacity-60'}`}
                onClick={() => {
                  if (canRedeem) {
                    setSelectedReward(reward)
                    setShowRedeemDialog(true)
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `${preferences.theme_primary}20` }}
                  >
                    {getCategoryIcon(reward.category)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{reward.name}</p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                    {reward.cashback_value > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        +R${reward.cashback_value} cashback
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: canRedeem ? preferences.theme_primary : undefined }}>
                      {reward.points_required}
                    </p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Historico de transacoes */}
      {loyaltyData.recentTransactions.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: preferences.theme_primary }} />
            Historico Recente
          </h3>
          <div className="space-y-2">
            {loyaltyData.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`font-bold ${tx.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dialog de resgate */}
      <Dialog open={showRedeemDialog} onOpenChange={(open) => {
        setShowRedeemDialog(open)
        if (!open) {
          setRedeemSuccess(null)
          setSelectedReward(null)
        }
      }}>
        <DialogContent>
          {redeemSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <Check className="w-6 h-6" />
                  Resgate Confirmado!
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                <p className="mb-4">Voce resgatou: <strong>{redeemSuccess.reward}</strong></p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Codigo de resgate:</p>
                  <p className="text-2xl font-mono font-bold">{redeemSuccess.code}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Apresente este codigo na recepcao para retirar sua recompensa.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowRedeemDialog(false)} className="w-full">
                  Fechar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Resgate</DialogTitle>
                <DialogDescription>
                  Voce esta prestes a resgatar uma recompensa.
                </DialogDescription>
              </DialogHeader>
              {selectedReward && (
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ background: `${preferences.theme_primary}20` }}
                    >
                      {getCategoryIcon(selectedReward.category)}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedReward.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Custo:</span>
                      <span className="font-bold">{selectedReward.points_required} pontos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seu saldo atual:</span>
                      <span>{loyaltyData.points.total_points} pontos</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Saldo apos resgate:</span>
                      <span className="font-bold">
                        {loyaltyData.points.total_points - selectedReward.points_required} pontos
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleRedeem} 
                  disabled={redeeming}
                  style={{ background: preferences.theme_primary }}
                >
                  {redeeming ? "Resgatando..." : "Confirmar Resgate"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
