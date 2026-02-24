# Screen Prompt: Material Issue Request (Batch Mode)

## Screen ID
`INV-MIR-BATCH`

## Route
`/inventory/material-issue-requests`

## Purpose
Batch material issue request view that addresses the legacy limitation (RQ-014). Enables summary-page selection and merging of same-material lines from multiple work orders into a single consolidated issue request for warehouse processing.

## Workflows
WF-05 (Material Issue Request - Detail and Summary Batch Mode)

## Requirements
RQ-014 (summary page batch launch + merge same material), RQ-009 (auto-generation of issue requests)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Inventory > Material Issue Requests                      |
| Material Issue Requests                    [+ Create Batch Request]  |
+---------------------------------------------------------------------+
| [Tabs: Pending Lines | Active Requests | Completed]                  |
+---------------------------------------------------------------------+
```

## Tab: Pending Lines (Summary Page - NEW per RQ-014)

This is the key new capability: a summary view of all pending material issue lines from across work orders, enabling batch selection and merging.

```
+---------------------------------------------------------------------+
| Select lines to create batch issue request:                          |
+---------------------------------------------------------------------+
| [🔍 Search] [Warehouse ▼] [Item Type ▼] [WO filter ▼]             |
|                                [Select All Mergeable] [Clear All]    |
+---------------------------------------------------------------------+
| ☐ | Source WO    | Item       | Rev | Qty  | UOM | WH    | Req Date |
+---+--------------+------------+-----+------+-----+-------+----------+
|   | GROUP: Widget-A (Rev B) / WH-01  —  Mergeable ✓                |
+---+--------------+------------+-----+------+-----+-------+----------+
| ☑ | WO-2024-001  | Widget-A   | B   | 100  | pcs | WH-01 | 03-15   |
| ☑ | WO-2024-003  | Widget-A   | B   | 50   | pcs | WH-01 | 03-16   |
+---+--------------+------------+-----+------+-----+-------+----------+
|   | GROUP: Sensor-B (Rev A) / WH-01                                 |
+---+--------------+------------+-----+------+-----+-------+----------+
| ☐ | WO-2024-002  | Sensor-B   | A   | 25   | pcs | WH-01 | 03-15   |
+---+--------------+------------+-----+------+-----+-------+----------+
|   | GROUP: Widget-A (Rev B) / WH-02  —  Cannot merge with WH-01    |
+---+--------------+------------+-----+------+-----+-------+----------+
| ☐ | WO-2024-005  | Widget-A   | B   | 30   | pcs | WH-02 | 03-18   |
+---+--------------+------------+-----+------+-----+-------+----------+
```

### Grouping Logic
Lines are grouped by (item, revision, warehouse, UOM) for visual clarity.
- Group header shows: item name + revision + warehouse + merge eligibility
- "Mergeable ✓" badge if all lines in group have matching UOM and required dates within tolerance
- Lines within a mergeable group can be batch-selected

### Merge Rules (displayed as info panel)
```
ℹ Merge Rules:
• Lines can be merged when they share the same item, revision, warehouse, and UOM
• Required dates must be within the configured tolerance (default: 3 days)
• Merged lines create one consolidated pick list for warehouse efficiency
• Original source line IDs are preserved in the audit trail
```

### Merge Preview Panel

When lines are selected, a merge preview appears at the bottom:

```
+---------------------------------------------------------------------+
| Merge Preview                                                        |
+---------------------------------------------------------------------+
| Widget-A (Rev B) from WH-01                                        |
| Source lines: WO-2024-001 (100 pcs) + WO-2024-003 (50 pcs)        |
| Merged total: 150 pcs                                               |
| Required date: 2024-03-15 (earliest)                                |
| UOM match: ✓  |  Date tolerance: ✓ (1 day gap)                     |
+---------------------------------------------------------------------+
| ⚠ Stock check: 165 available, 150 requested — Sufficient ✓         |
+---------------------------------------------------------------------+
| [Cancel]                            [Create Merged Issue Request]    |
+---------------------------------------------------------------------+
```

### Unmerged Lines
Lines that cannot be merged (different UOM, date tolerance exceeded) show:
- ⚠ "Cannot merge: UOM mismatch" or "Cannot merge: date gap exceeds tolerance (7 days)"
- These lines create individual issue requests

## Tab: Active Requests

List of created (merged or individual) issue requests:

| Column | Content |
|---|---|
| Request No. | Mono ID, clickable |
| Status | Pending / In Progress / Completed |
| Items | Item names + merged totals |
| Source Lines | Count of merged source lines |
| Warehouse | Target warehouse |
| Created Date | Date |
| Actions | View, Print Pick List |

## Tab: Completed

Archived completed requests with full audit trail access.

## Issue Request Detail View

Shows:
- Header: Request No., Status, Created By, Warehouse
- Merged item lines with total quantities
- Source traceability section: expandable list showing original WO lines that were merged
  - `merged_from_line_ids_json` displayed as linked references
- Pick list (printable format for warehouse use)
- Status progression: Created → Warehouse Processing → Picked → Issued
- Audit trail tab showing merge operation and all subsequent actions
