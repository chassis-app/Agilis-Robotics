import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  TrendingUp, TrendingDown, Minus,
  FileText, ClipboardList, Package, ShieldCheck,
  ArrowRight, Clock, AlertTriangle, Activity,
  Plus
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import type { DocumentStatus } from '@/types'

const kpiData = [
  { id: 'pending_prs', labelKey: 'dashboard.pending_prs', value: '12', change: '+3', changeType: 'up' as const, icon: FileText, color: 'bg-primary-100 text-primary-600' },
  { id: 'monthly_procurement', labelKey: 'dashboard.monthly_procurement', value: '¥2,450,000', change: '+12.5%', changeType: 'up' as const, icon: ClipboardList, color: 'bg-success-100 text-success-600' },
  { id: 'inventory_turnover', labelKey: 'dashboard.inventory_turnover', value: '4.2', change: '-0.3', changeType: 'down' as const, icon: Package, color: 'bg-warning-100 text-warning-600' },
  { id: 'quality_rate', labelKey: 'dashboard.quality_rate', value: '98.7%', change: '+0.5%', changeType: 'up' as const, icon: ShieldCheck, color: 'bg-info-100 text-info-600' },
]

const pendingApprovals = [
  { id: '1', docNo: 'PR-2024-0003', type: 'pr' as const, title: '钛合金轴采购申请', requester: '王芳', date: '2024-12-15', status: 'in_approval' as DocumentStatus },
  { id: '2', docNo: 'PR-2024-0004', type: 'pr' as const, title: '伺服电机模组采购', requester: '李明', date: '2024-12-14', status: 'in_approval' as DocumentStatus },
  { id: '3', docNo: 'PO-2024-0002', type: 'po' as const, title: 'PCB控制板采购订单', requester: '李明', date: '2024-12-13', status: 'in_approval' as DocumentStatus },
  { id: '4', docNo: 'WO-2024-0003', type: 'wo' as const, title: '不锈钢外壳生产工单', requester: '刘洋', date: '2024-12-12', status: 'submitted' as DocumentStatus },
]

const alerts = [
  { id: '1', type: 'warning' as const, message: '轴承套件 (ITM-0011) 库存低于安全库存', time: '2小时前' },
  { id: '2', type: 'danger' as const, message: '检验单 INS-2024-0003 不合格品待处置', time: '4小时前' },
  { id: '3', type: 'info' as const, message: 'PO-2024-0001 部分到货，待质检', time: '1天前' },
]

const recentActivity = [
  { id: '1', action: '李明 提交了采购申请 PR-2024-0008', time: '30分钟前' },
  { id: '2', action: '黄强 批准了采购订单 PO-2024-0004', time: '1小时前' },
  { id: '3', action: '赵静 完成了收货 GRN-2024-0002', time: '2小时前' },
  { id: '4', action: '陈刚 关闭了不合格报告 NC-2024-0002', time: '3小时前' },
  { id: '5', action: '刘洋 更新了工单进度 WO-2024-0001 (75%)', time: '4小时前' },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()

  const changeIcon = (type: 'up' | 'down' | 'neutral') => {
    if (type === 'up') return <TrendingUp className="h-3.5 w-3.5" />
    if (type === 'down') return <TrendingDown className="h-3.5 w-3.5" />
    return <Minus className="h-3.5 w-3.5" />
  }

  const changeColor = (type: 'up' | 'down' | 'neutral') => {
    if (type === 'up') return 'text-success-600'
    if (type === 'down') return 'text-danger-500'
    return 'text-neutral-500'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">{t('dashboard.title')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/procurement/purchase-requisitions/new')}>
            <Plus className="h-4 w-4" />
            {t('pr.new_pr')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.id} className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{t(kpi.labelKey)}</p>
                  <p className="text-2xl font-semibold text-neutral-900 mt-1">{kpi.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${changeColor(kpi.changeType)}`}>
                    {changeIcon(kpi.changeType)}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-900">{t('dashboard.pending_approvals')}</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/approvals')}>
                {language === 'zh-CN' ? '查看全部' : 'View All'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (item.type === 'pr') navigate(`/procurement/purchase-requisitions/${item.docNo}`)
                    else if (item.type === 'po') navigate(`/procurement/purchase-orders/${item.docNo}`)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900 font-mono">{item.docNo}</span>
                        <StatusBadge status={item.status} locale={language} />
                      </div>
                      <p className="text-sm text-neutral-500">{item.title} · {item.requester}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400">{item.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <h2 className="text-base font-semibold text-neutral-900 mb-4">{t('dashboard.alerts')}</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                    alert.type === 'danger' ? 'text-danger-500' : alert.type === 'warning' ? 'text-warning-500' : 'text-info-500'
                  }`} />
                  <div>
                    <p className="text-sm text-neutral-700">{alert.message}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-base font-semibold text-neutral-900 mb-4">{t('dashboard.recent_activity')}</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Activity className="h-4 w-4 mt-0.5 shrink-0 text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-700">{item.action}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
