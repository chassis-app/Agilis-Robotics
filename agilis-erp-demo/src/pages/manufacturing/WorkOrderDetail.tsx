import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Pencil, ChevronRight, ChevronDown,
  Wrench, CheckCircle2, Clock, Pause,
} from 'lucide-react'
import type { DocumentStatus, WOOperation } from '@/types'
import { useState } from 'react'

// Inline mock work order detail
const woData = {
  woNo: 'WO-2024-0001',
  status: 'approved' as DocumentStatus,
  itemId: 'itm15',
  itemNo: 'ITM-0015',
  itemName: '手术机器人整机',
  itemNameEn: 'Final Assembly Unit',
  bomId: 'bom-itm15',
  bomName: 'BOM-ITM-0015 Rev.A',
  quantity: 3,
  completedQty: 1,
  priority: 'urgent' as const,
  startDate: '2024-10-01',
  dueDate: '2024-12-15',
  createdAt: '2024-09-28',
  operations: [
    { id: 'wop-01-1', operationNo: 10, name: '机械臂组装', nameEn: 'Arm Assembly', status: 'completed' as const, workCenter: 'WC-ASM-01', plannedHours: 40, actualHours: 38, sequence: 1 },
    { id: 'wop-01-2', operationNo: 20, name: '电气布线', nameEn: 'Electrical Wiring', status: 'completed' as const, workCenter: 'WC-ELE-01', plannedHours: 24, actualHours: 26, sequence: 2 },
    { id: 'wop-01-3', operationNo: 30, name: '软件烧录与调试', nameEn: 'Firmware Flash & Debug', status: 'in_progress' as const, workCenter: 'WC-SW-01', plannedHours: 16, actualHours: 10, sequence: 3 },
    { id: 'wop-01-4', operationNo: 40, name: '整机校准', nameEn: 'Full Calibration', status: 'pending' as const, workCenter: 'WC-CAL-01', plannedHours: 20, actualHours: 0, sequence: 4 },
  ],
}

// Simplified BOM tree for display
const simpleBomTree = {
  id: 'bom-root',
  name: '手术机器人整机',
  nameEn: 'Final Assembly Unit',
  itemNo: 'ITM-0015',
  qty: 1,
  children: [
    {
      id: 'bom-c1',
      name: '手术机器人臂组件',
      nameEn: 'Surgical Robot Arm Assembly',
      itemNo: 'ITM-0001',
      qty: 1,
      children: [
        { id: 'bom-c1-1', name: '钛合金传动轴', nameEn: 'Titanium Alloy Shaft', itemNo: 'ITM-0002', qty: 6, children: [] },
        { id: 'bom-c1-2', name: '伺服电机模块', nameEn: 'Servo Motor Module', itemNo: 'ITM-0003', qty: 6, children: [] },
      ],
    },
    {
      id: 'bom-c2',
      name: 'PCB控制板',
      nameEn: 'PCB Control Board',
      itemNo: 'ITM-0004',
      qty: 1,
      children: [
        { id: 'bom-c2-1', name: '固件芯片', nameEn: 'Firmware Chip', itemNo: 'ITM-0012', qty: 2, children: [] },
      ],
    },
    { id: 'bom-c3', name: '电源模块', nameEn: 'Power Supply Unit', itemNo: 'ITM-0013', qty: 1, children: [] },
    { id: 'bom-c4', name: '线束组件', nameEn: 'Cable Harness Assembly', itemNo: 'ITM-0007', qty: 1, children: [] },
  ],
}

interface SimpleBOMNode {
  id: string
  name: string
  nameEn: string
  itemNo: string
  qty: number
  children: SimpleBOMNode[]
}

function BOMTreeNode({ node, level, language, expandedIds, onToggle }: {
  node: SimpleBOMNode
  level: number
  language: 'zh-CN' | 'en'
  expandedIds: Set<string>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedIds.has(node.id)

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer"
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <span className={cn('h-4 w-4 flex items-center justify-center', !hasChildren && 'invisible')}>
          {hasChildren && (isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-neutral-400" /> : <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />)}
        </span>
        <span className="font-mono text-xs text-neutral-500">{node.itemNo}</span>
        <span className="text-sm text-neutral-800">{language === 'zh-CN' ? node.name : node.nameEn}</span>
        <span className="ml-auto text-xs text-neutral-400">x{node.qty}</span>
      </div>
      {hasChildren && isExpanded && node.children.map(child => (
        <BOMTreeNode key={child.id} node={child} level={level + 1} language={language} expandedIds={expandedIds} onToggle={onToggle} />
      ))}
    </div>
  )
}

export default function WorkOrderDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const [bomExpanded, setBomExpanded] = useState<Set<string>>(new Set(['bom-root', 'bom-c1', 'bom-c2']))

  const toggleBomNode = (id: string) => {
    setBomExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completionPct = Math.round((woData.completedQty / woData.quantity) * 100)

  const opStatusIcon = (status: WOOperation['status']) => {
    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-success-500" />
    if (status === 'in_progress') return <Clock className="h-4 w-4 text-warning-500" />
    return <Pause className="h-4 w-4 text-neutral-400" />
  }

  const opStatusBadge = (status: WOOperation['status']) => {
    const cfg = {
      completed: { bg: 'bg-success-100', text: 'text-success-700', label: language === 'zh-CN' ? '已完成' : 'Completed' },
      in_progress: { bg: 'bg-warning-100', text: 'text-warning-700', label: language === 'zh-CN' ? '进行中' : 'In Progress' },
      pending: { bg: 'bg-neutral-100', text: 'text-neutral-600', label: language === 'zh-CN' ? '待开始' : 'Pending' },
    }
    const c = cfg[status]
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', c.bg, c.text)}>
        {opStatusIcon(status)}
        {c.label}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{woData.woNo}</h1>
            <StatusBadge status={woData.status} locale={language} />
            {woData.priority === 'urgent' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-danger-50 text-danger-600 rounded">
                {language === 'zh-CN' ? '紧急' : 'Urgent'}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? woData.itemName : woData.itemNameEn} ({woData.itemNo})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '完成进度' : 'Completion'}</p>
            <p className="text-lg font-semibold text-neutral-900">{woData.completedQty} / {woData.quantity}</p>
          </div>
          <div className="w-24">
            <ProgressBar
              value={completionPct}
              size="md"
              color={completionPct === 100 ? 'success' : 'primary'}
              showLabel
            />
          </div>
          <Button variant="secondary" size="sm">
            <Pencil className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '产品' : 'Item'}</label>
            <p className="text-sm text-neutral-900 mt-0.5">{language === 'zh-CN' ? woData.itemName : woData.itemNameEn}</p>
            <p className="text-xs text-neutral-400 font-mono">{woData.itemNo}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? 'BOM' : 'BOM'}</label>
            <p className="text-sm text-neutral-900 mt-0.5">{woData.bomName}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '计划数量' : 'Planned Qty'}</label>
            <p className="text-sm text-neutral-900 mt-0.5 font-medium">{woData.quantity}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '完成数量' : 'Completed Qty'}</label>
            <p className="text-sm text-neutral-900 mt-0.5 font-medium">{woData.completedQty}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '开始日期' : 'Start Date'}</label>
            <p className="text-sm text-neutral-900 mt-0.5">{woData.startDate}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '交期' : 'Due Date'}</label>
            <p className="text-sm text-neutral-900 mt-0.5">{woData.dueDate}</p>
          </div>
        </div>
      </Card>

      {/* Operations Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-neutral-500" />
            {language === 'zh-CN' ? '工序进度' : 'Operations Progress'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '工序号' : 'Op#'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '工序名称' : 'Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '工作中心' : 'Work Center'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '计划工时' : 'Planned Hrs'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '实际工时' : 'Actual Hrs'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 w-40">{language === 'zh-CN' ? '进度' : 'Progress'}</th>
              </tr>
            </thead>
            <tbody>
              {woData.operations.map((op) => {
                const progressPct = op.status === 'completed'
                  ? 100
                  : op.status === 'in_progress'
                    ? Math.round((op.actualHours / op.plannedHours) * 100)
                    : 0
                const progressColor = op.status === 'completed'
                  ? 'success' as const
                  : op.actualHours > op.plannedHours
                    ? 'danger' as const
                    : 'primary' as const

                return (
                  <tr key={op.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm font-mono text-neutral-600">{op.operationNo}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900">{language === 'zh-CN' ? op.name : op.nameEn}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500 font-mono">{op.workCenter}</td>
                    <td className="px-3 py-2">{opStatusBadge(op.status)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{op.plannedHours}h</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">
                      <span className={cn(op.actualHours > op.plannedHours && 'text-danger-600 font-medium')}>
                        {op.actualHours}h
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <ProgressBar value={progressPct} color={progressColor} size="sm" showLabel />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simplified BOM Tree */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? 'BOM 结构' : 'BOM Structure'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/engineering/bom')}
          >
            {language === 'zh-CN' ? '查看完整BOM' : 'View Full BOM'}
          </Button>
        </div>
        <div className="border border-neutral-200 rounded-lg p-2">
          <BOMTreeNode
            node={simpleBomTree}
            level={0}
            language={language}
            expandedIds={bomExpanded}
            onToggle={toggleBomNode}
          />
        </div>
      </Card>
    </div>
  )
}
