import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

/**
 * API para consultar logs de acesso das catracas
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const gymId = searchParams.get("gymId")
    const turnstileId = searchParams.get("turnstileId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status") // granted, denied
    const limit = parseInt(searchParams.get("limit") || "50")

    let logs

    if (userId) {
      // Logs de um usuario especifico
      logs = await sql`
        SELECT 
          tal.*,
          t.name as turnstile_name,
          t.location as turnstile_location,
          u.name as user_name,
          u.profile_photo_url
        FROM turnstile_access_logs tal
        LEFT JOIN turnstiles t ON tal.turnstile_id = t.id
        LEFT JOIN users u ON tal.user_id = u.user_id
        WHERE tal.user_id = ${userId}
        ORDER BY tal.accessed_at DESC
        LIMIT ${limit}
      `
    } else if (gymId) {
      // Logs de uma academia
      logs = await sql`
        SELECT 
          tal.*,
          t.name as turnstile_name,
          t.location as turnstile_location,
          u.name as user_name,
          u.profile_photo_url
        FROM turnstile_access_logs tal
        LEFT JOIN turnstiles t ON tal.turnstile_id = t.id
        LEFT JOIN users u ON tal.user_id = u.user_id
        WHERE t.gym_id = ${gymId}
        ORDER BY tal.accessed_at DESC
        LIMIT ${limit}
      `
    } else {
      // Todos os logs recentes
      logs = await sql`
        SELECT 
          tal.*,
          t.name as turnstile_name,
          t.location as turnstile_location,
          u.name as user_name,
          u.profile_photo_url
        FROM turnstile_access_logs tal
        LEFT JOIN turnstiles t ON tal.turnstile_id = t.id
        LEFT JOIN users u ON tal.user_id = u.user_id
        ORDER BY tal.accessed_at DESC
        LIMIT ${limit}
      `
    }

    // Estatisticas
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'granted' AND accessed_at >= CURRENT_DATE) as entries_today,
        COUNT(*) FILTER (WHERE status = 'denied' AND accessed_at >= CURRENT_DATE) as denials_today,
        COUNT(DISTINCT user_id) FILTER (WHERE status = 'granted' AND accessed_at >= CURRENT_DATE) as unique_users_today
      FROM turnstile_access_logs
    `

    return NextResponse.json({
      success: true,
      logs,
      stats: stats[0]
    })

  } catch (error) {
    console.error("[v0] Access logs error:", error)
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 })
  }
}
