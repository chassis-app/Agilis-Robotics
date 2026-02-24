import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  Search, Plus, Download, SlidersHorizontal,
  Package, X,
} from 'lucide-react'
import { items } from '@/mock/items'
import type { Item, SourcingType, ItemLifecycle } from '@/types'

// Inline revision history mock
const revisionHistory: Record<string, Array<{ rev: string; status: string; date: string; desc: string; by: string }>> = {
  'itm01': [
    { rev: 'A', status: 'approved', date: '2024-06-15', desc: '初始版本', by: '张伟' },
  ],
  'itm02': [
    { rev: 'A', status: 'approved', date: '2024-03-01', desc: '初始版本', by: '张伟' },
    { rev: 'B', status: 'approved', date: '2024-08-20', desc: '更新材料规格', by: '王芳' },
  ],
  'itm04': [
    { rev: 'A', status: 'approved', date: '2024-01-10', desc: '初始版本', by: '张伟' },
    { rev: 'B', status: 'approved', date: '2024-05-15', desc: '增加通信模块', by: '王芳' },
    { rev: 'C', status: 'approved', date: '2024-09-20', desc: 'ARM处理器升级', by: '张伟' },
  ],
  'itm10': [
    { rev: 'A', status: 'approved', date: '2024-02-01', desc: '初始版本', by: '张伟' },
    { rev: 'B', status: 'approved', date: '2024-07-10', desc: '增加基准块精度', by: '王芳' },
  ],
  'itm12': [
    { rev: 'A', status: 'approved', date: '2023-12-01', desc: '初始版本', by: '张伟' },
    { rev: 'B', status: 'approved', date: '2024-02-15', desc: '固件优化', by: '王芳' },
    { rev: 'C', status: 'approved', date: '2024-06-01', desc: '新增运动控制算法', by: '张伟' },
    { rev: 'D', status: 'approved', date: '2024-10-01', desc: '安全协议升级', by: '王芳' },
  ],
}

const supplierNames: Record<string, string> = {
  sup1: '苏州精密零件有限公司',
  sup2: '上海医疗材料科技',
  sup3: '深圳创新电子',
  sup5: '广州包装材料',
}

const supplierNamesEn: Record<string, string> = {
  sup1: 'Suzhou Precision Parts',
  sup2: 'Shanghai Medical Materials',
  sup3: 'Shenzhen Innovation Electronics',
  sup5: 'Guangzhou Packaging Materials',
}

export default function ItemMaster() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [drawerTab, setDrawerTab] = useState('general')

  const filtered = useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.itemNo.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const sourcingBadge = (type: SourcingType) => {
    const cfg: Record<SourcingType, { zh: string; en: string; color: string }> = {
      purchase: { zh: '外购', en: 'Purchase', color: 'bg-blue-100 text-blue-700' },
      make: { zh: '自制', en: 'Make', color: 'bg-green-100 text-green-700' },
      subcontract: { zh: '外协', en: 'Subcontract', color: 'bg-orange-100 text-orange-700' },
    }
    const c = cfg[type]
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', c.color)}>
        {language === 'zh-CN' ? c.zh : c.en}
      </span>
    )
  }

  const lifecycleBadge = (lc: ItemLifecycle) => {
    const cfg: Record<ItemLifecycle, { zh: string; en: string; color: string }> = {
      rd: { zh: '研发', en: 'R&D', color: 'bg-purple-100 text-purple-700' },
      pilot: { zh: '试产', en: 'Pilot', color: 'bg-warning-100 text-warning-700' },
      mass_production: { zh: '量产', en: 'Mass Prod.', color: 'bg-success-100 text-success-700' },
    }
    const c = cfg[lc]
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', c.color)}>
        {language === 'zh-CN' ? c.zh : c.en}
      </span>
    )
  }

  const drawerTabs = [
    { id: 'general', label: language === 'zh-CN' ? '基本信息' : 'General' },
    { id: 'revisions', label: language === 'zh-CN' ? '版本历史' : 'Revisions' },
    { id: 'bom', label: 'BOM' },
    { id: 'substitutes', label: language === 'zh-CN' ? '替代物料' : 'Substitutes' },
  ]

  const openDrawer = (item: Item) => {
    setSelectedItem(item)
    setDrawerTab('general')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '物料主数据' : 'Item Master'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新增物料' : 'New Item'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索物料编号、名称、分类...' : 'Search item no., name, category...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'zh-CN' ? '筛选' : 'Filter'}
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12 text-neutral-300" />}
          title={language === 'zh-CN' ? '没有匹配的物料' : 'No matching items'}
          description={language === 'zh-CN' ? '请尝试修改搜索条件' : 'Try adjusting your search criteria'}
        />
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '物料编号' : 'Item No'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '名称' : 'Name'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '分类' : 'Category'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '获取方式' : 'Sourcing'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '生命周期' : 'Lifecycle'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '单位' : 'UOM'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                    {language === 'zh-CN' ? '默认供应商' : 'Default Supplier'}
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                    {language === 'zh-CN' ? '前置时间' : 'Lead Time'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => openDrawer(item)}
                  >
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{item.itemNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm text-neutral-900">{language === 'zh-CN' ? item.name : item.nameEn}</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{item.category}</td>
                    <td className="px-3 py-2">{sourcingBadge(item.sourcingType)}</td>
                    <td className="px-3 py-2">{lifecycleBadge(item.lifecycle)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{item.uom}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {item.defaultSupplierId
                        ? (language === 'zh-CN'
                            ? supplierNames[item.defaultSupplierId] || '-'
                            : supplierNamesEn[item.defaultSupplierId] || '-')
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">
                      {item.leadTimeDays} {language === 'zh-CN' ? '天' : 'days'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
            <span className="text-sm text-neutral-500">
              {t('common.total_records', { count: filtered.length })}
            </span>
          </div>
        </Card>
      )}

      {/* Detail Drawer */}
      <Drawer
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem
          ? `${selectedItem.itemNo} - ${language === 'zh-CN' ? selectedItem.name : selectedItem.nameEn}`
          : ''}
        wide
      >
        {selectedItem && (
          <div className="space-y-4">
            <Tabs tabs={drawerTabs} activeTab={drawerTab} onChange={setDrawerTab} />

            {/* General Tab */}
            {drawerTab === 'general' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '物料编号' : 'Item No'}</label>
                    <p className="text-sm font-mono text-neutral-900 mt-0.5">{selectedItem.itemNo}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '版本' : 'Revision'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.revision}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '中文名称' : 'Name (CN)'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '英文名称' : 'Name (EN)'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.nameEn}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '分类' : 'Category'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.category}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '单位' : 'UOM'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.uom}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '获取方式' : 'Sourcing Type'}</label>
                    <div className="mt-0.5">{sourcingBadge(selectedItem.sourcingType)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '生命周期' : 'Lifecycle'}</label>
                    <div className="mt-0.5">{lifecycleBadge(selectedItem.lifecycle)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '前置时间' : 'Lead Time'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.leadTimeDays} {language === 'zh-CN' ? '天' : 'days'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '最小起订量' : 'MOQ'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.moq}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '安全库存' : 'Safety Stock'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">{selectedItem.safetyStock}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '单价' : 'Unit Price'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">
                      {selectedItem.currency === 'CNY' ? '¥' : '$'}{selectedItem.unitPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '描述' : 'Description'}</label>
                  <p className="text-sm text-neutral-700 mt-0.5">
                    {language === 'zh-CN' ? selectedItem.description : selectedItem.descriptionEn}
                  </p>
                </div>
              </div>
            )}

            {/* Revisions Tab */}
            {drawerTab === 'revisions' && (
              <div className="pt-2">
                {(revisionHistory[selectedItem.id] || []).length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '日期' : 'Date'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '描述' : 'Description'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '创建人' : 'By'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(revisionHistory[selectedItem.id] || []).map((rev, i) => (
                        <tr key={i} className="border-b border-neutral-100">
                          <td className="px-3 py-2 text-sm font-mono font-medium text-neutral-900">{rev.rev}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                              {language === 'zh-CN' ? '已批准' : 'Approved'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-neutral-700">{rev.date}</td>
                          <td className="px-3 py-2 text-sm text-neutral-700">{rev.desc}</td>
                          <td className="px-3 py-2 text-sm text-neutral-500">{rev.by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-400">
                      {language === 'zh-CN' ? '仅有当前版本' : 'Only current revision exists'}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">Rev. {selectedItem.revision}</p>
                  </div>
                )}
              </div>
            )}

            {/* BOM Tab */}
            {drawerTab === 'bom' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-10 w-10 text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500">
                  {language === 'zh-CN' ? '请前往 BOM 模块查看完整结构' : 'View full BOM structure in the BOM module'}
                </p>
                <Button variant="ghost" size="sm" className="mt-3">
                  {language === 'zh-CN' ? '查看BOM' : 'View BOM'}
                </Button>
              </div>
            )}

            {/* Substitutes Tab */}
            {drawerTab === 'substitutes' && (
              <div className="flex flex-col items-center justify-center py-12">
                <X className="h-10 w-10 text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500">
                  {language === 'zh-CN' ? '替代物料信息在BOM结构中定义' : 'Substitute info is defined in BOM structure'}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
