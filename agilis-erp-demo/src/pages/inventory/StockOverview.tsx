import { useState, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/data/KPICard'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  Search, Package, AlertTriangle, DollarSign,
  ChevronDown, ChevronRight, Download, SlidersHorizontal,
} from 'lucide-react'
import { stockSummaries } from '@/mock/inventory'
import type { StockSummary } from '@/types'

export default function StockOverview() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!searchQuery) return stockSummaries
    const q = searchQuery.toLowerCase()
    return stockSummaries.filter(
      (s) =>
        s.itemNo.toLowerCase().includes(q) ||
        s.itemName.toLowerCase().includes(q) ||
        s.itemNameEn.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const totalItems = stockSummaries.length
  const lowStockItems = stockSummaries.filter((s) => s.totalQty < s.safetyStock).length
  const totalValue = stockSummaries.reduce((sum, s) => sum + s.totalQty, 0)

  const toggleRow = (itemId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const isLowStock = (s: StockSummary) => s.totalQty < s.safetyStock

  const lotStatusLabel = (status: string) => {
    const map: Record<string, { zh: string; en: string; color: string }> = {
      available: { zh: '可用', en: 'Available', color: 'bg-success-100 text-success-700' },
      reserved: { zh: '已预留', en: 'Reserved', color: 'bg-warning-100 text-warning-700' },
      quarantine: { zh: '隔离', en: 'Quarantine', color: 'bg-danger-100 text-danger-700' },
      consumed: { zh: '已消耗', en: 'Consumed', color: 'bg-neutral-100 text-neutral-600' },
    }
    const cfg = map[status] || map.available
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cfg.color)}>
        {language === 'zh-CN' ? cfg.zh : cfg.en}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '库存总览' : 'Stock Overview'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label={language === 'zh-CN' ? '物料总数' : 'Total Items'}
          value={String(totalItems)}
          change="+2 this month"
          changeType="up"
          icon={<Package className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '低库存物料' : 'Low Stock Items'}
          value={String(lowStockItems)}
          change={lowStockItems > 0 ? `${lowStockItems} below safety` : 'All OK'}
          changeType={lowStockItems > 0 ? 'down' : 'neutral'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '库存总量' : 'Total Inventory Qty'}
          value={totalValue.toLocaleString()}
          change="+5.2%"
          changeType="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索物料编号、名称...' : 'Search item no., name...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'zh-CN' ? '筛选' : 'Filter'}
        </Button>
      </div>

      {/* Stock Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 w-10"></th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '物料编号' : 'Item No'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '物料名称' : 'Item Name'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '总数量' : 'Total Qty'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '可用' : 'Available'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '已预留' : 'Reserved'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '单位' : 'UOM'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '安全库存' : 'Safety Stock'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '状态' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock) => {
                const expanded = expandedRows.has(stock.itemId)
                const low = isLowStock(stock)
                return (
                  <Fragment key={stock.itemId}>
                    <tr
                      className={cn(
                        'border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors',
                        low && 'bg-warning-50/50',
                      )}
                      onClick={() => toggleRow(stock.itemId)}
                    >
                      <td className="px-3 py-2">
                        {stock.lots.length > 0 && (
                          expanded
                            ? <ChevronDown className="h-4 w-4 text-neutral-400" />
                            : <ChevronRight className="h-4 w-4 text-neutral-400" />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-primary-600 font-mono">{stock.itemNo}</span>
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-900">
                        {language === 'zh-CN' ? stock.itemName : stock.itemNameEn}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{stock.totalQty}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700 text-right">{stock.availableQty}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700 text-right">{stock.reservedQty}</td>
                      <td className="px-3 py-2 text-sm text-neutral-500">{stock.uom}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700 text-right">{stock.safetyStock}</td>
                      <td className="px-3 py-2">
                        {low ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                            <AlertTriangle className="h-3 w-3" />
                            {language === 'zh-CN' ? '低库存' : 'Low Stock'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                            {language === 'zh-CN' ? '正常' : 'Normal'}
                          </span>
                        )}
                      </td>
                    </tr>
                    {/* Expanded lot details */}
                    {expanded && stock.lots.map((lot) => (
                      <tr key={lot.id} className="border-b border-neutral-100 bg-neutral-50/70">
                        <td className="px-3 py-1.5"></td>
                        <td className="px-3 py-1.5" colSpan={2}>
                          <div className="pl-6 flex items-center gap-2">
                            <span className="text-xs font-mono text-neutral-500">{lot.lotNo}</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 text-xs text-neutral-700 text-right">{lot.quantity}</td>
                        <td className="px-3 py-1.5 text-xs text-neutral-500">{lot.warehouseName}</td>
                        <td className="px-3 py-1.5 text-xs text-neutral-500">{lot.location}</td>
                        <td className="px-3 py-1.5">{lotStatusLabel(lot.status)}</td>
                        <td className="px-3 py-1.5 text-xs text-neutral-500 text-right">
                          {lot.expiryDate || '-'}
                        </td>
                        <td className="px-3 py-1.5 text-xs text-neutral-400">{lot.receivedDate}</td>
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
        </div>
      </Card>
    </div>
  )
}
