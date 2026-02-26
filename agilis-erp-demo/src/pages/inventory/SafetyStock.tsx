import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { useSystemConfigStore } from '@/store/useSystemConfigStore'
import { useEngineeringStore } from '@/store/useEngineeringStore'
import { stockSummaries } from '@/mock/inventory'
import { formatItemNoWithRevision } from '@/lib/item-version'
import { cn } from '@/lib/utils'
import {
  calculateSafetyStockLevel,
  resolveSafetyStockRecipientEmails,
  type SafetyStockLevel,
} from '@/lib/safety-stock-alerts'
import { Download, Search, AlertTriangle } from 'lucide-react'

interface SafetyStockRow {
  id: string
  itemNo: string
  itemName: string
  itemNameEn: string
  currentStock: number
  safetyStock: number
  reorderPoint: number
  level: SafetyStockLevel
  lastOrdered: string
}

const levelConfig: Record<SafetyStockLevel, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  ok: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '正常', labelEn: 'Normal' },
  low: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500', label: '偏低', labelEn: 'Low' },
  critical: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500', label: '告急', labelEn: 'Critical' },
}

function getLastOrdered(receivedDates: string[]) {
  if (receivedDates.length === 0) return '--'
  return [...receivedDates].sort((a, b) => b.localeCompare(a))[0]
}

export default function SafetyStock() {
  const { t } = useTranslation()
  const { language, availableUsers } = useAuthStore()
  const { safetyStockAlert } = useSystemConfigStore()
  const versionsByPart = useEngineeringStore((state) => state.versionsByPart)
  const [searchQuery, setSearchQuery] = useState('')

  const getRevision = (itemId: string) => {
    return versionsByPart[itemId]?.find((entry) => entry.status === 'released')?.version ?? '01'
  }

  const rows = useMemo<SafetyStockRow[]>(() => {
    return stockSummaries.map((stock) => ({
      id: stock.itemId,
      itemNo: stock.itemNo,
      itemName: stock.itemName,
      itemNameEn: stock.itemNameEn,
      currentStock: stock.totalQty,
      safetyStock: stock.safetyStock,
      reorderPoint: stock.reorderPoint,
      level: calculateSafetyStockLevel(
        stock.totalQty,
        stock.safetyStock,
        safetyStockAlert.criticalThresholdPctBelowSafety,
      ),
      lastOrdered: getLastOrdered(stock.lots.map((lot) => lot.receivedDate).filter(Boolean)),
    }))
  }, [safetyStockAlert.criticalThresholdPctBelowSafety])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) => (
      formatItemNoWithRevision(row.itemNo, getRevision(row.id)).toLowerCase().includes(q)
      || row.itemNo.toLowerCase().includes(q)
      || row.itemName.toLowerCase().includes(q)
      || row.itemNameEn.toLowerCase().includes(q)
    ))
  }, [rows, searchQuery, versionsByPart])

  const criticalCount = rows.filter(r => r.level === 'critical').length
  const lowCount = rows.filter(r => r.level === 'low').length

  const triggerRows = rows.filter((row) => {
    if (!safetyStockAlert.enabled) return false
    if (row.level === 'critical') return safetyStockAlert.notifyOnCritical
    if (row.level === 'low') return safetyStockAlert.notifyOnLow
    return false
  })

  const recipients = resolveSafetyStockRecipientEmails(safetyStockAlert, availableUsers)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '安全库存预警' : 'Safety Stock Alerts'}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-sm text-danger-600">
                <AlertTriangle className="h-4 w-4" />
                {language === 'zh-CN' ? `${criticalCount} 项告急` : `${criticalCount} critical`}
              </span>
            )}
            {lowCount > 0 && (
              <span className="text-sm text-warning-600">
                {language === 'zh-CN' ? `${lowCount} 项偏低` : `${lowCount} low`}
              </span>
            )}
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          {t('common.export')}
        </Button>
      </div>

      <Card className="!p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">{language === 'zh-CN' ? '通知状态' : 'Notification Status'}</p>
            <p className={cn('font-medium mt-1', safetyStockAlert.enabled ? 'text-success-700' : 'text-neutral-500')}>
              {safetyStockAlert.enabled
                ? (language === 'zh-CN' ? '已启用' : 'Enabled')
                : (language === 'zh-CN' ? '已停用' : 'Disabled')}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">{language === 'zh-CN' ? '匹配告警条目' : 'Matched Alert Rows'}</p>
            <p className="font-medium text-neutral-900 mt-1">{triggerRows.length}</p>
          </div>
          <div>
            <p className="text-neutral-500">{language === 'zh-CN' ? '邮件接收人' : 'Email Recipients'}</p>
            <p className="font-medium text-neutral-900 mt-1">{recipients.length}</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-3">
          {language === 'zh-CN'
            ? `发送模式: ${safetyStockAlert.sendMode} · 冷却: ${safetyStockAlert.cooldownHours}小时`
            : `Send mode: ${safetyStockAlert.sendMode} · Cooldown: ${safetyStockAlert.cooldownHours}h`}
        </p>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索物料编号、名称...' : 'Search item no., name...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料编号' : 'Item No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料名称' : 'Item Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '当前库存' : 'Current Stock'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '安全库存' : 'Safety Stock'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '再订货点' : 'Reorder Point'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '上次订购' : 'Last Ordered'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const config = levelConfig[row.level]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">
                        {formatItemNoWithRevision(row.itemNo, getRevision(row.id))}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? row.itemName : row.itemNameEn}
                    </td>
                    <td className={cn('px-3 py-2 text-sm font-medium text-right', row.level === 'critical' ? 'text-danger-600' : row.level === 'low' ? 'text-warning-600' : 'text-neutral-900')}>
                      {row.currentStock}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500 text-right">{row.safetyStock}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500 text-right">{row.reorderPoint}</td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                        {language === 'zh-CN' ? config.label : config.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{row.lastOrdered}</td>
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
