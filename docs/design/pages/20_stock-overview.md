# Screen Prompt: Stock Overview

## Screen ID
`INV-STOCK-OVERVIEW`

## Route
`/inventory/stock`

## Purpose
Real-time inventory visibility across all items, revisions, lots, warehouses, and locations. Shows on-hand, allocated, and available quantities. Provides stock status at a glance with drill-down to lot-level detail.

## Workflows
WF-04, WF-06, WF-12

## Requirements
RQ-003 (indexed search on custom fields), RQ-012 (inventory type segmentation), RQ-026 (safety stock)

## Template
List Page with summary cards

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Home > Inventory > Stock Overview                        |
| Stock Overview                                         [Export ↓]    |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Total    | | Below    | | In       | | Allocated|                  |
| | SKUs     | | Safety   | | Quarant. | | Stock    |                  |
| | 1,247    | | 23 ⚠     | | 15 🔒    | | ¥2.4M   |                  |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| [🔍 Search item, lot, serial] [Warehouse ▼] [Item Type ▼]          |
| [Category ▼] [Stock Status ▼]              [Group by ▼]            |
+---------------------------------------------------------------------+
| Item No.    | Name         | Rev | Type   | WH    | On Hand |       |
|             |              |     |        |       | Alloc.  | Avail |
|             | Safety Stock | Status       |       |         |       |
+-------------+--------------+-----+--------+-------+---------+-------+
| ITM-001     | Widget-A     | B   | Raw    | WH-01 | 165     |       |
| (传感器A)   |              |     |        |       | 100     | 65    |
|             | Threshold:100| ⚠ Below     |       |         |       |
+-------------+--------------+-----+--------+-------+---------+-------+
| ITM-002     | Sensor-B     | A   | Raw    | WH-01 | 200     |       |
| (传感器B)   |              |     |        |       | 0       | 200   |
|             | Threshold:50 | ✓ OK        |       |         |       |
+-------------+--------------+-----+--------+-------+---------+-------+
```

## KPI Summary Cards

| Card | Value | Color Indication |
|---|---|---|
| Total SKUs | Count of distinct item+revision+warehouse | Neutral |
| Below Safety Stock | Count of items below threshold | Warning (amber) if > 0 |
| In Quarantine | Count of lots in quarantine status | Info (cyan) |
| Allocated Stock Value | Total value of allocated inventory | Neutral |

Clicking any card filters the table to that subset.

## Table Columns

| Column | Width | Sortable | Content |
|---|---|---|---|
| Item No. | 120px | Yes | Mono ID |
| Name (CN/EN) | 180px | Yes | Bilingual display |
| Revision | 60px | Yes | Latest released revision code |
| Item Type | 80px | Yes | Badge: Raw / Semi / Finished / Service / Tooling (per RQ-012) |
| Warehouse | 80px | Yes | Warehouse code |
| On Hand | 80px | Yes | Total physical quantity |
| Allocated | 80px | Yes | Quantity committed to WOs/shipments |
| Available | 80px | Yes | On hand minus allocated (bold, primary color) |
| Safety Threshold | 80px | No | From safety_stock_policy |
| Stock Status | 100px | Yes | ✓ OK (green) / ⚠ Below Safety (amber) / ✗ Out of Stock (red) / 🔒 Quarantine (grey) |

## Filters

| Filter | Type | Options |
|---|---|---|
| Search | Text | Item no., name (CN/EN), lot no., serial no. |
| Warehouse | Multi-select | All warehouses |
| Item Type | Multi-select | Raw, Semi-Finished, Finished, Service, Tooling (RQ-012) |
| Category | Tree select | Category hierarchy |
| Stock Status | Multi-select | OK, Below Safety, Out of Stock, Has Quarantine |
| Custom Fields | Dynamic | Custom field filters per RQ-003 (e.g., risk level) |

## Group By
Dropdown to group table rows by: None, Item Type, Warehouse, Category, Supplier

## Row Expansion (Drill-Down)

Clicking a row expands to show lot-level detail:

```
▼ ITM-001 | Widget-A | Rev B | WH-01
  +------+-------------+---------+--------+--------+------------+
  | Lot  | Lot No.     | Status  | Qty    | Location| Expiry    |
  +------+-------------+---------+--------+--------+------------+
  | 1    | LOT-2024-01 | Available| 65    | RAW-01  | 2025-03-01|
  | 2    | LOT-2024-02 | Allocated| 50    | RAW-01  | 2025-04-15|
  | 3    | LOT-2024-03 | Quarantine| 50   | QUA-01  | --        |
  +------+-------------+---------+--------+--------+------------+
```

Each lot row links to:
- Lot detail (origin GRN, inspection records)
- Trace button → forward traceability query (RQ-021)

## Actions
- [Export] — CSV/Excel of current filtered view
- Row action: [Transfer] — quick create stock transfer order
- Row action: [Adjust] — create inventory adjustment (triggers e-signature)
- Row action: [Trace] — open traceability query for this item/lot
