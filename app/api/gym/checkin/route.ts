import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, gymId, qrCode } = body

    // Verificar QR Code se fornecido
    if (qrCode) {
      const gymData = await sql`
        SELECT qr_code_secret FROM partner_gyms WHERE gym_id = ${gymId}
      `
      if (gymData.length === 0 || gymData[0].qr_code_secret !== qrCode) {
        return Response.json({ error: "Invalid QR code" }, { status: 400 })
      }
    }

    // Verificar último check-in (evitar spam)
    const lastCheckin = await sql`
      SELECT checkin_date FROM gym_checkins
      WHERE user_id = ${userId} AND gym_id = ${gymId}
      ORDER BY checkin_date DESC
      LIMIT 1
    `

    if (lastCheckin.length > 0) {
      const hoursSinceLastCheckin = (Date.now() - new Date(lastCheckin[0].checkin_date).getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastCheckin < 4) {
        return Response.json(
          {
            error: "Você já fez check-in hoje. Aguarde 4 horas.",
          },
          { status: 400 },
        )
      }
    }

    const points = qrCode ? 15 : 10 // Mais pontos com QR code

    // Registrar check-in
    await sql`
      INSERT INTO gym_checkins (user_id, gym_id, checkin_type, points_earned)
      VALUES (${userId}, ${gymId}, ${qrCode ? "qr_code" : "manual"}, ${points})
    `

    // Atualizar leaderboard
    const leaderboard = await sql`
      SELECT total_points, checkin_streak, last_checkin_date
      FROM gym_leaderboard
      WHERE user_id = ${userId} AND gym_id = ${gymId}
    `

    let newStreak = 1
    if (leaderboard.length > 0 && leaderboard[0].last_checkin_date) {
      const lastDate = new Date(leaderboard[0].last_checkin_date)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        newStreak = (leaderboard[0].checkin_streak || 0) + 1
      } else if (diffDays === 0) {
        newStreak = leaderboard[0].checkin_streak || 1
      }
    }

    await sql`
      UPDATE gym_leaderboard
      SET total_points = total_points + ${points},
          checkin_streak = ${newStreak},
          last_checkin_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND gym_id = ${gymId}
    `

    return Response.json({
      success: true,
      points,
      streak: newStreak,
      message: `Check-in realizado! +${points} pontos`,
    })
  } catch (error) {
    console.error("Error checking in:", error)
    return Response.json({ error: "Failed to check in" }, { status: 500 })
  }
}
