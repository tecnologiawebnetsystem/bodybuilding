import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection
export const sql = neon(process.env.DATABASE_URL!)

// User operations
export async function getUser(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE user_id = ${userId}
  `
  return result[0]
}

export async function verifyPin(userId: string, pin: string) {
  const result = await sql`
    SELECT * FROM users WHERE user_id = ${userId} AND pin = ${pin}
  `
  return result.length > 0
}

// Weight logs operations
export async function getWeightLogs(userId: string, limit = 30) {
  const result = await sql`
    SELECT * FROM weight_logs 
    WHERE user_id = ${userId} 
    ORDER BY date DESC 
    LIMIT ${limit}
  `
  return result
}

export async function addWeightLog(userId: string, weight: number, date: string, notes?: string) {
  const result = await sql`
    INSERT INTO weight_logs (user_id, weight, date, notes)
    VALUES (${userId}, ${weight}, ${date}, ${notes || null})
    RETURNING *
  `
  return result[0]
}

// Workout checkins operations
export async function getWorkoutCheckins(userId: string, date: string) {
  const result = await sql`
    SELECT * FROM workout_checkins 
    WHERE user_id = ${userId} AND date = ${date}
    ORDER BY created_at DESC
  `
  return result
}

export async function addWorkoutCheckin(
  userId: string,
  workoutType: string,
  workoutName: string,
  date: string,
  notes?: string,
) {
  const result = await sql`
    INSERT INTO workout_checkins (user_id, workout_type, workout_name, date, notes)
    VALUES (${userId}, ${workoutType}, ${workoutName}, ${date}, ${notes || null})
    RETURNING *
  `
  return result[0]
}

// Running checkins operations
export async function getRunningCheckins(userId: string, limit = 30) {
  const result = await sql`
    SELECT * FROM running_checkins 
    WHERE user_id = ${userId} 
    ORDER BY date DESC 
    LIMIT ${limit}
  `
  return result
}

export async function addRunningCheckin(
  userId: string,
  distance: number,
  duration: number,
  date: string,
  notes?: string,
) {
  const result = await sql`
    INSERT INTO running_checkins (user_id, distance, duration, date, notes)
    VALUES (${userId}, ${distance}, ${duration}, ${date}, ${notes || null})
    RETURNING *
  `
  return result[0]
}

export async function deleteRunningCheckin(id: number) {
  const result = await sql`
    DELETE FROM running_checkins 
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function clearRunningHistory(userId: string) {
  const result = await sql`
    DELETE FROM running_checkins 
    WHERE user_id = ${userId}
    RETURNING *
  `
  return result
}

// Supplement logs operations
export async function getSupplementLogs(userId: string, date: string) {
  const result = await sql`
    SELECT * FROM supplement_logs 
    WHERE user_id = ${userId} AND date = ${date}
    ORDER BY created_at ASC
  `
  return result
}

export async function toggleSupplementLog(id: number, taken: boolean) {
  const result = await sql`
    UPDATE supplement_logs 
    SET taken = ${taken}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function addSupplementLog(
  userId: string,
  supplementName: string,
  dosage: string,
  time: string,
  date: string,
) {
  const result = await sql`
    INSERT INTO supplement_logs (user_id, supplement_name, dosage, time, date)
    VALUES (${userId}, ${supplementName}, ${dosage}, ${time}, ${date})
    RETURNING *
  `
  return result[0]
}
