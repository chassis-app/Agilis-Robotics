# Screen Prompt: Sales Orders List & Shipments

## Screen ID
`SALES-ORDERS` / `SALES-SHIPMENTS`

## Route
- Orders List: `/sales/orders`
- Order Detail: `/sales/orders/:id` → See [61_sales-order-detail.md](61_sales-order-detail.md)
- Shipments List: `/sales/shipments`
- Shipment Detail: `/sales/shipments/:id`

## Purpose
List views for sales orders and outbound shipments. Sales Order detail (including PR generation from SO) is handled in screen 61. Shipment detail includes genealogy tracking per RQ-021.

## Workflows
- WF-11 (Sales Outbound Traceability)
- WF-15 (Sales-Driven Procurement Planning) — via Order Detail

## Requirements
- RQ-021 (component version + batch traceability on shipment)

## Sales Order List

| Column | Content |
|---|---|
| SO No. | Mono ID, clickable |
| Status | Draft / Confirmed / Allocating / Shipped / Closed |
| Customer | Customer name |
| Items | Count of line items |
| Total Amount | Formatted with currency |
| Order Date | Date |
| Required Ship Date | Date, red if overdue |
| Actions | View, Edit (draft), Create Shipment, Generate PR |

> **Note:** Sales Order Detail with Material Requirements analysis, PR generation, and procurement links is documented in [61_sales-order-detail.md](61_sales-order-detail.md).

## Shipment List

| Column | Content |
|---|---|
| Shipment No. | Mono ID, clickable |
| Status | Draft / Picked / Packed / Shipped / Delivered |
| Source SO | Sales order link |
| Customer | Customer name |
| Items | Count of lines |
| Ship Date | Actual ship date |
| Tracking | Carrier + tracking number |
| Actions | View, Ship, Print |

## Shipment Detail

### Header

| Field | Type | Required |
|---|---|---|
| Shipment No. | Mono | Auto |
| Status | Badge | Auto |
| Source SO | Link | Auto |
| Customer | Text | Auto |
| Ship Date | Date picker | Yes |
| Carrier | Text | No |
| Tracking Number | Text | No |

### Shipment Lines with Genealogy (Key Feature per RQ-021)

```
+---------------------------------------------------------------------+
| Shipment Lines                                                       |
+---------------------------------------------------------------------+
| # | Item         | Rev | Serial/Lot    | Qty | Genealogy            |
+---+--------------+-----+---------------+-----+----------------------+
| 1 | Assembly-X   | C   | SN-2024-00145 | 1   | [View Trace ⧉]      |
| 2 | Assembly-X   | C   | SN-2024-00146 | 1   | [View Trace ⧉]      |
| 3 | Assembly-X   | C   | SN-2024-00147 | 1   | [View Trace ⧉]      |
+---+--------------+-----+---------------+-----+----------------------+
```

[View Trace] opens the backward traceability tree for that serial in a side panel, showing all component lots, revisions, and suppliers (per Traceability Query page, Section 52).

### Component Genealogy Panel (Inline per RQ-021)

When expanded for a shipment line:

```
+---------------------------------------------------------------------+
| Genealogy: SN-2024-00145 (Assembly-X, Rev C)                       |
+---------------------------------------------------------------------+
| Component       | Rev | Lot/Serial    | Supplier      | PO          |
+-----------------+-----+---------------+---------------+-------------+
| Widget-A        | B   | LOT-2024-0234 | Acme Parts    | PO-2024-022 |
| Module-Y        | D   | LOT-2024-0198 | (In-house)    | WO-2024-052 |
| Module-Z        | D   | LOT-2024-0210 | PrecisionMfg  | SC-2024-008 |
| Sensor-B        | A   | LOT-2024-0195 | SensorCo      | PO-2024-019 |
| Connector-C     | A   | LOT-2024-0201 | Acme Parts    | PO-2024-022 |
+-----------------+-----+---------------+---------------+-------------+
| Final Inspection: INSP-2024-0345 (Passed ✓, 2024-03-10)           |
| DHR: [View Device History Record]                                    |
+---------------------------------------------------------------------+
```

### Post Shipment Action

[Post Shipment] button:
1. Validates all lines have allocated lots/serials
2. Validates all allocated items have passed final inspection
3. Creates shipment posting
4. System writes genealogy links (finished lot/serial → consumed component lots via source WO)
5. Inventory transactions: deducts from finished goods
6. Toast: "Shipment posted. Genealogy links created for N devices."

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Cancel] [Save Draft] [Start Picking] |
| Picked | [Confirm Packing] |
| Packed | [Post Shipment] |
| Shipped | [Confirm Delivery] [Print Shipping Docs] |
| Delivered | Read-only, [View Genealogy Report] |
