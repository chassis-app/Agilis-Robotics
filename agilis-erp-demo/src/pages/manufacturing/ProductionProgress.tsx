import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { KPICard } from '@/components/data/KPICard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BarChartComponent } from '@/components/charts/BarChartComponent'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  Wrench, Play, CheckCircle2, Clock, TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { workOrders } from '@/mock/work-orders'
import type { DocumentStatus } from '@/types'

export default function ProductionProgress() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()

  // Compute KPIs
  const totalWOs = workOrders.length
  const inProgressWOs = workOrders.filter(wo =>
    wo.status === 'approved' && wo.completedQty < wo.quantity
  ).length
  const completedWOs = workOrders.filter(wo =>
    wo.completedQty >= wo.quantity
  ).length
  const completionRate = totalWOs > 0 ? Math.round((completedWOs / totalWOs) * 100) : 0

  // On-time: completed WOs where completedQty >= quantity
  const completedOnTime = workOrders.filter(wo =>
    wo.completedQty >= wo.quantity
  ).length
  const totalDue = workOrders.filter(wo =>
    wo.status === 'approved' || wo.completedQty >= wo.quantity
  ).length
  const onTimeRate = totalDue > 0 ? Math.round((completedOnTime / totalDue) * 100) : 0

  // Active work orders (approved with incomplete qty)
  const activeWOs = useMemo(() =>
    workOrders
      .filter(wo => wo.status === 'approved' && wo.completedQty < wo.quantity)
      .map(wo => ({
        ...wo,
        completionPct: Math.round((wo.completedQty / wo.quantity) * 100),
        opsCompleted: wo.operations.filter(op => op.status === 'completed').length,
        opsTotal: wo.operations.length,
      })),
  [])

  // Status distribution for bar chart
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    workOrders.forEach(wo => {
      const label = wo.completedQty >= wo.quantity ? 'completed' : wo.status
      counts[label] = (counts[label] || 0) + 1
    })

    const statusLabels: Record<string, { zh: string; en: string; color: string }> = {
      draft: { zh: '草稿', en: 'Draft', color: '#94A3B8' },
      submitted: { zh: '已提交', en: 'Submitted', color: '#3B82F6' },
      approved: { zh: '进行中', en: 'In Progress', color: '#F59E0B' },
      completed: { zh: '已完成', en: 'Completed', color: '#22C55E' },
    }

    return Object.entries(counts).map(([key, value]) => ({
      label: language === 'zh-CN'
        ? (statusLabels[key]?.zh || key)
        : (statusLabels[key]?.en || key),
      value,
      color: statusLabels[key]?.color || '#94A3B8',
    }))
  }, [language])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '生产进度看板' : 'Production Progress'}
        </h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/manufacturing/work-orders')}>
          {language === 'zh-CN' ? '查看全部工单' : 'View All WOs'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label={language === 'zh-CN' ? '工单总数' : 'Total WOs'}
          value={String(totalWOs)}
          change="+2 this week"
          changeType="up"
          icon={<Wrench className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '进行中' : 'In Progress'}
          value={String(inProgressWOs)}
          change={`${inProgressWOs} active`}
          changeType="neutral"
          icon={<Play className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '完成率' : 'Completion Rate'}
          value={`${completionRate}%`}
          change="+8%"
          changeType="up"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <KPICard
          label={language === 'zh-CN' ? '按时完成率' : 'On-Time Rate'}
          value={`${onTimeRate}%`}
          change="+3%"
          changeType="up"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Active Work Orders - Progress Cards */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '活跃工单进度' : 'Active Work Order Progress'}
          </h3>
          <span className="text-sm text-neutral-500">
            {activeWOs.length} {language === 'zh-CN' ? '个工单进行中' : 'work orders in progress'}
          </span>
        </div>
        <div className="space-y-3">
          {activeWOs.map(wo => {
            const progressColor = wo.completionPct >= 75
              ? 'success' as const
              : wo.completionPct >= 40
                ? 'primary' as const
                : 'warning' as const

            return (
              <div
                key={wo.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/manufacturing/work-orders/${wo.woNo}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium text-primary-600">{wo.woNo}</span>
                    <StatusBadge status={wo.status} locale={language} />
                    {wo.priority === 'urgent' && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-danger-50 text-danger-600 rounded">
                        {language === 'zh-CN' ? '紧急' : 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-0.5 truncate">{wo.itemName} ({wo.itemNo})</p>
                </div>
                <div className="text-right shrink-0 w-20">
                  <p className="text-sm font-medium text-neutral-900">{wo.completedQty}/{wo.quantity}</p>
                  <p className="text-xs text-neutral-400">{language === 'zh-CN' ? '已完成' : 'completed'}</p>
                </div>
                <div className="text-right shrink-0 w-20">
                  <p className="text-xs text-neutral-500">
                    {wo.opsCompleted}/{wo.opsTotal} {language === 'zh-CN' ? '工序' : 'ops'}
                  </p>
                </div>
                <div className="w-32 shrink-0">
                  <ProgressBar value={wo.completionPct} color={progressColor} size="md" showLabel />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-neutral-400">{language === 'zh-CN' ? '交期' : 'Due'}</p>
                  <p className="text-sm text-neutral-700">{wo.dueDate}</p>
                </div>
              </div>
            )
          })}
          {activeWOs.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-8">
              {language === 'zh-CN' ? '暂无活跃工单' : 'No active work orders'}
            </p>
          )}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card>
          <h3 className="text-base font-semibold text-neutral-900 mb-4">
            {language === 'zh-CN' ? '工单状态分布' : 'WO Status Distribution'}
          </h3>
          <BarChartComponent data={statusDistribution} height={250} />
        </Card>

        {/* Work Orders Table */}
        <Card padding="sm">
          <div className="px-3 pt-3 mb-3">
            <h3 className="text-base font-semibold text-neutral-900">
              {language === 'zh-CN' ? '全部工单' : 'All Work Orders'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '工单号' : 'WO No'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '产品' : 'Item'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '进度' : 'Progress'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '交期' : 'Due'}</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map(wo => {
                  const pct = wo.quantity > 0 ? Math.round((wo.completedQty / wo.quantity) * 100) : 0
                  return (
                    <tr
                      key={wo.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/manufacturing/work-orders/${wo.woNo}`)}
                    >
                      <td className="px-3 py-2">
                        <span className="text-sm font-mono font-medium text-primary-600">{wo.woNo}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm text-neutral-900 truncate max-w-[140px]">{wo.itemName}</div>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={wo.status} locale={language} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-sm font-medium text-neutral-900">{pct}%</span>
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-500">{wo.dueDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
