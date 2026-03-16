import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { GitCompareArrows, Layers3, Tags } from 'lucide-react'

const bomRows = [
  {
    layer: '1',
    itemNo: 'ITM-0015',
    itemName: '手术机器人整机',
    itemNameEn: 'Final Assembly Unit',
    customOrder: 10,
    sourcing: ['make'],
    bomClass: 'Final Product',
    note: 'Header tags: CN / EU / US',
  },
  {
    layer: '1.1',
    itemNo: 'ITM-0001',
    itemName: '手术机器人臂组件',
    itemNameEn: 'Surgical Robot Arm Assembly',
    customOrder: 20,
    sourcing: ['make', 'subcontract'],
    bomClass: 'Semi Product',
    note: 'Replacement keeps layer number',
  },
  {
    layer: '1.1.3',
    itemNo: 'ITM-0098',
    itemName: '减震垫片',
    itemNameEn: 'Damping Spacer',
    customOrder: 99,
    sourcing: ['purchase'],
    bomClass: 'Component',
    note: 'New insert gets permanent new number',
  },
]

export default function BOMDetail() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [showNumberingRules, setShowNumberingRules] = useState(true)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? 'BOM 管理' : 'BOM Management'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '支持永久层号、自定义排序、BOM 头标签、多选 sourcing type，以及半成品/成品标记'
              : 'Permanent layer numbering, custom ordering, header tags, multi-source selection, and semi/final product classification.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/engineering/bom/comparison')}>
            <GitCompareArrows className="h-4 w-4" />
            {language === 'zh-CN' ? 'BOM 对比' : 'Compare BOM'}
          </Button>
          <Button size="sm">{t('common.edit')}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4 text-neutral-500" />
            <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? 'BOM 头标签' : 'Header Tags'}</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['CN', 'EU', 'US'].map((tag) => (
              <span key={tag} className="rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">{tag}</span>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-neutral-500" />
            <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? 'BOM 类别' : 'BOM Class'}</h3>
          </div>
          <p className="mt-3 text-sm text-neutral-700">
            {language === 'zh-CN' ? '正式订单仅允许成品 BOM，非正式/内部订单可选择半成品 BOM。' : 'Formal orders allow final-product BOMs only; informal/internal orders can select semi-product BOMs.'}
          </p>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '编号规则' : 'Numbering Rule'}</h3>
          <p className="mt-3 text-sm text-neutral-700">
            {language === 'zh-CN' ? '新增不复用编号，替换沿用原编号，自定义排序不改变层号。' : 'New inserts never reuse numbers, replacements keep numbers, and custom ordering does not change layer numbers.'}
          </p>
        </Card>
      </div>

      {showNumberingRules && (
        <Card className="bg-neutral-950 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">{language === 'zh-CN' ? '永久层号说明' : 'Permanent Layer Rules'}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>{language === 'zh-CN' ? '1. 层号如 1 / 1.1 / 1.1.1 永久保留。' : '1. Layer numbers like 1 / 1.1 / 1.1.1 are permanent.'}</li>
                <li>{language === 'zh-CN' ? '2. 新增零件分配新号，不回填旧号。' : '2. New parts receive new numbers and never backfill old ones.'}</li>
                <li>{language === 'zh-CN' ? '3. 替换零件沿用原层号。' : '3. Replaced components reuse the original layer number.'}</li>
              </ul>
            </div>
            <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => setShowNumberingRules(false)}>
              {language === 'zh-CN' ? '收起' : 'Hide'}
            </Button>
          </div>
        </Card>
      )}

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '层号' : 'Layer No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '零件' : 'Part'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '自定义顺序' : 'Custom Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Sourcing Type' : 'Sourcing Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '类别' : 'Classification'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '规则备注' : 'Notes'}</th>
              </tr>
            </thead>
            <tbody>
              {bomRows.map((row) => (
                <tr key={`${row.layer}-${row.itemNo}`} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.layer}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">
                    <div>{language === 'zh-CN' ? row.itemName : row.itemNameEn}</div>
                    <div className="font-mono text-xs text-neutral-400">{row.itemNo}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.customOrder}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.sourcing.join(' / ')}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.bomClass}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
