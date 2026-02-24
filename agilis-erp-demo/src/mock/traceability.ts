import type { TraceNode } from '@/types';

/**
 * Forward trace: from raw material lot → through production → to finished goods.
 * Traces lot L2024-TI-001 (Titanium Alloy Shaft) forward to the Final Assembly Unit.
 */
export const forwardTrace: TraceNode = {
  id: 'ft-root',
  type: 'Lot',
  docNo: 'L2024-TI-001',
  itemName: '钛合金传动轴',
  date: '2024-10-05',
  status: '可用',
  children: [
    {
      id: 'ft-grn',
      type: 'GoodsReceipt',
      docNo: 'GRN-2024-0001',
      itemName: '钛合金传动轴 × 50',
      date: '2024-10-05',
      status: '已批准',
      children: [
        {
          id: 'ft-insp',
          type: 'Inspection',
          docNo: 'INS-2024-0001',
          itemName: '来料检验 — 钛合金传动轴',
          date: '2024-10-06',
          status: '通过',
        },
      ],
    },
    {
      id: 'ft-min',
      type: 'MaterialIssue',
      docNo: 'MIN-2024-0002',
      itemName: '领料 30 PC → WO-2024-0002',
      date: '2024-10-11',
      status: '已发料',
      children: [
        {
          id: 'ft-wo2',
          type: 'WorkOrder',
          docNo: 'WO-2024-0002',
          itemName: '手术机器人臂组件 × 5',
          date: '2024-10-10',
          status: '生产中',
          children: [
            {
              id: 'ft-insp5',
              type: 'Inspection',
              docNo: 'INS-2024-0005',
              itemName: '过程检验 — 臂组件',
              date: '2024-11-18',
              status: '待检',
            },
            {
              id: 'ft-wo1',
              type: 'WorkOrder',
              docNo: 'WO-2024-0001',
              itemName: '手术机器人整机 × 3',
              date: '2024-10-01',
              status: '生产中',
              children: [
                {
                  id: 'ft-lot-fau',
                  type: 'Lot',
                  docNo: 'L2024-FAU-001',
                  itemName: '手术机器人整机',
                  date: '2024-11-01',
                  status: '可用',
                  children: [
                    {
                      id: 'ft-so1',
                      type: 'SalesOrder',
                      docNo: 'SO-2024-0001',
                      itemName: '北京协和医院 × 2台',
                      date: '2025-01-15',
                      status: '已批准',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Backward trace: from finished goods lot back to raw materials.
 * Traces lot L2024-FAU-001 (Final Assembly Unit) backwards.
 */
export const backwardTrace: TraceNode = {
  id: 'bt-root',
  type: 'Lot',
  docNo: 'L2024-FAU-001',
  itemName: '手术机器人整机',
  date: '2024-11-01',
  status: '可用',
  children: [
    {
      id: 'bt-wo1',
      type: 'WorkOrder',
      docNo: 'WO-2024-0001',
      itemName: '手术机器人整机 × 3',
      date: '2024-10-01',
      status: '生产中',
      children: [
        {
          id: 'bt-min1',
          type: 'MaterialIssue',
          docNo: 'MIN-2024-0001',
          itemName: '整机装配领料',
          date: '2024-10-02',
          status: '已发料',
          children: [
            {
              id: 'bt-lot-arm',
              type: 'Lot',
              docNo: 'L2024-ARM-001',
              itemName: '手术机器人臂组件 × 3',
              date: '2024-09-15',
              status: '已消耗',
              children: [
                {
                  id: 'bt-wo2',
                  type: 'WorkOrder',
                  docNo: 'WO-2024-0002',
                  itemName: '手术机器人臂组件 × 5',
                  date: '2024-10-10',
                  status: '生产中',
                  children: [
                    {
                      id: 'bt-lot-ti',
                      type: 'Lot',
                      docNo: 'L2024-TI-001',
                      itemName: '钛合金传动轴 × 30',
                      date: '2024-10-05',
                      status: '已消耗',
                      children: [
                        {
                          id: 'bt-grn1',
                          type: 'GoodsReceipt',
                          docNo: 'GRN-2024-0001',
                          itemName: 'PO-2024-0001 / 苏州精密零件有限公司',
                          date: '2024-10-05',
                          status: '已批准',
                        },
                      ],
                    },
                    {
                      id: 'bt-lot-srv',
                      type: 'Lot',
                      docNo: 'L2024-SRV-001',
                      itemName: '伺服电机模块 × 30',
                      date: '2024-09-20',
                      status: '已消耗',
                    },
                    {
                      id: 'bt-lot-brg',
                      type: 'Lot',
                      docNo: 'L2024-BRG-001',
                      itemName: '轴承套件 × 30',
                      date: '2024-10-01',
                      status: '已消耗',
                    },
                  ],
                },
              ],
            },
            {
              id: 'bt-lot-pcb',
              type: 'Lot',
              docNo: 'L2024-PCB-001',
              itemName: 'PCB控制板 × 3',
              date: '2024-10-15',
              status: '已消耗',
            },
            {
              id: 'bt-lot-psu',
              type: 'Lot',
              docNo: 'L2024-PSU-001',
              itemName: '电源模块 × 3',
              date: '2024-10-25',
              status: '已消耗',
            },
            {
              id: 'bt-lot-cbl',
              type: 'Lot',
              docNo: 'L2024-CBL-001',
              itemName: '线束组件 × 3',
              date: '2024-11-20',
              status: '已消耗',
              children: [
                {
                  id: 'bt-grn3',
                  type: 'GoodsReceipt',
                  docNo: 'GRN-2024-0003',
                  itemName: 'PO-2024-0003 / 深圳创新电子',
                  date: '2024-11-20',
                  status: '已批准',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
