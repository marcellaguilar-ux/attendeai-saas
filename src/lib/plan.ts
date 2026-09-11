export type Plan = 'starter' | 'pro' | 'business'

function level(plano: string | null | undefined): number {
  if (plano === 'business') return 3
  if (plano === 'pro') return 2
  if (plano === 'starter') return 1
  return 0
}

export const isPro      = (p: string | null | undefined) => level(p) >= 2
export const isBusiness = (p: string | null | undefined) => level(p) >= 3

export const PLAN_LABEL: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
}

export const PLAN_COLOR: Record<string, string> = {
  starter: '#6c7884',
  pro: '#5b9cff',
  business: '#00e5a0',
}
