import type { SalesOrder } from '@/types';

export const salesOrders: SalesOrder[] = [
  {
    id: 'so1',
    soNo: 'SO-2024-0001',
    status: 'approved',
    customerId: 'cust1',
    customerName: '北京协和医院',
    deliveryDate: '2025-01-15',
    totalAmount: 540000,
    currency: 'CNY',
    lines: [
      { id: 'sol-01', lineNo: 1, itemId: 'itm15', itemNo: 'ITM-0015', itemName: '手术机器人整机', quantity: 2, uom: 'EA', unitPrice: 180000, amount: 360000 },
      { id: 'sol-02', lineNo: 2, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', quantity: 100, uom: 'PC', unitPrice: 85, amount: 8500 },
      { id: 'sol-03', lineNo: 3, itemId: 'itm09', itemNo: 'ITM-0009', itemName: '灭菌托盘', quantity: 10, uom: 'EA', unitPrice: 450, amount: 4500 },
      { id: 'sol-04', lineNo: 4, itemId: 'itm10', itemNo: 'ITM-0010', itemName: '校准夹具', quantity: 2, uom: 'EA', unitPrice: 1800, amount: 3600 },
    ],
  },
  {
    id: 'so2',
    soNo: 'SO-2024-0002',
    status: 'submitted',
    customerId: 'cust2',
    customerName: '上海瑞金医院',
    deliveryDate: '2025-02-28',
    totalAmount: 218500,
    currency: 'CNY',
    lines: [
      { id: 'sol-05', lineNo: 1, itemId: 'itm15', itemNo: 'ITM-0015', itemName: '手术机器人整机', quantity: 1, uom: 'EA', unitPrice: 180000, amount: 180000 },
      { id: 'sol-06', lineNo: 2, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', quantity: 200, uom: 'PC', unitPrice: 85, amount: 17000 },
      { id: 'sol-07', lineNo: 3, itemId: 'itm14', itemNo: 'ITM-0014', itemName: '保护套管', quantity: 500, uom: 'M', unitPrice: 18, amount: 9000 },
    ],
  },
  {
    id: 'so3',
    soNo: 'SO-2024-0003',
    status: 'draft',
    customerId: 'cust3',
    customerName: '广州中山大学附属第一医院',
    deliveryDate: '2025-03-30',
    totalAmount: 385900,
    currency: 'CNY',
    lines: [
      { id: 'sol-08', lineNo: 1, itemId: 'itm15', itemNo: 'ITM-0015', itemName: '手术机器人整机', quantity: 2, uom: 'EA', unitPrice: 180000, amount: 360000 },
      { id: 'sol-09', lineNo: 2, itemId: 'itm09', itemNo: 'ITM-0009', itemName: '灭菌托盘', quantity: 20, uom: 'EA', unitPrice: 450, amount: 9000 },
      { id: 'sol-10', lineNo: 3, itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', quantity: 200, uom: 'PC', unitPrice: 85, amount: 17000 },
    ],
  },
];
