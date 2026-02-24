import type { GoodsReceipt } from '@/types';

export const goodsReceipts: GoodsReceipt[] = [
  {
    id: 'grn1',
    grnNo: 'GRN-2024-0001',
    status: 'approved',
    poId: 'po1',
    poNo: 'PO-2024-0001',
    supplierId: 'sup1',
    supplierName: '苏州精密零件有限公司',
    receivedDate: '2024-10-05',
    warehouseId: 'wh1',
    warehouseName: '主仓库',
    notes: '钛合金传动轴到货，已通过来料检验',
    lines: [
      { id: 'grnl-01', lineNo: 1, itemId: 'itm02', itemNo: 'ITM-0002', itemName: '钛合金传动轴', orderedQty: 50, receivedQty: 50, acceptedQty: 50, rejectedQty: 0, uom: 'PC', lotNo: 'L2024-TI-001' },
    ],
  },
  {
    id: 'grn2',
    grnNo: 'GRN-2024-0002',
    status: 'approved',
    poId: 'po2',
    poNo: 'PO-2024-0002',
    supplierId: 'sup2',
    supplierName: '上海医疗材料科技',
    receivedDate: '2024-10-10',
    warehouseId: 'wh1',
    warehouseName: '主仓库',
    notes: '硅胶末端执行器头到货',
    lines: [
      { id: 'grnl-02', lineNo: 1, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', orderedQty: 100, receivedQty: 100, acceptedQty: 100, rejectedQty: 0, uom: 'PC', lotNo: 'L2024-SIL-001' },
    ],
  },
  {
    id: 'grn3',
    grnNo: 'GRN-2024-0003',
    status: 'approved',
    poId: 'po3',
    poNo: 'PO-2024-0003',
    supplierId: 'sup3',
    supplierName: '深圳创新电子',
    receivedDate: '2024-11-20',
    warehouseId: 'wh1',
    warehouseName: '主仓库',
    notes: '线束组件到货，2件条件放行（见NC-2024-0001）',
    lines: [
      { id: 'grnl-03', lineNo: 1, itemId: 'itm07', itemNo: 'ITM-0007', itemName: '线束组件', orderedQty: 10, receivedQty: 10, acceptedQty: 8, rejectedQty: 2, uom: 'SET', lotNo: 'L2024-CBL-001' },
    ],
  },
];
