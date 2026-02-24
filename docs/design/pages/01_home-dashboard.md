# Screen Prompt: Home Dashboard

## Screen ID
`HOME-DASHBOARD`

## Route
`/`

## Purpose
Role-aware landing page after login. Shows personalized KPI cards, pending action items, and recent activity relevant to the user's role. Serves as the primary entry point for daily operations.

## Workflows
All workflows (entry point)

## Requirements
Role-based display (all RQs via role filtering)

## Layout

```
+---------------------------------------------------------------------+
| Dashboard                                        [Date range] [⟳]   |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | KPI Card | | KPI Card | | KPI Card | | KPI Card |  (row, 4-col)  |
| | 1        | | 2        | | 3        | | 4        |                 |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| +---------------------------+ +------------------------------------+ |
| | Pending Actions           | | Alerts & Notifications             | |
| | (list, scrollable)        | | (list, scrollable)                 | |
| |                           | |                                    | |
| +---------------------------+ +------------------------------------+ |
+---------------------------------------------------------------------+
| +------------------------------------------------------------------+ |
| | Recent Activity (table, last 10 events)                          | |
| +------------------------------------------------------------------+ |
+---------------------------------------------------------------------+
```

## KPI Cards (Role-Dependent)

Each KPI card contains:
- Title (caption, 12px, neutral-500)
- Primary value (display-sm, 24px, weight 700, neutral-900)
- Trend indicator: arrow icon + percentage + "vs last 7 days" (caption, green for positive / red for negative)
- Sparkline mini-chart (48px height, no axis labels)

### Card Sets by Role

| Role | Card 1 | Card 2 | Card 3 | Card 4 |
|---|---|---|---|---|
| **Supply Chain Manager** | Pending Approvals | Open PRs | POs Due This Week | Overdue Deliveries |
| **Inventory Controller** | Low Stock Alerts | Pending Material Issues | Cycle Counts Due | Total Stock Value |
| **Production Planner** | Active Work Orders | Module Readiness % | Material Shortages | WOs Completing Today |
| **QA Inspector** | Pending Inspections | Open Nonconformances | Open CAPAs | Inspection Pass Rate (%) |
| **R&D Engineer** | ECRs In Progress | Items in R&D Stage | BOMs Pending Release | Documents Expiring |
| **Warehouse** | Pending GRN | Material Issues to Process | Transfers Pending | Cycle Count Tasks |
| **Finance** | Unreconciled AP | Cost Posting Queue | Failed Integrations | Monthly Cost Variance |

Card styling:
- Background: `--color-neutral-0` (white)
- Border: 1px solid `--color-neutral-200`
- Border-radius: `--radius-lg` (8px)
- Padding: 20px
- Hover: `--shadow-md`, cursor-pointer (clicking navigates to relevant list page)

## Pending Actions Panel (Left, 50% width)

Title: "My Pending Actions" with count badge

List of actionable items sorted by urgency (oldest first):
- Each item shows:
  - Document type icon (Lucide, 16px)
  - Document ID (mono-sm, clickable link)
  - Document type label
  - Brief description (body-sm, truncated to 1 line)
  - Submitted by (caption)
  - Time since submitted (caption, relative: "2h ago", "3 days ago")
  - Quick action buttons: [Approve] [Reject] (ghost buttons, primary/danger)
- Empty state: Illustration + "No pending actions" message
- Footer: "View All Approvals →" link to Approval Inbox
- Max 8 items displayed, scroll if more

## Alerts Panel (Right, 50% width)

Title: "Active Alerts" with count badge

List of system alerts:
- Safety stock alerts (warning-500 icon): "Widget-A below threshold in WH-01 (65/100)"
- Overdue items (danger-500 icon): "PO-2024-0033 overdue by 3 days"
- Integration failures (danger-500 icon): "2 Feishu notifications failed"
- Inspection pending (info-500 icon): "LOT-2024-0234 awaiting inspection"

Each alert:
- Severity icon + colored left border (warning/danger/info)
- Title text (body-sm)
- Timestamp (caption)
- Action link: "View →"
- Dismiss button (X icon, ghost)

## Recent Activity Table

Title: "Recent Activity"

| Column | Width | Content |
|---|---|---|
| Timestamp | 140px | Relative time ("2 hours ago"), tooltip shows UTC |
| User | 140px | User display name |
| Action | 100px | Badge: Created, Updated, Submitted, Approved, Rejected |
| Document | 180px | Type icon + document ID (linked) |
| Description | flex | Brief change description, truncated |

- 10 rows max, no pagination
- Footer: "View Full Audit Log →" link

## Responsive Behavior

| Breakpoint | KPI Cards | Panels | Activity Table |
|---|---|---|---|
| >= 1024px | 4 per row | Side by side (50/50) | Full table |
| 768-1023px | 2 per row (2 rows) | Stacked (full width each) | Horizontal scroll |
| < 768px | 1 per row (4 rows) | Stacked (full width each) | Card layout per row |

## Interactions
- KPI card click → navigates to the relevant list page (e.g., "Pending Approvals" → Approval Inbox)
- Quick Approve/Reject on pending actions → triggers e-signature dialog (Section 10.2 of design spec)
- Alert dismiss → marks alert as acknowledged in system
- Auto-refresh: every 60 seconds (configurable), or manual refresh button
- Date range selector: Today, Last 7 Days, Last 30 Days, Custom Range
