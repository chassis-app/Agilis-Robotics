# Screen Prompt: Stock Transfers

## Screen ID
`INV-TRANSFER`

## Route
- List: `/inventory/transfers`
- Detail: `/inventory/transfers/:id`

## Purpose
Create and manage inter-warehouse stock transfer orders. Maintains lot/serial tracking throughout the transfer process.

## Workflows
WF-06 (Shortage Handling — transfer branch)

## Requirements
RQ-007 (shortage resolution via transfer)

## List View

Standard list page with columns:
| Column | Content |
|---|---|
| Transfer No. | Mono ID, clickable |
| Status | Draft / Submitted / In Transit / Received / Cancelled |
| From Warehouse | Source warehouse name |
| To Warehouse | Destination warehouse name |
| Items | Count of lines |
| Created Date | Date |
| Transfer Date | Actual ship date |
| Actions | View, Edit (draft), Post Ship, Post Receive |

## Detail / Create View

### Header Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Transfer No. | Mono | Auto | Auto-generated |
| Status | Badge | Auto | Colored by status |
| From Warehouse | Select | Yes | Source warehouse |
| To Warehouse | Select | Yes | Destination warehouse (cannot be same as source) |
| Requested Date | Date picker | Yes | When transfer is needed |
| Reason | Textarea | No | Reason for transfer |
| Source Document | Link | Auto | If created from shortage resolution, link to material issue notice |

### Line Items

| Field | Type | Required | Notes |
|---|---|---|---|
| Item | Searchable select | Yes | Only items with stock in source warehouse shown |
| Revision | Select | Yes | Released revisions |
| Quantity | Number | Yes | Cannot exceed available qty in source warehouse |
| UOM | Auto | Auto | From item master |
| Lot/Serial | Select | Yes | Select specific lots/serials from source warehouse |
| Source Location | Select | Yes | Location within source warehouse |
| Destination Location | Select | Yes | Location within destination warehouse |

### Status Flow

```
Draft → Submitted → Approved → In Transit → Received
                              (ship posted)  (receive posted)
```

- [Post Shipment] — records items leaving source warehouse, creates outbound inventory txns
- [Post Receipt] — records items arriving at destination, creates inbound inventory txns
- Full lot/serial tracking maintained through the transfer

## Footer Actions

| Status | Actions |
|---|---|
| Draft | [Discard] [Save Draft] [Submit] |
| Approved | [Post Shipment] |
| In Transit | [Post Receipt] |
| Received | Read-only, [Print Transfer Note] |
