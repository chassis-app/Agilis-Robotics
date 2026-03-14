import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs, TabPanel } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Plus, Upload, Download, CheckCircle2, AlertTriangle, ChevronRight,
  ChevronDown, ChevronUp, FileSpreadsheet, RefreshCw, X, ChevronLeft
} from 'lucide-react'
import type { DocumentStatus } from '@/types'

type ForecastStatus = 'draft' | 'accepted' | 'processed' | 'closed'

interface ForecastLine {
  id: string
  lineNo: number
  itemNo: string
  itemName: string
  itemNameEn: string
  revision: string
  forecastQty: number
  uom: string
  unitPrice: number
  confidence: 'high' | 'medium' | 'low'
  notes: string
}

interface BOMExplosionItem {
  componentNo: string
  componentName: string
  componentNameEn: string
  revision: string
  qtyPerUnit: number
  totalReq: number
  onHand: number
  onOrder: number
  net: number
}

interface BOMExpanded {
  itemNo: string
  itemName: string
  itemNameEn: string
  revision: string
  forecastQty: number
  components: BOMExplosionItem[]
}

interface ForecastData {
  forecastNo: string
  period: string
  periodKey: string
  description: string
  status: ForecastStatus
  createdBy: string
  createdAt: string
  acceptedBy: string | null
  acceptedAt: string | null
  lines: ForecastLine[]
}

const forecastByQuarter: Record<string, ForecastData> = {
  '2024-Q1': {
    forecastNo: 'FC-2024-014',
    period: '2024 Q1',
    periodKey: '2024-Q1',
    description: '一季度销售预测 - 手术机器人',
    status: 'closed',
    createdBy: '张伟',
    createdAt: '2024-09-01 10:00',
    acceptedBy: '李明',
    acceptedAt: '2024-09-05 09:00',
    lines: [
      { id: '1', lineNo: 1, itemNo: 'FG-001', itemName: '手术机器人手臂组件', itemNameEn: 'Surgical Robot Arm Assembly', revision: 'C', forecastQty: 80, uom: 'EA', unitPrice: 350000, confidence: 'high', notes: '' },
      { id: '2', lineNo: 2, itemNo: 'FG-002', itemName: '控制系统主机', itemNameEn: 'Control System Unit', revision: 'B', forecastQty: 40, uom: 'EA', unitPrice: 300000, confidence: 'high', notes: '' },
    ]
  },
  '2024-Q2': {
    forecastNo: 'FC-2024-015',
    period: '2024 Q2',
    periodKey: '2024-Q2',
    description: '二季度销售预测 - 手术机器人',
    status: 'accepted',
    createdBy: '张伟',
    createdAt: '2024-12-01 14:30',
    acceptedBy: '李明',
    acceptedAt: '2024-12-05 09:00',
    lines: [
      { id: '1', lineNo: 1, itemNo: 'FG-001', itemName: '手术机器人手臂组件', itemNameEn: 'Surgical Robot Arm Assembly', revision: 'C', forecastQty: 100, uom: 'EA', unitPrice: 350000, confidence: 'high', notes: '' },
      { id: '2', lineNo: 2, itemNo: 'FG-002', itemName: '控制系统主机', itemNameEn: 'Control System Unit', revision: 'B', forecastQty: 50, uom: 'EA', unitPrice: 300000, confidence: 'medium', notes: '' },
      { id: '3', lineNo: 3, itemNo: 'FG-003', itemName: '末端执行器套件', itemNameEn: 'End Effector Kit', revision: 'A', forecastQty: 25, uom: 'SET', unitPrice: 50000, confidence: 'low', notes: '新客户推广' },
    ]
  },
  '2024-Q3': {
    forecastNo: 'FC-2024-016',
    period: '2024 Q3',
    periodKey: '2024-Q3',
    description: '三季度销售预测 - 手术机器人',
    status: 'draft',
    createdBy: '张伟',
    createdAt: '2025-03-01 09:00',
    acceptedBy: null,
    acceptedAt: null,
    lines: [
      { id: '1', lineNo: 1, itemNo: 'FG-001', itemName: '手术机器人手臂组件', itemNameEn: 'Surgical Robot Arm Assembly', revision: 'C', forecastQty: 120, uom: 'EA', unitPrice: 350000, confidence: 'medium', notes: '' },
      { id: '2', lineNo: 2, itemNo: 'FG-002', itemName: '控制系统主机', itemNameEn: 'Control System Unit', revision: 'B', forecastQty: 60, uom: 'EA', unitPrice: 300000, confidence: 'medium', notes: '' },
      { id: '3', lineNo: 3, itemNo: 'FG-003', itemName: '末端执行器套件', itemNameEn: 'End Effector Kit', revision: 'A', forecastQty: 40, uom: 'SET', unitPrice: 50000, confidence: 'high', notes: '' },
      { id: '4', lineNo: 4, itemNo: 'FG-004', itemName: '高清摄像头模块', itemNameEn: 'HD Camera Module', revision: 'A', forecastQty: 30, uom: 'EA', unitPrice: 80000, confidence: 'low', notes: '新品推广' },
    ]
  },
  '2024-Q4': {
    forecastNo: 'FC-2024-017',
    period: '2024 Q4',
    periodKey: '2024-Q4',
    description: '四季度销售预测 - 手术机器人',
    status: 'draft',
    createdBy: '张伟',
    createdAt: '2025-03-10 11:00',
    acceptedBy: null,
    acceptedAt: null,
    lines: []
  },
}

const quarterOptions = [
  { value: '2024-Q1', label: '2024 Q1' },
  { value: '2024-Q2', label: '2024 Q2' },
  { value: '2024-Q3', label: '2024 Q3' },
  { value: '2024-Q4', label: '2024 Q4' },
]

const forecastData = forecastByQuarter['2024-Q2']

const bomExplosion: BOMExpanded[] = [
  {
    itemNo: 'FG-001', itemName: '手术机器人手臂组件', itemNameEn: 'Surgical Robot Arm Assembly', revision: 'C', forecastQty: 100,
    components: [
      { componentNo: 'CMP-001', componentName: '钛合金轴', componentNameEn: 'Titanium Alloy Shaft', revision: 'B', qtyPerUnit: 3, totalReq: 300, onHand: 150, onOrder: 50, net: 100 },
      { componentNo: 'CMP-002', componentName: '电机模组', componentNameEn: 'Motor Module', revision: 'D', qtyPerUnit: 1, totalReq: 100, onHand: 80, onOrder: 0, net: 20 },
      { componentNo: 'CMP-003', componentName: '传感器B型', componentNameEn: 'Sensor Type-B', revision: 'A', qtyPerUnit: 2, totalReq: 200, onHand: 200, onOrder: 0, net: 0 },
      { componentNo: 'CMP-004', componentName: '外壳C型', componentNameEn: 'Housing Type-C', revision: 'A', qtyPerUnit: 1, totalReq: 100, onHand: 30, onOrder: 0, net: 70 },
    ]
  },
  {
    itemNo: 'FG-002', itemName: '控制系统主机', itemNameEn: 'Control System Unit', revision: 'B', forecastQty: 50,
    components: [
      { componentNo: 'CMP-005', componentName: '主控芯片', componentNameEn: 'Main Controller Chip', revision: 'A', qtyPerUnit: 2, totalReq: 100, onHand: 60, onOrder: 20, net: 20 },
      { componentNo: 'CMP-006', componentName: '电源模块', componentNameEn: 'Power Module', revision: 'B', qtyPerUnit: 1, totalReq: 50, onHand: 40, onOrder: 0, net: 10 },
    ]
  },
]

const prPreviewData = [
  { supplier: 'Acme Parts', items: 5, totalQty: 850, estAmount: 42500, status: 'ready' },
  { supplier: 'PrecisionMfg', items: 3, totalQty: 200, estAmount: 18000, status: 'ready' },
  { supplier: 'SensorCo', items: 2, totalQty: 300, estAmount: 12000, status: 'ready' },
  { supplier: '⚠ Multi-Supplier', items: 4, totalQty: 115, estAmount: null, status: 'review' },
]

const procurementStatus = [
  { prNo: 'PR-0456', supplier: 'Acme Parts', status: 'approved', poNo: 'PO-0234', poStatus: 'sent', expectedDate: '2024-04-15' },
  { prNo: 'PR-0457', supplier: 'PrecisionMfg', status: 'in_approval', poNo: null, poStatus: null, expectedDate: null },
  { prNo: 'PR-0458', supplier: 'SensorCo', status: 'draft', poNo: null, poStatus: null, expectedDate: null },
]

const statusMap: Record<ForecastStatus, DocumentStatus> = {
  draft: 'draft',
  accepted: 'approved',
  processed: 'approved',
  closed: 'approved',
}

export default function SalesPlanning() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [activeTab, setActiveTab] = useState('lines')
  const [showPRDialog, setShowPRDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [expandedBOM, setExpandedBOM] = useState<string[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState('2024-Q2')
  
  const forecastData = forecastByQuarter[selectedQuarter]
  const currentIndex = quarterOptions.findIndex(q => q.value === selectedQuarter)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < quarterOptions.length - 1

  const tabs = [
    { id: 'lines', label: language === 'zh-CN' ? '预测明细' : 'Forecast Lines' },
    { id: 'bom', label: language === 'zh-CN' ? 'BOM展开预览' : 'BOM Explosion' },
    { id: 'procurement', label: language === 'zh-CN' ? '采购状态' : 'Procurement Status' },
  ]

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)

  const confidenceBadge = (level: 'high' | 'medium' | 'low') => {
    const config = {
      high: { label: language === 'zh-CN' ? '高' : 'High', className: 'bg-success-100 text-success-600' },
      medium: { label: language === 'zh-CN' ? '中' : 'Medium', className: 'bg-warning-100 text-warning-600' },
      low: { label: language === 'zh-CN' ? '低' : 'Low', className: 'bg-neutral-100 text-neutral-600' },
    }
    const c = config[level]
    return <span className={`px-2 py-0.5 text-xs font-medium rounded ${c.className}`}>{c.label}</span>
  }

  const toggleBOMExpand = (itemNo: string) => {
    setExpandedBOM(prev => 
      prev.includes(itemNo) ? prev.filter(x => x !== itemNo) : [...prev, itemNo]
    )
  }

  const totalComponents = bomExplosion.reduce((sum, item) => sum + item.components.length, 0)
  const totalParts = bomExplosion.reduce((sum, item) => sum + item.components.reduce((s, c) => s + c.totalReq, 0), 0)
  const totalOnHand = bomExplosion.reduce((sum, item) => sum + item.components.reduce((s, c) => s + c.onHand, 0), 0)
  const totalOnOrder = bomExplosion.reduce((sum, item) => sum + item.components.reduce((s, c) => s + c.onOrder, 0), 0)
  const totalNet = bomExplosion.reduce((sum, item) => sum + item.components.reduce((s, c) => s + c.net, 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{forecastData.forecastNo}</h1>
            <StatusBadge status={statusMap[forecastData.status]} locale={language} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => hasPrev && setSelectedQuarter(quarterOptions[currentIndex - 1].value)}
                disabled={!hasPrev}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 text-neutral-500" />
              </button>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="h-8 px-3 pr-8 rounded-md border border-neutral-300 text-sm font-medium text-neutral-900 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {quarterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => hasNext && setSelectedQuarter(quarterOptions[currentIndex + 1].value)}
                disabled={!hasNext}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <span className="text-sm text-neutral-500">{language === 'zh-CN' ? forecastData.description : `${forecastData.period} Sales Forecast - Surgical Robots`}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {forecastData.status === 'draft' && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setShowImportDialog(true)}>
                <Upload className="h-4 w-4" />
                {language === 'zh-CN' ? '导入Excel' : 'Import Excel'}
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                {language === 'zh-CN' ? '导出Excel' : 'Export Excel'}
              </Button>
              <Button size="sm">
                <CheckCircle2 className="h-4 w-4" />
                {language === 'zh-CN' ? '接受预测' : 'Accept Forecast'}
              </Button>
            </>
          )}
          {forecastData.status === 'accepted' && (
            <>
              <Button size="sm" onClick={() => setShowPRDialog(true)}>
                <FileSpreadsheet className="h-4 w-4" />
                {language === 'zh-CN' ? '生成请购单' : 'Generate PRs'}
              </Button>
              <Button variant="secondary" size="sm">
                {language === 'zh-CN' ? '查看PR' : 'View PRs'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          {forecastData.status === 'processed' && (
            <>
              <Button variant="secondary" size="sm">
                {language === 'zh-CN' ? '查看PR' : 'View PRs'}
              </Button>
              <Button variant="secondary" size="sm">
                {language === 'zh-CN' ? '查看PO' : 'View POs'}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '预测单号' : 'Forecast No.'}</label>
            <p className="text-sm font-mono font-medium text-neutral-900">{forecastData.forecastNo}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '预测期间' : 'Period'}</label>
            <p className="text-sm text-neutral-900">{forecastData.period}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '创建人' : 'Created By'}</label>
            <p className="text-sm text-neutral-900">{forecastData.createdBy}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '创建时间' : 'Created At'}</label>
            <p className="text-sm text-neutral-900">{forecastData.createdAt}</p>
          </div>
          {forecastData.acceptedBy && (
            <>
              <div>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '接受人' : 'Accepted By'}</label>
                <p className="text-sm text-neutral-900">{forecastData.acceptedBy}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '接受时间' : 'Accepted At'}</label>
                <p className="text-sm text-neutral-900">{forecastData.acceptedAt}</p>
              </div>
            </>
          )}
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'lines' && (
        <Card padding="sm" className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '预测明细' : 'Forecast Lines'}</h3>
            {forecastData.status === 'draft' && (
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4" />
                {language === 'zh-CN' ? '添加行' : 'Add Line'}
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">#</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料' : 'Item'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '预测数量' : 'Forecast Qty'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '单位' : 'UOM'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '单价' : 'Unit Price'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '行金额' : 'Line Total'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '置信度' : 'Confidence'}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '备注' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.lines.map(line => (
                  <tr key={line.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.lineNo}</td>
                    <td className="px-3 py-2">
                      <div className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? line.itemName : line.itemNameEn}</div>
                      <div className="text-xs text-neutral-400 font-mono">{line.itemNo}</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{line.revision}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{line.forecastQty}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.uom}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatAmount(line.unitPrice)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(line.forecastQty * line.unitPrice)}</td>
                    <td className="px-3 py-2">{confidenceBadge(line.confidence)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-primary-50 rounded-lg px-4 py-3">
              <div className="text-sm text-primary-700">
                <span className="font-medium">{language === 'zh-CN' ? '来源' : 'Source'}:</span> Forecast {forecastData.forecastNo} ({language === 'zh-CN' ? '已接受' : 'Accepted'})
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4" />
              {language === 'zh-CN' ? '重新计算' : 'Recalculate'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center py-4">
              <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '成品总数' : 'Finished Goods'}</p>
              <p className="text-2xl font-semibold text-neutral-900">{bomExplosion.length}</p>
            </Card>
            <Card className="text-center py-4">
              <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '组件种类' : 'Components'}</p>
              <p className="text-2xl font-semibold text-neutral-900">{totalComponents}</p>
            </Card>
            <Card className="text-center py-4">
              <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '总需求数' : 'Total Required'}</p>
              <p className="text-2xl font-semibold text-neutral-900">{totalParts.toLocaleString()}</p>
            </Card>
            <Card className="text-center py-4">
              <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '净需求' : 'Net Requirement'}</p>
              <p className="text-2xl font-semibold text-danger-600">{totalNet.toLocaleString()}</p>
            </Card>
          </div>

          <Card padding="sm" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 w-8"></th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '成品' : 'Finished Good'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Rev'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '预测数量' : 'Forecast Qty'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '组件数' : 'Components'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '总需求' : 'Total Req.'}</th>
                  </tr>
                </thead>
                <tbody>
                  {bomExplosion.map(item => {
                    const isExpanded = expandedBOM.includes(item.itemNo)
                    const itemTotalReq = item.components.reduce((s, c) => s + c.totalReq, 0)
                    return (
                      <>
                        <tr 
                          key={item.itemNo} 
                          className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => toggleBOMExpand(item.itemNo)}
                        >
                          <td className="px-3 py-2">
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? item.itemName : item.itemNameEn}</div>
                            <div className="text-xs text-neutral-400 font-mono">{item.itemNo}</div>
                          </td>
                          <td className="px-3 py-2 text-sm text-neutral-700">{item.revision}</td>
                          <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{item.forecastQty}</td>
                          <td className="px-3 py-2 text-sm text-neutral-700 text-right">{item.components.length}</td>
                          <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{itemTotalReq.toLocaleString()} parts</td>
                        </tr>
                        {isExpanded && item.components.map(comp => (
                          <tr key={`${item.itemNo}-${comp.componentNo}`} className="border-b border-neutral-50 bg-neutral-50">
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2 pl-8">
                              <div className="text-sm text-neutral-700">{language === 'zh-CN' ? comp.componentName : comp.componentNameEn}</div>
                              <div className="text-xs text-neutral-400 font-mono">{comp.componentNo}</div>
                            </td>
                            <td className="px-3 py-2 text-sm text-neutral-500">{comp.revision}</td>
                            <td className="px-3 py-2 text-sm text-neutral-500 text-right">{comp.qtyPerUnit}/unit</td>
                            <td className="px-3 py-2 text-sm text-neutral-700 text-right">{comp.totalReq}</td>
                            <td className="px-3 py-2 text-sm text-right">
                              <span className="text-neutral-500">On Hand: {comp.onHand}</span>
                              <span className="mx-1 text-neutral-300">|</span>
                              <span className="text-neutral-500">On Order: {comp.onOrder}</span>
                              <span className="mx-1 text-neutral-300">|</span>
                              <span className={comp.net > 0 ? 'text-danger-600 font-medium' : 'text-success-600'}>Net: {comp.net}</span>
                            </td>
                          </tr>
                        ))}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'procurement' && (
        <Card padding="sm" className="overflow-hidden">
          {procurementStatus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileSpreadsheet className="h-12 w-12 text-neutral-300 mb-4" />
              <p className="text-base font-medium text-neutral-700">
                {language === 'zh-CN' ? '暂无采购记录' : 'No procurement records'}
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowPRDialog(true)}>
                {language === 'zh-CN' ? '生成请购单' : 'Generate PRs'}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '请购单号' : 'PR No.'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'PR状态' : 'PR Status'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '采购单号' : 'PO No.'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'PO状态' : 'PO Status'}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '预计到货' : 'Expected Date'}</th>
                  </tr>
                </thead>
                <tbody>
                  {procurementStatus.map((row, i) => (
                    <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-primary-600 font-mono cursor-pointer">{row.prNo}</span>
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{row.supplier}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={row.status as DocumentStatus} locale={language} />
                      </td>
                      <td className="px-3 py-2">
                        {row.poNo ? (
                          <span className="text-sm font-medium text-primary-600 font-mono cursor-pointer">{row.poNo}</span>
                        ) : (
                          <span className="text-sm text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {row.poStatus ? (
                          <StatusBadge status="approved" locale={language} />
                        ) : (
                          <span className="text-sm text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-500">{row.expectedDate || '-'}</td>
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
              <span className="font-medium">{language === 'zh-CN' ? '来源' : 'Source'}:</span> Forecast {forecastData.forecastNo}
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              <span className="font-medium">{language === 'zh-CN' ? '期间' : 'Period'}:</span> {forecastData.period}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">{language === 'zh-CN' ? '总组件需求' : 'Total Components Required'}:</span>
              <span className="font-medium text-neutral-900">{totalParts.toLocaleString()} parts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">{language === 'zh-CN' ? '现有库存' : 'Already Available (On Hand)'}:</span>
              <span className="font-medium text-neutral-900">{totalOnHand.toLocaleString()} parts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">{language === 'zh-CN' ? '在途数量' : 'On Order (Open POs)'}:</span>
              <span className="font-medium text-neutral-900">{totalOnOrder.toLocaleString()} parts</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-neutral-200">
              <span className="font-medium text-neutral-700">{language === 'zh-CN' ? '净需求' : 'Net Requirements'}:</span>
              <span className="font-semibold text-danger-600">{totalNet.toLocaleString()} parts</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">{language === 'zh-CN' ? '请购单分组预览' : 'PR Grouping Preview'}</h4>
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
                          {language === 'zh-CN' ? '就绪' : 'Ready'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning-600">
                          <AlertTriangle className="h-4 w-4" />
                          {language === 'zh-CN' ? '需人工审核' : 'Manual Review'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={() => setShowPRDialog(false)}>{t('common.cancel')}</Button>
            <Button variant="secondary">
              {language === 'zh-CN' ? '创建PR（跳过未解决）' : 'Create PRs (Skip Unresolved)'}
            </Button>
            <Button>
              {language === 'zh-CN' ? '解决多供应商' : 'Resolve Multi-Supplier'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        title={language === 'zh-CN' ? '导入预测Excel' : 'Import Forecast from Excel'}
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-sm text-neutral-600">
              {language === 'zh-CN' ? '拖拽文件到此处，或点击选择文件' : 'Drag and drop file here, or click to select'}
            </p>
            <input type="file" className="hidden" accept=".xlsx,.xls" />
            <Button variant="secondary" size="sm" className="mt-4">
              {language === 'zh-CN' ? '选择文件' : 'Select File'}
            </Button>
          </div>

          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">{language === 'zh-CN' ? '模板结构' : 'Template Structure'}</h4>
            <div className="text-xs text-neutral-600 space-y-1">
              <p><span className="font-medium">Item No.</span> - {language === 'zh-CN' ? '物料编号（必须存在于主数据）' : 'Item number (must exist in master)'}</p>
              <p><span className="font-medium">Revision</span> - {language === 'zh-CN' ? '版本（可选，默认当前版本）' : 'Revision (optional, defaults to current)'}</p>
              <p><span className="font-medium">Forecast Qty</span> - {language === 'zh-CN' ? '数量' : 'Quantity'}</p>
              <p><span className="font-medium">Unit Price</span> - {language === 'zh-CN' ? '单价（可选）' : 'Unit Price (optional)'}</p>
              <p><span className="font-medium">Confidence</span> - {language === 'zh-CN' ? '置信度（High/Medium/Low）' : 'Confidence (High/Medium/Low)'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={() => setShowImportDialog(false)}>{t('common.cancel')}</Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" />
              {language === 'zh-CN' ? '下载模板' : 'Download Template'}
            </Button>
            <Button disabled>
              {language === 'zh-CN' ? '导入' : 'Import'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
