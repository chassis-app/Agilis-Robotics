import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/useAuthStore'
import { useLayoutStore } from '@/store/useLayoutStore'
import { Bell, Search, Menu, Globe } from 'lucide-react'
import { DropdownMenu } from '@/components/ui/DropdownMenu'

export function TopBar() {
  const { t, i18n } = useTranslation()
  const { user, language, setLanguage, availableUsers, setUser } = useAuthStore()
  const { setSidebarMobileOpen } = useLayoutStore()

  const toggleLang = () => {
    const newLang = language === 'zh-CN' ? 'en' : 'zh-CN'
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center px-4 gap-4 shrink-0">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden text-neutral-500 hover:text-neutral-700"
        onClick={() => setSidebarMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('common.search') + ' (⌘K)'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{language === 'zh-CN' ? '中文' : 'EN'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-danger-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User avatar */}
        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-neutral-700">{user.name}</div>
                <div className="text-xs text-neutral-400">{user.role}</div>
              </div>
            </button>
          }
          items={[
            ...availableUsers.map((u) => ({
              label: `${u.name} (${u.role})`,
              onClick: () => setUser(u),
            })),
            { label: '---', onClick: () => {}, disabled: true },
            { label: t('common.logout'), onClick: () => {}, danger: true },
          ]}
        />
      </div>
    </header>
  )
}
