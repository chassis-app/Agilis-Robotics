import type { KPIData, AuditEntry } from '@/types';

// ---------------------------------------------------------------------------
// KPI cards
// ---------------------------------------------------------------------------
export const kpiData: KPIData[] = [
  {
    label: '待处理采购申请',
    labelEn: 'Pending PRs',
    value: 12,
    change: '+3',
    changeType: 'up',
    icon: 'FileText',
  },
  {
    label: '本月采购额',
    labelEn: 'Monthly Procurement',
    value: '¥2,450,000',
    change: '+12.5%',
    changeType: 'up',
    icon: 'TrendingUp',
  },
  {
    label: '库存周转率',
    labelEn: 'Inventory Turnover',
    value: 4.2,
    change: '-0.3',
    changeType: 'down',
    icon: 'Package',
  },
  {
    label: '质量合格率',
    labelEn: 'Quality Pass Rate',
    value: '98.7%',
    change: '+0.5%',
    changeType: 'up',
    icon: 'ShieldCheck',
  },
];

// ---------------------------------------------------------------------------
// Pending approval items for the dashboard widget
// ---------------------------------------------------------------------------
export interface PendingApproval {
  id: string;
  docType: string;
  docNo: string;
  title: string;
  requester: string;
  amount: number;
  currency: string;
  submittedAt: string;
  priority: 'normal' | 'urgent';
}

export const pendingApprovals: PendingApproval[] = [
  {
    id: 'pa1',
    docType: 'PR',
    docNo: 'PR-2024-0004',
    title: '伺服电机批量采购',
    requester: '刘洋',
    amount: 84000,
    currency: 'CNY',
    submittedAt: '2024-10-22T09:30:00Z',
    priority: 'normal',
  },
  {
    id: 'pa2',
    docType: 'PR',
    docNo: 'PR-2024-0005',
    title: '控制板及固件芯片补货',
    requester: '王芳',
    amount: 47250,
    currency: 'CNY',
    submittedAt: '2024-10-22T10:00:00Z',
    priority: 'urgent',
  },
  {
    id: 'pa3',
    docType: 'PO',
    docNo: 'PO-2024-0006',
    title: '轴承紧急补货',
    requester: '李明',
    amount: 13000,
    currency: 'CNY',
    submittedAt: '2024-11-10T08:00:00Z',
    priority: 'urgent',
  },
  {
    id: 'pa4',
    docType: 'WO',
    docNo: 'WO-2024-0005',
    title: '校准夹具生产工单',
    requester: '刘洋',
    amount: 0,
    currency: 'CNY',
    submittedAt: '2024-11-18T08:00:00Z',
    priority: 'normal',
  },
  {
    id: 'pa5',
    docType: 'NC',
    docNo: 'NC-2024-0002',
    title: '不锈钢外壳加工不合格',
    requester: '陈刚',
    amount: 0,
    currency: 'CNY',
    submittedAt: '2024-10-29T14:00:00Z',
    priority: 'normal',
  },
];

// ---------------------------------------------------------------------------
// Recent activity log
// ---------------------------------------------------------------------------
export const recentActivity: AuditEntry[] = [
  {
    id: 'act1',
    entityType: 'PurchaseRequisition',
    entityId: 'pr3',
    action: 'submit',
    field: 'status',
    oldValue: 'draft',
    newValue: 'submitted',
    userId: 'u3',
    userName: '王芳',
    timestamp: '2024-11-12T14:00:00Z',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'act2',
    entityType: 'WorkOrder',
    entityId: 'wo1',
    action: 'update',
    field: 'completedQty',
    oldValue: '0',
    newValue: '1',
    userId: 'u6',
    userName: '刘洋',
    timestamp: '2024-11-11T16:30:00Z',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'act3',
    entityType: 'GoodsReceipt',
    entityId: 'grn3',
    action: 'create',
    field: '',
    oldValue: '',
    newValue: '',
    userId: 'u5',
    userName: '赵静',
    timestamp: '2024-11-20T10:15:00Z',
    ipAddress: '192.168.1.103',
  },
  {
    id: 'act4',
    entityType: 'Inspection',
    entityId: 'insp3',
    action: 'approve',
    field: 'result',
    oldValue: 'pending',
    newValue: 'conditional',
    userId: 'u4',
    userName: '陈刚',
    timestamp: '2024-11-21T11:00:00Z',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'act5',
    entityType: 'NCReport',
    entityId: 'nc3',
    action: 'create',
    field: '',
    oldValue: '',
    newValue: '',
    userId: 'u4',
    userName: '陈刚',
    timestamp: '2024-11-19T10:30:00Z',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'act6',
    entityType: 'PurchaseOrder',
    entityId: 'po6',
    action: 'submit',
    field: 'status',
    oldValue: 'draft',
    newValue: 'in_approval',
    userId: 'u2',
    userName: '李明',
    timestamp: '2024-11-10T09:00:00Z',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'act7',
    entityType: 'MaterialIssueNotice',
    entityId: 'min1',
    action: 'approve',
    field: 'status',
    oldValue: 'submitted',
    newValue: 'approved',
    userId: 'u5',
    userName: '赵静',
    timestamp: '2024-10-02T08:30:00Z',
    ipAddress: '192.168.1.103',
  },
  {
    id: 'act8',
    entityType: 'SalesOrder',
    entityId: 'so1',
    action: 'approve',
    field: 'status',
    oldValue: 'submitted',
    newValue: 'approved',
    userId: 'u7',
    userName: '黄强',
    timestamp: '2024-10-25T15:00:00Z',
    ipAddress: '192.168.1.107',
  },
];
