import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const totalStudents = await sql`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM users
      WHERE role = 'student' AND gym_id = 1
    `

    // Total de alunos ativos (mesma query pois não temos status na tabela users)
    const activeStudents = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE role = 'student' AND gym_id = 1
    `

    const activeEmployees = await sql`
      SELECT COUNT(*) as count FROM gym_employees 
      WHERE status = 'active'
    `

    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthlyRevenue = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM student_payments
      WHERE status = 'paid' 
      AND TO_CHAR(payment_date, 'YYYY-MM') = ${currentMonth}
    `

    const monthlyExpenses = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM gym_expenses 
      WHERE TO_CHAR(expense_date, 'YYYY-MM') = ${currentMonth}
    `

    const employeePayments = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM employee_payments ep
      JOIN gym_employees ge ON ge.id = ep.employee_id
      WHERE ep.reference_month = ${currentMonth}
    `

    const pendingPayments = await sql`
      SELECT COUNT(*) as count
      FROM student_payments
      WHERE status = 'pending'
    `

    const weeklyCheckins = await sql`
      SELECT COUNT(DISTINCT dc.user_id) as count
      FROM daily_checkins dc
      JOIN users u ON u.user_id = dc.user_id
      WHERE dc.checkin_date >= CURRENT_DATE - INTERVAL '7 days'
      AND u.gym_id = 1 AND u.role = 'student'
    `

    const totalActiveStudents = Number(activeStudents[0]?.count) || 1
    const weeklyCheckinsCount = Number(weeklyCheckins[0]?.count) || 0
    const attendancePercentage = (weeklyCheckinsCount / totalActiveStudents) * 100

    const totalExpenses = Number(monthlyExpenses[0]?.total || 0) + Number(employeePayments[0]?.total || 0)

    return Response.json({
      totalStudents: Number(totalStudents[0]?.count) || 0,
      activeStudents: Number(activeStudents[0]?.count) || 0,
      employees: Number(activeEmployees[0]?.count) || 0,
      totalRevenue: Number(monthlyRevenue[0]?.total) || 0,
      totalExpenses: totalExpenses,
      pendingPayments: Number(pendingPayments[0]?.count) || 0,
      weeklyAttendance: attendancePercentage,
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return Response.json({
      totalStudents: 0,
      activeStudents: 0,
      employees: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      pendingPayments: 0,
      weeklyAttendance: 0,
    })
  }
}
