import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    // Buscar informações da academia do usuário
    const gymData = await sql`
      SELECT 
        u.partner_gym_id,
        u.gym_member_since,
        u.gym_member_id,
        pg.gym_name,
        pg.gym_logo_url,
        pg.badge_color,
        pg.city,
        pg.state
      FROM users u
      LEFT JOIN partner_gyms pg ON u.partner_gym_id = pg.gym_id
      WHERE u.user_id = ${userId}
    `

    if (gymData.length === 0 || !gymData[0].partner_gym_id) {
      return Response.json({ success: false, data: null })
    }

    // Buscar dados do leaderboard
    const leaderboardData = await sql`
      SELECT total_points, checkin_streak, monthly_rank, achievements
      FROM gym_leaderboard
      WHERE user_id = ${userId} AND gym_id = ${gymData[0].partner_gym_id}
    `

    const leaderboard = leaderboardData[0] || { total_points: 0, checkin_streak: 0 }

    return Response.json({
      success: true,
      data: {
        gymName: gymData[0].gym_name,
        badgeColor: gymData[0].badge_color,
        memberSince: gymData[0].gym_member_since,
        totalPoints: leaderboard.total_points,
        streak: leaderboard.checkin_streak,
        city: gymData[0].city,
        state: gymData[0].state,
      },
    })
  } catch (error) {
    console.error("Error fetching gym data:", error)
    return Response.json({ success: false, error: "Failed to fetch gym data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, gymId } = body

    // Vincular usuário à academia
    await sql`
      UPDATE users
      SET partner_gym_id = ${gymId},
          gym_member_since = CURRENT_DATE
      WHERE user_id = ${userId}
    `

    // Criar entrada no leaderboard
    await sql`
      INSERT INTO gym_leaderboard (user_id, gym_id, total_points, checkin_streak)
      VALUES (${userId}, ${gymId}, 0, 0)
      ON CONFLICT (user_id, gym_id) DO NOTHING
    `

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error linking gym:", error)
    return Response.json({ error: "Failed to link gym" }, { status: 500 })
  }
}
