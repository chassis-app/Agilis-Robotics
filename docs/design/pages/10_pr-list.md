# Screen Prompt: Purchase Requisition List

## Screen ID
`PROC-PR-LIST`

## Route
`/procurement/purchase-requisitions`

## Purpose
List view of all purchase requisitions with status filtering, search, bulk actions, and create button. Entry point for the PR → PO procurement workflow.

## Workflows
WF-01

## Requirements
RQ-004 (PR before PO mandate), RQ-005 (two-level approval)

## Template
List Page (design spec Section 9.1)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Home > Procurement > Purchase Requisitions               |
| Purchase Requisitions                           [+ Create New PR]    |
+---------------------------------------------------------------------+
| [All (245)] [Draft (12)] [Submitted (8)] [In Approval (5)]          |
| [Approved (180)] [Rejected (30)] [Cancelled (10)]                    |
+---------------------------------------------------------------------+
| [🔍 Search PR no., item, requester] [Date range ▼] [Warehouse ▼]   |
| [More filters ▼]                   [Columns ⚙] [Export ↓]          |
+---------------------------------------------------------------------+
| ☐ | PR No.       | Status     | Requester    | Created    |         |
|   |              |            |              | Date       | Req Date |
|   | Lines | Total Est. | Priority | Actions                        |
+---+--------------+------------+--------------+------------+---------+
| ☐ | PR-2024-0047 | [Approved] | Zhang Wei    | 2024-03-14 |         |
|   |              |            |              |            | 03-20   |
|   | 3     | ¥45,000    | Normal   | [View] [⋮]                     |
+---+--------------+------------+--------------+------------+---------+
| ☐ | PR-2024-0048 | [Draft]    | Li Ming      | 2024-03-15 |         |
|   |              |            |              |            | 03-25   |
|   | 1     | ¥12,000    | Urgent   | [Edit] [⋮]                     |
+---------------------------------------------------------------------+
| Showing 1-20 of 245     [20 ▼] per page    [< 1 2 3 ... 13 >]     |
+---------------------------------------------------------------------+
```

## Status Filter Tabs
- Tab for each document status: All, Draft, Submitted, In Approval, Approved, Rejected, Cancelled
- Each tab shows count in parentheses
- Active tab: primary-600 underline + primary-600 text
- Counts update when other filters change

## Table Columns

| Column | Width | Sortable | Content |
|---|---|---|---|
| Checkbox | 40px | No | Row selection for bulk actions |
| PR No. | 140px | Yes | Monospace document ID, clickable link (primary-500) |
| Status | 120px | Yes | Status badge (colored pill per design spec Section 7.4) |
| Requester | 140px | Yes | User display name |
| Created Date | 110px | Yes (default: desc) | YYYY-MM-DD format |
| Required Date | 110px | Yes | YYYY-MM-DD, red text if overdue |
| Lines | 60px | Yes | Count of PR lines |
| Total Est. | 120px | Yes | Currency symbol + formatted amount |
| Priority | 80px | Yes | "Normal" or "Urgent" badge (urgent = warning-500) |
| Actions | 100px | No | Primary action button + overflow menu |

## Row Actions

| Status | Primary Action | Overflow Menu |
|---|---|---|
| Draft | [Edit] | Clone, Delete, View Audit |
| Submitted | [View] | View Audit |
| In Approval | [View] | View Audit |
| Approved | [Create PO] | View, Clone, View Audit |
| Rejected | [Edit] (re-submit) | Clone, Delete, View Audit |
| Cancelled | [View] | Clone, View Audit |

## Bulk Actions
When rows selected, sticky bottom bar appears:
- **Draft selected**: [Submit Selected (N)] [Delete Selected (N)]
- **Approved selected**: [Create PO from Selected (N)]
- Mixed statuses: only common actions shown

## Filters

| Filter | Type | Options |
|---|---|---|
| Search | Text input | Searches PR no., item name (CN+EN), requester name |
| Date range | Date range picker | Created date range |
| Warehouse | Multi-select dropdown | All configured warehouses |
| Priority | Select | All, Normal, Urgent |
| Requester | Searchable select | User list (filtered by role) |
| Amount range | Min-max number inputs | Minimum and maximum estimated total |

"More filters" toggles visibility of secondary filters (warehouse, priority, requester, amount range).

## Create Button
- Position: Top-right, primary button
- Label: "+ Create New PR"
- Click: Navigates to PR Create/Edit form page (`/procurement/purchase-requisitions/new`)

## Export
- Click: Dropdown with options: Export CSV, Export Excel
- Exports current filtered view (all pages, not just visible)
- Includes all visible columns

## Column Configuration
- Gear icon opens drawer from right
- Toggle visibility of each column
- Drag to reorder columns
- "Reset to Default" button
- Saved per user preference

## Empty States
- **No PRs at all**: Illustration + "No purchase requisitions yet. Create your first PR." + [Create PR] button
- **Filter no results**: "No PRs match your filters." + [Clear Filters] link
- **Loading**: Skeleton rows (8 rows of skeleton content)
