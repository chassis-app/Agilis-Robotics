import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Download, Search, Pencil } from 'lucide-react'

type UserStatus = 'active' | 'inactive'

interface UserRow {
  id: string
  name: string
  nameEn: string
  email: string
  role: string
  roleEn: string
  department: string
  departmentEn: string
  status: UserStatus
  lastLogin: string
}

const mockUsers: UserRow[] = [
  { id: '1', name: '陈总', nameEn: 'Chen Zong', email: 'chen@agilis.com', role: '总经理', roleEn: 'General Manager', department: '管理层', departmentEn: 'Management', status: 'active', lastLogin: '2024-12-15 09:30' },
  { id: '2', name: '王芳', nameEn: 'Wang Fang', email: 'wang.fang@agilis.com', role: '工程师', roleEn: 'Engineer', department: '工程部', departmentEn: 'Engineering', status: 'active', lastLogin: '2024-12-15 08:45' },
  { id: '3', name: '李明', nameEn: 'Li Ming', email: 'li.ming@agilis.com', role: '采购主管', roleEn: 'Procurement Lead', department: '供应链', departmentEn: 'Supply Chain', status: 'active', lastLogin: '2024-12-14 17:20' },
  { id: '4', name: '刘洋', nameEn: 'Liu Yang', email: 'liu.yang@agilis.com', role: '生产主管', roleEn: 'Production Lead', department: '生产部', departmentEn: 'Manufacturing', status: 'active', lastLogin: '2024-12-15 10:00' },
  { id: '5', name: '赵静', nameEn: 'Zhao Jing', email: 'zhao.jing@agilis.com', role: '品质主管', roleEn: 'Quality Lead', department: '质量部', departmentEn: 'Quality', status: 'active', lastLogin: '2024-12-13 16:30' },
  { id: '6', name: '张伟', nameEn: 'Zhang Wei', email: 'zhang.wei@agilis.com', role: '仓库管理员', roleEn: 'Warehouse Admin', department: '仓储部', departmentEn: 'Warehouse', status: 'inactive', lastLogin: '2024-11-20 14:15' },
]

const statusStyles: Record<UserStatus, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  active: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '启用', labelEn: 'Active' },
  inactive: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', label: '停用', labelEn: 'Inactive' },
}

export default function AdminUsers() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockUsers.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.name.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '用户与角色' : 'Users & Roles'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '添加用户' : 'Add User'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索用户名、邮箱...' : 'Search name, email...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '姓名' : 'Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '邮箱' : 'Email'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '角色' : 'Role'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '部门' : 'Department'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '最后登录' : 'Last Login'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const config = statusStyles[row.status]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">
                      {language === 'zh-CN' ? row.name : row.nameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{row.email}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                        {language === 'zh-CN' ? row.role : row.roleEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? row.department : row.departmentEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                        {language === 'zh-CN' ? config.label : config.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{row.lastLogin}</td>
                    <td className="px-3 py-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
        </div>
      </Card>
    </div>
  )
}
