# Screen Prompt: Goods Receipt (GRN)

## Screen ID
`PROC-GRN`

## Route
- List: `/procurement/goods-receipts`
- Create: `/procurement/goods-receipts/new?source_po=:poId`
- Detail: `/procurement/goods-receipts/:id`

## Purpose
Record receipt of goods against purchase orders. Generate lot/serial numbers, trigger quarantine and inspection when required, and post inventory transactions. Links to the incoming inspection workflow for quality control.

## Workflows
WF-03 (Receiving and Incoming/Final Inspection)

## Requirements
RQ-003 (lot-level tracking), RQ-015 (finished product inspection)

## GRN List View

Standard list page with columns:
| Column | Content |
|---|---|
| GRN No. | Mono ID, clickable |
| Status | Draft / Posted / Cancelled |
| Source PO | Linked PO number (clickable) |
| Supplier | Supplier name |
| Receipt Date | Date |
| Lines | Count |
| Inspection Status | All Passed / Pending / Has Failures |
| Actions | View, Post (if draft) |

## GRN Detail / Create View

### Header Fields (2-column)

| Field | Type | Required | Notes |
|---|---|---|---|
| GRN Number | Mono text | Auto | Auto-generated |
| Status | Badge | Auto | Draft / Posted |
| Source PO | Link (read-only) | Auto | Pre-filled from PO selection |
| Supplier | Text (read-only) | Auto | From PO |
| Receipt Date | Date picker | Yes | Default: today |
| Warehouse | Select | Yes | Receiving warehouse |
| Receiver | Text (read-only) | Auto | Current user |
| Notes | Textarea | No | Free text |

### Line Items (from PO lines)

```
+---------------------------------------------------------------------+
| Receipt Lines                                                        |
+---------------------------------------------------------------------+
| # | Item       | Rev | PO Qty | Already Received | This Receipt |   |
|   |            |     |        |                  | Qty *        |   |
|   | Lot/Serial | Location   | Inspection Req | Actions         |   |
+---+------------+-----+--------+------------------+--------------+---+
| 1 | Widget-A   | B   | 100    | 0                | [100]        |   |
|   | (传感器A)  |     |        |                  |              |   |
|   | [Auto-gen] | RAW-01     | ✓ Yes (quarantine)| [Scan]       |   |
+---+------------+-----+--------+------------------+--------------+---+
| 2 | Sensor-B   | A   | 50     | 25               | [25]         |   |
|   | (传感器B)  |     |        |                  |              |   |
|   | [Manual]   | RAW-02     | ✗ No              | [Scan]       |   |
+---+------------+-----+--------+------------------+--------------+---+
```

### Line Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Item + Revision | Read-only | From PO | Shows CN + EN name |
| PO Quantity | Read-only | From PO | Original ordered qty |
| Already Received | Read-only | Calculated | Sum of previous GRNs for this PO line |
| This Receipt Qty | Number | Yes | Cannot exceed remaining (PO qty - already received) |
| Lot/Serial Number | Text or auto | Yes | Options: auto-generate, manual entry, or barcode scan |
| Storage Location | Select | Yes | Location within receiving warehouse |
| Inspection Required | Indicator | Auto | Determined by item inspection policy; if yes, lot status set to "quarantine" |

### Lot/Serial Generation
- **Auto-generate**: System generates lot number per numbering template (e.g., `LOT-YYYY-NNNN`)
- **Manual entry**: User types lot number (validated for uniqueness)
- **Barcode scan**: [Scan] button activates camera/scanner input
- For serialized items: generate individual serial numbers per unit quantity

### Inspection Trigger
- If item has inspection_required = true:
  - Lot status automatically set to "Quarantine"
  - Quarantine badge shown on line: yellow "Quarantine" status
  - System auto-creates inspection_record linked to this lot
  - Link to inspection record shown: "Inspection: INSP-2024-0345 (Pending)"
- If finished product (RQ-015): additional final product inspection record created

### Post Receipt Action
1. User clicks [Post Receipt]
2. System validates all lines have qty and lot/serial
3. Creates inventory transactions (receipt type)
4. Updates PO received quantities
5. If inspection required: lots remain in quarantine until inspection pass
6. If no inspection: lots move directly to available status
7. Toast: "Receipt posted. N lots created."

## Footer Actions

| Status | Actions |
|---|---|
| New | [Cancel] [Save Draft] [Post Receipt] |
| Draft | [Delete Draft] [Post Receipt] |
| Posted | Read-only, [Print GRN] [View Inspection Records] |
