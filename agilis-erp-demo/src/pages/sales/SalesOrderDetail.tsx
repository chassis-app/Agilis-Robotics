import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs, TabPanel } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/store/useAuthStore'
import {
  ArrowLeft, Pencil, FileText, Package, Truck, Wrench,
  AlertTriangle, CheckCircle2, XCircle, Plus, RefreshCw, Download, ChevronRight
} from 'lucide-react'
import type { DocumentStatus } from '@/types'

type SOStatus = 'draft' | 'confirmed' | 'in_production' | 'partially_shipped' | 'shipped' | 'closed'

const soData = {
  soNo: 'SO-2024-0145',
  status: 'confirmed' as SOStatus,
  customer: '北京协和医院',
  customerEn: 'Peking Union Medical College Hospital',
  customerContact: '张医生',
  orderDate: '2024-12-10',
  requiredShipDate: '2025-01-15',
  shippingAddress: '北京市东城区帅府园1号',
  paymentTerms: 'Net 30',
  currency: 'CNY',
  totalAmount: 2850000,
  notes: '紧急订单，请优先安排生产。',
  lines: [
    { id: '1', lineNo: 1, itemNo: 'FG-001', itemName: '手术机器人手臂组件', itemNameEn: 'Surgical Robot Arm Assembly', revision: 'C', orderedQty: 5, uom: 'EA', unitPrice: 350000, allocatedQty: 2, shortageQty: 0, productionStatus: 'in_progress' as const },
    { id: '2', lineNo: 2, itemNo: 'FG-002', itemName: '控制系统主机', itemNameEn: 'Control System Unit', revision: 'B', orderedQty: 3, uom: 'EA', unitPrice: 300000, allocatedQty: 0, shortageQty: 3, productionStatus: 'not_started' as const },
    { id: '3', lineNo: 3, itemNo: 'FG-003', itemName: '末端执行器套件', itemNameEn: 'End Effector Kit', revision: 'A', orderedQty: 10, uom: 'SET', unitPrice: 50000, allocatedQty: 10, shortageQty: 0, productionStatus: 'complete' as const },
  ],
}

interface MaterialReq {
  id: string
  componentNo: string
  componentName: string
  componentNameEn: string
  revision: string
  required: number
  onHand: number
  onOrder: number
  shortage: number
  preferredSupplier: string | null
  supplierType: 'single' | 'make' | 'multi' | 'none'
}

const materialRequirements: MaterialReq[] = [
  { id: '1', componentNo: 'CMP-001', componentName: '钛合金轴', componentNameEn: 'Titanium Alloy Shaft', revision: 'B', required: 500, onHand: 200, onOrder: 150, shortage: 150, preferredSupplier: 'Acme Parts', supplierType: 'single' },
  { id: '2', componentNo: 'CMP-002', componentName: '电机模组', componentNameEn: 'Motor Module', revision: 'D', required: 100, onHand: 80, onOrder: 0, shortage: 20, preferredSupplier: '(Make)', supplierType: 'make' },
  { id: '3', componentNo: 'CMP-003', componentName: '传感器B型', componentNameEn: 'Sensor Type-B', revision: 'A', required: 200, onHand: 200, onOrder: 0, shortage: 0, preferredSupplier: null, supplierType: 'none' },
  { id: '4', componentNo: 'CMP-004', componentName: '外壳C型', componentNameEn: 'Housing Type-C', revision: 'A', required: 100, onHand: 50, onOrder: 0, shortage: 50, preferredSupplier: '⚠ Multiple Vendors', supplierType: 'multi' },
]

const procurementTrail = [
  { docNo: 'PR-0456', type: 'PR', status: 'approved', supplier: 'Acme Parts', amount: 15000, created: '2024-03-10' },
  { docNo: 'PO-0234', type: 'PO', status: 'sent', supplier: 'Acme Parts', amount: 15000, created: '2024-03-12' },
  { docNo: 'PR-0457', type: 'PR', status: 'in_approval', supplier: 'PrecisionMfg', amount: 3500, created: '2024-03-10' },
]

const shipments = [
  { shipmentNo: 'SHP-2024-0012', status: 'shipped', shipDate: '2024-12-20', lines: 2, tracking: 'SF1234567890' },
]

const statusMap: Record<SOStatus, DocumentStatus> = {
  draft: 'draft',
  confirmed: 'approved',
  in_production: 'in_approval',
  partially_shipped: 'approved',
  shipped: 'approved',
  closed: 'approved',
}

export default function SalesOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [activeTab, setActiveTab] = useState('lines')
  const [showPRDialog, setShowPRDialog] = useState(false)
  const [showShortagesOnly, setShowShortagesOnly] = useState(true)

  const tabs = [
    { id: 'lines', label: language === 'zh-CN' ? '订单明细' : 'Order Lines' },
    { id: 'materials', label: language === 'zh-CN' ? '物料需求' : 'Material Requirements', count: materialRequirements.filter(m => m.shortage > 0).length },
    { id: 'shipments', label: language === 'zh-CN' ? '发货记录' : 'Shipments' },
    { id: 'procurement', label: language === 'zh-CN' ? '采购关联' : 'Procurement Links' },
  ]

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)

  const filteredMaterials = showShortagesOnly 
    ? materialRequirements.filter(m => m.shortage > 0)
    : materialRequirements

  const prPreviewData = [
    { supplier: 'Acme Parts', items: 2, totalQty: 350, estAmount: 15000, status: 'ready' },
    { supplier: 'PrecisionMfg', items: 1, totalQty: 50, estAmount: 3500, status: 'ready' },
    { supplier: '⚠ Unassigned', items: 1, totalQty: 50, estAmount: null, status: 'unassigned' },
  ]

  const productionStatusBadge = (status: 'not_started' | 'in_progress' | 'complete') => {
    const config = {
      not_started: { label: language === 'zh-CN' ? '未开始' : 'Not Started', className: 'bg-neutral-100 text-neutral-600' },
      in_progress: { label: language === 'zh-CN' ? '生产中' : 'In Progress', className: 'bg-primary-100 text-primary-600' },
      complete: { label: language === 'zh-CN' ? '已完成' : 'Complete', className: 'bg-success-100 text-success-600' },
    }
    const c = config[status]
    return <span className={`px-2 py-0.5 text-xs font-medium rounded ${c.className}`}>{c.label}</span>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{soData.soNo}</h1>
            <StatusBadge status={statusMap[soData.status]} locale={language} />
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? soData.customer : soData.customerEn}
          </p>
        </div>
        <div className="flex gap-2">
          {soData.status === 'draft' && (
            <>
              <Button variant="danger" size="sm">{t('common.delete')}</Button>
              <Button variant="secondary" size="sm">{t('common.save')}</Button>
              <Button size="sm">{language === 'zh-CN' ? '确认订单' : 'Confirm Order'}</Button>
            </>
          )}
          {soData.status === 'confirmed' && (
            <>
              <Button variant="secondary" size="sm"><Wrench className="h-4 w-4" />{language === 'zh-CN' ? '创建工单' : 'Create WO'}</Button>
              <Button variant="secondary" size="sm" onClick={() => setShowPRDialog(true)}><FileText className="h-4 w-4" />{language === 'zh-CN' ? '生成请购单' : 'Generate PRs'}</Button>
              <Button size="sm"><Package className="h-4 w-4" />{language === 'zh-CN' ? '创建发货单' : 'Create Shipment'}</Button>
            </>
          )}
          {soData.status === 'in_production' && (
            <>
              <Button variant="secondary" size="sm"><Wrench className="h-4 w-4" />{language === 'zh-CN' ? '查看工单' : 'View WOs'}</Button>
              <Button variant="secondary" size="sm" onClick={() => setShowPRDialog(true)}><FileText className="h-4 w-4" />{language === 'zh-CN' ? '生成请购单' : 'Generate PRs'}</Button>
              <Button size="sm"><Package className="h-4 w-4" />{language === 'zh-CN' ? '创建发货单' : 'Create Shipment'}</Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '客户' : 'Customer'}</label>
              <p className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? soData.customer : soData.customerEn}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '联系人' : 'Contact'}</label>
              <p className="text-sm text-neutral-900">{soData.customerContact}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '订单日期' : 'Order Date'}</label>
              <p className="text-sm text-neutral-900">{soData.orderDate}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '要求发货日期' : 'Required Ship Date'}</label>
              <p className="text-sm text-neutral-900">{soData.requiredShipDate}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '付款条款' : 'Payment Terms'}</label>
              <p className="text-sm text-neutral-900">{soData.paymentTerms}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '货币' : 'Currency'}</label>
              <p className="text-sm text-neutral-900">{soData.currency}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '收货地址' : 'Shipping Address'}</label>
              <p className="text-sm text-neutral-900">{soData.shippingAddress}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '订单总额' : 'Total Amount'}</label>
              <p className="text-sm font-semibold text-neutral-900">{formatAmount(soData.totalAmount)}</p>
            </div>
          </div>
        </div>
        {soData.notes && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '备注' : 'Notes'}</label>
            <p className="text-sm text-neutral-700 mt-1">{soData.notes}</p>
          </div>
        )}
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'lines' && (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">#</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料' : 'Item'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '数量' : 'Qty'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '单位' : 'UOM'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '单价' : 'Unit Price'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '行金额' : 'Line Total'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已分配' : 'Allocated'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '短缺' : 'Shortage'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '生产状态' : 'Production'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {soData.lines.map(line => (
                  <tr key={line.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.lineNo}</td>
                    <td className="px-3 py-2">
                      <div className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? line.itemName : line.itemNameEn}</div>
                      <div className="text-xs text-neutral-400 font-mono">{line.itemNo}</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{line.revision}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{line.orderedQty}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.uom}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatAmount(line.unitPrice)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(line.orderedQty * line.unitPrice)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{line.allocatedQty}</td>
                    <td className="px-3 py-2 text-sm text-right">
                      {line.shortageQty > 0 ? (
                        <span className="text-danger-600 font-medium">{line.shortageQty}</span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{productionStatusBadge(line.productionStatus)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-neutral-400 hover:text-neutral-600" title={language === 'zh-CN' ? '查看BOM' : 'View BOM'}>
                          <FileText className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-neutral-400 hover:text-neutral-600" title={language === 'zh-CN' ? '检查可用性' : 'Check Availability'}>
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        {line.shortageQty > 0 && (
                          <button className="p-1 text-neutral-400 hover:text-neutral-600" title={language === 'zh-CN' ? '创建工单' : 'Create WO'}>
                            <Wrench className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50">
                  <td colSpan={6} className="px-3 py-2 text-sm font-medium text-neutral-900 text-right">{language === 'zh-CN' ? '总计' : 'Total'}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatAmount(soData.totalAmount)}</td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showShortagesOnly} 
                  onChange={(e) => setShowShortagesOnly(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                {language === 'zh-CN' ? '仅显示短缺' : 'Show Shortages Only'}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm"><RefreshCw className="h-4 w-4" />{language === 'zh-CN' ? '刷新库存' : 'Refresh'}</Button>
              <Button variant="secondary" size="sm"><Download className="h-4 w-4" />{language === 'zh-CN' ? '导出' : 'Export'}</Button>
              <Button size="sm" onClick={() => setShowPRDialog(true)}><FileText className="h-4 w-4" />{language === 'zh-CN' ? '生成所有请购单' : 'Generate All PRs'}</Button>
            </div>
          </div>

          <Card padding="sm" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '组件' : 'Component'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '需求' : 'Required'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '现有' : 'On Hand'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '在途' : 'On Order'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '短缺' : 'Shortage'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '优选供应商' : 'Preferred Supplier'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '操作' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map(mat => (
                    <tr key={mat.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? mat.componentName : mat.componentNameEn}</div>
                        <div className="text-xs text-neutral-400 font-mono">{mat.componentNo}</div>
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{mat.revision}</td>
                      <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{mat.required}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700 text-right">{mat.onHand}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700 text-right">{mat.onOrder}</td>
                      <td className="px-3 py-2 text-sm text-right">
                        {mat.shortage > 0 ? (
                          <span className="text-danger-600 font-medium">{mat.shortage}</span>
                        ) : (
                          <span className="text-success-600">0</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm">
                        {mat.supplierType === 'multi' ? (
                          <span className="text-warning-600 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            {language === 'zh-CN' ? '多供应商' : 'Multiple Vendors'}
                          </span>
                        ) : mat.supplierType === 'make' ? (
                          <span className="text-neutral-500 italic">{language === 'zh-CN' ? '(自制)' : '(Make)'}</span>
                        ) : mat.supplierType === 'none' ? (
                          <span className="text-neutral-400">—</span>
                        ) : (
                          <span className="text-neutral-700">{mat.preferredSupplier}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {mat.shortage === 0 ? (
                          <span className="inline-flex items-center gap-1 text-success-600 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            {language === 'zh-CN' ? '充足' : 'Available'}
                          </span>
                        ) : mat.supplierType === 'make' ? (
                          <Button variant="secondary" size="sm"><Wrench className="h-3 w-3" />{language === 'zh-CN' ? '创建工单' : 'Create WO'}</Button>
                        ) : mat.supplierType === 'multi' ? (
                          <Button variant="secondary" size="sm"><AlertTriangle className="h-3 w-3" />{language === 'zh-CN' ? '解决' : 'Resolve'}</Button>
                        ) : (
                          <Button variant="secondary" size="sm"><FileText className="h-3 w-3" />{language === 'zh-CN' ? '创建请购单' : 'Create PR'}</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'shipments' && (
        <Card padding="sm" className="overflow-hidden">
          {shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-neutral-300 mb-4" />
              <p className="text-base font-medium text-neutral-700">
                {language === 'zh-CN' ? '暂无发货记录' : 'No shipments yet'}
              </p>
              <Button size="sm" className="mt-4">
                <Package className="h-4 w-4" />
                {language === 'zh-CN' ? '创建发货单' : 'Create Shipment'}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '发货单号' : 'Shipment No.'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '发货日期' : 'Ship Date'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '行数' : 'Lines'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物流跟踪' : 'Tracking'}</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(ship => (
                    <tr key={ship.shipmentNo} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer">
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-primary-600 font-mono">{ship.shipmentNo}</span>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status="approved" locale={language} />
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{ship.shipDate}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{ship.lines}</td>
                      <td className="px-3 py-2 text-sm text-neutral-500 font-mono">{ship.tracking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'procurement' && (
        <Card padding="sm" className="overflow-hidden">
          {procurementTrail.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-neutral-300 mb-4" />
              <p className="text-base font-medium text-neutral-700">
                {language === 'zh-CN' ? '暂无采购关联' : 'No procurement links'}
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setActiveTab('materials')}>
                {language === 'zh-CN' ? '查看物料需求' : 'View Material Requirements'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '单号' : 'Document'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '类型' : 'Type'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '金额' : 'Amount'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '创建日期' : 'Created'}</th>
                  </tr>
                </thead>
                <tbody>
                  {procurementTrail.map((doc, i) => (
                    <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer">
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-primary-600 font-mono">{doc.docNo}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${doc.type === 'PR' ? 'bg-primary-100 text-primary-600' : 'bg-success-100 text-success-600'}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={(doc.status === 'sent' ? 'approved' : doc.status) as DocumentStatus} locale={language} />
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{doc.supplier}</td>
                      <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">¥{doc.amount.toLocaleString()}</td>
                      <td className="px-3 py-2 text-sm text-neutral-500">{doc.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <Modal
        open={showPRDialog}
        onClose={() => setShowPRDialog(false)}
        title={language === 'zh-CN' ? '生成采购请购单' : 'Generate Purchase Requisitions'}
      >
        <div className="space-y-4">
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="text-sm text-neutral-600">
              <span className="font-medium">{language === 'zh-CN' ? '来源' : 'Source'}:</span> Sales Order {soData.soNo}
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              <span className="font-medium">{language === 'zh-CN' ? '已选行数' : 'Lines Selected'}:</span> {filteredMaterials.filter(m => m.shortage > 0 && m.supplierType !== 'make').length} items with shortage
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">{language === 'zh-CN' ? '请购单预览' : 'PR Preview'}</h4>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-2 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                  <th className="px-2 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '物料数' : 'Items'}</th>
                  <th className="px-2 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '总数量' : 'Total Qty'}</th>
                  <th className="px-2 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '预估金额' : 'Est. Amount'}</th>
                  <th className="px-2 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {prPreviewData.map((row, i) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="px-2 py-2 text-neutral-900">{row.supplier}</td>
                    <td className="px-2 py-2 text-neutral-700 text-right">{row.items}</td>
                    <td className="px-2 py-2 text-neutral-700 text-right">{row.totalQty}</td>
                    <td className="px-2 py-2 text-neutral-900 font-medium text-right">
                      {row.estAmount ? `¥${row.estAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-2 py-2">
                      {row.status === 'ready' ? (
                        <span className="inline-flex items-center gap-1 text-success-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {language === 'zh-CN' ? '可创建' : 'Ready'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning-600">
                          <AlertTriangle className="h-4 w-4" />
                          {language === 'zh-CN' ? '需指定供应商' : 'Requires vendor'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
              {language === 'zh-CN' ? '创建草稿请购单（需审批后才能转PO）' : 'Create draft PRs (requires approval before PO)'}
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input type="checkbox" className="rounded border-neutral-300" />
              {language === 'zh-CN' ? '立即提交请购单（跳过草稿）' : 'Submit PRs immediately (bypass draft)'}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={() => setShowPRDialog(false)}>{t('common.cancel')}</Button>
            <Button variant="secondary">
              {language === 'zh-CN' ? '创建请购单 - 跳过未分配' : 'Create PRs - Skip Unassigned'}
            </Button>
            <Button>
              {language === 'zh-CN' ? '先解决未分配' : 'Resolve Unassigned First'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
