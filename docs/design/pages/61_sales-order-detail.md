# Screen Prompt: Sales Order Detail

## Screen ID
`SALES-ORDER-DETAIL`

## Route
- Detail: `/sales/orders/:id`

## Purpose
Detailed view of a single sales order with line items, allocation status, and procurement planning integration. Key feature: **Generate PR from SO** to auto-create purchase requisitions based on BOM explosion and material requirements.

## Workflows
- WF-11 (Sales Outbound Traceability)
- WF-15 (Sales-Driven Procurement Planning)

## Requirements
- RQ-021 (component version + batch traceability on shipment)
- New: Sales-to-PR generation with supplier grouping

## Header Section

| Field | Type | Required | Notes |
|---|---|---|---|
| SO Number | Mono | Auto | System-generated |
| Status | Badge | Auto | Draft / Confirmed / In Production / Partially Shipped / Shipped / Closed |
| Customer | Searchable select | Yes | Links to customer master |
| Customer Contact | Text | Auto | Auto-filled from customer |
| Order Date | Date picker | Yes | Default: today |
| Required Ship Date | Date picker | Yes | Highlight red if overdue |
| Shipping Address | Textarea | Yes | Default from customer |
| Payment Terms | Select | No | From customer defaults |
| Currency | Select | Yes | Default tenant currency |
| Total Amount | Calculated | Auto | Sum of line totals |
| Notes | Textarea | No | Internal notes |

## Order Lines Tab

### Line Items Table

| Column | Content |
|---|---|
| Line # | Auto sequence |
| Item | Searchable select (finished goods only) |
| Item Description | Auto from item |
| Revision | Select (released revisions only) |
| Ordered Qty | Number |
| UOM | Auto from item |
| Unit Price | Number |
| Line Total | Calculated (qty × price) |
| Allocated Qty | Number (read-only) |
| Shortage Qty | Number (read-only, red if > 0) |
| Production Status | Badge (Not Started / In Progress / Complete) |

### Line Actions
- **View BOM**: Opens BOM explosion for this item
- **Check Availability**: Runs ATP check for components
- **Create Work Order**: Generates production work order for this line

## Material Requirements Tab (New)

Shows BOM-exploded component requirements for all SO lines.

```
+-----------------------------------------------------------------------------------------------+
| Material Requirements Analysis                                                                |
+-----------------------------------------------------------------------------------------------+
| Filter: [All Lines ▼] [Show Shortages Only ☑]                                                |
+-----------------------------------------------------------------------------------------------+
| Component | Rev | Required | On Hand | On Order | Shortage | Preferred Supplier | Action      |
+-----------+-----+----------+---------+----------+----------+---------------------+-------------|
| Widget-A  | B   | 500      | 200     | 150      | 150      | Acme Parts          | [Create PR] |
| Module-Y  | D   | 100      | 80      | 0        | 20       | (Make)              | [Create WO] |
| Sensor-B  | A   | 200      | 200     | 0        | 0        | —                   | ✓ Available|
| Housing-C | A   | 100      | 50      | 0        | 50       | ⚠ Multiple Vendors  | [Resolve]   |
+-----------+-----+----------+---------+----------+----------+---------------------+-------------+
| [Generate All PRs] [Export to Excel] [Refresh Availability]                                  |
+-----------------------------------------------------------------------------------------------+
```

### Column Definitions

| Column | Source |
|---|---|
| Component | BOM line item |
| Rev | Component revision |
| Required | Sum of (SO line qty × qty_per from BOM) |
| On Hand | Current inventory balance |
| On Order | Open PO remaining qty |
| Shortage | max(0, Required - On Hand - On Order) |
| Preferred Supplier | From `supplier_item.is_preferred = true` |
| Action | Button or status indicator |

### Special Cases

- **Multiple Suppliers**: If component has multiple suppliers with no preferred flag set, show "⚠ Multiple Vendors" with [Resolve] button
- **Make Items**: Show "(Make)" for items with `sourcing_type = make`
- **Subcontract Items**: Show subcontractor name for `sourcing_type = subcontract`

## Generate PR Dialog

Triggered from **[Generate All PRs]** button or individual **[Create PR]** links.

```
+-----------------------------------------------------------------------+
| Generate Purchase Requisitions                              [X]      |
+-----------------------------------------------------------------------+
| Source: Sales Order SO-2024-0145                                      |
| Lines Selected: 3 items with shortage                                 |
+-----------------------------------------------------------------------+
| PR Preview                                                            |
+-----------------------------------------------------------------------+
| Supplier       | Items | Total Qty | Est. Amount | Status           |
+----------------+-------+-----------+-------------+------------------+
| Acme Parts     | 2     | 350       | ¥15,000     | ✓ Ready to create|
| PrecisionMfg   | 1     | 50        | ¥3,500      | ✓ Ready to create|
| ⚠ Unassigned   | 1     | 50        | —           | Requires vendor  |
+----------------+-------+-----------+-------------+------------------+
|                                                                       |
| ☑ Create draft PRs (requires approval before PO)                     |
| ☐ Submit PRs immediately (bypass draft)                              |
|                                                                       |
| [Cancel] [Create PRs - Skip Unassigned] [Resolve Unassigned First]   |
+-----------------------------------------------------------------------+
```

### PR Generation Rules

1. **Group by Supplier**: Components with same preferred supplier → one PR
2. **Skip Unassigned**: Components with multiple/no suppliers → flagged for manual review
3. **Link Back**: Each PR line stores `source_so_id` and `source_so_line_id`
4. **Calculate Net**: Shortage qty = Required - On Hand - On Order (remaining PO qty)

### After PR Creation

- Show success toast with PR numbers created
- Link to PR list with filter showing new PRs
- Update Material Requirements tab with PR references

## Shipments Tab

Shows shipments created from this SO.

| Column | Content |
|---|---|
| Shipment No. | Link to shipment detail |
| Status | Draft / Picked / Packed / Shipped / Delivered |
| Ship Date | Date |
| Lines | Count of items |
| Tracking | Carrier + tracking number |

## Procurement Links Tab (New)

Shows PRs and POs generated from this sales order.

```
+-----------------------------------------------------------------------+
| Procurement Trail                                                     |
+-----------------------------------------------------------------------+
| Document | Type | Status    | Supplier    | Amount    | Created      |
+----------+------+-----------+-------------+-----------+--------------+
| PR-0456  | PR   | Approved  | Acme Parts  | ¥15,000   | 2024-03-10   |
| PO-0234  | PO   | Sent      | Acme Parts  | ¥15,000   | 2024-03-12   |
| PR-0457  | PR   | In Review | PrecisionMfg| ¥3,500    | 2024-03-10   |
+----------+------+-----------+-------------+-----------+--------------+
```

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Delete] [Save] [Confirm Order] |
| Confirmed | [Create Work Order] [Generate PRs] [Create Shipment] |
| In Production | [View Work Orders] [Generate PRs] [Create Shipment] |
| Partially Shipped | [Create Shipment] [View Shipments] |
| Shipped | [View Shipments] [View Genealogy] |
| Closed | Read-only |

## Related Screens

- **PR Detail**: Direct link from Procurement Links tab
- **Work Order**: Created from order lines
- **Shipment Detail**: Created from Shipments tab
- **BOM View**: Opens from line item context menu