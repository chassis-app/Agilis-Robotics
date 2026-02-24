import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Search, Pencil } from 'lucide-react'

type FieldStatus = 'active' | 'inactive'
type FieldType = 'text' | 'number' | 'date' | 'select'

interface CustomFieldRow {
  id: string
  fieldName: string
  fieldNameEn: string
  entity: string
  entityEn: string
  type: FieldType
  required: boolean
  status: FieldStatus
}

const mockFields: CustomFieldRow[] = [
  { id: '1', fieldName: '海关编码', fieldNameEn: 'HS Code', entity: '物料', entityEn: 'Item', type: 'text', required: true, status: 'active' },
  { id: '2', fieldName: '保质期(天)', fieldNameEn: 'Shelf Life (Days)', entity: '物料', entityEn: 'Item', type: 'number', required: false, status: 'active' },
  { id: '3', fieldName: '进口日期', fieldNameEn: 'Import Date', entity: '采购订单', entityEn: 'Purchase Order', type: 'date', required: false, status: 'active' },
  { id: '4', fieldName: '付款方式', fieldNameEn: 'Payment Method', entity: '供应商', entityEn: 'Supplier', type: 'select', required: true, status: 'active' },
  { id: '5', fieldName: '客户分级', fieldNameEn: 'Customer Tier', entity: '销售订单', entityEn: 'Sales Order', type: 'select', required: false, status: 'inactive' },
]

const typeLabels: Record<FieldType, { zh: string; en: string; color: string }> = {
  text: { zh: '文本', en: 'Text', color: 'bg-primary-100 text-primary-700' },
  number: { zh: '数字', en: 'Number', color: 'bg-success-100 text-success-700' },
  date: { zh: '日期', en: 'Date', color: 'bg-warning-100 text-warning-700' },
  select: { zh: '下拉选择', en: 'Select', color: 'bg-info-100 text-info-700' },
}

const statusStyles: Record<FieldStatus, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  active: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '启用', labelEn: 'Active' },
  inactive: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', label: '停用', labelEn: 'Inactive' },
}

export default function CustomFields() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockFields.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.fieldName.toLowerCase().includes(q) || r.fieldNameEn.toLowerCase().includes(q) || r.entity.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '自定义字段' : 'Custom Fields'}
        </h1>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建字段' : 'New Field'}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索字段名称、实体...' : 'Search field name, entity...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '字段名称' : 'Field Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '关联实体' : 'Entity'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '类型' : 'Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '必填' : 'Required'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const typeConfig = typeLabels[row.type]
                const stConfig = statusStyles[row.status]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">
                      {language === 'zh-CN' ? row.fieldName : row.fieldNameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? row.entity : row.entityEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', typeConfig.color)}>
                        {language === 'zh-CN' ? typeConfig.zh : typeConfig.en}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.required ? (
                        <span className="text-xs font-medium text-danger-600">{language === 'zh-CN' ? '是' : 'Yes'}</span>
                      ) : (
                        <span className="text-xs text-neutral-400">{language === 'zh-CN' ? '否' : 'No'}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', stConfig.bg, stConfig.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', stConfig.dot)} />
                        {language === 'zh-CN' ? stConfig.label : stConfig.labelEn}
                      </span>
                    </td>
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
