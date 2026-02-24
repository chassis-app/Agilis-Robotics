# Screen Prompt: Material Issue Notice List & Detail

## Screen ID
`INV-MIN-LIST` / `INV-MIN-DETAIL`

## Route
- List: `/inventory/material-issue-notices`
- Detail: `/inventory/material-issue-notices/:id`

## Purpose
Manage material issue notices that authorize warehouse to release materials for production or subcontracting. Includes warehouse approval/rejection step and GM override capability.

## Workflows
WF-04 (Material Issue Notice and Outbound Control)

## Requirements
RQ-006 (warehouse approval + GM override), RQ-007 (outbound note + shortage handling)

## List View

Standard list page with columns:
| Column | Content |
|---|---|
| Notice No. | Mono ID, clickable |
| Status | Draft / Submitted / WH Approved / WH Rejected / GM Overridden / Issued / Cancelled |
| Source | Work Order or Subcontract Order link |
| Planner | User who created the notice |
| Items | Count of line items |
| Created Date | Date |
| Actions | Context-dependent |

Status tabs: All | Draft | Submitted | WH Approved | WH Rejected | Issued

## Detail View

### Header Fields

| Field | Type | Notes |
|---|---|---|
| Notice No. | Mono text | Auto-generated |
| Status | Badge | With status-specific color |
| Source Document | Link | Links to WO or Subcontract Order |
| Planner | Text (read-only) | Creator |
| Created Date | Date (read-only) | Auto |
| Warehouse | Select | Target warehouse for issue |

### Line Items

```
+---------------------------------------------------------------------+
| Material Issue Lines                                                 |
+---------------------------------------------------------------------+
| # | Item       | Rev | Required | Available | Status     | Actions  |
|   |            |     | Qty      | Qty       |            |          |
+---+------------+-----+----------+-----------+------------+----------+
| 1 | Widget-A   | B   | 100      | 65        | ⚠ Shortage | [Detail] |
|   | (传感器A)  |     |          |           | (35 short) |          |
+---+------------+-----+----------+-----------+------------+----------+
| 2 | Sensor-B   | A   | 50       | 200       | ✓ OK       | [Detail] |
|   | (传感器B)  |     |          |           |            |          |
+---+------------+-----+----------+-----------+------------+----------+
```

Each line shows:
- Real-time available qty check against warehouse stock
- Status: ✓ OK (green) if available >= required, ⚠ Shortage (amber) if partial, ✗ Out of Stock (red) if zero
- Shortage quantity calculated and displayed

### Warehouse Approval Section

Visible to warehouse role when status is "Submitted":

```
+---------------------------------------------------------------------+
| Warehouse Review                                                     |
+---------------------------------------------------------------------+
| All items available: ⚠ No (1 of 2 lines have shortage)             |
|                                                                      |
| Decision:                                                            |
| [Approve All ✓]  [Reject ✗]  [Partial Approve]                     |
|                                                                      |
| Rejection Reason (required if rejecting):                            |
| [Select reason ▼] [________________________________]                |
|                                                                      |
| Reason options: Insufficient stock | Quality hold | Location         |
| unavailable | Other (specify)                                        |
+---------------------------------------------------------------------+
```

### GM Override Section (RQ-006)

Visible only to GM role when status is "WH Rejected":

```
+---------------------------------------------------------------------+
| ⚠ GM Override Required                                              |
+---------------------------------------------------------------------+
| This material issue was rejected by warehouse.                       |
| Rejected by: Wang Jun  |  Reason: Insufficient stock                |
|                                                                      |
| To override, you must provide a documented justification.            |
|                                                                      |
| Override Reason: *                                                   |
| [____________________________________________________________]       |
| [____________________________________________________________]       |
|                                                                      |
| ⚠ This action will be permanently recorded in the audit trail      |
|   and requires electronic signature.                                 |
|                                                                      |
| [Cancel]                              [Override & Sign]              |
+---------------------------------------------------------------------+
```

Clicking [Override & Sign] opens e-signature dialog with meaning: "I override warehouse rejection for this material issue with documented justification."

### Status Timeline

Visual timeline showing all state transitions:
```
●━━━━━━━●━━━━━━━●━━━━━━━✗━━━━━━━●━━━━━━━○
Created  Submitted WH Review Rejected  GM Override  Issued
Li Ming  Li Ming   Wang Jun  Wang Jun   Chen GM      (pending)
03-14    03-14     03-14     03-14      03-15
```

### Post Issue
After warehouse approval (or GM override):
- System creates material_outbound_note
- Inventory transactions posted (issue type)
- Lot/serial traceability links created
- Status changes to "Issued"

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Discard] [Save Draft] [Submit to Warehouse] |
| Submitted | Read-only for planner; warehouse sees approval section |
| WH Approved | [Post Issue] (creates outbound note + inventory txns) |
| WH Rejected | GM sees override section; planner sees [Edit & Resubmit] |
| GM Overridden | [Post Issue] |
| Issued | Read-only, [View Outbound Note] |
