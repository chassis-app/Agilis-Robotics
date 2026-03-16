import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

// Tier 1 screens (full treatment)
const Dashboard = lazy(() => import('@/pages/home/Dashboard'))
const ApprovalInbox = lazy(() => import('@/pages/home/ApprovalInbox'))
const PRList = lazy(() => import('@/pages/procurement/PRList'))
const PRDetail = lazy(() => import('@/pages/procurement/PRDetail'))
const StockOverview = lazy(() => import('@/pages/inventory/StockOverview'))
const WorkOrderDetail = lazy(() => import('@/pages/manufacturing/WorkOrderDetail'))
const BOMDetail = lazy(() => import('@/pages/engineering/BOMDetail'))
const ItemMaster = lazy(() => import('@/pages/engineering/ItemMaster'))
const Traceability = lazy(() => import('@/pages/quality/Traceability'))
const ProductionProgress = lazy(() => import('@/pages/manufacturing/ProductionProgress'))

// Tier 2 screens (medium treatment)
const POList = lazy(() => import('@/pages/procurement/POList'))
const PODetail = lazy(() => import('@/pages/procurement/PODetail'))
const WorkOrderList = lazy(() => import('@/pages/manufacturing/WorkOrderList'))
const MaterialIssueNotice = lazy(() => import('@/pages/inventory/MaterialIssueNotice'))
const Inspections = lazy(() => import('@/pages/quality/Inspections'))
const NCCapa = lazy(() => import('@/pages/quality/NCCapa'))
const SalesOrders = lazy(() => import('@/pages/sales/SalesOrders'))
const Costing = lazy(() => import('@/pages/finance/Costing'))
const IntegrationMonitor = lazy(() => import('@/pages/finance/IntegrationMonitor'))
const PaymentRequestList = lazy(() => import('@/pages/finance/PaymentRequestList'))
const PaymentRequestCreate = lazy(() => import('@/pages/finance/PaymentRequestCreate'))
const PaymentRequestDetail = lazy(() => import('@/pages/finance/PaymentRequestDetail'))

// Tier 3 screens (simplified)
const RFQ = lazy(() => import('@/pages/procurement/RFQ'))
const GoodsReceipt = lazy(() => import('@/pages/procurement/GoodsReceipt'))
const GoodsReturn = lazy(() => import('@/pages/procurement/GoodsReturn'))
const MIRBatch = lazy(() => import('@/pages/inventory/MIRBatch'))
const StockTransfers = lazy(() => import('@/pages/inventory/StockTransfers'))
const CycleCount = lazy(() => import('@/pages/inventory/CycleCount'))
const SafetyStock = lazy(() => import('@/pages/inventory/SafetyStock'))
const SubcontractOrder = lazy(() => import('@/pages/manufacturing/SubcontractOrder'))
const ECRECO = lazy(() => import('@/pages/engineering/ECRECO'))
const BOMComparison = lazy(() => import('@/pages/engineering/BOMComparison'))
const Documents = lazy(() => import('@/pages/engineering/Documents'))
const ReportsOperational = lazy(() => import('@/pages/reports/ReportsOperational'))
const ReportsCompliance = lazy(() => import('@/pages/reports/ReportsCompliance'))
const APReconciliation = lazy(() => import('@/pages/finance/APReconciliation'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const ApprovalPolicies = lazy(() => import('@/pages/admin/ApprovalPolicies'))
const CustomFields = lazy(() => import('@/pages/admin/CustomFields'))
const SystemConfig = lazy(() => import('@/pages/admin/SystemConfig'))

// Sales (new screens for WF-15)
const SalesOrderDetail = lazy(() => import('@/pages/sales/SalesOrderDetail'))
const SalesPlanning = lazy(() => import('@/pages/sales/SalesPlanning'))
const SalesForecastList = lazy(() => import('@/pages/sales/SalesForecastList'))
const Complaints = lazy(() => import('@/pages/quality/Complaints'))
const InternalQC = lazy(() => import('@/pages/quality/InternalQC'))
const InternalQCTemplateEditor = lazy(() => import('@/pages/quality/InternalQCTemplateEditor'))

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AppShell />}>
          {/* Home */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/approvals" element={<ApprovalInbox />} />

          {/* Procurement */}
          <Route path="/procurement/purchase-requisitions" element={<PRList />} />
          <Route path="/procurement/purchase-requisitions/:id" element={<PRDetail />} />
          <Route path="/procurement/purchase-orders" element={<POList />} />
          <Route path="/procurement/purchase-orders/:id" element={<PODetail />} />
          <Route path="/procurement/rfq" element={<RFQ />} />
          <Route path="/procurement/goods-receipts" element={<GoodsReceipt />} />
          <Route path="/procurement/goods-returns" element={<GoodsReturn />} />

          {/* Inventory */}
          <Route path="/inventory/stock" element={<StockOverview />} />
          <Route path="/inventory/material-issue-notices" element={<MaterialIssueNotice />} />
          <Route path="/inventory/material-issue-requests" element={<MIRBatch />} />
          <Route path="/inventory/transfers" element={<StockTransfers />} />
          <Route path="/inventory/cycle-counts" element={<CycleCount />} />
          <Route path="/inventory/safety-stock-alerts" element={<SafetyStock />} />

          {/* Manufacturing */}
          <Route path="/manufacturing/work-orders" element={<WorkOrderList />} />
          <Route path="/manufacturing/work-orders/:id" element={<WorkOrderDetail />} />
          <Route path="/manufacturing/subcontract-orders" element={<SubcontractOrder />} />
          <Route path="/manufacturing/production-progress" element={<ProductionProgress />} />

          {/* Engineering */}
          <Route path="/engineering/items" element={<ItemMaster />} />
          <Route path="/engineering/items/:id" element={<ItemMaster />} />
          <Route path="/engineering/bom" element={<BOMDetail />} />
          <Route path="/engineering/bom/comparison" element={<BOMComparison />} />
          <Route path="/engineering/ecr" element={<ECRECO />} />
          <Route path="/engineering/documents" element={<Documents />} />

          {/* Quality */}
          <Route path="/quality/inspections" element={<Inspections />} />
          <Route path="/quality/complaints" element={<Complaints />} />
          <Route path="/quality/nonconformance" element={<NCCapa />} />
          <Route path="/quality/internal-qc" element={<InternalQC />} />
          <Route path="/quality/internal-qc/templates" element={<InternalQCTemplateEditor />} />
          <Route path="/quality/traceability" element={<Traceability />} />

          {/* Sales */}
          <Route path="/sales/orders" element={<SalesOrders />} />
          <Route path="/sales/orders/:id" element={<SalesOrderDetail />} />
          <Route path="/sales/planning" element={<SalesPlanning />} />
          <Route path="/sales/planning/:id" element={<SalesPlanning />} />
          <Route path="/sales/forecasts" element={<SalesForecastList />} />

          {/* Finance */}
          <Route path="/finance/costing" element={<Costing />} />
          <Route path="/finance/payment-requests" element={<PaymentRequestList />} />
          <Route path="/finance/payment-requests/new" element={<PaymentRequestCreate />} />
          <Route path="/finance/payment-requests/:id" element={<PaymentRequestDetail />} />
          <Route path="/finance/ap-reconciliation" element={<APReconciliation />} />
          <Route path="/finance/integration-status" element={<IntegrationMonitor />} />

          {/* Reports */}
          <Route path="/reports/operational" element={<ReportsOperational />} />
          <Route path="/reports/compliance" element={<ReportsCompliance />} />

          {/* Admin */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/approval-policies" element={<ApprovalPolicies />} />
          <Route path="/admin/custom-fields" element={<CustomFields />} />
          <Route path="/admin/system-config" element={<SystemConfig />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
