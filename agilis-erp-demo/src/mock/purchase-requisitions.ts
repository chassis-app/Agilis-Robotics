import type { PurchaseRequisition, ApprovalStep } from '@/types';

// ---------------------------------------------------------------------------
// Approval step helpers
// ---------------------------------------------------------------------------
function approvalSteps(
  status: 'submitted' | 'in_approval' | 'approved' | 'rejected',
): ApprovalStep[] {
  const step1Base: ApprovalStep = {
    id: '',
    step: 1,
    role: 'supply_chain_manager',
    approverId: 'u2',
    approverName: '李明',
    decision: null,
    comment: '',
    timestamp: '',
    signatureHash: '',
    verified: false,
  };
  const step2Base: ApprovalStep = {
    id: '',
    step: 2,
    role: 'general_manager',
    approverId: 'u7',
    approverName: '黄强',
    decision: null,
    comment: '',
    timestamp: '',
    signatureHash: '',
    verified: false,
  };

  if (status === 'submitted') {
    return [
      { ...step1Base, id: 'as-pending-1', decision: 'pending' },
      { ...step2Base, id: 'as-pending-2', decision: 'pending' },
    ];
  }
  if (status === 'in_approval') {
    return [
      { ...step1Base, id: 'as-inappr-1', decision: 'approved', comment: '同意', timestamp: '2024-10-22T09:30:00Z', signatureHash: 'a1b2c3', verified: true },
      { ...step2Base, id: 'as-inappr-2', decision: 'pending' },
    ];
  }
  if (status === 'approved') {
    return [
      { ...step1Base, id: 'as-appr-1', decision: 'approved', comment: '同意采购', timestamp: '2024-10-20T10:00:00Z', signatureHash: 'c3d4e5', verified: true },
      { ...step2Base, id: 'as-appr-2', decision: 'approved', comment: '批准', timestamp: '2024-10-21T14:30:00Z', signatureHash: 'f6g7h8', verified: true },
    ];
  }
  // rejected
  return [
    { ...step1Base, id: 'as-rej-1', decision: 'approved', comment: '同意', timestamp: '2024-11-01T09:00:00Z', signatureHash: 'r1s2t3', verified: true },
    { ...step2Base, id: 'as-rej-2', decision: 'rejected', comment: '预算不足，请修改后重新提交', timestamp: '2024-11-02T11:00:00Z', signatureHash: 'u4v5w6', verified: true },
  ];
}

// ---------------------------------------------------------------------------
// Purchase Requisitions
// ---------------------------------------------------------------------------
export const purchaseRequisitions: PurchaseRequisition[] = [
  // --- 2 Drafts ---
  {
    id: 'pr1',
    prNo: 'PR-2024-0001',
    status: 'draft',
    requesterId: 'u3',
    requesterName: '王芳',
    department: '工程部',
    priority: 'normal',
    requiredDate: '2024-12-15',
    notes: '研发新批次所需零件',
    totalAmount: 35200,
    currency: 'CNY',
    createdAt: '2024-11-15T08:30:00Z',
    updatedAt: '2024-11-15T08:30:00Z',
    lines: [
      { id: 'prl-01', lineNo: 1, itemId: 'itm02', itemNo: 'ITM-0002', itemName: '钛合金传动轴', itemNameEn: 'Titanium Alloy Shaft', revision: 'B', quantity: 60, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-15', estimatedUnitPrice: 320, currency: 'CNY', notes: '', stockStatus: 'low' },
      { id: 'prl-02', lineNo: 2, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', itemNameEn: 'Silicone End Effector Tip', revision: 'A', quantity: 200, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-15', estimatedUnitPrice: 85, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
    ],
  },
  {
    id: 'pr2',
    prNo: 'PR-2024-0002',
    status: 'draft',
    requesterId: 'u6',
    requesterName: '刘洋',
    department: '生产部',
    priority: 'urgent',
    requiredDate: '2024-12-01',
    notes: '生产线紧急补料',
    totalAmount: 15600,
    currency: 'CNY',
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
    lines: [
      { id: 'prl-03', lineNo: 1, itemId: 'itm11', itemNo: 'ITM-0011', itemName: '轴承套件', itemNameEn: 'Bearing Set', revision: 'A', quantity: 60, uom: 'SET', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-01', estimatedUnitPrice: 260, currency: 'CNY', notes: '紧急', stockStatus: 'out' },
    ],
  },
  // --- 1 Submitted ---
  {
    id: 'pr3',
    prNo: 'PR-2024-0003',
    status: 'submitted',
    requesterId: 'u3',
    requesterName: '王芳',
    department: '工程部',
    priority: 'normal',
    requiredDate: '2024-12-20',
    notes: '传感器模块补货',
    totalAmount: 63000,
    currency: 'CNY',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-12T14:00:00Z',
    lines: [
      { id: 'prl-04', lineNo: 1, itemId: 'itm08', itemNo: 'ITM-0008', itemName: '光学传感器模块', itemNameEn: 'Optical Sensor Module', revision: 'A', quantity: 15, uom: 'EA', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-20', estimatedUnitPrice: 4200, currency: 'CNY', notes: '', stockStatus: 'low' },
    ],
  },
  // --- 2 In Approval ---
  {
    id: 'pr4',
    prNo: 'PR-2024-0004',
    status: 'in_approval',
    requesterId: 'u6',
    requesterName: '刘洋',
    department: '生产部',
    priority: 'normal',
    requiredDate: '2024-12-25',
    notes: '伺服电机批量采购',
    totalAmount: 84000,
    currency: 'CNY',
    createdAt: '2024-10-20T08:00:00Z',
    updatedAt: '2024-10-22T09:30:00Z',
    lines: [
      { id: 'prl-05', lineNo: 1, itemId: 'itm03', itemNo: 'ITM-0003', itemName: '伺服电机模块', itemNameEn: 'Servo Motor Module', revision: 'A', quantity: 30, uom: 'EA', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-25', estimatedUnitPrice: 2800, currency: 'CNY', notes: '', stockStatus: 'low' },
    ],
  },
  {
    id: 'pr5',
    prNo: 'PR-2024-0005',
    status: 'in_approval',
    requesterId: 'u3',
    requesterName: '王芳',
    department: '工程部',
    priority: 'urgent',
    requiredDate: '2024-12-10',
    notes: '控制板及固件芯片补货',
    totalAmount: 47250,
    currency: 'CNY',
    createdAt: '2024-10-18T11:00:00Z',
    updatedAt: '2024-10-22T10:00:00Z',
    lines: [
      { id: 'prl-06', lineNo: 1, itemId: 'itm04', itemNo: 'ITM-0004', itemName: 'PCB控制板', itemNameEn: 'PCB Control Board', revision: 'C', quantity: 25, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-10', estimatedUnitPrice: 1500, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
      { id: 'prl-07', lineNo: 2, itemId: 'itm12', itemNo: 'ITM-0012', itemName: '固件芯片', itemNameEn: 'Firmware Chip', revision: 'D', quantity: 150, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-10', estimatedUnitPrice: 45, currency: 'CNY', notes: '', stockStatus: 'low' },
    ],
  },
  // --- 2 Approved ---
  {
    id: 'pr6',
    prNo: 'PR-2024-0006',
    status: 'approved',
    requesterId: 'u6',
    requesterName: '刘洋',
    department: '生产部',
    priority: 'normal',
    requiredDate: '2024-11-30',
    notes: '常规生产物料补货',
    totalAmount: 36900,
    currency: 'CNY',
    createdAt: '2024-10-15T08:00:00Z',
    updatedAt: '2024-10-21T14:30:00Z',
    lines: [
      { id: 'prl-08', lineNo: 1, itemId: 'itm02', itemNo: 'ITM-0002', itemName: '钛合金传动轴', itemNameEn: 'Titanium Alloy Shaft', revision: 'B', quantity: 50, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-11-30', estimatedUnitPrice: 320, currency: 'CNY', notes: '', stockStatus: 'low' },
      { id: 'prl-09', lineNo: 2, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', itemNameEn: 'Silicone End Effector Tip', revision: 'A', quantity: 100, uom: 'PC', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-11-30', estimatedUnitPrice: 85, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
      { id: 'prl-10', lineNo: 3, itemId: 'itm13', itemNo: 'ITM-0013', itemName: '电源模块', itemNameEn: 'Power Supply Unit', revision: 'A', quantity: 10, uom: 'EA', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-11-30', estimatedUnitPrice: 950, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
    ],
  },
  {
    id: 'pr7',
    prNo: 'PR-2024-0007',
    status: 'approved',
    requesterId: 'u3',
    requesterName: '王芳',
    department: '工程部',
    priority: 'normal',
    requiredDate: '2024-11-25',
    notes: '线束和保护套管采购',
    totalAmount: 10400,
    currency: 'CNY',
    createdAt: '2024-10-12T09:00:00Z',
    updatedAt: '2024-10-18T16:00:00Z',
    lines: [
      { id: 'prl-11', lineNo: 1, itemId: 'itm07', itemNo: 'ITM-0007', itemName: '线束组件', itemNameEn: 'Cable Harness Assembly', revision: 'A', quantity: 10, uom: 'SET', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-11-25', estimatedUnitPrice: 680, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
      { id: 'prl-12', lineNo: 2, itemId: 'itm14', itemNo: 'ITM-0014', itemName: '保护套管', itemNameEn: 'Protective Sleeve', revision: 'A', quantity: 200, uom: 'M', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-11-25', estimatedUnitPrice: 18, currency: 'CNY', notes: '', stockStatus: 'sufficient' },
    ],
  },
  // --- 1 Rejected ---
  {
    id: 'pr8',
    prNo: 'PR-2024-0008',
    status: 'rejected',
    requesterId: 'u6',
    requesterName: '刘洋',
    department: '生产部',
    priority: 'normal',
    requiredDate: '2024-12-30',
    notes: '光学传感器大批量采购申请',
    totalAmount: 210000,
    currency: 'CNY',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-02T11:00:00Z',
    lines: [
      { id: 'prl-13', lineNo: 1, itemId: 'itm08', itemNo: 'ITM-0008', itemName: '光学传感器模块', itemNameEn: 'Optical Sensor Module', revision: 'A', quantity: 50, uom: 'EA', warehouseId: 'wh1', warehouseName: '主仓库', requiredDate: '2024-12-30', estimatedUnitPrice: 4200, currency: 'CNY', notes: '大批量备货', stockStatus: 'sufficient' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Approval steps keyed by PR id
// ---------------------------------------------------------------------------
export const prApprovalSteps: Record<string, ApprovalStep[]> = {
  pr3: approvalSteps('submitted').map((s, i) => ({ ...s, id: `as-pr3-${i + 1}` })),
  pr4: approvalSteps('in_approval').map((s, i) => ({ ...s, id: `as-pr4-${i + 1}` })),
  pr5: approvalSteps('in_approval').map((s, i) => ({ ...s, id: `as-pr5-${i + 1}` })),
  pr6: approvalSteps('approved').map((s, i) => ({ ...s, id: `as-pr6-${i + 1}` })),
  pr7: approvalSteps('approved').map((s, i) => ({ ...s, id: `as-pr7-${i + 1}` })),
  pr8: approvalSteps('rejected').map((s, i) => ({ ...s, id: `as-pr8-${i + 1}` })),
};
