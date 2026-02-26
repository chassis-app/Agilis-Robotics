import type { SafetyStockAlertConfig, User } from '@/types'

export type SafetyStockLevel = 'ok' | 'low' | 'critical'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmailList(rawEmails: string[]) {
  return Array.from(
    new Set(
      rawEmails
        .flatMap((entry) => entry.split(/[,\n;]+/))
        .map((email) => email.trim().toLowerCase())
        .filter((email) => EMAIL_REGEX.test(email)),
    ),
  )
}

export function resolveSafetyStockRecipientEmails(config: SafetyStockAlertConfig, users: User[]) {
  const roleSet = new Set(config.recipients.roles)
  const departmentSet = new Set(config.recipients.departments)
  const userIdSet = new Set(config.recipients.userIds)

  const matchedUserEmails = users
    .filter((user) =>
      roleSet.has(user.role) || departmentSet.has(user.department) || userIdSet.has(user.id),
    )
    .map((user) => user.email)

  return Array.from(
    new Set([
      ...matchedUserEmails,
      ...normalizeEmailList(config.recipients.extraEmails),
    ]),
  )
}

export function calculateSafetyStockLevel(
  currentStock: number,
  safetyStock: number,
  criticalThresholdPctBelowSafety: number,
): SafetyStockLevel {
  if (safetyStock <= 0 || currentStock >= safetyStock) return 'ok'

  const pct = Math.max(0, Math.min(95, criticalThresholdPctBelowSafety))
  const criticalBoundary = safetyStock * (1 - pct / 100)
  if (currentStock <= criticalBoundary) return 'critical'
  return 'low'
}

