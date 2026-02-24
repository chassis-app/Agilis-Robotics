import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { TreeView } from '@/components/data/TreeView'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  Expand, Shrink, Star, Package,
  ArrowRightLeft, AlertTriangle, Info,
} from 'lucide-react'
import { bomTree } from '@/mock/bom'
import type { BOMNode } from '@/types'

// Helper to collect all node IDs recursively
function collectIds(node: BOMNode): string[] {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach(child => ids.push(...collectIds(child)))
  }
  return ids
}

// Mock stock info for selected items
const mockStock: Record<string, { onHand: number; available: number; reserved: number }> = {
  'itm02': { onHand: 75, available: 55, reserved: 20 },
  'itm03': { onHand: 12, available: 8, reserved: 4 },
  'itm04': { onHand: 45, available: 35, reserved: 10 },
  'itm05': { onHand: 350, available: 300, reserved: 50 },
  'itm06': { onHand: 14, available: 10, reserved: 4 },
  'itm07': { onHand: 22, available: 18, reserved: 4 },
  'itm08': { onHand: 6, available: 4, reserved: 2 },
  'itm09': { onHand: 30, available: 25, reserved: 5 },
  'itm10': { onHand: 4, available: 3, reserved: 1 },
  'itm11': { onHand: 18, available: 10, reserved: 8 },
  'itm12': { onHand: 60, available: 40, reserved: 20 },
  'itm13': { onHand: 18, available: 15, reserved: 3 },
  'itm14': { onHand: 500, available: 450, reserved: 50 },
  'itm15': { onHand: 2, available: 1, reserved: 1 },
  'itm01': { onHand: 8, available: 5, reserved: 3 },
}

export default function BOMDetail() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([bomTree.id]))
  const [selectedNode, setSelectedNode] = useState<BOMNode | null>(null)

  const handleToggle = useCallback((nodeId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  const handleNodeClick = useCallback((node: BOMNode) => {
    setSelectedNode(node)
  }, [])

  const expandAll = () => {
    setExpandedIds(new Set(collectIds(bomTree)))
  }

  const collapseAll = () => {
    setExpandedIds(new Set([bomTree.id]))
  }

  const sourcingLabel = (type: string) => {
    const map: Record<string, { zh: string; en: string; color: string }> = {
      purchase: { zh: '外购', en: 'Purchase', color: 'bg-blue-100 text-blue-700' },
      make: { zh: '自制', en: 'Make', color: 'bg-green-100 text-green-700' },
      subcontract: { zh: '外协', en: 'Subcontract', color: 'bg-orange-100 text-orange-700' },
    }
    const cfg = map[type] || map.purchase
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cfg.color)}>
        {language === 'zh-CN' ? cfg.zh : cfg.en}
      </span>
    )
  }

  const stock = selectedNode ? mockStock[selectedNode.itemId] : null

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? 'BOM 结构' : 'Bill of Materials'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            <span className="font-mono">{bomTree.itemNo}</span> - {language === 'zh-CN' ? bomTree.itemName : bomTree.itemNameEn} (Rev. {bomTree.revision})
          </p>
        </div>
      </div>

      {/* Color Legend + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-500">{language === 'zh-CN' ? '图例' : 'Legend'}:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-neutral-600">{language === 'zh-CN' ? '外购' : 'Purchase'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-xs text-neutral-600">{language === 'zh-CN' ? '自制' : 'Make'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-xs text-neutral-600">{language === 'zh-CN' ? '外协' : 'Subcontract'}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-4">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-neutral-600">{language === 'zh-CN' ? '关键物料' : 'Critical'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={expandAll}>
            <Expand className="h-4 w-4" />
            {language === 'zh-CN' ? '展开全部' : 'Expand All'}
          </Button>
          <Button variant="secondary" size="sm" onClick={collapseAll}>
            <Shrink className="h-4 w-4" />
            {language === 'zh-CN' ? '折叠全部' : 'Collapse All'}
          </Button>
        </div>
      </div>

      {/* BOM Tree */}
      <Card>
        <TreeView
          data={bomTree}
          onNodeClick={handleNodeClick}
          expandedIds={expandedIds}
          onToggle={handleToggle}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode ? (language === 'zh-CN' ? selectedNode.itemName : selectedNode.itemNameEn) : ''}
        wide
      >
        {selectedNode && (
          <div className="space-y-6">
            {/* Item Details */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-neutral-400" />
                {language === 'zh-CN' ? '物料信息' : 'Item Details'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '物料编号' : 'Item No'}</label>
                  <p className="text-sm font-mono text-neutral-900">{selectedNode.itemNo}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '获取方式' : 'Sourcing Type'}</label>
                  <div className="mt-0.5">{sourcingLabel(selectedNode.sourcingType)}</div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '版本' : 'Revision'}</label>
                  <p className="text-sm text-neutral-900">{selectedNode.revision}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</label>
                  <p className="text-sm text-neutral-900">{selectedNode.supplierName || '-'}</p>
                </div>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* BOM Specific Info */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-neutral-400" />
                {language === 'zh-CN' ? 'BOM 参数' : 'BOM Parameters'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '数量' : 'Quantity in BOM'}</label>
                  <p className="text-sm font-medium text-neutral-900">{selectedNode.quantity}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '损耗率' : 'Scrap Rate'}</label>
                  <p className="text-sm text-neutral-900">{(selectedNode.scrapRate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '模块代码' : 'Module Code'}</label>
                  <p className="text-sm text-neutral-900 font-mono">{selectedNode.moduleCode || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '关键物料' : 'Critical'}</label>
                  <p className="text-sm text-neutral-900">
                    {selectedNode.isCritical ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <Star className="h-3.5 w-3.5 fill-yellow-500" />
                        {language === 'zh-CN' ? '是' : 'Yes'}
                      </span>
                    ) : (
                      <span className="text-neutral-500">{language === 'zh-CN' ? '否' : 'No'}</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '前置时间' : 'Lead Time'}</label>
                  <p className="text-sm text-neutral-900">{selectedNode.leadTimeDays} {language === 'zh-CN' ? '天' : 'days'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '最小起订量' : 'MOQ'}</label>
                  <p className="text-sm text-neutral-900">{selectedNode.moq}</p>
                </div>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* Substitutes */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-neutral-400" />
                {language === 'zh-CN' ? '替代物料' : 'Substitutes'}
              </h4>
              {selectedNode.substitutes.length > 0 ? (
                <div className="space-y-2">
                  {selectedNode.substitutes.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-md border border-neutral-200 bg-neutral-50">
                      <div>
                        <span className="text-sm font-mono text-neutral-600">{sub.itemNo}</span>
                        <span className="text-sm text-neutral-900 ml-2">{sub.itemName}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {language === 'zh-CN' ? `优先级 ${sub.priority}` : `Priority ${sub.priority}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">{language === 'zh-CN' ? '无替代物料' : 'No substitutes defined'}</p>
              )}
            </div>

            <hr className="border-neutral-200" />

            {/* Current Stock */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-neutral-400" />
                {language === 'zh-CN' ? '当前库存' : 'Current Stock'}
              </h4>
              {stock ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-md bg-neutral-50 text-center">
                    <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '在手量' : 'On Hand'}</p>
                    <p className="text-lg font-semibold text-neutral-900">{stock.onHand}</p>
                  </div>
                  <div className="p-3 rounded-md bg-success-50 text-center">
                    <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '可用量' : 'Available'}</p>
                    <p className="text-lg font-semibold text-success-700">{stock.available}</p>
                  </div>
                  <div className="p-3 rounded-md bg-warning-50 text-center">
                    <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '预留量' : 'Reserved'}</p>
                    <p className="text-lg font-semibold text-warning-700">{stock.reserved}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-400">{language === 'zh-CN' ? '无库存信息' : 'No stock info'}</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
