# Screen Prompt: Approval Inbox

## Screen ID
`APPROVAL-INBOX`

## Route
`/approvals`

## Purpose
Centralized view for all items awaiting the current user's approval across all document types (PRs, POs, ECRs, material issues, cycle count adjustments, etc.). Enables efficient batch review and action.

## Workflows
WF-01, WF-02, WF-04, WF-07, WF-08, WF-09, WF-10, WF-13

## Requirements
RQ-005 (two-level approval + submit), 21 CFR Part 11 (e-signature)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Home > My Approvals                                      |
| My Approvals                                              [Filters]  |
+---------------------------------------------------------------------+
| [Tabs: Pending (12) | Completed | All]                               |
+---------------------------------------------------------------------+
| [Search by doc ID or title] [Type filter ▼] [Date range]            |
+---------------------------------------------------------------------+
|                                                                      |
| +----------------------------------------------------------------+  |
| | [icon] PR-2024-0047  Purchase Requisition                      |  |
| | Submitted by: Zhang Wei  |  Level 1 of 2  |  2 hours ago      |  |
| | Items: Widget-A (100 pcs), Sensor-B (50 pcs)                  |  |
| | Total estimated: ¥45,000.00                                    |  |
| | [View Details]               [Approve ✓]  [Reject ✗]          |  |
| +----------------------------------------------------------------+  |
|                                                                      |
| +----------------------------------------------------------------+  |
| | [icon] ECR-2024-0012  Engineering Change Request               |  |
| | Submitted by: Li Hua  |  Level 2 of 2  |  1 day ago           |  |
| | Impact: High  |  Type: BOM Change                             |  |
| | Affected items: 3 items, 2 BOMs                                |  |
| | [View Details]               [Approve ✓]  [Reject ✗]          |  |
| +----------------------------------------------------------------+  |
|                                                                      |
| +----------------------------------------------------------------+  |
| | [icon] MIN-2024-0089  Material Issue Notice (GM Override)      |  |
| | Warehouse rejected  |  Override requested by: Chen Ping        |  |
| | Override reason: "Urgent production line requirement"           |  |
| | [View Details]           [Approve Override]  [Deny Override]   |  |
| +----------------------------------------------------------------+  |
|                                                                      |
+---------------------------------------------------------------------+
| Showing 1-10 of 12                                  [< 1 2 >]       |
+---------------------------------------------------------------------+
```

## Approval Card Structure

Each approval item is rendered as a card with:

### Header Row
- Document type icon (Lucide, 20px, colored by module)
- Document ID (mono-sm, primary-500, clickable → opens detail page)
- Document type name (body-md, weight 500)
- Urgency badge (if overdue: red "Overdue" badge; if > 3 days: yellow "Aging" badge)

### Info Row
- Submitted by: user display name
- Approval level: "Level X of Y" (shows where in approval chain)
- Time since submission (relative)

### Summary Row (document-type specific)
- **PR**: Item names + quantities, total estimated amount
- **PO**: Supplier name, total amount, currency
- **ECR/ECO**: Impact level, change type, affected item count
- **Material Issue Notice**: Items, quantities, warehouse, override reason (if GM override)
- **Cycle Count**: Variance count, total adjustment value

### Action Row
- [View Details] — ghost button, opens document detail page or side panel
- [Approve] — primary button (green variant: success-500 bg)
- [Reject] — danger ghost button
- For GM Override: [Approve Override] / [Deny Override]

### Clicking Approve or Reject
1. Opens e-signature dialog (per design spec Section 10.2)
2. Pre-filled: username, action meaning ("I approve this document for processing" / "I reject this document")
3. User enters password + optional comment
4. On success: card slides out with success animation, count updates
5. On error: inline error message on card

## Tabs

| Tab | Content | Sort |
|---|---|---|
| **Pending** | Items awaiting current user's action | Oldest first (urgency) |
| **Completed** | Items user has already actioned (last 30 days) | Most recent first |
| **All** | Both pending and completed | Most recent activity first |

Completed tab cards show:
- Same structure but with action badge: "Approved ✓" (green) or "Rejected ✗" (red)
- Actioned timestamp
- No action buttons

## Filters
- **Document type**: Multi-select dropdown (PR, PO, ECR, Material Issue, Cycle Count, etc.)
- **Date range**: Submitted date range picker
- **Search**: Full-text search across document IDs and descriptions
- **Priority**: All, Urgent only

## Bulk Actions
- Checkbox on each card (left side)
- When checkboxes selected: sticky bottom bar appears with [Approve Selected (N)] [Reject Selected (N)]
- Bulk approve/reject triggers a single e-signature dialog for all selected items
- Only available on Pending tab

## Empty States
- **Pending tab empty**: Illustration + "All caught up! No approvals pending."
- **Completed tab empty**: "No approval history in the last 30 days."
- **Filter no results**: "No approvals match your filters." + [Clear Filters]

## Responsive Behavior

| Breakpoint | Cards | Actions |
|---|---|---|
| >= 1024px | Full card layout as shown | Inline buttons |
| 768-1023px | Full width cards | Inline buttons |
| < 768px | Full width cards, summary truncated | Buttons stacked below card |
