import type { StockSummary } from '@/types';

export const stockSummaries: StockSummary[] = [
  {
    itemId: 'itm01', itemNo: 'ITM-0001', itemName: '手术机器人臂组件', itemNameEn: 'Surgical Robot Arm Assembly',
    totalQty: 8, availableQty: 5, reservedQty: 3, uom: 'EA', safetyStock: 5, reorderPoint: 8,
    lots: [
      { id: 'lot-0101', lotNo: 'L2024-ARM-001', itemId: 'itm01', itemName: '手术机器人臂组件', itemNo: 'ITM-0001', quantity: 5, warehouseId: 'wh1', warehouseName: '主仓库', location: 'A-01-01', status: 'available', receivedDate: '2024-09-15', expiryDate: '', grnId: '', supplierId: '' },
      { id: 'lot-0102', lotNo: 'L2024-ARM-002', itemId: 'itm01', itemName: '手术机器人臂组件', itemNo: 'ITM-0001', quantity: 3, warehouseId: 'wh1', warehouseName: '主仓库', location: 'A-01-02', status: 'reserved', receivedDate: '2024-10-20', expiryDate: '', grnId: '', supplierId: '' },
    ],
  },
  {
    itemId: 'itm02', itemNo: 'ITM-0002', itemName: '钛合金传动轴', itemNameEn: 'Titanium Alloy Shaft',
    totalQty: 75, availableQty: 55, reservedQty: 20, uom: 'PC', safetyStock: 100, reorderPoint: 120,
    lots: [
      { id: 'lot-0201', lotNo: 'L2024-TI-001', itemId: 'itm02', itemName: '钛合金传动轴', itemNo: 'ITM-0002', quantity: 30, warehouseId: 'wh1', warehouseName: '主仓库', location: 'B-02-01', status: 'available', receivedDate: '2024-10-05', expiryDate: '', grnId: 'grn1', supplierId: 'sup1' },
      { id: 'lot-0202', lotNo: 'L2024-TI-002', itemId: 'itm02', itemName: '钛合金传动轴', itemNo: 'ITM-0002', quantity: 25, warehouseId: 'wh1', warehouseName: '主仓库', location: 'B-02-02', status: 'available', receivedDate: '2024-11-10', expiryDate: '', grnId: 'grn1', supplierId: 'sup1' },
      { id: 'lot-0203', lotNo: 'L2024-TI-003', itemId: 'itm02', itemName: '钛合金传动轴', itemNo: 'ITM-0002', quantity: 20, warehouseId: 'wh1', warehouseName: '主仓库', location: 'B-02-03', status: 'reserved', receivedDate: '2024-11-10', expiryDate: '', grnId: 'grn1', supplierId: 'sup1' },
    ],
  },
  {
    itemId: 'itm03', itemNo: 'ITM-0003', itemName: '伺服电机模块', itemNameEn: 'Servo Motor Module',
    totalQty: 12, availableQty: 8, reservedQty: 4, uom: 'EA', safetyStock: 20, reorderPoint: 25,
    lots: [
      { id: 'lot-0301', lotNo: 'L2024-SRV-001', itemId: 'itm03', itemName: '伺服电机模块', itemNo: 'ITM-0003', quantity: 12, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-01-01', status: 'available', receivedDate: '2024-09-20', expiryDate: '', grnId: '', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm04', itemNo: 'ITM-0004', itemName: 'PCB控制板', itemNameEn: 'PCB Control Board',
    totalQty: 45, availableQty: 35, reservedQty: 10, uom: 'PC', safetyStock: 30, reorderPoint: 40,
    lots: [
      { id: 'lot-0401', lotNo: 'L2024-PCB-001', itemId: 'itm04', itemName: 'PCB控制板', itemNo: 'ITM-0004', quantity: 45, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-02-01', status: 'available', receivedDate: '2024-10-15', expiryDate: '', grnId: '', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm05', itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', itemNameEn: 'Silicone End Effector Tip',
    totalQty: 350, availableQty: 300, reservedQty: 50, uom: 'PC', safetyStock: 200, reorderPoint: 250,
    lots: [
      { id: 'lot-0501', lotNo: 'L2024-SIL-001', itemId: 'itm05', itemName: '硅胶末端执行器头', itemNo: 'ITM-0005', quantity: 200, warehouseId: 'wh1', warehouseName: '主仓库', location: 'D-01-01', status: 'available', receivedDate: '2024-10-10', expiryDate: '2026-10-10', grnId: 'grn2', supplierId: 'sup2' },
      { id: 'lot-0502', lotNo: 'L2024-SIL-002', itemId: 'itm05', itemName: '硅胶末端执行器头', itemNo: 'ITM-0005', quantity: 150, warehouseId: 'wh1', warehouseName: '主仓库', location: 'D-01-02', status: 'available', receivedDate: '2024-11-15', expiryDate: '2026-11-15', grnId: 'grn2', supplierId: 'sup2' },
    ],
  },
  {
    itemId: 'itm06', itemNo: 'ITM-0006', itemName: '不锈钢外壳', itemNameEn: 'Stainless Steel Housing',
    totalQty: 14, availableQty: 10, reservedQty: 4, uom: 'EA', safetyStock: 10, reorderPoint: 15,
    lots: [
      { id: 'lot-0601', lotNo: 'L2024-HSG-001', itemId: 'itm06', itemName: '不锈钢外壳', itemNo: 'ITM-0006', quantity: 14, warehouseId: 'wh1', warehouseName: '主仓库', location: 'A-02-01', status: 'available', receivedDate: '2024-10-31', expiryDate: '', grnId: '', supplierId: '' },
    ],
  },
  {
    itemId: 'itm07', itemNo: 'ITM-0007', itemName: '线束组件', itemNameEn: 'Cable Harness Assembly',
    totalQty: 22, availableQty: 18, reservedQty: 4, uom: 'SET', safetyStock: 15, reorderPoint: 20,
    lots: [
      { id: 'lot-0701', lotNo: 'L2024-CBL-001', itemId: 'itm07', itemName: '线束组件', itemNo: 'ITM-0007', quantity: 22, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-03-01', status: 'available', receivedDate: '2024-11-20', expiryDate: '', grnId: 'grn3', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm08', itemNo: 'ITM-0008', itemName: '光学传感器模块', itemNameEn: 'Optical Sensor Module',
    totalQty: 6, availableQty: 4, reservedQty: 2, uom: 'EA', safetyStock: 10, reorderPoint: 12,
    lots: [
      { id: 'lot-0801', lotNo: 'L2024-OPT-001', itemId: 'itm08', itemName: '光学传感器模块', itemNo: 'ITM-0008', quantity: 6, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-04-01', status: 'available', receivedDate: '2024-08-20', expiryDate: '', grnId: '', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm09', itemNo: 'ITM-0009', itemName: '灭菌托盘', itemNameEn: 'Sterilization Tray',
    totalQty: 30, availableQty: 25, reservedQty: 5, uom: 'EA', safetyStock: 20, reorderPoint: 25,
    lots: [
      { id: 'lot-0901', lotNo: 'L2024-STR-001', itemId: 'itm09', itemName: '灭菌托盘', itemNo: 'ITM-0009', quantity: 30, warehouseId: 'wh1', warehouseName: '主仓库', location: 'D-02-01', status: 'available', receivedDate: '2024-10-10', expiryDate: '', grnId: '', supplierId: '' },
    ],
  },
  {
    itemId: 'itm10', itemNo: 'ITM-0010', itemName: '校准夹具', itemNameEn: 'Calibration Fixture',
    totalQty: 4, availableQty: 3, reservedQty: 1, uom: 'EA', safetyStock: 3, reorderPoint: 4,
    lots: [
      { id: 'lot-1001', lotNo: 'L2024-CAL-001', itemId: 'itm10', itemName: '校准夹具', itemNo: 'ITM-0010', quantity: 4, warehouseId: 'wh1', warehouseName: '主仓库', location: 'E-01-01', status: 'available', receivedDate: '2024-09-01', expiryDate: '', grnId: '', supplierId: '' },
    ],
  },
  {
    itemId: 'itm11', itemNo: 'ITM-0011', itemName: '轴承套件', itemNameEn: 'Bearing Set',
    totalQty: 18, availableQty: 10, reservedQty: 8, uom: 'SET', safetyStock: 50, reorderPoint: 60,
    lots: [
      { id: 'lot-1101', lotNo: 'L2024-BRG-001', itemId: 'itm11', itemName: '轴承套件', itemNo: 'ITM-0011', quantity: 18, warehouseId: 'wh1', warehouseName: '主仓库', location: 'B-03-01', status: 'available', receivedDate: '2024-10-01', expiryDate: '', grnId: '', supplierId: 'sup1' },
    ],
  },
  {
    itemId: 'itm12', itemNo: 'ITM-0012', itemName: '固件芯片', itemNameEn: 'Firmware Chip',
    totalQty: 60, availableQty: 40, reservedQty: 20, uom: 'PC', safetyStock: 80, reorderPoint: 100,
    lots: [
      { id: 'lot-1201', lotNo: 'L2024-FW-001', itemId: 'itm12', itemName: '固件芯片', itemNo: 'ITM-0012', quantity: 60, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-05-01', status: 'available', receivedDate: '2024-09-10', expiryDate: '', grnId: '', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm13', itemNo: 'ITM-0013', itemName: '电源模块', itemNameEn: 'Power Supply Unit',
    totalQty: 18, availableQty: 15, reservedQty: 3, uom: 'EA', safetyStock: 15, reorderPoint: 18,
    lots: [
      { id: 'lot-1301', lotNo: 'L2024-PSU-001', itemId: 'itm13', itemName: '电源模块', itemNo: 'ITM-0013', quantity: 18, warehouseId: 'wh1', warehouseName: '主仓库', location: 'C-06-01', status: 'available', receivedDate: '2024-10-25', expiryDate: '', grnId: '', supplierId: 'sup3' },
    ],
  },
  {
    itemId: 'itm14', itemNo: 'ITM-0014', itemName: '保护套管', itemNameEn: 'Protective Sleeve',
    totalQty: 500, availableQty: 450, reservedQty: 50, uom: 'M', safetyStock: 200, reorderPoint: 300,
    lots: [
      { id: 'lot-1401', lotNo: 'L2024-SLV-001', itemId: 'itm14', itemName: '保护套管', itemNo: 'ITM-0014', quantity: 500, warehouseId: 'wh1', warehouseName: '主仓库', location: 'D-03-01', status: 'available', receivedDate: '2024-11-01', expiryDate: '2027-11-01', grnId: '', supplierId: 'sup5' },
    ],
  },
  {
    itemId: 'itm15', itemNo: 'ITM-0015', itemName: '手术机器人整机', itemNameEn: 'Final Assembly Unit',
    totalQty: 2, availableQty: 1, reservedQty: 1, uom: 'EA', safetyStock: 2, reorderPoint: 3,
    lots: [
      { id: 'lot-1501', lotNo: 'L2024-FAU-001', itemId: 'itm15', itemName: '手术机器人整机', itemNo: 'ITM-0015', quantity: 1, warehouseId: 'wh1', warehouseName: '成品仓', location: 'F-01-01', status: 'available', receivedDate: '2024-11-01', expiryDate: '', grnId: '', supplierId: '' },
      { id: 'lot-1502', lotNo: 'L2024-FAU-002', itemId: 'itm15', itemName: '手术机器人整机', itemNo: 'ITM-0015', quantity: 1, warehouseId: 'wh1', warehouseName: '成品仓', location: 'F-01-02', status: 'reserved', receivedDate: '2024-11-20', expiryDate: '', grnId: '', supplierId: '' },
    ],
  },
];
