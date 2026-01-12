// Sistema de roles e permissões do FitTransform

export type UserRole = "student" | "trainer" | "gym_owner" | "admin"

export interface UserProfile {
  userId: string
  role: UserRole
  permissions: string[]
}

export const ROLE_PERMISSIONS = {
  student: ["view_workouts", "view_achievements", "view_social_feed", "view_subscription_plans", "manage_own_data"],
  trainer: [
    "view_workouts",
    "view_achievements",
    "view_social_feed",
    "view_trainer_panel",
    "manage_clients",
    "create_custom_workouts",
  ],
  gym_owner: [
    "view_gym_dashboard",
    "view_gym_analytics",
    "manage_gym_members",
    "view_trainer_panel",
    "manage_trainers",
  ],
  admin: ["full_access", "manage_all_users", "manage_system_settings"],
} as const

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission) || ROLE_PERMISSIONS[role].includes("full_access")
}

export function getUserRole(userId: string): UserRole {
  // Por enquanto, retorna do sessionStorage
  // No futuro, buscar do banco de dados
  const storedRole = sessionStorage.getItem(`user_role_${userId}`)
  return (storedRole as UserRole) || "student"
}

export function setUserRole(userId: string, role: UserRole): void {
  sessionStorage.setItem(`user_role_${userId}`, role)
}
