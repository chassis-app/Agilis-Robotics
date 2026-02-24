# Screen Prompt: Purchase Order Detail / Create / Edit

## Screen ID
`PROC-PO-DETAIL`

## Route
- Create: `/procurement/purchase-orders/new?source_pr=:prId`
- Detail/Edit: `/procurement/purchase-orders/:id`

## Purpose
Create, view, and edit purchase orders. POs are always created from approved PRs (RQ-004). Supports multi-currency (RQ-002), quotation source tracking (RQ-023), document links (RQ-020), and full approval audit trail.

## Workflows
WF-01, WF-02

## Requirements
RQ-002 (multi-currency), RQ-004 (PR→PO), RQ-005 (approval), RQ-020 (documents), RQ-023 (quotation link)

## Template
Detail Page (design spec Section 9.2)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Procurement > Purchase Orders > PO-2024-0033             |
| PO-2024-0033                                          [Sent]         |
| Supplier: Acme Parts Ltd  |  Created: 2024-03-16                     |
+---------------------------------------------------------------------+
| [Details] [Lines] [Receipts] [Approvals] [Documents] [Audit Trail]  |
+---------------------------------------------------------------------+
```

## Header Fields (2-column)

| Field | Type | Required | Notes |
|---|---|---|---|
| PO Number | Mono text | Auto | Auto-generated |
| Status | Badge | Auto | Status badge |
| Source PR | Link | Auto | Clickable link to source PR (read-only) |
| Supplier | Searchable select | Yes | Dropdown with supplier name + site; after selection shows supplier contact info |
| Supplier Contact | Text | No | Auto-filled from supplier master, editable |
| Currency | Select | Yes | RMB (¥) / USD ($) per RQ-002; locked after first line added |
| PO Date | Date picker | Yes | Default: today |
| Required Date | Date picker | Yes | Default: from source PR |
| Delivery Address | Textarea | No | Default: from site master |
| Payment Terms | Select | No | Net 30 / Net 60 / Prepaid / Custom |
| Shipping Instructions | Textarea | No | Free text |

## Tab: Lines

| Field | Type | Required | Notes |
|---|---|---|---|
| Line # | Auto | Auto | Sequential |
| Item | Text (from PR) | Yes | Pre-filled from source PR line; shows CN + EN name |
| Revision | Text (from PR) | Yes | Pre-filled from PR |
| Supplier Part No. | Text | No | Auto-filled if supplier_item record exists |
| Quantity | Number | Yes | Defaults from PR line, editable |
| UOM | Text | Auto | From item master |
| Unit Price | Number | Yes | Manual entry or from selected quotation |
| Line Total | Calculated | Auto | Qty x Unit Price, formatted with currency |
| Lead Time (days) | Number | No | Auto-filled from supplier_item if available |
| Source Quotation | Select | No | Dropdown of quotation lines for this item+supplier (RQ-023) |
| Required Date | Date picker | Yes | Per-line, defaults from header |

### Quotation Source Indicator (RQ-023)
- If a source quotation line is selected: show info badge with quotation ID + selected price
- Tooltip shows: quotation date, quoted price, lead time, selection rationale
- If no quotation: show "No quotation linked" in muted text

### Line Totals Footer
```
Subtotal: ¥56,000.00
Tax (13%): ¥7,280.00
Total: ¥63,280.00
```

If currency is USD, also show:
```
Exchange rate: 1 USD = 7.24 RMB (as of 2024-03-16)
Equivalent: ¥63,280.00 RMB
```

## Tab: Receipts

List of goods receipts recorded against this PO:

| Column | Content |
|---|---|
| GRN No. | Clickable link to GRN detail |
| Receipt Date | Date received |
| Item | Item name |
| Qty Received | Quantity in this receipt |
| Lot/Serial | Generated lot or serial numbers |
| Inspection Status | Badge: Pending / Passed / Failed |
| Actions | [View GRN] |

Summary bar: "Ordered: 100 | Received: 65 | Remaining: 35"

[Record Receipt] button → navigates to GRN creation page with PO pre-linked.

## Tab: Approvals
Approval flow visualization + approval history table (same pattern as PR detail).

## Tab: Documents (RQ-020)
Linked controlled documents list + [Link Document] button.

## Tab: Audit Trail
Immutable event log with export capability.

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Discard] [Save Draft] [Submit for Approval] |
| Submitted | Read-only |
| Approved | [Send to Supplier] (primary) — marks PO as "Sent" and optionally triggers email/Feishu notification |
| Sent | [Record Receipt] (primary) |
| Partially Received | [Record Receipt] (primary) [Close PO] (if remaining qty is zero or waived) |
| Received | [Close PO] (primary) |
| Closed | Read-only |
