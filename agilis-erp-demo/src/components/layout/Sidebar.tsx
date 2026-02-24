import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/useLayoutStore'
import { useTranslation } from 'react-i18next'
import { navigation as navigationConfig } from '@/config/navigation'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PanelLeftClose, PanelLeft } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Circle
}

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useLayoutStore()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        'h-14 flex items-center border-b border-neutral-200 shrink-0',
        sidebarCollapsed ? 'justify-center px-2' : 'px-4 gap-3',
      )}>
        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-lg font-semibold text-neutral-900 block truncate">Agilis</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navigationConfig.map((section) => (
          <div key={section.id} className="mb-1">
            {section.label && !sidebarCollapsed && (
              <div className="px-3 py-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                {t(`nav.${section.id}`, { defaultValue: section.label })}
              </div>
            )}
            {sidebarCollapsed && section.label && (
              <div className="my-1 mx-2 border-t border-neutral-200" />
            )}
            {section.items.map((item) => {
              const Icon = getIcon(item.icon)
              const active = isActive(item.path)
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarMobileOpen(false)}
                  title={sidebarCollapsed ? t(`nav.${item.id}`, { defaultValue: item.label }) : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md text-sm transition-colors duration-150 mb-0.5',
                    sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
                    active
                      ? 'bg-primary-50 text-primary-600 font-medium border-l-[3px] border-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 border-l-[3px] border-transparent',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{t(`nav.${item.id}`, { defaultValue: item.label })}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-neutral-200 p-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          {!sidebarCollapsed && <span>收起</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-neutral-100 border-r border-neutral-200 shrink-0 transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-60',
        )}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-60 bg-neutral-100 border-r border-neutral-200 z-30 lg:hidden">
            {content}
          </aside>
        </>
      )}
    </>
  )
}
