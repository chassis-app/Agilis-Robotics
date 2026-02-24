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

// Tier 3 screens (simplified)
const RFQ = lazy(() => import('@/pages/procurement/RFQ'))
const GoodsReceipt = lazy(() => import('@/pages/procurement/GoodsReceipt'))
const MIRBatch = lazy(() => import('@/pages/inventory/MIRBatch'))
const StockTransfers = lazy(() => import('@/pages/inventory/StockTransfers'))
const CycleCount = lazy(() => import('@/pages/inventory/CycleCount'))
const SafetyStock = lazy(() => import('@/pages/inventory/SafetyStock'))
const SubcontractOrder = lazy(() => import('@/pages/manufacturing/SubcontractOrder'))
const ECRECO = lazy(() => import('@/pages/engineering/ECRECO'))
const Documents = lazy(() => import('@/pages/engineering/Documents'))
const Projects = lazy(() => import('@/pages/engineering/Projects'))
const ReportsOperational = lazy(() => import('@/pages/reports/ReportsOperational'))
const ReportsCompliance = lazy(() => import('@/pages/reports/ReportsCompliance'))
const APReconciliation = lazy(() => import('@/pages/finance/APReconciliation'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const ApprovalPolicies = lazy(() => import('@/pages/admin/ApprovalPolicies'))
const CustomFields = lazy(() => import('@/pages/admin/CustomFields'))
const SystemConfig = lazy(() => import('@/pages/admin/SystemConfig'))

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
          <Route path="/engineering/ecr" element={<ECRECO />} />
          <Route path="/engineering/documents" element={<Documents />} />
          <Route path="/engineering/projects" element={<Projects />} />

          {/* Quality */}
          <Route path="/quality/inspections" element={<Inspections />} />
          <Route path="/quality/nonconformance" element={<NCCapa />} />
          <Route path="/quality/traceability" element={<Traceability />} />

          {/* Sales */}
          <Route path="/sales/orders" element={<SalesOrders />} />

          {/* Finance */}
          <Route path="/finance/costing" element={<Costing />} />
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
