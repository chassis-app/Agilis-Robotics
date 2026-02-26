// ---------------------------------------------------------------------------
// Central re-export for all mock data
// ---------------------------------------------------------------------------

export { users, currentUser } from './users';
export { suppliers } from './suppliers';
export { items } from './items';
export { purchaseRequisitions, prApprovalSteps } from './purchase-requisitions';
export { purchaseOrders } from './purchase-orders';
export { workOrders } from './work-orders';
export { stockSummaries } from './inventory';
export { bomTree } from './bom';
export { inspections } from './inspections';
export { ncReports } from './quality';
export { goodsReceipts } from './goods-receipts';
export { materialIssueNotices } from './material-issues';
export { salesOrders } from './sales';
export { defaultSafetyStockAlertConfig } from './system-config';
export {
  kpiData,
  pendingApprovals,
  recentActivity,
  type PendingApproval,
} from './dashboard';
export { forwardTrace, backwardTrace } from './traceability';
