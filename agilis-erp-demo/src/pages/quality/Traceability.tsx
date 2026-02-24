import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  Search, ArrowRight, ArrowLeft, ChevronRight, ChevronDown,
  FileText, ClipboardCheck, Wrench, ShoppingCart,
  Package, TestTubes, Star,
} from 'lucide-react'
import { forwardTrace, backwardTrace } from '@/mock/traceability'
import type { TraceNode } from '@/types'

// Document type configuration for colors and icons
const docTypeConfig: Record<string, {
  icon: typeof FileText
  color: string
  bgColor: string
  borderColor: string
}> = {
  Lot: { icon: Package, color: 'text-neutral-700', bgColor: 'bg-neutral-100', borderColor: 'border-neutral-300' },
  GoodsReceipt: { icon: FileText, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  Inspection: { icon: TestTubes, color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  WorkOrder: { icon: Wrench, color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  MaterialIssue: { icon: ClipboardCheck, color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  SalesOrder: { icon: ShoppingCart, color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
}

const docTypeLabels: Record<string, { zh: string; en: string }> = {
  Lot: { zh: '批次', en: 'Lot' },
  GoodsReceipt: { zh: '收货单', en: 'Goods Receipt' },
  Inspection: { zh: '检验单', en: 'Inspection' },
  WorkOrder: { zh: '工单', en: 'Work Order' },
  MaterialIssue: { zh: '领料单', en: 'Material Issue' },
  SalesOrder: { zh: '销售订单', en: 'Sales Order' },
}

function TraceTreeNode({ node, level, language, expandedIds, onToggle }: {
  node: TraceNode
  level: number
  language: 'zh-CN' | 'en'
  expandedIds: Set<string>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const cfg = docTypeConfig[node.type] || docTypeConfig.Lot
  const Icon = cfg.icon
  const typeLabel = docTypeLabels[node.type] || { zh: node.type, en: node.type }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-2 py-2 px-3 rounded-lg border transition-colors cursor-pointer hover:shadow-sm',
          cfg.borderColor,
          cfg.bgColor,
        )}
        style={{ marginLeft: `${level * 28}px` }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {/* Expand toggle */}
        <span className={cn('h-5 w-5 flex items-center justify-center shrink-0', !hasChildren && 'invisible')}>
          {hasChildren && (
            isExpanded
              ? <ChevronDown className="h-4 w-4 text-neutral-500" />
              : <ChevronRight className="h-4 w-4 text-neutral-500" />
          )}
        </span>

        {/* Doc type icon */}
        <div className={cn('h-7 w-7 rounded-md flex items-center justify-center shrink-0', cfg.bgColor)}>
          <Icon className={cn('h-4 w-4', cfg.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', cfg.bgColor, cfg.color)}>
              {language === 'zh-CN' ? typeLabel.zh : typeLabel.en}
            </span>
            <span className="text-sm font-mono font-medium text-neutral-800">{node.docNo}</span>
          </div>
          <p className="text-sm text-neutral-600 truncate mt-0.5">{node.itemName}</p>
        </div>

        {/* Date and Status */}
        <div className="text-right shrink-0">
          <p className="text-xs text-neutral-400">{node.date}</p>
          <span className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mt-0.5',
            node.status === '已批准' || node.status === '通过' || node.status === '可用'
              ? 'bg-success-100 text-success-700'
              : node.status === '生产中' || node.status === '已发料' || node.status === '进行中'
                ? 'bg-warning-100 text-warning-700'
                : node.status === '待检'
                  ? 'bg-neutral-100 text-neutral-600'
                  : node.status === '已消耗'
                    ? 'bg-neutral-100 text-neutral-500'
                    : 'bg-primary-100 text-primary-700',
          )}>
            {node.status}
          </span>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1 relative">
          {/* Connecting line */}
          <div
            className="absolute border-l-2 border-dashed border-neutral-300"
            style={{
              left: `${level * 28 + 22}px`,
              top: 0,
              bottom: 0,
            }}
          />
          {node.children!.map((child) => (
            <TraceTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              language={language}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Collect all IDs from a trace tree
function collectTraceIds(node: TraceNode): string[] {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach(child => ids.push(...collectTraceIds(child)))
  }
  return ids
}

export default function Traceability() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('L2024-TI-001')
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(collectTraceIds(forwardTrace))
  })

  const traceData = direction === 'forward' ? forwardTrace : backwardTrace

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const switchDirection = (dir: 'forward' | 'backward') => {
    setDirection(dir)
    const data = dir === 'forward' ? forwardTrace : backwardTrace
    setExpandedIds(new Set(collectTraceIds(data)))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '追溯查询' : 'Traceability Query'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN'
              ? '输入批次号或物料编号，查看正向或反向追溯链'
              : 'Enter a lot number or item number to trace forward or backward'}
          </p>
        </div>
      </div>

      {/* Search + Direction Toggle */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'zh-CN' ? '输入批次号或物料编号...' : 'Enter lot no. or item no...'}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Direction toggle */}
          <div className="flex rounded-md border border-neutral-300 overflow-hidden">
            <button
              onClick={() => switchDirection('forward')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
                direction === 'forward'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50',
              )}
            >
              <ArrowRight className="h-4 w-4" />
              {language === 'zh-CN' ? '正向追溯' : 'Forward'}
            </button>
            <button
              onClick={() => switchDirection('backward')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-l border-neutral-300',
                direction === 'backward'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'zh-CN' ? '反向追溯' : 'Backward'}
            </button>
          </div>
        </div>

        {/* Color legend */}
        <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center gap-4">
          <span className="text-xs text-neutral-500">{language === 'zh-CN' ? '文档类型' : 'Doc Types'}:</span>
          {Object.entries(docTypeConfig).map(([type, cfg]) => {
            const Icon = cfg.icon
            const label = docTypeLabels[type]
            return (
              <div key={type} className="flex items-center gap-1.5">
                <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
                <span className="text-xs text-neutral-600">{language === 'zh-CN' ? label.zh : label.en}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Trace Tree */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">
            {direction === 'forward'
              ? (language === 'zh-CN' ? '正向追溯结果' : 'Forward Trace Results')
              : (language === 'zh-CN' ? '反向追溯结果' : 'Backward Trace Results')}
          </h3>
          <span className="text-xs text-neutral-400">
            {language === 'zh-CN' ? '点击节点展开/折叠' : 'Click nodes to expand/collapse'}
          </span>
        </div>
        <div className="space-y-1">
          <TraceTreeNode
            node={traceData}
            level={0}
            language={language}
            expandedIds={expandedIds}
            onToggle={handleToggle}
          />
        </div>
      </Card>
    </div>
  )
}
