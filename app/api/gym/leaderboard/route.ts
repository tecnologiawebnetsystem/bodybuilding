import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gymId = searchParams.get("gymId")
    const userId = searchParams.get("userId")

    if (!gymId) {
      return Response.json({ error: "Gym ID required" }, { status: 400 })
    }

    // Buscar top 10 do ranking
    const leaderboard = await sql`
      SELECT 
        gl.user_id,
        gl.total_points,
        gl.checkin_streak,
        gl.monthly_rank,
        u.name as user_name
      FROM gym_leaderboard gl
      JOIN users u ON gl.user_id = u.user_id
      WHERE gl.gym_id = ${gymId}
      ORDER BY gl.total_points DESC
      LIMIT 10
    `

    // Buscar posição do usuário atual
    let userRank = null
    if (userId) {
      const rankQuery = await sql`
        SELECT COUNT(*) + 1 as rank
        FROM gym_leaderboard
        WHERE gym_id = ${gymId} 
        AND total_points > (
          SELECT total_points FROM gym_leaderboard 
          WHERE user_id = ${userId} AND gym_id = ${gymId}
        )
      `
      userRank = rankQuery.length > 0 ? rankQuery[0].rank : null
    }

    return Response.json({ leaderboard, userRank })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return Response.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
