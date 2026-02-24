# Screen Prompt: Cycle Count

## Screen ID
`INV-CYCLE-COUNT`

## Route
- List: `/inventory/cycle-counts`
- Detail: `/inventory/cycle-counts/:id`

## Purpose
Plan and execute periodic warehouse inventory counts (quarterly/yearly). Supports blind counting, variance calculation, approval with e-signature, and adjustment posting with full audit trail.

## Workflows
WF-13 (Warehouse Periodic Checks)

## Requirements
RQ-009 (quarterly/yearly checks), RQ-013 (periodic warehouse checks), 21 CFR Part 11 (e-signature for adjustments)

## List View

Standard list page with columns:
| Column | Content |
|---|---|
| Plan No. | Mono ID, clickable |
| Status | Planned / Counting / Pending Approval / Approved / Posted |
| Period | Q1 2024 / FY 2024 etc. |
| Warehouse | Warehouse name |
| Items to Count | Total items in scope |
| Counted | Count of items already counted |
| Variances | Count of items with variance |
| Freeze Date | Timestamp when count was frozen |
| Actions | Context-dependent |

Create button: [+ Create Count Plan]

## Detail View

### Header

| Field | Type | Notes |
|---|---|---|
| Plan No. | Mono | Auto-generated |
| Status | Badge | Colored by status |
| Period | Select | Quarterly / Yearly + year selection |
| Warehouse | Select | Target warehouse |
| Freeze Timestamp | Datetime (read-only) | Set when counting begins |
| Count Scope | Text | "All items" or specific category/location filter |

### Count Entry Table (Blind Count Mode)

During counting status, system quantities are HIDDEN from counter:

```
+---------------------------------------------------------------------+
| Cycle Count Entry — Blind Mode                                       |
| System quantities hidden until count submitted                       |
+---------------------------------------------------------------------+
| # | Item       | Rev | Location | Counted Qty * | Notes             |
+---+------------+-----+----------+---------------+-------------------+
| 1 | Widget-A   | B   | RAW-01   | [____]        | [___________]     |
| 2 | Sensor-B   | A   | RAW-01   | [____]        | [___________]     |
| 3 | Part-P     | A   | RAW-02   | [____]        | [___________]     |
+---------------------------------------------------------------------+
| [Save Progress]                              [Submit Count]          |
+---------------------------------------------------------------------+
```

### Variance Review (After Count Submitted)

System quantities revealed; variances calculated:

```
+---------------------------------------------------------------------+
| Variance Review                                                      |
+---------------------------------------------------------------------+
| # | Item       | Rev | Location | System | Counted | Variance | %   |
+---+------------+-----+----------+--------+---------+----------+-----+
| 1 | Widget-A   | B   | RAW-01   | 165    | 160     | -5       | -3% |
| 2 | Sensor-B   | A   | RAW-01   | 200    | 200     | 0        | 0%  |
| 3 | Part-P     | A   | RAW-02   | 400    | 395     | -5       | -1% |
+---------------------------------------------------------------------+
| Items with variance: 2 of 3                                          |
| Total variance value: -¥2,250.00                                    |
+---------------------------------------------------------------------+
```

Variance rows with non-zero variance highlighted:
- Small variance (< 5%): amber background
- Large variance (>= 5%): red background
- Zero variance: green checkmark

### Adjustment Approval

For each variance line:
- Reason code required: select from (Damage, Theft, Measurement Error, System Error, Other)
- Free-text explanation
- Approve / Reject per line

```
+---------------------------------------------------------------------+
| Adjustment Approval                                                  |
+---------------------------------------------------------------------+
| Item: Widget-A (Rev B) | Variance: -5 pcs | Value: -¥2,250.00     |
|                                                                      |
| Reason Code: * [Measurement Error ▼]                                |
| Explanation: * [Partial lot was moved to WH-02 without transfer___] |
|                                                                      |
| [Reject Adjustment]                    [Approve Adjustment]          |
+---------------------------------------------------------------------+
```

[Approve Adjustment] triggers e-signature dialog (21 CFR Part 11):
- Meaning: "I approve this inventory adjustment with documented justification"
- Password re-entry required
- Audit event created with full variance details

### Post Adjustments

After all variances approved:
- [Post Adjustments] button creates inventory adjustment transactions
- Each adjustment is an immutable inventory_txn record
- Lot quantities updated
- Complete audit chain: freeze → count → variance → reason → approval → adjustment

## Footer Actions by Status

| Status | Actions |
|---|---|
| Planned | [Edit Plan] [Start Count] (freezes system quantities) |
| Counting | [Save Progress] [Submit Count] |
| Pending Approval | [Approve/Reject per line] [Post Adjustments] |
| Posted | Read-only, [Export Report] [Print] |
