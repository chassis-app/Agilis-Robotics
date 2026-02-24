# Screen Prompt: Production Progress Dashboard

## Screen ID
`MFG-PROGRESS`

## Route
`/manufacturing/production-progress`

## Purpose
Operational dashboard showing real-time production status across all active work orders. Provides at-a-glance visibility into WO progress, bottlenecks, material readiness, and schedule compliance.

## Workflows
WF-08

## Requirements
RQ-011 (trackable production progress), RQ-013 (module readiness)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Manufacturing > Production Progress                      |
| Production Progress                       [Date range] [Refresh ⟳]  |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Active   | | On Track | | At Risk  | | Overdue  |                  |
| | WOs      | |          | |          | |          |                  |
| | 24       | | 18 ✓     | | 4 ⚠      | | 2 🔴     |                  |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| +--------------------------+ +------------------------------------+  |
| | WO Progress Summary      | | Material Readiness               |  |
| | (horizontal bar chart)   | | (grouped bar chart)              |  |
| |                          | |                                    |  |
| | WO-001 ████████░░ 80%   | | WO-001: 3/3 modules ready        |  |
| | WO-002 ████░░░░░░ 40%   | | WO-002: 2/3 modules ready ⚠      |  |
| | WO-003 ██░░░░░░░░ 20%   | | WO-003: 1/4 modules ready ⚠      |  |
| |                          | |                                    |  |
| +--------------------------+ +------------------------------------+  |
+---------------------------------------------------------------------+
| +------------------------------------------------------------------+ |
| | Active Work Orders Table                                         | |
| +------------------------------------------------------------------+ |
| | WO No. | Item | Qty | Progress | Module Gate | Due Date | Status | |
| +--------+------+-----+----------+-------------+----------+--------+ |
| | WO-001 | Assy | 100 | ████ 80% | ✓ 3/3      | 03-25    | On Trk | |
| | WO-002 | Mod  | 50  | ██░░ 40% | ⚠ 2/3      | 03-22    | Risk   | |
| | WO-003 | Assy | 200 | █░░░ 20% | ⚠ 1/4      | 03-20    | Overdue| |
| +------------------------------------------------------------------+ |
+---------------------------------------------------------------------+
```

## KPI Cards

| Card | Metric | Click Action |
|---|---|---|
| Active WOs | Count of WOs in Released + In Progress status | Filter table to active |
| On Track | WOs where progress % aligns with schedule | Filter to on-track |
| At Risk | WOs behind schedule but not yet overdue | Filter to at-risk (amber) |
| Overdue | WOs past planned end date | Filter to overdue (red) |

## Charts

### WO Progress Summary (horizontal bar chart)
- Each bar represents a WO
- Bar fill = % of operations completed
- Color: green (on track), amber (at risk), red (overdue)
- Click bar → navigates to WO detail

### Material Readiness (grouped indicator)
- Shows module readiness status per WO
- Visual: checkmark for ready modules, X for pending
- Click → navigates to WO BOM & Modules tab

## Active Work Orders Table

Sortable, filterable table:
| Column | Content |
|---|---|
| WO No. | Mono ID, clickable link |
| Item | Item name (bilingual) + revision |
| Quantity | Planned qty |
| Progress | Progress bar with % |
| Module Gate | "N/M ready" with color indicator |
| Due Date | Planned end date, red if overdue |
| Schedule Status | On Track (green) / At Risk (amber) / Overdue (red) badge |
| Current Operation | Name of currently active operation |
| Actions | [View] [Update Progress] |

## Auto-Refresh
- Data refreshes every 60 seconds
- Manual refresh button in header
- Last updated timestamp shown
