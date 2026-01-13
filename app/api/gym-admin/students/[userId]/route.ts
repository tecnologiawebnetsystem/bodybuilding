import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const body = await request.json()

    const {
      name,
      email,
      gender,
      height,
      current_weight,
      target_weight,
      pin,
      age,
      profile_photo_url,
      gym_member_id,
      partner_gym_id,
      subscription_status,
      subscription_plan_id,
      personal_trainer_id,
      user_role,
      initial_weight,
      start_date,
      gym_member_since,
    } = body

    // Construir update dinâmico apenas com campos fornecidos
    const updates: string[] = []
    const values: any[] = []

    if (name !== undefined) {
      updates.push("name = $" + (values.length + 1))
      values.push(name)
    }
    if (email !== undefined) {
      updates.push("email = $" + (values.length + 1))
      values.push(email)
    }
    if (gender !== undefined) {
      updates.push("gender = $" + (values.length + 1))
      values.push(gender)
    }
    if (height !== undefined) {
      updates.push("height = $" + (values.length + 1))
      values.push(height)
    }
    if (current_weight !== undefined) {
      updates.push("current_weight = $" + (values.length + 1))
      values.push(current_weight)
    }
    if (target_weight !== undefined) {
      updates.push("target_weight = $" + (values.length + 1))
      values.push(target_weight)
    }
    if (pin !== undefined && pin !== "") {
      updates.push("pin = $" + (values.length + 1))
      values.push(pin)
    }
    if (age !== undefined) {
      updates.push("age = $" + (values.length + 1))
      values.push(age)
    }
    if (profile_photo_url !== undefined) {
      updates.push("profile_photo_url = $" + (values.length + 1))
      values.push(profile_photo_url)
    }
    if (gym_member_id !== undefined) {
      updates.push("gym_member_id = $" + (values.length + 1))
      values.push(gym_member_id)
    }
    if (partner_gym_id !== undefined) {
      updates.push("partner_gym_id = $" + (values.length + 1))
      values.push(partner_gym_id)
    }
    if (subscription_status !== undefined) {
      updates.push("subscription_status = $" + (values.length + 1))
      values.push(subscription_status)
    }
    if (subscription_plan_id !== undefined) {
      updates.push("subscription_plan_id = $" + (values.length + 1))
      values.push(subscription_plan_id)
    }
    if (personal_trainer_id !== undefined) {
      updates.push("personal_trainer_id = $" + (values.length + 1))
      values.push(personal_trainer_id)
    }
    if (user_role !== undefined) {
      updates.push("user_role = $" + (values.length + 1))
      values.push(user_role)
    }
    if (initial_weight !== undefined) {
      updates.push("initial_weight = $" + (values.length + 1))
      values.push(initial_weight)
    }
    if (start_date !== undefined) {
      updates.push("start_date = $" + (values.length + 1))
      values.push(start_date)
    }
    if (gym_member_since !== undefined) {
      updates.push("gym_member_since = $" + (values.length + 1))
      values.push(gym_member_since)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    values.push(userId)
    const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = $${values.length}`

    await sql(query, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error)
    return NextResponse.json({ error: "Erro ao atualizar aluno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    await sql`DELETE FROM users WHERE user_id = ${userId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir aluno:", error)
    return NextResponse.json({ error: "Erro ao excluir aluno" }, { status: 500 })
  }
}
