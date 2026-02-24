import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navigation as navigationConfig } from '@/config/navigation'

interface Crumb {
  label: string
  path?: string
}

function buildBreadcrumbs(pathname: string, t: (key: string, options?: Record<string, unknown>) => string): Crumb[] {
  const crumbs: Crumb[] = [{ label: t('common.home'), path: '/' }]

  if (pathname === '/') return crumbs

  // Find the matching nav item
  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (pathname.startsWith(item.path)) {
        // Add section if it exists
        if (section.label) {
          crumbs.push({ label: t(`nav.${section.id}`, { defaultValue: section.label }) })
        }
        crumbs.push({ label: t(`nav.${item.id}`, { defaultValue: item.label }), path: item.path })

        // If there's more to the path (e.g., /:id), add a detail crumb
        const remainder = pathname.slice(item.path.length)
        if (remainder && remainder !== '/') {
          const id = remainder.replace(/^\//, '')
          if (id === 'new') {
            crumbs.push({ label: t('common.create') })
          } else {
            crumbs.push({ label: id })
          }
        }
        return crumbs
      }
    }
  }

  // Fallback: just split the path
  const segments = pathname.split('/').filter(Boolean)
  segments.forEach((seg) => {
    crumbs.push({ label: seg.replace(/-/g, ' ') })
  })

  return crumbs
}

export function Breadcrumbs() {
  const location = useLocation()
  const { t } = useTranslation()
  const crumbs = buildBreadcrumbs(location.pathname, t)

  return (
    <div className="h-10 flex items-center px-6 bg-white border-b border-neutral-200 shrink-0">
      <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-neutral-400" />}
              {i === 0 && <Home className="h-3.5 w-3.5 text-neutral-400 mr-0.5" />}
              {isLast || !crumb.path ? (
                <span className={isLast ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="text-neutral-500 hover:text-primary-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>
    </div>
  )
}
