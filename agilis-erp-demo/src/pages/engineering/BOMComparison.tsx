import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { GitCompareArrows, Download, RefreshCw } from 'lucide-react'

const comparisonRows = [
  {
    layer: '1.1',
    itemNo: 'ITM-0002',
    itemName: '钛合金传动轴',
    itemNameEn: 'Titanium Alloy Shaft',
    oldValue: 'Qty 6 / Rev 02',
    newValue: 'Qty 6 / Rev 03',
    changeType: 'replace',
    impact: 'Material spec updated by CAPA-2026-0003',
  },
  {
    layer: '1.1.3',
    itemNo: 'ITM-0098',
    itemName: '减震垫片',
    itemNameEn: 'Damping Spacer',
    oldValue: '-',
    newValue: 'Qty 2 / Rev 01',
    changeType: 'add',
    impact: 'New component inserted, permanent layer number assigned',
  },
  {
    layer: '2.2',
    itemNo: 'ITM-0012',
    itemName: '固件芯片',
    itemNameEn: 'Firmware Chip',
    oldValue: 'Rev 04',
    newValue: 'Rev 04',
    changeType: 'header',
    impact: 'Header tag changed from CN-only to CN/EU/US',
  },
]

export default function BOMComparison() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [leftVersion, setLeftVersion] = useState('BOM-ITM-0015 Rev.03')
  const [rightVersion, setRightVersion] = useState('BOM-ITM-0015 Rev.04')

  const rowTone = (changeType: string) => {
    if (changeType === 'add') return 'bg-success-50'
    if (changeType === 'replace') return 'bg-warning-50'
    return 'bg-primary-50'
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? 'BOM 对比' : 'BOM Comparison'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '比较两个 BOM 版本，显示到最底层的零件差异与市场标签变化'
              : 'Compare two BOM versions down to the lowest layer with market-tag and part variance visibility.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button variant="secondary" size="sm">
            <RefreshCw className="h-4 w-4" />
            {language === 'zh-CN' ? '刷新差异' : 'Refresh Diff'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr,48px,1fr]">
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '基准版本' : 'Base Version'}</label>
            <select value={leftVersion} onChange={(event) => setLeftVersion(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-neutral-300 px-3 text-sm">
              <option>BOM-ITM-0015 Rev.03</option>
              <option>BOM-ITM-0015 Rev.02</option>
            </select>
          </div>
          <div className="flex items-end justify-center pb-2">
            <GitCompareArrows className="h-5 w-5 text-neutral-400" />
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '目标版本' : 'Target Version'}</label>
            <select value={rightVersion} onChange={(event) => setRightVersion(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-neutral-300 px-3 text-sm">
              <option>BOM-ITM-0015 Rev.04</option>
              <option>BOM-ITM-0015 Rev.03</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '新增零件' : 'Added Parts'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">1</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '替换零件' : 'Replaced Parts'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">1</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '数量变化' : 'Qty Changes'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">0</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '标签变化' : 'Tag Changes'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">1</p>
        </Card>
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '层号' : 'Layer No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '零件' : 'Part'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '旧版本' : 'Old Value'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '新版本' : 'New Value'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '变化类型' : 'Change Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '影响说明' : 'Impact'}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={`${row.layer}-${row.itemNo}`} className={`border-b border-neutral-100 ${rowTone(row.changeType)}`}>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.layer}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">
                    <div>{language === 'zh-CN' ? row.itemName : row.itemNameEn}</div>
                    <div className="font-mono text-xs text-neutral-400">{row.itemNo}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.oldValue}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900">{row.newValue}</td>
                  <td className="px-3 py-2 text-sm font-medium text-neutral-700">{row.changeType.toUpperCase()}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
