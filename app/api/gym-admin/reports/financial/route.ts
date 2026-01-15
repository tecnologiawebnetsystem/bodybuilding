import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gymId = searchParams.get("gymId") || "1"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Receitas
    const revenues = await sql`
      SELECT 
        DATE_TRUNC('month', payment_date) as month,
        SUM(amount) as total_revenue,
        COUNT(*) as payments_count
      FROM student_payments
      WHERE status = 'paid'
        ${startDate ? sql`AND payment_date >= ${startDate}` : sql``}
        ${endDate ? sql`AND payment_date <= ${endDate}` : sql``}
      GROUP BY month
      ORDER BY month DESC
    `

    // Despesas
    const expenses = await sql`
      SELECT 
        DATE_TRUNC('month', expense_date) as month,
        SUM(amount) as total_expenses,
        COUNT(*) as expenses_count
      FROM gym_expenses
      ${startDate ? sql`WHERE expense_date >= ${startDate}` : sql``}
      ${endDate ? sql`AND expense_date <= ${endDate}` : sql``}
      GROUP BY month
      ORDER BY month DESC
    `

    // Salários de funcionários
    const salaries = await sql`
      SELECT 
        DATE_TRUNC('month', payment_date) as month,
        SUM(amount) as total_salaries,
        COUNT(*) as employees_count
      FROM employee_payments
      ${startDate ? sql`WHERE payment_date >= ${startDate}` : sql``}
      ${endDate ? sql`AND payment_date <= ${endDate}` : sql``}
      GROUP BY month
      ORDER BY month DESC
    `

    // Total de alunos ativos por mês
    const activeStudents = await sql`
      SELECT 
        DATE_TRUNC('month', start_date) as month,
        COUNT(*) as active_count
      FROM student_enrollments
      WHERE status = 'active' AND gym_id = ${gymId}
      ${startDate ? sql`AND start_date >= ${startDate}` : sql``}
      ${endDate ? sql`AND start_date <= ${endDate}` : sql``}
      GROUP BY month
      ORDER BY month DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        revenues,
        expenses,
        salaries,
        activeStudents,
      },
    })
  } catch (error: any) {
    console.error("Error generating financial report:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório financeiro", details: error.message }, { status: 500 })
  }
}
