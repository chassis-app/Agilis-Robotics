# Screen Prompt: Subcontract Order

## Screen ID
`MFG-SC-ORDER`

## Route
- List: `/manufacturing/subcontract-orders`
- Detail: `/manufacturing/subcontract-orders/:id`

## Purpose
Manage subcontract orders for outsourced manufacturing operations. Track material shipment to supplier, return receipt with inspection, and fee statement reconciliation.

## Workflows
WF-07 (Subcontract Processing)

## Requirements
RQ-007 (lot tracking for shipped materials), RQ-008 (auto-PO if insufficient material), RQ-010 (fee statement reconciliation)

## List View

| Column | Content |
|---|---|
| SC No. | Mono ID, clickable |
| Status | Draft / Material Check / Shipping / At Supplier / Receiving / Completed / Closed |
| Item | Item being subcontracted |
| Supplier | Subcontractor name |
| Quantity | Ordered qty |
| Material Status | "All shipped" / "Pending shipment" / "PO needed for shortage" |
| Created Date | Date |
| Actions | View, Edit (draft) |

## Detail View

### Header

| Field | Type | Required |
|---|---|---|
| SC Number | Mono | Auto |
| Status | Badge | Auto |
| Item + Revision | Searchable select | Yes |
| Quantity | Number | Yes |
| Supplier | Searchable select | Yes |
| Required Date | Date picker | Yes |
| BOM Reference | Link | Auto (from item's BOM) |

### Tab: Required Materials (from BOM)

```
+---------------------------------------------------------------------+
| Component Materials (from BOM)                                       |
+---------------------------------------------------------------------+
| # | Component   | Rev | Required | Available | Status     | Action  |
|   |             |     | Qty      | Qty       |            |         |
+---+-------------+-----+----------+-----------+------------+---------+
| 1 | Sensor-B    | A   | 300      | 200       | ⚠ Short   | [→ PR]  |
|   |             |     |          |           | (100 short)|         |
+---+-------------+-----+----------+-----------+------------+---------+
| 2 | Connector-C | A   | 600      | 800       | ✓ OK       | --     |
+---+-------------+-----+----------+-----------+------------+---------+
```

- Availability check runs against warehouse stock
- ✓ OK: sufficient stock; ⚠ Short: shortage with auto-PR option (RQ-008)
- [→ PR] button: creates PR for shortage quantity, linking back to this subcontract order
- [Ship Materials] button: creates material issue for available components

### Tab: Material Shipments (RQ-007)

Records of materials shipped to subcontractor with lot tracking:

| Column | Content |
|---|---|
| Shipment No. | Clickable link |
| Ship Date | Date |
| Component | Item name |
| Lot/Serial | Specific lots shipped (full traceability) |
| Quantity | Qty shipped |
| Status | Shipped / Received by Supplier |

### Tab: Returns & Inspection

Records of processed goods returned by subcontractor:

| Column | Content |
|---|---|
| Receipt No. | Clickable link |
| Receipt Date | Date |
| Lot/Serial | Generated for returned goods |
| Quantity | Qty returned |
| Inspection | Pass / Fail / Pending |
| Actions | [Record Receipt] [View Inspection] |

### Tab: Fee Statement (RQ-010)

```
+---------------------------------------------------------------------+
| Subcontract Fee Statement                                            |
+---------------------------------------------------------------------+
| Statement Period: 2024-03-01 to 2024-03-31                          |
+---------------------------------------------------------------------+
| SC Order | Item        | Qty  | Unit Fee | Total Fee  | Invoiced?  |
+----------+-------------+------+----------+------------+------------+
| SC-008   | Assembly-X  | 100  | ¥50.00   | ¥5,000.00  | ✓ Matched |
| SC-011   | Module-Z    | 50   | ¥120.00  | ¥6,000.00  | ✗ Pending |
+----------+-------------+------+----------+------------+------------+
| Total: ¥11,000.00  |  Matched: ¥5,000.00  |  Pending: ¥6,000.00   |
+---------------------------------------------------------------------+
| [Generate Fee Statement]  [Export]  [Send to AP Reconciliation]      |
+---------------------------------------------------------------------+
```

### Tab: Audit Trail
Full event log including material shipment lots, return lots, fee statement generation.

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Save Draft] [Check Material Availability] |
| Material Check | [Ship Available Materials] [Create PR for Shortage] |
| Shipping | [Confirm Materials Shipped] |
| At Supplier | [Record Return Receipt] |
| Receiving | [Post Receipt] [Create Inspection] |
| Completed | [Generate Fee Statement] [Close Order] |
