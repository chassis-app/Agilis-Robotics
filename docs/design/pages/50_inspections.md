# Screen Prompt: Inspections

## Screen ID
`QA-INSPECTIONS`

## Route
- List: `/quality/inspections`
- Detail: `/quality/inspections/:id`

## Purpose
Manage incoming, in-process, and final product inspections. Record inspection results, defect documentation, and pass/fail disposition. Failed inspections route to nonconformance flow.

## Workflows
WF-03 (Receiving and Incoming/Final Inspection)

## Requirements
RQ-015 (finished product inspection note)

## List View

| Column | Content |
|---|---|
| Inspection No. | Mono ID, clickable |
| Type | Incoming / In-Process / Final (badge) |
| Status | Pending / In Progress / Passed / Failed |
| Source | GRN / WO / SC number (clickable link) |
| Item | Item name (bilingual) + revision |
| Lot/Serial | Lot or serial number |
| Inspector | Assigned QA user |
| Created Date | Date |
| Completed Date | Date (blank if pending) |
| Actions | Start, Record Results, View |

Status tabs: All | Pending | In Progress | Passed | Failed

## Detail View

### Header

| Field | Type | Notes |
|---|---|---|
| Inspection No. | Mono | Auto-generated |
| Type | Badge | Incoming / In-Process / Final |
| Status | Badge | Pending / In Progress / Passed / Failed |
| Source Document | Link | GRN, Work Order, or Subcontract Receipt |
| Item + Revision | Text | Item being inspected |
| Lot/Serial | Mono text | Lot or serial under inspection |
| Quantity | Number | Quantity to inspect |
| Inspector | User select | Assigned QA inspector |

### Inspection Criteria Section

```
+---------------------------------------------------------------------+
| Inspection Criteria                                                  |
+---------------------------------------------------------------------+
| # | Criterion         | Spec        | Method    | Result | Pass?   |
+---+--------------------+-------------+-----------+--------+---------+
| 1 | Dimension (mm)     | 10.0 ± 0.1  | Caliper   | [10.05]| ✓ Pass |
| 2 | Surface finish     | Ra 0.8 max  | Profilom. | [0.72] | ✓ Pass |
| 3 | Visual inspection  | No defects  | Visual    | [____] | ○ --   |
| 4 | Electrical test    | 5V ± 0.2    | Multimeter| [____] | ○ --   |
+---+--------------------+-------------+-----------+--------+---------+
```

Each criterion:
- Specification reference (from inspection plan)
- Test method
- Result input (number, text, or pass/fail toggle)
- Auto-evaluate: if numerical, auto-compare against spec and mark pass/fail
- Manual override: inspector can override auto-evaluation with reason

### Defect Documentation

```
+---------------------------------------------------------------------+
| Defect Records                                  [+ Record Defect]    |
+---------------------------------------------------------------------+
| # | Defect Type      | Qty  | Severity | Description   | Photo     |
+---+-------------------+------+----------+---------------+-----------+
| 1 | Dimension OOS    | 3    | Major    | Width 10.3mm  | [📷 View] |
+---+-------------------+------+----------+---------------+-----------+
```

- Defect types: Dimension Out of Spec, Surface Defect, Functional Failure, Cosmetic, Other
- Severity: Critical / Major / Minor
- Photo upload for visual evidence
- Defect quantity

### Disposition Section

```
+---------------------------------------------------------------------+
| Disposition                                                          |
+---------------------------------------------------------------------+
| Overall Result: ○ Pass  ○ Conditional Pass  ○ Fail                  |
|                                                                      |
| If Pass:                                                             |
|   Lot status → Available, move to storage location                  |
|                                                                      |
| If Conditional Pass:                                                 |
|   Condition notes: * [________________________________]             |
|   Lot status → Available with condition flag                        |
|                                                                      |
| If Fail:                                                             |
|   Lot status → Rejected                                             |
|   Action: ○ Create Nonconformance  ○ Return to Supplier            |
|   NC Reference: [auto-created link]                                 |
|                                                                      |
| [Cancel]                        [Complete Inspection & Sign]         |
+---------------------------------------------------------------------+
```

[Complete Inspection & Sign] triggers e-signature dialog:
- Meaning: "I certify these inspection results are accurate"
- Creates immutable inspection record

## Responsive
- Criteria table scrolls horizontally on mobile
- Defect photos viewable in lightbox
