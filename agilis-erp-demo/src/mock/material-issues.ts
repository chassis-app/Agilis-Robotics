import type { MaterialIssueNotice } from '@/types';

export const materialIssueNotices: MaterialIssueNotice[] = [
  {
    id: 'min1',
    minNo: 'MIN-2024-0001',
    status: 'approved',
    woId: 'wo1',
    woNo: 'WO-2024-0001',
    requesterId: 'u6',
    requesterName: '刘洋',
    requiredDate: '2024-10-02',
    notes: '整机装配所需物料',
    lines: [
      { id: 'minl-01', lineNo: 1, itemId: 'itm01', itemNo: 'ITM-0001', itemName: '手术机器人臂组件', requestedQty: 3, issuedQty: 3, uom: 'EA', lotNo: 'L2024-ARM-001', warehouseId: 'wh1' },
      { id: 'minl-02', lineNo: 2, itemId: 'itm04', itemNo: 'ITM-0004', itemName: 'PCB控制板', requestedQty: 3, issuedQty: 3, uom: 'PC', lotNo: 'L2024-PCB-001', warehouseId: 'wh1' },
      { id: 'minl-03', lineNo: 3, itemId: 'itm13', itemNo: 'ITM-0013', itemName: '电源模块', requestedQty: 3, issuedQty: 3, uom: 'EA', lotNo: 'L2024-PSU-001', warehouseId: 'wh1' },
      { id: 'minl-04', lineNo: 4, itemId: 'itm07', itemNo: 'ITM-0007', itemName: '线束组件', requestedQty: 3, issuedQty: 3, uom: 'SET', lotNo: 'L2024-CBL-001', warehouseId: 'wh1' },
    ],
  },
  {
    id: 'min2',
    minNo: 'MIN-2024-0002',
    status: 'approved',
    woId: 'wo2',
    woNo: 'WO-2024-0002',
    requesterId: 'u6',
    requesterName: '刘洋',
    requiredDate: '2024-10-11',
    notes: '机器人臂组件装配用料',
    lines: [
      { id: 'minl-05', lineNo: 1, itemId: 'itm02', itemNo: 'ITM-0002', itemName: '钛合金传动轴', requestedQty: 30, issuedQty: 30, uom: 'PC', lotNo: 'L2024-TI-001', warehouseId: 'wh1' },
      { id: 'minl-06', lineNo: 2, itemId: 'itm03', itemNo: 'ITM-0003', itemName: '伺服电机模块', requestedQty: 30, issuedQty: 30, uom: 'EA', lotNo: 'L2024-SRV-001', warehouseId: 'wh1' },
      { id: 'minl-07', lineNo: 3, itemId: 'itm11', itemNo: 'ITM-0011', itemName: '轴承套件', requestedQty: 30, issuedQty: 30, uom: 'SET', lotNo: 'L2024-BRG-001', warehouseId: 'wh1' },
    ],
  },
  {
    id: 'min3',
    minNo: 'MIN-2024-0003',
    status: 'submitted',
    woId: 'wo3',
    woNo: 'WO-2024-0003',
    requesterId: 'u6',
    requesterName: '刘洋',
    requiredDate: '2024-09-16',
    notes: '不锈钢外壳生产领料',
    lines: [
      { id: 'minl-08', lineNo: 1, itemId: 'itm06', itemNo: 'ITM-0006', itemName: '不锈钢外壳', requestedQty: 10, issuedQty: 0, uom: 'EA', lotNo: '', warehouseId: 'wh1' },
    ],
  },
];
