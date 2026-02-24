// ---------------------------------------------------------------------------
// Domain type aliases
// ---------------------------------------------------------------------------

export type DocumentStatus =
  | 'draft'
  | 'submitted'
  | 'in_approval'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type Priority = 'normal' | 'urgent';

export type SourcingType = 'purchase' | 'make' | 'subcontract';

export type ItemLifecycle = 'rd' | 'pilot' | 'mass_production';

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
}

export interface Supplier {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  status: string;
}

export interface Item {
  id: string;
  itemNo: string;
  name: string;
  nameEn: string;
  revision: string;
  category: string;
  uom: string;
  sourcingType: SourcingType;
  lifecycle: ItemLifecycle;
  defaultSupplierId: string;
  leadTimeDays: number;
  moq: number;
  safetyStock: number;
  unitPrice: number;
  currency: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
}

export interface ItemRevision {
  id: string;
  itemId: string;
  revision: string;
  status: DocumentStatus;
  effectiveDate: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Procurement
// ---------------------------------------------------------------------------

export interface PRLine {
  id: string;
  lineNo: number;
  itemId: string;
  itemNo: string;
  itemName: string;
  itemNameEn: string;
  revision: string;
  quantity: number;
  uom: string;
  warehouseId: string;
  warehouseName: string;
  requiredDate: string;
  estimatedUnitPrice: number;
  currency: string;
  notes: string;
  stockStatus: 'sufficient' | 'low' | 'out';
}

export interface PurchaseRequisition {
  id: string;
  prNo: string;
  status: DocumentStatus;
  requesterId: string;
  requesterName: string;
  department: string;
  priority: Priority;
  requiredDate: string;
  notes: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  lines: PRLine[];
}

export interface POLine {
  id: string;
  lineNo: number;
  itemId: string;
  itemNo: string;
  itemName: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  amount: number;
  currency: string;
  deliveryDate: string;
  receivedQty: number;
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  status: DocumentStatus;
  supplierId: string;
  supplierName: string;
  buyerId: string;
  buyerName: string;
  prId: string;
  priority: Priority;
  paymentTerms: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
  notes: string;
  createdAt: string;
  lines: POLine[];
}

// ---------------------------------------------------------------------------
// Manufacturing
// ---------------------------------------------------------------------------

export interface WOOperation {
  id: string;
  operationNo: number;
  name: string;
  nameEn: string;
  status: 'pending' | 'in_progress' | 'completed';
  workCenter: string;
  plannedHours: number;
  actualHours: number;
  sequence: number;
}

export interface WorkOrder {
  id: string;
  woNo: string;
  status: DocumentStatus;
  itemId: string;
  itemName: string;
  itemNo: string;
  bomId: string;
  quantity: number;
  completedQty: number;
  priority: Priority;
  startDate: string;
  dueDate: string;
  operations: WOOperation[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Engineering — BOM
// ---------------------------------------------------------------------------

export interface BOMSubstitute {
  id: string;
  itemId: string;
  itemNo: string;
  itemName: string;
  priority: number;
}

export interface BOMNode {
  id: string;
  itemId: string;
  itemNo: string;
  itemName: string;
  itemNameEn: string;
  revision: string;
  quantity: number;
  scrapRate: number;
  sourcingType: SourcingType;
  isModule: boolean;
  isCritical: boolean;
  moduleCode: string;
  supplierId: string;
  supplierName: string;
  leadTimeDays: number;
  moq: number;
  children: BOMNode[];
  substitutes: BOMSubstitute[];
}

// ---------------------------------------------------------------------------
// Quality
// ---------------------------------------------------------------------------

export interface Inspection {
  id: string;
  inspNo: string;
  status: DocumentStatus;
  type: 'incoming' | 'in_process' | 'final';
  itemId: string;
  itemName: string;
  lotNo: string;
  quantity: number;
  grnId: string;
  woId: string;
  inspectedBy: string;
  inspectedDate: string;
  result: 'pending' | 'pass' | 'fail' | 'conditional';
  notes: string;
}

export interface NCReport {
  id: string;
  ncNo: string;
  status: DocumentStatus;
  type: 'material' | 'process' | 'product';
  severity: 'minor' | 'major' | 'critical';
  itemName: string;
  lotNo: string;
  description: string;
  disposition: string;
  capaId: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export interface Lot {
  id: string;
  lotNo: string;
  itemId: string;
  itemName: string;
  itemNo: string;
  quantity: number;
  warehouseId: string;
  warehouseName: string;
  location: string;
  status: 'available' | 'reserved' | 'quarantine' | 'consumed';
  receivedDate: string;
  expiryDate: string;
  grnId: string;
  supplierId: string;
}

export interface StockSummary {
  itemId: string;
  itemNo: string;
  itemName: string;
  itemNameEn: string;
  totalQty: number;
  availableQty: number;
  reservedQty: number;
  uom: string;
  lots: Lot[];
  safetyStock: number;
  reorderPoint: number;
}

// ---------------------------------------------------------------------------
// Goods Receipt
// ---------------------------------------------------------------------------

export interface GRNLine {
  id: string;
  lineNo: number;
  itemId: string;
  itemNo: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  uom: string;
  lotNo: string;
}

export interface GoodsReceipt {
  id: string;
  grnNo: string;
  status: DocumentStatus;
  poId: string;
  poNo: string;
  supplierId: string;
  supplierName: string;
  receivedDate: string;
  warehouseId: string;
  warehouseName: string;
  notes: string;
  lines: GRNLine[];
}

// ---------------------------------------------------------------------------
// Material Issue
// ---------------------------------------------------------------------------

export interface MINLine {
  id: string;
  lineNo: number;
  itemId: string;
  itemNo: string;
  itemName: string;
  requestedQty: number;
  issuedQty: number;
  uom: string;
  lotNo: string;
  warehouseId: string;
}

export interface MaterialIssueNotice {
  id: string;
  minNo: string;
  status: DocumentStatus;
  woId: string;
  woNo: string;
  requesterId: string;
  requesterName: string;
  requiredDate: string;
  notes: string;
  lines: MINLine[];
}

// ---------------------------------------------------------------------------
// Sales
// ---------------------------------------------------------------------------

export interface SOLine {
  id: string;
  lineNo: number;
  itemId: string;
  itemNo: string;
  itemName: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  amount: number;
}

export interface SalesOrder {
  id: string;
  soNo: string;
  status: DocumentStatus;
  customerId: string;
  customerName: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
  lines: SOLine[];
}

// ---------------------------------------------------------------------------
// Approval & Audit
// ---------------------------------------------------------------------------

export interface ApprovalStep {
  id: string;
  step: number;
  role: string;
  approverName: string;
  approverId: string;
  decision: 'pending' | 'approved' | 'rejected' | null;
  comment: string | null;
  timestamp: string | null;
  signatureHash: string | null;
  verified: boolean;
}

export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

export interface KPIData {
  label: string;
  labelEn: string;
  value: string | number;
  change: string | number;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  path: string;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  label: string;
  labelEn: string;
  items: NavItem[];
}

export interface TraceNode {
  id: string;
  type: string;
  docNo: string;
  itemName: string;
  date: string;
  status: string;
  children?: TraceNode[];
}
