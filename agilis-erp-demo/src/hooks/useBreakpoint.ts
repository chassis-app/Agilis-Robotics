import { useSyncExternalStore } from 'react'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

const queries = {
  xl: '(min-width: 1440px)',
  lg: '(min-width: 1024px)',
  md: '(min-width: 768px)',
} as const

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg'
  if (window.matchMedia(queries.xl).matches) return 'xl'
  if (window.matchMedia(queries.lg).matches) return 'lg'
  if (window.matchMedia(queries.md).matches) return 'md'
  return 'sm'
}

function subscribe(callback: () => void): () => void {
  const mediaQueryLists = Object.values(queries).map((q) =>
    window.matchMedia(q),
  )
  for (const mql of mediaQueryLists) {
    mql.addEventListener('change', callback)
  }
  return () => {
    for (const mql of mediaQueryLists) {
      mql.removeEventListener('change', callback)
    }
  }
}

function getServerSnapshot(): Breakpoint {
  return 'lg'
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getBreakpoint, getServerSnapshot)
}
