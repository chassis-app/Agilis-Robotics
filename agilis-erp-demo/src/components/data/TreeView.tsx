import { ChevronRight, Star } from 'lucide-react'
import { formatItemNoWithRevision, toRevisionNumber } from '@/lib/item-version'
import { cn } from '@/lib/utils'
import type { BOMNode } from '@/types'

interface TreeViewProps {
  data: BOMNode
  onNodeClick?: (node: BOMNode) => void
  expandedIds: Set<string>
  onToggle: (nodeId: string) => void
}

const sourcingColors: Record<string, string> = {
  purchase: 'bg-blue-500',
  make: 'bg-green-500',
  subcontract: 'bg-orange-500',
}

function TreeNode({
  node,
  level,
  onNodeClick,
  expandedIds,
  onToggle,
}: {
  node: BOMNode
  level: number
  onNodeClick?: (node: BOMNode) => void
  expandedIds: Set<string>
  onToggle: (nodeId: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)

  return (
    <div>
      {/* Node row */}
      <div
        className={cn(
          'group flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer transition-colors',
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => onNodeClick?.(node)}
      >
        {/* Expand/collapse toggle */}
        <button
          className={cn(
            'flex items-center justify-center h-5 w-5 rounded transition-colors',
            hasChildren
              ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200'
              : 'text-transparent cursor-default',
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) onToggle(node.id)
          }}
          tabIndex={hasChildren ? 0 : -1}
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-150',
              isExpanded && 'rotate-90',
            )}
          />
        </button>

        {/* Sourcing type dot */}
        <span
          className={cn(
            'inline-block h-2.5 w-2.5 rounded-full shrink-0',
            sourcingColors[node.sourcingType] || 'bg-neutral-400',
          )}
          title={node.sourcingType}
        />

        {/* Item number (monospace) */}
        <span className="font-mono text-xs text-neutral-600 shrink-0">
          {formatItemNoWithRevision(node.itemNo, toRevisionNumber(node.revision) || '01')}
        </span>

        {/* Item name */}
        <span className="text-sm text-neutral-900 truncate">{node.itemName}</span>

        {/* Quantity */}
        <span className="ml-auto text-xs text-neutral-500 shrink-0">Qty: {node.quantity}</span>

        {/* Critical flag */}
        {node.isCritical && (
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-0 bottom-0 border-l border-neutral-200"
            style={{ left: `${level * 24 + 18}px` }}
          />
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeView({ data, onNodeClick, expandedIds, onToggle }: TreeViewProps) {
  return (
    <div className="text-sm">
      <TreeNode
        node={data}
        level={0}
        onNodeClick={onNodeClick}
        expandedIds={expandedIds}
        onToggle={onToggle}
      />
    </div>
  )
}
