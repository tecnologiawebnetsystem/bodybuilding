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

    // === SISTEMA DE FIDELIDADE ===
    // Buscar ou criar registro de pontos do usuario
    let userLoyalty = await sql`
      SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
    `

    if (userLoyalty.length === 0) {
      await sql`
        INSERT INTO user_loyalty_points (user_id, total_points, lifetime_points, current_level, total_checkins, current_streak)
        VALUES (${userId}, 0, 0, 'Bronze', 0, 0)
      `
      userLoyalty = await sql`
        SELECT * FROM user_loyalty_points WHERE user_id = ${userId}
      `
    }

    // Buscar nivel atual para aplicar multiplicador
    const currentLevel = await sql`
      SELECT * FROM loyalty_levels 
      WHERE min_points <= ${userLoyalty[0].lifetime_points}
      ORDER BY min_points DESC
      LIMIT 1
    `

    // Calcular pontos com multiplicador de nivel
    const basePoints = 10
    const multiplier = currentLevel.length > 0 ? parseFloat(currentLevel[0].points_multiplier) : 1.0
    const loyaltyPoints = Math.floor(basePoints * multiplier)

    // Calcular cashback
    const cashbackPercentage = currentLevel.length > 0 ? parseFloat(currentLevel[0].cashback_percentage) : 1.0
    const cashbackEarned = (loyaltyPoints / 100) * cashbackPercentage

    // Calcular streak de fidelidade
    let loyaltyStreak = 1
    if (userLoyalty[0].current_streak > 0) {
      // Verificar se treinou ontem
      const lastUpdate = new Date(userLoyalty[0].updated_at)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        loyaltyStreak = userLoyalty[0].current_streak + 1
      } else if (diffDays === 0) {
        loyaltyStreak = userLoyalty[0].current_streak
      }
    }

    // Verificar se quebrou recorde de streak
    const longestStreak = Math.max(userLoyalty[0].longest_streak || 0, loyaltyStreak)

    // Atualizar pontos de fidelidade
    const newTotalPoints = userLoyalty[0].total_points + loyaltyPoints
    const newLifetimePoints = userLoyalty[0].lifetime_points + loyaltyPoints
    const newCashback = parseFloat(userLoyalty[0].cashback_balance || 0) + cashbackEarned
    const newTotalCheckins = userLoyalty[0].total_checkins + 1

    // Verificar novo nivel
    const newLevelData = await sql`
      SELECT name FROM loyalty_levels 
      WHERE min_points <= ${newLifetimePoints}
      ORDER BY min_points DESC
      LIMIT 1
    `
    const newLevel = newLevelData[0]?.name || 'Bronze'
    const leveledUp = newLevel !== userLoyalty[0].current_level

    await sql`
      UPDATE user_loyalty_points 
      SET 
        total_points = ${newTotalPoints},
        lifetime_points = ${newLifetimePoints},
        cashback_balance = ${newCashback},
        current_streak = ${loyaltyStreak},
        longest_streak = ${longestStreak},
        total_checkins = ${newTotalCheckins},
        current_level = ${newLevel},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Registrar transacao
    await sql`
      INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, reference_id, balance_after)
      VALUES (${userId}, 'earn', ${loyaltyPoints}, 'Check-in na academia', 'checkin', ${gymId}, ${newTotalPoints})
    `

    // Bonus por streak
    let streakBonus = 0
    if (loyaltyStreak === 7) {
      streakBonus = 50
    } else if (loyaltyStreak === 30) {
      streakBonus = 200
    } else if (loyaltyStreak % 100 === 0) {
      streakBonus = 500
    }

    if (streakBonus > 0) {
      await sql`
        UPDATE user_loyalty_points SET total_points = total_points + ${streakBonus}, lifetime_points = lifetime_points + ${streakBonus} WHERE user_id = ${userId}
      `
      await sql`
        INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, balance_after)
        VALUES (${userId}, 'bonus', ${streakBonus}, ${'Bonus de sequencia: ' + loyaltyStreak + ' dias!'}, 'streak', ${newTotalPoints + streakBonus})
      `
    }

    // Bonus por subir de nivel
    if (leveledUp) {
      await sql`
        UPDATE user_loyalty_points SET total_points = total_points + 50, lifetime_points = lifetime_points + 50 WHERE user_id = ${userId}
      `
      await sql`
        INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, reference_type, balance_after)
        VALUES (${userId}, 'bonus', 50, ${'Parabens! Voce subiu para o nivel ' + newLevel + '!'}, 'level_up', ${newTotalPoints + streakBonus + 50})
      `
    }

    // Atualizar progresso dos desafios de check-in
    await sql`
      UPDATE user_challenge_progress p
      SET current_value = current_value + 1,
          is_completed = CASE WHEN current_value + 1 >= c.target_value THEN true ELSE false END,
          completed_at = CASE WHEN current_value + 1 >= c.target_value THEN CURRENT_TIMESTAMP ELSE NULL END
      FROM loyalty_challenges c
      WHERE p.challenge_id = c.id 
      AND p.user_id = ${userId}
      AND p.is_completed = false
      AND c.target_metric = 'checkins'
    `

    return Response.json({
      success: true,
      points,
      streak: newStreak,
      message: `Check-in realizado! +${points} pontos`,
      loyalty: {
        pointsEarned: loyaltyPoints,
        cashbackEarned: cashbackEarned.toFixed(2),
        newBalance: newTotalPoints + streakBonus + (leveledUp ? 50 : 0),
        streak: loyaltyStreak,
        level: newLevel,
        leveledUp,
        streakBonus,
        multiplier
      }
    })
  } catch (error) {
    console.error("Error checking in:", error)
    return Response.json({ error: "Failed to check in" }, { status: 500 })
  }
}
