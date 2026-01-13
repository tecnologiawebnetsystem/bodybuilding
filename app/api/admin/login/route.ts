import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Admin login attempt:", username)

    const result = await sql`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.role,
        u.gym_id,
        g.gym_name,
        g.city,
        g.state,
        g.email as gym_email
      FROM users u
      LEFT JOIN gyms g ON u.gym_id = g.id
      WHERE u.user_id = ${username} AND u.pin = ${password}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const user = result[0]

    let stats = {}

    if (user.role === "super_admin") {
      // Super Admin: estatísticas de todo o sistema
      const [gymsCount, trainersCount, studentsCount] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM gyms WHERE is_active = true`,
        sql`SELECT COUNT(*) as count FROM personal_trainers WHERE is_active = true`,
        sql`SELECT COUNT(*) as count FROM users WHERE role = 'student'`,
      ])

      stats = {
        totalGyms: gymsCount[0].count,
        totalTrainers: trainersCount[0].count,
        totalStudents: studentsCount[0].count,
      }
    } else if (user.role === "gym_admin" && user.gym_id) {
      // Gym Admin: estatísticas da academia
      const [studentsCount, activeEnrollments, monthlyRevenue] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM users WHERE role = 'student' AND gym_id = ${user.gym_id}`,
        sql`SELECT COUNT(*) as count FROM student_enrollments WHERE gym_id = ${user.gym_id} AND status = 'active'`,
        sql`SELECT COALESCE(SUM(monthly_value), 0) as total FROM student_enrollments WHERE gym_id = ${user.gym_id} AND status = 'active'`,
      ])

      stats = {
        totalStudents: studentsCount[0].count,
        activeEnrollments: activeEnrollments[0].count,
        monthlyRevenue: Number.parseFloat(monthlyRevenue[0].total || 0),
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        gym: user.gym_id
          ? {
              id: user.gym_id,
              name: user.gym_name,
              city: user.city,
              state: user.state,
              email: user.gym_email,
            }
          : null,
      },
      stats,
    })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
