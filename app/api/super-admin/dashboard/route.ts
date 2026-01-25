import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)

    // Buscar estatisticas de academias
    const gymsStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active,
        COUNT(*) FILTER (WHERE trial_ends_at > NOW()) as in_trial
      FROM gyms
    `

    // Buscar estatisticas de trainers
    const trainersStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active
      FROM trainer_profiles_new
    `

    // Buscar estatisticas de alunos
    const studentsStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE account_type = 'student' OR role = 'student') as students,
        COUNT(*) FILTER (WHERE is_independent = true) as independent
      FROM users
      WHERE account_type = 'student' OR role = 'student' OR is_independent = true
    `

    // Buscar assinaturas ativas e receita
    const subscriptionsStats = await sql`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
        COUNT(*) FILTER (WHERE status = 'trial') as trial_subscriptions,
        COALESCE(SUM(
          CASE WHEN status = 'active' THEN
            (SELECT price_monthly FROM saas_plans_new sp WHERE sp.id = saas_subscriptions.plan_id)
          ELSE 0 END
        ), 0) as monthly_revenue
      FROM saas_subscriptions
    `

    // Buscar atividade recente
    const recentUsers = await sql`
      SELECT 
        user_id, name, email, account_type, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    const recentGyms = await sql`
      SELECT 
        id, gym_name, created_at
      FROM gyms 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Montar atividade recente
    const recentActivity = [
      ...recentUsers.map(u => ({
        id: u.user_id,
        type: u.account_type === 'gym_owner' ? 'Dono Academia' : 
              u.account_type === 'trainer' ? 'Personal' : 'Aluno',
        description: `Novo usuario: ${u.name}`,
        timestamp: new Date(u.created_at).toLocaleString('pt-BR'),
        status: 'success'
      })),
      ...recentGyms.map(g => ({
        id: g.id,
        type: 'Academia',
        description: `Nova academia: ${g.gym_name}`,
        timestamp: new Date(g.created_at).toLocaleString('pt-BR'),
        status: 'success'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    // Calcular churn rate (simplificado)
    const churnRate = subscriptionsStats[0]?.total_subscriptions > 0 
      ? ((subscriptionsStats[0]?.total_subscriptions - subscriptionsStats[0]?.active_subscriptions) / subscriptionsStats[0]?.total_subscriptions * 100).toFixed(1)
      : 0

    return NextResponse.json({
      stats: {
        totalGyms: Number(gymsStats[0]?.total) || 0,
        activeGyms: Number(gymsStats[0]?.active) || 0,
        totalTrainers: Number(trainersStats[0]?.total) || 0,
        activeTrainers: Number(trainersStats[0]?.active) || 0,
        totalStudents: Number(studentsStats[0]?.students) || 0,
        activeStudents: Number(studentsStats[0]?.students) || 0,
        independentStudents: Number(studentsStats[0]?.independent) || 0,
        monthlyRevenue: Number(subscriptionsStats[0]?.monthly_revenue) || 0,
        trialUsers: Number(subscriptionsStats[0]?.trial_subscriptions) || 0,
        churnRate: Number(churnRate) || 0,
      },
      recentActivity,
    })
  } catch (error) {
    console.error("[SuperAdmin] Dashboard error:", error)
    return NextResponse.json({ error: "Erro ao carregar dashboard" }, { status: 500 })
  }
}
