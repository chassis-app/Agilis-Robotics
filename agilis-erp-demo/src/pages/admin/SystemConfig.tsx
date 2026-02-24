import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Save, Building2, Globe, Clock, MessageSquare, Bell, Link2 } from 'lucide-react'

interface SettingField {
  id: string
  label: string
  labelEn: string
  value: string
  type: 'text' | 'select' | 'toggle'
  options?: { label: string; labelEn: string; value: string }[]
}

interface SettingGroup {
  id: string
  title: string
  titleEn: string
  icon: React.ReactNode
  iconBg: string
  fields: SettingField[]
}

const settingGroups: SettingGroup[] = [
  {
    id: 'general',
    title: '通用设置',
    titleEn: 'General',
    icon: <Building2 className="h-5 w-5" />,
    iconBg: 'bg-primary-50 text-primary-600',
    fields: [
      { id: 'company_name', label: '公司名称', labelEn: 'Company Name', value: '灵巧医疗机器人有限公司', type: 'text' },
      { id: 'language', label: '默认语言', labelEn: 'Default Language', value: 'zh-CN', type: 'select', options: [{ label: '简体中文', labelEn: 'Chinese (Simplified)', value: 'zh-CN' }, { label: 'English', labelEn: 'English', value: 'en' }] },
      { id: 'timezone', label: '时区', labelEn: 'Timezone', value: 'Asia/Shanghai', type: 'select', options: [{ label: '亚洲/上海 (UTC+8)', labelEn: 'Asia/Shanghai (UTC+8)', value: 'Asia/Shanghai' }, { label: 'UTC', labelEn: 'UTC', value: 'UTC' }] },
    ],
  },
  {
    id: 'integrations',
    title: '系统集成',
    titleEn: 'Integrations',
    icon: <Link2 className="h-5 w-5" />,
    iconBg: 'bg-success-50 text-success-600',
    fields: [
      { id: 'feishu', label: '飞书集成', labelEn: 'Feishu Integration', value: 'enabled', type: 'toggle' },
      { id: 'wms', label: 'WMS对接', labelEn: 'WMS Integration', value: 'enabled', type: 'toggle' },
      { id: 'finance', label: '财务系统对接', labelEn: 'Finance System', value: 'disabled', type: 'toggle' },
    ],
  },
  {
    id: 'notifications',
    title: '通知设置',
    titleEn: 'Notifications',
    icon: <Bell className="h-5 w-5" />,
    iconBg: 'bg-warning-50 text-warning-600',
    fields: [
      { id: 'email', label: '邮件通知', labelEn: 'Email Notifications', value: 'enabled', type: 'toggle' },
      { id: 'push', label: '推送通知', labelEn: 'Push Notifications', value: 'enabled', type: 'toggle' },
      { id: 'feishu_notify', label: '飞书通知', labelEn: 'Feishu Notifications', value: 'enabled', type: 'toggle' },
    ],
  },
]

export default function SystemConfig() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    settingGroups.forEach(g => g.fields.forEach(f => { initial[f.id] = f.value }))
    return initial
  })

  const updateValue = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }))
  }

  const toggleValue = (id: string) => {
    setValues(prev => ({
      ...prev,
      [id]: prev[id] === 'enabled' ? 'disabled' : 'enabled',
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '系统配置' : 'System Configuration'}
        </h1>
        <Button size="sm">
          <Save className="h-4 w-4" />
          {language === 'zh-CN' ? '保存设置' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {settingGroups.map(group => (
          <Card key={group.id}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${group.iconBg}`}>
                {group.icon}
              </div>
              <h3 className="text-base font-semibold text-neutral-900">
                {language === 'zh-CN' ? group.title : group.titleEn}
              </h3>
            </div>

            <div className="space-y-4">
              {group.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {language === 'zh-CN' ? field.label : field.labelEn}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={values[field.id]}
                      onChange={(e) => updateValue(field.id, e.target.value)}
                      className="w-full h-9 px-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}

                  {field.type === 'select' && field.options && (
                    <select
                      value={values[field.id]}
                      onChange={(e) => updateValue(field.id, e.target.value)}
                      className="w-full h-9 px-3 rounded-md border border-neutral-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {language === 'zh-CN' ? opt.label : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'toggle' && (
                    <button
                      onClick={() => toggleValue(field.id)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        values[field.id] === 'enabled' ? 'bg-primary-600' : 'bg-neutral-300',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                          values[field.id] === 'enabled' ? 'translate-x-6' : 'translate-x-1',
                        )}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
