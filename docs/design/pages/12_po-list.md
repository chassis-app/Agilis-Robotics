# Screen Prompt: Purchase Order List

## Screen ID
`PROC-PO-LIST`

## Route
`/procurement/purchase-orders`

## Purpose
List view of all purchase orders with filtering, search, and status tracking. POs can only be created from approved PRs (RQ-004).

## Workflows
WF-01 (PR→PO), WF-02 (RFQ→PO)

## Requirements
RQ-002 (multi-currency), RQ-004 (PR before PO), RQ-005 (approval)

## Template
List Page (design spec Section 9.1)

## Status Tabs
All | Draft | Submitted | Approved | Sent | Partially Received | Received | Closed

## Table Columns

| Column | Width | Sortable | Content |
|---|---|---|---|
| Checkbox | 40px | No | Row selection |
| PO No. | 140px | Yes | Mono ID, clickable link |
| Status | 120px | Yes | Status badge |
| Supplier | 160px | Yes | Supplier name |
| Source PR | 120px | Yes | Linked PR number (clickable) |
| Currency | 60px | Yes | RMB / USD |
| Total Amount | 130px | Yes | Formatted with currency symbol |
| PO Date | 110px | Yes (default: desc) | YYYY-MM-DD |
| Required Date | 110px | Yes | Red if overdue |
| Received % | 80px | No | Progress bar (received qty / ordered qty) |
| Actions | 100px | No | Context-dependent |

## Row Actions by Status

| Status | Primary | Overflow |
|---|---|---|
| Draft | [Edit] | Submit, Delete, View Audit |
| Submitted | [View] | View Audit |
| Approved | [Send to Supplier] | View, View Audit |
| Sent | [Record Receipt] | View, View Audit |
| Partially Received | [Record Receipt] | View, View Audit |
| Received | [View] | Close PO, View Audit |
| Closed | [View] | View Audit |

## Filters
- Search: PO no., supplier name, item name
- Date range: PO date
- Supplier: searchable select
- Currency: RMB / USD / All
- Amount range: min-max
- Source PR: PR number text search

## Create Button
- Label: "+ Create PO"
- Click behavior: opens dialog to select from approved PRs, then navigates to PO create form
- If no approved PRs available: dialog shows message "No approved PRs available. Create and approve a PR first." with link to PR list

## Bulk Actions
- Submitted: [Submit Selected]
- Approved: [Send Selected to Supplier]
