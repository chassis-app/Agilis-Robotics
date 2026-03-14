# Screen Prompt: Sales Forecast List

## Screen ID
`SALES-FORECAST-LIST`

## Route
- List: `/sales/forecasts`

## Purpose
List view of all sales forecasts with quick access to create, import, and track procurement status. Serves as the entry point for sales-driven procurement planning.

## Workflows
- WF-15 (Sales-Driven Procurement Planning)

## Quick Stats Cards (Top)

```
+-------------------+-------------------+-------------------+-------------------+
| Active Forecasts  | Pending PRs       | Open POs          | Expected Revenue  |
| 8                 | 12                | 23                | ¥2,450,000        |
| ↑ 2 from last mo  | ↓ 3 from last mo  | ↑ 5 from last mo  | ↑ 15% YoY         |
+-------------------+-------------------+-------------------+-------------------+
```

## Filters Bar

| Filter | Type | Options |
|---|---|---|
| Period | Date range picker | This month, This quarter, Custom |
| Status | Multi-select | Draft, Accepted, Processed, Closed |
| Created By | User select | Active users |
| Has Shortage | Checkbox | Show only forecasts with material shortage |

## Forecast List Table

| Column | Content | Sortable |
|---|---|---|
| Forecast No. | Mono ID, link to detail | Yes |
| Period | Display period (e.g., "2024 Q2") | Yes |
| Description | Truncated text | No |
| Items | Count of forecast lines | No |
| Total Qty | Sum of all quantities | Yes |
| Est. Revenue | Calculated if prices provided | Yes |
| Status | Badge | Yes |
| PRs Generated | Count with drill-down link | No |
| Shortage Alert | ⚠ icon if unresolved shortage | No |
| Created | Date + user | Yes |
| Actions | Menu | No |

### Status Badges

| Status | Color | Description |
|---|---|---|
| Draft | Gray | Being edited, not yet accepted |
| Accepted | Blue | Locked, ready for PR generation |
| Processed | Green | PRs generated, procurement in progress |
| Closed | Dark Gray | Completed or cancelled |

### Actions Menu

| Action | Availability |
|---|---|
| View Detail | All |
| Edit | Draft only |
| Accept | Draft only |
| Generate PRs | Accepted only |
| View PRs | Processed only |
| Duplicate | All |
| Delete | Draft only |
| Export Excel | All |

## Bulk Actions

Select multiple forecasts for bulk operations:

| Action | Description |
|---|---|
| Accept All | Accept selected drafts |
| Generate PRs | Generate PRs for selected accepted forecasts |
| Export to Excel | Download selected as Excel file |

## Keyboard Shortcuts

| Key | Action |
|---|---|
| N | New forecast |
| I | Import Excel |
| Enter | Open selected forecast |

## Empty State

When no forecasts exist:

```
+-----------------------------------------------------------------------+
|                                                                       |
|                    No Sales Forecasts Yet                             |
|                                                                       |
|     Create your first forecast to start planning procurement.         |
|                                                                       |
|              [+ New Forecast]    [Import Excel]                       |
|                                                                       |
+-----------------------------------------------------------------------+
```

## Related Navigation

- **Sales Planning** (detailed forecast management) → `/sales/planning`
- **Sales Orders** → `/sales/orders`
- **Purchase Requisitions** → `/procurement/purchase-requisitions`