import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, ArrowUpDown } from 'lucide-react'

type IntegrationStatus = 'connected' | 'error' | 'degraded'
type SyncDirection = 'inbound' | 'outbound' | 'bidirectional'
type SyncStatus = 'success' | 'error' | 'warning'

interface IntegrationCard {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  status: IntegrationStatus
  lastSync: string
  uptime: string
}

interface SyncLogEntry {
  id: string
  timestamp: string
  system: string
  systemEn: string
  direction: SyncDirection
  status: SyncStatus
  records: number
  duration: string
  message: string
  messageEn: string
}

const integrations: IntegrationCard[] = [
  { id: '1', name: '飞书集成', nameEn: 'Feishu Integration', description: '审批通知、即时消息推送', descriptionEn: 'Approval notifications, instant messaging', status: 'connected', lastSync: '2024-12-14 16:30', uptime: '99.9%' },
  { id: '2', name: 'ERP同步', nameEn: 'ERP Sync', description: '主数据、订单双向同步', descriptionEn: 'Master data, order bidirectional sync', status: 'connected', lastSync: '2024-12-14 16:25', uptime: '99.7%' },
  { id: '3', name: 'WMS仓储系统', nameEn: 'WMS System', description: '库存数据、出入库记录同步', descriptionEn: 'Inventory data, warehouse movement sync', status: 'degraded', lastSync: '2024-12-14 15:45', uptime: '97.2%' },
  { id: '4', name: '财务系统', nameEn: 'Finance System', description: '应付账款、成本核算数据同步', descriptionEn: 'AP reconciliation, costing data sync', status: 'error', lastSync: '2024-12-14 12:00', uptime: '94.1%' },
]

const syncLogs: SyncLogEntry[] = [
  { id: '1', timestamp: '2024-12-14 16:30:12', system: '飞书', systemEn: 'Feishu', direction: 'outbound', status: 'success', records: 3, duration: '0.8s', message: '发送3条审批通知', messageEn: 'Sent 3 approval notifications' },
  { id: '2', timestamp: '2024-12-14 16:25:08', system: 'ERP', systemEn: 'ERP', direction: 'bidirectional', status: 'success', records: 47, duration: '3.2s', message: '同步47条主数据记录', messageEn: 'Synced 47 master data records' },
  { id: '3', timestamp: '2024-12-14 15:45:33', system: 'WMS', systemEn: 'WMS', direction: 'inbound', status: 'warning', records: 12, duration: '8.5s', message: '同步完成但响应延迟，12条记录', messageEn: 'Sync completed with delay, 12 records' },
  { id: '4', timestamp: '2024-12-14 12:00:00', system: '财务系统', systemEn: 'Finance', direction: 'outbound', status: 'error', records: 0, duration: '30.0s', message: '连接超时，请检查网络配置', messageEn: 'Connection timeout, check network config' },
  { id: '5', timestamp: '2024-12-14 11:30:15', system: 'ERP', systemEn: 'ERP', direction: 'outbound', status: 'success', records: 8, duration: '1.5s', message: '推送8条采购订单', messageEn: 'Pushed 8 purchase orders' },
  { id: '6', timestamp: '2024-12-14 10:00:22', system: '飞书', systemEn: 'Feishu', direction: 'outbound', status: 'success', records: 5, duration: '0.6s', message: '发送5条审批完成通知', messageEn: 'Sent 5 approval completion notifications' },
]

const statusConfig: Record<IntegrationStatus, { bg: string; text: string; dot: string; label: string; labelEn: string; Icon: typeof CheckCircle2 }> = {
  connected: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500', label: '已连接', labelEn: 'Connected', Icon: CheckCircle2 },
  error: { bg: 'bg-danger-50', text: 'text-danger-700', dot: 'bg-danger-500', label: '异常', labelEn: 'Error', Icon: XCircle },
  degraded: { bg: 'bg-warning-50', text: 'text-warning-700', dot: 'bg-warning-500', label: '降级', labelEn: 'Degraded', Icon: AlertTriangle },
}

const syncStatusConfig: Record<SyncStatus, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
  error: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500' },
  warning: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500' },
}

const directionLabels: Record<SyncDirection, { label: string; labelEn: string }> = {
  inbound: { label: '入站', labelEn: 'Inbound' },
  outbound: { label: '出站', labelEn: 'Outbound' },
  bidirectional: { label: '双向', labelEn: 'Bidirectional' },
}

export default function IntegrationMonitor() {
  const { t } = useTranslation()
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '集成监控' : 'Integration Monitor'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? '外部系统集成状态与同步日志' : 'External system integration status and sync logs'}
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors">
          <RefreshCw className="h-4 w-4" />
          {language === 'zh-CN' ? '刷新状态' : 'Refresh'}
        </button>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map(integration => {
          const cfg = statusConfig[integration.status]
          const StatusIcon = cfg.Icon
          return (
            <Card key={integration.id} className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-lg',
                  cfg.bg,
                )}>
                  <StatusIcon className={cn('h-5 w-5', cfg.text)} />
                </div>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                  cfg.bg, cfg.text,
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                  {language === 'zh-CN' ? cfg.label : cfg.labelEn}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                {language === 'zh-CN' ? integration.name : integration.nameEn}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'zh-CN' ? integration.description : integration.descriptionEn}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    {language === 'zh-CN' ? '最后同步' : 'Last Sync'}
                  </p>
                  <p className="text-xs text-neutral-600">{integration.lastSync}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    {language === 'zh-CN' ? '可用率' : 'Uptime'}
                  </p>
                  <p className={cn('text-xs font-medium', cfg.text)}>{integration.uptime}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Sync Log Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="px-3 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '最近同步日志' : 'Recent Sync Logs'}
          </h3>
          <span className="text-sm text-neutral-500">
            {language === 'zh-CN' ? '最近24小时' : 'Last 24 hours'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '时间' : 'Timestamp'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '系统' : 'System'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '方向' : 'Direction'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '记录数' : 'Records'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '耗时' : 'Duration'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '详情' : 'Message'}
                </th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.map(log => {
                const sCfg = syncStatusConfig[log.status]
                const dLbl = directionLabels[log.direction]
                return (
                  <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-mono text-neutral-600">{log.timestamp}</span>
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">
                      {language === 'zh-CN' ? log.system : log.systemEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                        <ArrowUpDown className="h-3 w-3" />
                        {language === 'zh-CN' ? dLbl.label : dLbl.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                        sCfg.bg, sCfg.text,
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sCfg.dot)} />
                        {log.status === 'success'
                          ? (language === 'zh-CN' ? '成功' : 'Success')
                          : log.status === 'error'
                            ? (language === 'zh-CN' ? '失败' : 'Error')
                            : (language === 'zh-CN' ? '警告' : 'Warning')
                        }
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right font-mono">{log.records}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right font-mono">{log.duration}</td>
                    <td className="px-3 py-2 text-sm text-neutral-600 max-w-xs truncate">
                      {language === 'zh-CN' ? log.message : log.messageEn}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: syncLogs.length })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
