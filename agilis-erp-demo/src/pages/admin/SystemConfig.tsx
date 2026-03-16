import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuthStore } from '@/store/useAuthStore'
import { useSystemConfigStore } from '@/store/useSystemConfigStore'
import {
  normalizeEmailList,
  resolveSafetyStockRecipientEmails,
} from '@/lib/safety-stock-alerts'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { SafetyStockAlertConfig, User } from '@/types'
import { Save, Building2, Bell, Link2, AlertTriangle, FlaskConical } from 'lucide-react'

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

function ToggleSwitch({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-primary-600' : 'bg-neutral-300',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

function resolveRecipientPreview(config: SafetyStockAlertConfig, users: User[]) {
  const validExtraEmails = normalizeEmailList(config.recipients.extraEmails)
  const mergedConfig: SafetyStockAlertConfig = {
    ...config,
    recipients: {
      ...config.recipients,
      extraEmails: validExtraEmails,
    },
  }
  return resolveSafetyStockRecipientEmails(mergedConfig, users)
}

export default function SystemConfig() {
  const { language, availableUsers } = useAuthStore()
  const { safetyStockAlert, setSafetyStockAlert } = useSystemConfigStore()

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    settingGroups.forEach(g => g.fields.forEach(f => { initial[f.id] = f.value }))
    return initial
  })

  const [draft, setDraft] = useState<SafetyStockAlertConfig>(safetyStockAlert)

  const roleOptions = useMemo(() => Array.from(new Set(availableUsers.map(u => u.role))), [availableUsers])
  const departmentOptions = useMemo(() => Array.from(new Set(availableUsers.map(u => u.department))), [availableUsers])

  const recipientEmails = useMemo(
    () => resolveRecipientPreview(draft, availableUsers),
    [draft, availableUsers],
  )

  const updateValue = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }))
  }

  const toggleValue = (id: string) => {
    setValues(prev => ({
      ...prev,
      [id]: prev[id] === 'enabled' ? 'disabled' : 'enabled',
    }))
  }

  const updateDraft = <K extends keyof SafetyStockAlertConfig>(key: K, val: SafetyStockAlertConfig[K]) => {
    setDraft(prev => ({ ...prev, [key]: val }))
  }

  const toggleArrayValue = (
    group: 'roles' | 'departments' | 'userIds',
    value: string,
  ) => {
    setDraft(prev => {
      const current = prev.recipients[group]
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]

      return {
        ...prev,
        recipients: {
          ...prev.recipients,
          [group]: next,
        },
      }
    })
  }

  const saveSettings = () => {
    if (draft.enabled && !draft.notifyOnLow && !draft.notifyOnCritical) {
      toast('warning', language === 'zh-CN' ? '请至少开启一个预警级别' : 'Please enable at least one alert level')
      return
    }

    if (draft.enabled && recipientEmails.length === 0) {
      toast('warning', language === 'zh-CN' ? '请至少配置一位邮件接收人' : 'Please configure at least one email recipient')
      return
    }

    const normalizedExtraEmails = normalizeEmailList(draft.recipients.extraEmails)
    setSafetyStockAlert({
      ...draft,
      recipients: {
        ...draft.recipients,
        extraEmails: normalizedExtraEmails,
      },
    })

    toast('success', language === 'zh-CN' ? '系统配置已保存' : 'System configuration saved')
  }

  const sendTestEmail = () => {
    if (recipientEmails.length === 0) {
      toast('warning', language === 'zh-CN' ? '没有可发送的有效邮箱地址' : 'No valid recipient email found')
      return
    }

    const previewRecipients = recipientEmails.slice(0, 3).join(', ')
    const hiddenCount = Math.max(0, recipientEmails.length - 3)

    toast(
      'info',
      language === 'zh-CN'
        ? `测试邮件已发送 (${recipientEmails.length}人): ${previewRecipients}${hiddenCount > 0 ? ` 等${hiddenCount}人` : ''}`
        : `Test email sent (${recipientEmails.length} recipients): ${previewRecipients}${hiddenCount > 0 ? ` +${hiddenCount} more` : ''}`,
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '系统配置' : 'System Configuration'}
        </h1>
        <Button size="sm" onClick={saveSettings}>
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
                    <ToggleSwitch
                      checked={values[field.id] === 'enabled'}
                      onToggle={() => toggleValue(field.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="lg:col-span-2 xl:col-span-3">
          <div className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  {language === 'zh-CN' ? '双序列文档规则' : 'Dual Sequence Rules'}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {language === 'zh-CN'
                    ? '整个生产流程支持正式 / 非正式两套序列，从订单、采购、Build Order、領料/發料到质量文件统一生效'
                    : 'Formal and informal numbering now spans the whole production flow across orders, procurement, build orders, withdrawal docs, and quality documents.'}
                </p>
              </div>
              <Button variant="secondary" size="sm">
                <Save className="h-4 w-4" />
                {language === 'zh-CN' ? '保存序列规则' : 'Save Sequence Rules'}
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { title: language === 'zh-CN' ? '正式序列前缀' : 'Formal Prefix', value: 'F' },
                { title: language === 'zh-CN' ? '非正式序列前缀' : 'Informal Prefix', value: 'I' },
                { title: language === 'zh-CN' ? '订单链生效范围' : 'Order Chain Scope', value: language === 'zh-CN' ? '全部生产流程' : 'Whole Production Flow' },
                { title: language === 'zh-CN' ? '内部订单默认序列' : 'Internal Order Default', value: 'INFORMAL' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs text-neutral-500">{item.title}</p>
                  <p className="mt-2 text-lg font-semibold text-neutral-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <h3 className="text-base font-semibold text-neutral-900">
                  {language === 'zh-CN' ? '安全库存预警邮件' : 'Safety Stock Alert Emails'}
                </h3>
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                {language === 'zh-CN'
                  ? '按级别、规则、角色和人员灵活配置邮件通知'
                  : 'Configure alert levels, routing rules, and recipient targeting for emails'}
              </p>
            </div>
            <ToggleSwitch
              checked={draft.enabled}
              onToggle={() => updateDraft('enabled', !draft.enabled)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">
                {language === 'zh-CN' ? '触发级别' : 'Trigger Levels'}
              </p>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={draft.notifyOnLow}
                  onChange={(e) => updateDraft('notifyOnLow', e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                {language === 'zh-CN' ? '偏低 (Low)' : 'Low'}
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={draft.notifyOnCritical}
                  onChange={(e) => updateDraft('notifyOnCritical', e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                {language === 'zh-CN' ? '告急 (Critical)' : 'Critical'}
              </label>
            </div>

            <div>
              <Input
                type="number"
                min={0}
                max={95}
                value={draft.criticalThresholdPctBelowSafety}
                onChange={(e) => updateDraft('criticalThresholdPctBelowSafety', Number(e.target.value || 0))}
                label={language === 'zh-CN' ? '告急阈值 (% 低于安全库存)' : 'Critical Threshold (% below safety stock)'}
              />
            </div>

            <div>
              <Input
                type="number"
                min={1}
                max={72}
                value={draft.cooldownHours}
                onChange={(e) => updateDraft('cooldownHours', Number(e.target.value || 1))}
                label={language === 'zh-CN' ? '重复发送冷却 (小时)' : 'Resend Cooldown (hours)'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {language === 'zh-CN' ? '发送模式' : 'Send Mode'}
              </label>
              <select
                value={draft.sendMode}
                onChange={(e) => updateDraft('sendMode', e.target.value as SafetyStockAlertConfig['sendMode'])}
                className="w-full h-9 px-3 rounded-md border border-neutral-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="immediate">{language === 'zh-CN' ? '实时发送' : 'Immediate'}</option>
                <option value="digest_hourly">{language === 'zh-CN' ? '每小时汇总' : 'Hourly Digest'}</option>
                <option value="digest_daily">{language === 'zh-CN' ? '每日汇总' : 'Daily Digest'}</option>
              </select>
            </div>

            <div>
              <Input
                type="time"
                value={draft.digestTime}
                onChange={(e) => updateDraft('digestTime', e.target.value)}
                label={language === 'zh-CN' ? '每日汇总时间' : 'Daily Digest Time'}
                disabled={draft.sendMode !== 'digest_daily'}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={sendTestEmail}
                className="w-full"
              >
                <FlaskConical className="h-4 w-4" />
                {language === 'zh-CN' ? '发送测试邮件' : 'Send Test Email'}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3">
              {language === 'zh-CN' ? '接收人配置' : 'Recipient Configuration'}
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2 border border-neutral-200 rounded-lg p-3">
                <p className="text-sm font-medium text-neutral-700">{language === 'zh-CN' ? '按角色' : 'By Role'}</p>
                {roleOptions.map(role => (
                  <label key={role} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={draft.recipients.roles.includes(role)}
                      onChange={() => toggleArrayValue('roles', role)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    {role}
                  </label>
                ))}
              </div>

              <div className="space-y-2 border border-neutral-200 rounded-lg p-3">
                <p className="text-sm font-medium text-neutral-700">{language === 'zh-CN' ? '按部门' : 'By Department'}</p>
                {departmentOptions.map(dept => (
                  <label key={dept} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={draft.recipients.departments.includes(dept)}
                      onChange={() => toggleArrayValue('departments', dept)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    {dept}
                  </label>
                ))}
              </div>

              <div className="space-y-2 border border-neutral-200 rounded-lg p-3 max-h-56 overflow-y-auto">
                <p className="text-sm font-medium text-neutral-700">{language === 'zh-CN' ? '指定人员' : 'Specific Users'}</p>
                {availableUsers.map(user => (
                  <label key={user.id} className="flex items-start gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={draft.recipients.userIds.includes(user.id)}
                      onChange={() => toggleArrayValue('userIds', user.id)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                    />
                    <span>
                      <span className="font-medium">{user.name}</span>
                      <span className="text-neutral-400"> · {user.email}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="border border-neutral-200 rounded-lg p-3">
                <Textarea
                  label={language === 'zh-CN' ? '额外邮箱' : 'Extra Emails'}
                  value={draft.recipients.extraEmails.join('\n')}
                  onChange={(e) => setDraft(prev => ({
                    ...prev,
                    recipients: {
                      ...prev.recipients,
                      extraEmails: [e.target.value],
                    },
                  }))}
                  placeholder={language === 'zh-CN' ? '多个邮箱可使用逗号或换行分隔' : 'Use comma or newline to separate multiple emails'}
                  className="min-h-[160px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <Input
              label={language === 'zh-CN' ? '邮件主题模板' : 'Email Subject Template'}
              value={draft.template.subject}
              onChange={(e) => setDraft(prev => ({
                ...prev,
                template: {
                  ...prev.template,
                  subject: e.target.value,
                },
              }))}
            />
            <Textarea
              label={language === 'zh-CN' ? '邮件正文模板' : 'Email Body Template'}
              value={draft.template.body}
              onChange={(e) => setDraft(prev => ({
                ...prev,
                template: {
                  ...prev.template,
                  body: e.target.value,
                },
              }))}
              className="min-h-[112px]"
            />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <Bell className="h-4 w-4" />
              {language === 'zh-CN' ? '当前生效接收人' : 'Effective Recipients'}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {recipientEmails.length > 0
                ? recipientEmails.join(', ')
                : (language === 'zh-CN' ? '暂无有效邮箱' : 'No valid recipient email')}
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              {language === 'zh-CN'
                ? '模板变量: {{level}}, {{count}}, {{triggeredAt}}, {{items}}'
                : 'Template vars: {{level}}, {{count}}, {{triggeredAt}}, {{items}}'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
