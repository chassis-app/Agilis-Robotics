import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { FileBarChart, Package, Factory, ShieldCheck, Truck, Clock } from 'lucide-react'
import type { ReactNode } from 'react'

interface ReportCard {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: ReactNode
  iconBg: string
}

const reports: ReportCard[] = [
  {
    id: 'procurement-summary',
    title: '采购汇总报表',
    titleEn: 'Procurement Summary',
    description: '按供应商、品类汇总的采购金额与数量分析',
    descriptionEn: 'Purchase amount and quantity analysis by supplier and category',
    icon: <FileBarChart className="h-5 w-5" />,
    iconBg: 'bg-primary-50 text-primary-600',
  },
  {
    id: 'inventory-aging',
    title: '库存账龄分析',
    titleEn: 'Inventory Aging',
    description: '按仓库、物料分类的库存账龄分布和滞销预警',
    descriptionEn: 'Inventory aging distribution and slow-moving alerts by warehouse',
    icon: <Package className="h-5 w-5" />,
    iconBg: 'bg-warning-50 text-warning-600',
  },
  {
    id: 'production-efficiency',
    title: '生产效率报表',
    titleEn: 'Production Efficiency',
    description: '各工单完工率、良品率及工序瓶颈分析',
    descriptionEn: 'Work order completion rate, yield rate and bottleneck analysis',
    icon: <Factory className="h-5 w-5" />,
    iconBg: 'bg-success-50 text-success-600',
  },
  {
    id: 'quality-metrics',
    title: '质量指标报表',
    titleEn: 'Quality Metrics',
    description: '来料检合格率、过程不良率及CAPA趋势统计',
    descriptionEn: 'Incoming inspection pass rate, process defect rate and CAPA trends',
    icon: <ShieldCheck className="h-5 w-5" />,
    iconBg: 'bg-info-50 text-info-600',
  },
  {
    id: 'supplier-performance',
    title: '供应商绩效',
    titleEn: 'Supplier Performance',
    description: '供应商交期达成率、质量评分及综合排名',
    descriptionEn: 'Supplier on-time delivery, quality score and overall ranking',
    icon: <Truck className="h-5 w-5" />,
    iconBg: 'bg-danger-50 text-danger-600',
  },
  {
    id: 'delivery-performance',
    title: '交付绩效报表',
    titleEn: 'Delivery Performance',
    description: '客户订单按时交付率及延迟原因分析',
    descriptionEn: 'Customer order on-time delivery rate and delay analysis',
    icon: <Clock className="h-5 w-5" />,
    iconBg: 'bg-neutral-100 text-neutral-600',
  },
]

export default function ReportsOperational() {
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '运营报表' : 'Operational Reports'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map(report => (
          <Card key={report.id} className="flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${report.iconBg}`}>
                {report.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {language === 'zh-CN' ? report.title : report.titleEn}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {language === 'zh-CN' ? report.description : report.descriptionEn}
                </p>
              </div>
            </div>
            <div className="mt-auto pt-2">
              <Button variant="secondary" size="sm" className="w-full">
                <FileBarChart className="h-4 w-4" />
                {language === 'zh-CN' ? '生成报表' : 'Generate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
