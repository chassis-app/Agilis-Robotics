import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { useAuthStore } from '@/store/useAuthStore'
import { formatItemNoWithRevision } from '@/lib/item-version'
import { Download, Plus, Search } from 'lucide-react'
import { items } from '@/mock/items'
import type { Item } from '@/types'

const categoryExtensions: Record<string, { categoryA: string; categoryB: string; categoryC: string }> = {
  itm01: { categoryA: 'A', categoryB: 'Assembly', categoryC: 'Sterile Path' },
  itm02: { categoryA: 'A', categoryB: 'Critical Metal', categoryC: 'Incoming QC' },
  itm03: { categoryA: 'B', categoryB: 'Electronics', categoryC: 'Functional' },
  itm04: { categoryA: 'B', categoryB: 'Electronics', categoryC: 'Market Specific' },
  itm05: { categoryA: 'C', categoryB: 'Consumable', categoryC: 'Visual' },
  itm15: { categoryA: 'A', categoryB: 'Final Product', categoryC: 'Market Release' },
}

export default function ItemMaster() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const filtered = useMemo(() => {
    if (!searchQuery) return items
    const query = searchQuery.toLowerCase()
    return items.filter((item) => {
      const extra = categoryExtensions[item.id]
      return (
        item.itemNo.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        extra?.categoryA.toLowerCase().includes(query) ||
        extra?.categoryB.toLowerCase().includes(query) ||
        extra?.categoryC.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '物料主数据' : 'Item Master'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '保留原物料分类，并补充 3 个分类字段供内部检验模板与规则使用'
              : 'Keep the base material category and add three extra classification fields for internal QC and template logic.'}
          </p>
        </div>
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

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索物料、原分类、Category A/B/C...' : 'Search item, category, Category A/B/C...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料编号' : 'Item No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '名称' : 'Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '原分类' : 'Base Category'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">Category A</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">Category B</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">Category C</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '单位' : 'UOM'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const extra = categoryExtensions[item.id] ?? { categoryA: '-', categoryB: '-', categoryC: '-' }
                return (
                  <tr key={item.id} className="cursor-pointer border-b border-neutral-100 hover:bg-neutral-50" onClick={() => setSelectedItem(item)}>
                    <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">
                      {formatItemNoWithRevision(item.itemNo, item.revision)}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-800">{language === 'zh-CN' ? item.name : item.nameEn}</td>
                    <td className="px-3 py-2 text-sm text-neutral-600">{item.category}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{extra.categoryA}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{extra.categoryB}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{extra.categoryC}</td>
                    <td className="px-3 py-2 text-sm text-neutral-600">{item.uom}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? `${selectedItem.itemNo} · ${language === 'zh-CN' ? selectedItem.name : selectedItem.nameEn}` : ''}
        wide
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '原分类' : 'Base Category'}</label>
                <p className="mt-1 text-sm font-medium text-neutral-900">{selectedItem.category}</p>
              </Card>
              <Card>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '用途说明' : 'Usage'}</label>
                <p className="mt-1 text-sm text-neutral-700">
                  {language === 'zh-CN'
                    ? '新增分类字段将用于内部检验模板映射与抽检规则筛选。'
                    : 'The new category fields drive internal QC template and sampling-rule assignment.'}
                </p>
              </Card>
            </div>
            <Card>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(categoryExtensions[selectedItem.id] ?? { categoryA: '-', categoryB: '-', categoryC: '-' }).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-neutral-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">{key}</p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  )
}
