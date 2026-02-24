import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { KPICard } from '@/components/data/KPICard'
import { useAuthStore } from '@/store/useAuthStore'
import { DollarSign, Package, Users, Settings } from 'lucide-react'

interface CostItem {
  id: string
  itemNo: string
  itemName: string
  itemNameEn: string
  materialPct: number
  laborPct: number
  overheadPct: number
  totalUnitCost: number
}

const costSummary = {
  totalCost: 4850000,
  materialCost: 2910000,
  laborCost: 1212500,
  overheadCost: 727500,
}

const mockCostItems: CostItem[] = [
  { id: '1', itemNo: 'ITM-0001', itemName: '手术臂关节模组', itemNameEn: 'Surgical Arm Joint Module', materialPct: 58, laborPct: 28, overheadPct: 14, totalUnitCost: 12500 },
  { id: '2', itemNo: 'ITM-0002', itemName: '末端执行器组件', itemNameEn: 'End Effector Assembly', materialPct: 62, laborPct: 24, overheadPct: 14, totalUnitCost: 8900 },
  { id: '3', itemNo: 'ITM-0003', itemName: '控制电路板', itemNameEn: 'Control Circuit Board', materialPct: 65, laborPct: 22, overheadPct: 13, totalUnitCost: 3200 },
  { id: '4', itemNo: 'ITM-0004', itemName: '传感器模组', itemNameEn: 'Sensor Module', materialPct: 55, laborPct: 30, overheadPct: 15, totalUnitCost: 4800 },
  { id: '5', itemNo: 'ITM-0005', itemName: '主体框架', itemNameEn: 'Main Frame Structure', materialPct: 70, laborPct: 18, overheadPct: 12, totalUnitCost: 18500 },
  { id: '6', itemNo: 'ITM-0006', itemName: '电源模块', itemNameEn: 'Power Supply Module', materialPct: 60, laborPct: 25, overheadPct: 15, totalUnitCost: 3600 },
]

export default function Costing() {
  const { t } = useTranslation()
  const { language } = useAuthStore()

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '成本核算' : 'Costing'}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {language === 'zh-CN' ? '产品成本结构分析与单位成本明细' : 'Product cost structure analysis and unit cost breakdown'}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label={language === 'zh-CN' ? '总成本' : 'Total Cost'}
          value={formatAmount(costSummary.totalCost)}
          change="+8.2% MoM"
          changeType="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '材料成本' : 'Material Cost'}
          value={formatAmount(costSummary.materialCost)}
          change="60%"
          changeType="neutral"
          icon={<Package className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '人工成本' : 'Labor Cost'}
          value={formatAmount(costSummary.laborCost)}
          change="25%"
          changeType="neutral"
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '制造费用' : 'Overhead'}
          value={formatAmount(costSummary.overheadCost)}
          change="15%"
          changeType="neutral"
          icon={<Settings className="h-5 w-5" />}
        />
      </div>

      {/* Cost Breakdown Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="px-3 py-3 border-b border-neutral-200">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '产品单位成本明细' : 'Item Unit Cost Breakdown'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_name')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '材料 %' : 'Material %'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '人工 %' : 'Labor %'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '制造费用 %' : 'Overhead %'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '成本结构' : 'Cost Structure'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '单位成本' : 'Total Unit Cost'}
                </th>
              </tr>
            </thead>
            <tbody>
              {mockCostItems.map(item => (
                <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-mono text-primary-600">{item.itemNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-900">
                    {language === 'zh-CN' ? item.itemName : item.itemNameEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{item.materialPct}%</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{item.laborPct}%</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{item.overheadPct}%</td>
                  <td className="px-3 py-3">
                    <div className="flex h-2 rounded-full overflow-hidden bg-neutral-200 w-36">
                      <div className="bg-primary-500" style={{ width: `${item.materialPct}%` }} />
                      <div className="bg-success-500" style={{ width: `${item.laborPct}%` }} />
                      <div className="bg-warning-500" style={{ width: `${item.overheadPct}%` }} />
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                        {language === 'zh-CN' ? '材料' : 'Material'}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                        {language === 'zh-CN' ? '人工' : 'Labor'}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
                        {language === 'zh-CN' ? '制造费用' : 'OH'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatAmount(item.totalUnitCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: mockCostItems.length })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
