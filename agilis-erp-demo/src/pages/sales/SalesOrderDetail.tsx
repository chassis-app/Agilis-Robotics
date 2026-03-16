import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowLeft, Factory, FileText, GitBranch, Layers3, Package } from 'lucide-react'
import type { DocumentStatus } from '@/types'

const order = {
  orderNo: 'SO-F-2026-0018',
  status: 'approved' as DocumentStatus,
  orderType: 'Formal Sales Order',
  sequenceFamily: 'FORMAL',
  market: 'EU',
  customer: '德国分销商 A',
  customerEn: 'EU Distributor A',
  productScope: 'Final product only',
  bomRule: 'EU market BOM released and valid',
  linkedBuildOrder: 'BO-F-2026-0012',
  linkedBatches: ['PB-2026-0012-01', 'PB-2026-0012-02'],
  notes: 'Formal order cannot create semi-product build batches.',
  lines: [
    { lineNo: 1, itemNo: 'FG-001', itemName: '手术机器人整机', itemNameEn: 'Final Assembly Unit', qty: 5, uom: 'EA', bomState: 'EU Rev.04 Released' },
    { lineNo: 2, itemNo: 'ACC-003', itemName: '配套治具包', itemNameEn: 'Accessory Fixture Pack', qty: 5, uom: 'SET', bomState: 'EU Rev.02 Released' },
  ],
  linkedDocs: [
    { label: 'PR-F-2026-0031', type: 'PR', status: 'approved' as DocumentStatus },
    { label: 'BO-F-2026-0012', type: 'Build Order', status: 'approved' as DocumentStatus },
    { label: 'QC-2026-0007', type: 'Internal QC', status: 'in_approval' as DocumentStatus },
  ],
}

export default function SalesOrderDetail() {
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('lines')

  const tabs = [
    { id: 'lines', label: language === 'zh-CN' ? '订单行' : 'Lines' },
    { id: 'build', label: language === 'zh-CN' ? 'Build Order' : 'Build Orders' },
    { id: 'rules', label: language === 'zh-CN' ? '市场与 BOM 规则' : 'Market & BOM Rules' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{order.orderNo}</h1>
            <StatusBadge status={order.status} locale={language} />
          </div>
          <p className="mt-1 text-sm text-neutral-500">{language === 'zh-CN' ? order.customer : order.customerEn}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4" />
            {language === 'zh-CN' ? '查看 PR 链路' : 'View PR Chain'}
          </Button>
          <Button size="sm">
            <Factory className="h-4 w-4" />
            {language === 'zh-CN' ? '查看 Build Order' : 'View Build Order'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '订单类型' : 'Order Type'}</label>
            <p className="mt-1 text-sm font-medium text-neutral-900">{order.orderType}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '序列族' : 'Sequence Family'}</label>
            <p className="mt-1 text-sm font-medium text-neutral-900">{order.sequenceFamily}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</label>
            <p className="mt-1 text-sm font-medium text-neutral-900">{order.market}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '产品规则' : 'Product Rule'}</label>
            <p className="mt-1 text-sm font-medium text-neutral-900">{order.productScope}</p>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'lines' && (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">#</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.item')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '数量' : 'Qty'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">UOM</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场 BOM 条件' : 'Market BOM Eligibility'}</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.lineNo} className="border-b border-neutral-100">
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.lineNo}</td>
                    <td className="px-3 py-2 text-sm text-neutral-800">
                      <div>{language === 'zh-CN' ? line.itemName : line.itemNameEn}</div>
                      <div className="font-mono text-xs text-neutral-400">{line.itemNo}</div>
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">{line.qty}</td>
                    <td className="px-3 py-2 text-sm text-neutral-600">{line.uom}</td>
                    <td className="px-3 py-2 text-sm text-success-700">{line.bomState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'build' && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <Card>
            <div className="flex items-center gap-2">
              <Factory className="h-4 w-4 text-neutral-500" />
              <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? 'Build Order 链路' : 'Build Order Chain'}</h3>
            </div>
            <div className="mt-4 rounded-xl border border-neutral-200 p-4">
              <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '主 Build Order' : 'Primary Build Order'}</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900 font-mono">{order.linkedBuildOrder}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {order.linkedBatches.map((batch) => (
                  <div key={batch} className="rounded-lg bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '生产批次' : 'Production Batch'}</p>
                    <p className="mt-1 text-sm font-mono text-neutral-800">{batch}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-neutral-500" />
              <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '相关文档' : 'Linked Documents'}</h3>
            </div>
            <div className="mt-4 space-y-3">
              {order.linkedDocs.map((doc) => (
                <div key={doc.label} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{doc.type}</p>
                    <p className="mt-1 text-xs font-mono text-primary-600">{doc.label}</p>
                  </div>
                  <StatusBadge status={doc.status} locale={language} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-neutral-500" />
              <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '市场规则' : 'Market Rule'}</h3>
            </div>
            <p className="mt-4 text-sm text-neutral-700">{order.bomRule}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-500" />
              <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '建单限制' : 'Build Restriction'}</h3>
            </div>
            <p className="mt-4 text-sm text-neutral-700">{order.notes}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
