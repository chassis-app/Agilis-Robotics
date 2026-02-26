import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/useAuthStore'
import { useEngineeringStore } from '@/store/useEngineeringStore'
import { formatItemNoWithRevision, parseRevisionIndex, toRevisionNumber } from '@/lib/item-version'
import { cn } from '@/lib/utils'
import {
  Search, Plus, Download, SlidersHorizontal,
  Package, X,
} from 'lucide-react'
import { items } from '@/mock/items'
import type { Item, SourcingType, PartSource, ItemLifecycle, PartVersionStatus } from '@/types'

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
  const versionsByPart = useEngineeringStore((state) => state.versionsByPart)
  const createDraftVersion = useEngineeringStore((state) => state.createDraftVersion)
  const releaseVersion = useEngineeringStore((state) => state.releaseVersion)
  const markVersionObsolete = useEngineeringStore((state) => state.markVersionObsolete)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [drawerTab, setDrawerTab] = useState('general')
  const [newVersionNote, setNewVersionNote] = useState('')

  function getReleasedRevision(itemId: string, fallbackRevision: string) {
    const released = versionsByPart[itemId]?.find((entry) => entry.status === 'released')?.version
    if (released) return released
    return toRevisionNumber(fallbackRevision) || '01'
  }

  const filtered = useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        formatItemNoWithRevision(item.itemNo, getReleasedRevision(item.id, item.revision)).toLowerCase().includes(q) ||
        item.itemNo.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    )
  }, [searchQuery, versionsByPart])

  const selectedItemVersions = useMemo(
    () => (selectedItem ? versionsByPart[selectedItem.id] ?? [] : []),
    [selectedItem, versionsByPart],
  )

  const selectedReleasedVersion = useMemo(
    () => selectedItemVersions.find((entry) => entry.status === 'released') ?? null,
    [selectedItemVersions],
  )

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

  const partSourceBadge = (source: PartSource) => {
    const cfg: Record<PartSource, { zh: string; en: string; color: string }> = {
      purchased_from_vendor: { zh: '供应商采购', en: 'Purchased from vendor', color: 'bg-blue-100 text-blue-700' },
      outsource_production: { zh: '外协生产', en: 'Outsource production', color: 'bg-orange-100 text-orange-700' },
      self_manufactured: { zh: '自制生产', en: 'Self-manufactured', color: 'bg-green-100 text-green-700' },
    }
    const c = cfg[source]
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

  const versionStatusBadge = (status: PartVersionStatus) => {
    const cfg: Record<PartVersionStatus, { zh: string; en: string; color: string }> = {
      draft: { zh: '草稿', en: 'Draft', color: 'bg-warning-100 text-warning-700' },
      released: { zh: '已发布', en: 'Released', color: 'bg-success-100 text-success-700' },
      obsolete: { zh: '已作废', en: 'Obsolete', color: 'bg-neutral-100 text-neutral-600' },
    }
    const current = cfg[status]
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', current.color)}>
        {language === 'zh-CN' ? current.zh : current.en}
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
    setNewVersionNote('')
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
                    {language === 'zh-CN' ? '零件来源' : 'Part Source'}
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
                      <span className="text-sm font-medium text-primary-600 font-mono">
                        {formatItemNoWithRevision(item.itemNo, getReleasedRevision(item.id, item.revision))}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm text-neutral-900">{language === 'zh-CN' ? item.name : item.nameEn}</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{item.category}</td>
                    <td className="px-3 py-2">{sourcingBadge(item.sourcingType)}</td>
                    <td className="px-3 py-2">{partSourceBadge(item.partSource)}</td>
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
          ? `${formatItemNoWithRevision(selectedItem.itemNo, getReleasedRevision(selectedItem.id, selectedItem.revision))} - ${language === 'zh-CN' ? selectedItem.name : selectedItem.nameEn}`
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
                    <p className="text-sm font-mono text-neutral-900 mt-0.5">
                      {formatItemNoWithRevision(selectedItem.itemNo, getReleasedRevision(selectedItem.id, selectedItem.revision))}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '版本' : 'Revision'}</label>
                    <p className="text-sm text-neutral-900 mt-0.5">
                      {selectedReleasedVersion?.version ?? (toRevisionNumber(selectedItem.revision) || '01')}
                    </p>
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
                    <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '零件来源' : 'Part Source'}</label>
                    <div className="mt-0.5">{partSourceBadge(selectedItem.partSource)}</div>
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
              <div className="pt-2 space-y-3">
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={newVersionNote}
                    onChange={(e) => setNewVersionNote(e.target.value)}
                    placeholder={language === 'zh-CN' ? '输入变更说明 (可选)' : 'Change note (optional)'}
                    className="h-9 flex-1 rounded-md border border-neutral-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      createDraftVersion(
                        selectedItem.id,
                        newVersionNote || (language === 'zh-CN' ? '前端演示草稿版本' : 'Frontend demo draft version'),
                      )
                      setNewVersionNote('')
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    {language === 'zh-CN' ? '创建草稿版本' : 'Create Draft Version'}
                  </Button>
                </div>

                {selectedItemVersions.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '生效日期' : 'Effective Date'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '变更说明' : 'Change Note'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '创建人' : 'By'}</th>
                        <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...selectedItemVersions]
                        .sort((a, b) => parseRevisionIndex(b.version) - parseRevisionIndex(a.version))
                        .map((version) => (
                          <tr key={version.id} className="border-b border-neutral-100">
                            <td className="px-3 py-2 text-sm font-mono font-medium text-neutral-900">{version.version}</td>
                            <td className="px-3 py-2">{versionStatusBadge(version.status)}</td>
                            <td className="px-3 py-2 text-sm text-neutral-700">{version.effectiveFrom || '-'}</td>
                            <td className="px-3 py-2 text-sm text-neutral-700">{version.changeNote || '-'}</td>
                            <td className="px-3 py-2 text-sm text-neutral-500">{version.createdBy}</td>
                            <td className="px-3 py-2">
                              <div className="flex justify-end gap-2">
                                {version.status === 'draft' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => releaseVersion(selectedItem.id, version.version)}
                                    >
                                      {language === 'zh-CN' ? '发布' : 'Release'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => markVersionObsolete(selectedItem.id, version.version)}
                                    >
                                      {language === 'zh-CN' ? '作废' : 'Obsolete'}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-400">
                      {language === 'zh-CN' ? '暂无版本记录' : 'No versions available'}
                    </p>
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
