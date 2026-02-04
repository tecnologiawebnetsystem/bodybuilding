import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Obter conquistas, rankings e desafios do usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "all" // achievements, rankings, challenges, all

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId obrigatorio" }, { status: 400 })
    }

    const result: Record<string, unknown> = {}

    if (type === "all" || type === "achievements") {
      // Todas as conquistas
      const allAchievements = await sql`
        SELECT * FROM gym_achievements WHERE is_active = true ORDER BY points ASC
      `
      
      // Conquistas do usuario
      const userAchievements = await sql`
        SELECT ua.*, ga.* 
        FROM gym_user_achievements ua
        JOIN gym_achievements ga ON ua.achievement_id = ga.id
        WHERE ua.user_id = ${userId}
      `
      
      result.achievements = {
        all: allAchievements,
        unlocked: userAchievements
      }
    }

    if (type === "all" || type === "rankings") {
      // Rankings
      const rankings = await sql`
        SELECT ur.*, 
          (SELECT full_name FROM user_profiles WHERE user_id = ur.user_id LIMIT 1) as user_name
        FROM user_rankings ur
        WHERE ur.period = 'monthly'
        ORDER BY ur.total_points DESC
        LIMIT 50
      `
      
      // Posicao do usuario
      const userRanking = await sql`
        SELECT * FROM user_rankings 
        WHERE user_id = ${userId} AND period = 'monthly'
        LIMIT 1
      `
      
      result.rankings = {
        leaderboard: rankings,
        userPosition: userRanking[0] || null
      }
    }

    if (type === "all" || type === "challenges") {
      // Desafios ativos
      const activeChallenges = await sql`
        SELECT c.*, 
          (SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = c.id) as participants_count
        FROM challenges c
        WHERE c.is_active = true AND c.end_date >= CURRENT_DATE
        ORDER BY c.end_date ASC
      `
      
      // Participacao do usuario em desafios
      const userChallenges = await sql`
        SELECT cp.*, c.title, c.description, c.target_value, c.metric_type, c.end_date
        FROM challenge_participants cp
        JOIN challenges c ON cp.challenge_id = c.id
        WHERE cp.user_id = ${userId} AND c.end_date >= CURRENT_DATE
      `
      
      result.challenges = {
        active: activeChallenges,
        participating: userChallenges
      }
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erro ao buscar gamificacao:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar dados" }, { status: 500 })
  }
}

// POST - Participar de desafio ou verificar conquista
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, challengeId } = body

    if (action === "join_challenge") {
      // Verificar se ja esta participando
      const existing = await sql`
        SELECT id FROM challenge_participants 
        WHERE challenge_id = ${challengeId} AND user_id = ${userId}
      `
      
      if (existing.length > 0) {
        return NextResponse.json({ success: false, error: "Ja esta participando deste desafio" }, { status: 400 })
      }
      
      // Verificar capacidade maxima
      const challenge = await sql`
        SELECT max_participants, 
          (SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = ${challengeId}) as current_count
        FROM challenges WHERE id = ${challengeId}
      `
      
      if (challenge[0]?.max_participants && challenge[0].current_count >= challenge[0].max_participants) {
        return NextResponse.json({ success: false, error: "Desafio lotado" }, { status: 400 })
      }
      
      await sql`
        INSERT INTO challenge_participants (challenge_id, user_id)
        VALUES (${challengeId}, ${userId})
      `
      
      return NextResponse.json({ success: true, message: "Inscrito no desafio com sucesso!" })
    }

    if (action === "check_achievements") {
      // Verificar e desbloquear conquistas baseado na atividade do usuario
      const unlockedNew: string[] = []
      
      // Buscar estatisticas do usuario
      const stats = await sql`
        SELECT 
          (SELECT COUNT(*) FROM check_ins WHERE user_id = ${userId}) as total_checkins,
          (SELECT COUNT(*) FROM check_ins WHERE user_id = ${userId} AND DATE(check_in_time) >= CURRENT_DATE - INTERVAL '7 days') as week_checkins,
          (SELECT COUNT(*) FROM check_ins WHERE user_id = ${userId} AND DATE(check_in_time) >= DATE_TRUNC('month', CURRENT_DATE)) as month_checkins
      `
      
      const userStats = stats[0]
      
      // Buscar conquistas nao desbloqueadas
      const availableAchievements = await sql`
        SELECT ga.* FROM gym_achievements ga
        WHERE ga.is_active = true
        AND NOT EXISTS (
          SELECT 1 FROM gym_user_achievements gua 
          WHERE gua.achievement_id = ga.id AND gua.user_id = ${userId}
        )
      `
      
      for (const achievement of availableAchievements) {
        let shouldUnlock = false
        
        if (achievement.requirement_type === 'check_ins') {
          shouldUnlock = userStats.total_checkins >= achievement.requirement_value
        } else if (achievement.requirement_type === 'streak') {
          shouldUnlock = userStats.week_checkins >= achievement.requirement_value
        }
        
        if (shouldUnlock) {
          await sql`
            INSERT INTO gym_user_achievements (user_id, achievement_id)
            VALUES (${userId}, ${achievement.id})
            ON CONFLICT DO NOTHING
          `
          unlockedNew.push(achievement.name)
        }
      }
      
      return NextResponse.json({ success: true, newAchievements: unlockedNew })
    }

    return NextResponse.json({ success: false, error: "Acao invalida" }, { status: 400 })
  } catch (error) {
    console.error("Erro na gamificacao:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar" }, { status: 500 })
  }
}
