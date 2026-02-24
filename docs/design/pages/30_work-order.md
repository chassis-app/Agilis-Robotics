# Screen Prompt: Work Order List & Detail

## Screen ID
`MFG-WO-LIST` / `MFG-WO-DETAIL`

## Route
- List: `/manufacturing/work-orders`
- Detail: `/manufacturing/work-orders/:id`
- Create: `/manufacturing/work-orders/new`

## Purpose
Create and manage production work orders. Track operations, material consumption, module readiness gating (RQ-013), production receipt, final inspection, and DHR generation. The primary screen for manufacturing execution.

## Workflows
WF-08 (Production Order and Module Readiness Gating)

## Requirements
RQ-011 (trackable production progress), RQ-013 (module readiness gating), RQ-015 (finished product inspection), RQ-020 (document links), RQ-024 (BOM sourcing visualization)

## List View

Standard list page with status tabs: All | Draft | Released | In Progress | Completed | Closed

| Column | Content |
|---|---|
| WO No. | Mono ID, clickable |
| Status | Draft / Released / In Progress / Completed / Closed |
| Item | Item name (CN + EN) + revision |
| Quantity | Planned production qty |
| Priority | Normal / High / Urgent |
| Module Ready | "3/3 ✓" or "2/3 ⚠" (ready count / total critical modules) |
| Progress | Progress bar (% of operations completed) |
| Planned Start | Date |
| Planned End | Date |
| Actions | View, Edit (draft), Release, Print WO |

## Detail View

### Header

| Field | Type | Required | Notes |
|---|---|---|---|
| WO Number | Mono | Auto | Auto-generated |
| Status | Badge | Auto | Colored by status |
| Item | Searchable select | Yes | Semi-finished or finished items only |
| Revision | Select | Yes | Released revisions |
| Quantity | Number | Yes | Planned production qty |
| Priority | Select | Yes | Normal / High / Urgent |
| Planned Start | Date picker | Yes | |
| Planned End | Date picker | Yes | |
| Production Line | Select | No | If applicable |

### Tab: BOM & Modules (Key Feature)

#### BOM Tree View (per design spec Section 15.4)
- Expandable tree showing BOM hierarchy
- Color-coded by sourcing type (RQ-024): blue=purchase, green=make, orange=subcontract
- Critical component flag (star icon)
- Substitute indicator
- Click any node → opens item detail in side panel

#### Module Readiness Gate (RQ-013)

```
+---------------------------------------------------------------------+
| Module Readiness Gate                                                |
+---------------------------------------------------------------------+
| Module          | Type        | Critical | Status     | Source       |
+-----------------+-------------+----------+------------+--------------+
| Module-Y        | Make        | Yes ⭐   | ✓ Ready    | WO-2024-052 |
| Module-Z        | Subcontract | Yes ⭐   | ✗ Pending  | SC-2024-008 |
| Sub-Assembly-Q  | Make        | Yes ⭐   | ✓ Ready    | WO-2024-055 |
| Packaging       | Purchase    | No       | ✓ Ready    | PO-2024-022 |
+-----------------+-------------+----------+------------+--------------+
| Gate Status: ⚠ BLOCKED — 1 critical module pending                  |
|                                                                      |
| [Release Work Order] (disabled — requires all critical modules ✓)    |
+---------------------------------------------------------------------+
```

- Each module row shows source document link (WO, SC, PO)
- Click source link to navigate to that document
- Gate status summary: BLOCKED (red) if any critical module not ready, READY (green) if all clear
- [Release Work Order] button only enabled when all critical modules ready
- Optional modules shown but do not block release

### Tab: Operations

Manufacturing operations sequence:

```
+---------------------------------------------------------------------+
| Operations                                                           |
+---------------------------------------------------------------------+
| Seq | Operation       | Work Center | Planned  | Actual   | Status  |
|     |                 |             | Start/End| Start/End|         |
+-----+------------------+-------------+----------+----------+---------+
| 10  | Cut raw material | CUT-01      | 03-20    | 03-20    | ✓ Done |
|     |                  |             | 03-20    | 03-20    |         |
+-----+------------------+-------------+----------+----------+---------+
| 20  | Machining        | MCH-01      | 03-21    | 03-21    | ▶ In   |
|     |                  |             | 03-22    | --       | Progress|
+-----+------------------+-------------+----------+----------+---------+
| 30  | Assembly         | ASM-01      | 03-23    | --       | ○ Not  |
|     |                  |             | 03-24    | --       | Started |
+-----+------------------+-------------+----------+----------+---------+
| 40  | Final QA         | QA-01       | 03-25    | --       | ○ Not  |
|     |                  |             | 03-25    | --       | Started |
+-----+------------------+-------------+----------+----------+---------+
| Overall Progress: ████████░░░░░░░░░░░░ 35%                          |
+---------------------------------------------------------------------+
```

Each operation row:
- [Start] / [Complete] buttons for status transitions
- Operator assignment (user select)
- Comments/notes field
- Linked work instructions (from Documents tab)

### Tab: Material Issues

List of material issue notices linked to this WO:
- Table showing issued materials, lots consumed, quantities
- [Create Material Issue Notice] button
- Links to material outbound notes

### Tab: Production Receipt

```
+---------------------------------------------------------------------+
| Production Receipt                                                   |
+---------------------------------------------------------------------+
| Planned Qty: 100  |  Received: 0  |  Remaining: 100                |
+---------------------------------------------------------------------+
| Finished Lot/Serial: * [LOT-2024-____] or [Auto-generate]          |
| Quantity Received: * [____]                                          |
| Storage Location: * [FG-01 ▼]                                       |
|                                                                      |
| ⚠ Final inspection required before release to finished goods (RQ-015)|
| Inspection will be auto-created on receipt posting.                  |
|                                                                      |
| [Post Production Receipt]                                            |
+---------------------------------------------------------------------+
```

After posting:
- Creates finished goods lot/serial
- Auto-creates final inspection record (RQ-015)
- Links to consumed component lots (genealogy)
- Creates DHR skeleton

### Tab: Documents (RQ-020)
- Work instructions, quality plans, process specifications
- Each shows: doc ID, title, revision, type, status
- Version selector: shows latest effective released document
- [Link Document] button

### Tab: Audit Trail
Full immutable event log.

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Discard] [Save Draft] [Release WO] (requires gate check) |
| Released | [Start Production] [Create Material Issue] |
| In Progress | [Complete WO] (all operations must be done) |
| Completed | [Post Production Receipt] [View DHR] |
| Closed | Read-only, [View DHR] [Print WO Summary] |
