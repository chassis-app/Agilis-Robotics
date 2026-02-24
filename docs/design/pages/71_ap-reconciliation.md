# Screen Prompt: AP Reconciliation

## Screen ID
`FIN-AP-RECON`

## Route
`/finance/ap-reconciliation`

## Purpose
Three-way match reconciliation: PO → Goods Receipt → Supplier Invoice. Also handles subcontract fee statement reconciliation against supplier invoices. Identifies mismatches for resolution.

## Workflows
WF-07 (subcontract fee reconciliation), WF-14 (finance integration)

## Requirements
RQ-010 (subcontract fee reconciliation), RQ-027 (finance integration)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Finance > AP Reconciliation                              |
| AP Reconciliation                                                    |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Pending  | | Matched  | | Mismatched| | Total AP |                |
| | Invoices | | This Mo. | | Items     | | Value    |                |
| | 15       | | 42       | | 3 ⚠      | | ¥890K    |                |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| [Tabs: 3-Way Match | Subcontract Fees | Payment Schedule]            |
+---------------------------------------------------------------------+
```

## Tab: 3-Way Match

```
+---------------------------------------------------------------------+
| [🔍 Search PO/Invoice] [Supplier ▼] [Status ▼] [Date range]       |
+---------------------------------------------------------------------+
| PO No.     | Supplier    | PO Amt    | Received  | Invoice   | Match|
|            |             |           | Amt       | Amt       |      |
+------------+-------------+-----------+-----------+-----------+------+
| PO-2024-033| Acme Parts  | ¥45,000   | ¥45,000   | ¥45,000   | ✓   |
| PO-2024-035| SensorCo    | ¥24,000   | ¥22,000   | ¥24,000   | ⚠   |
|            |             |           |           |           |Qty ≠ |
| PO-2024-038| PrecisionM  | ¥18,000   | ¥18,000   | --        |Pend.|
+------------+-------------+-----------+-----------+-----------+------+
```

Match statuses:
- ✓ Full Match (green): PO = Receipt = Invoice
- ⚠ Mismatch (amber): variance between any two of the three
- Pending: invoice or receipt not yet recorded
- Overdue: invoice expected but not received past tolerance

### Mismatch Detail (expandable row)

```
▼ PO-2024-035 | SensorCo | Mismatch Detail
+---------------------------------------------------------------------+
| Line | Item       | PO Qty | Received | Invoiced | Variance         |
+------+------------+--------+----------+----------+------------------+
| 1    | Sensor-B   | 50     | 45       | 50       | -5 (short recv)  |
+------+------------+--------+----------+----------+------------------+
| Resolution: ○ Accept partial  ○ Create debit note  ○ Flag for review|
| Notes: [________________________________]                            |
| [Resolve]                                                            |
+---------------------------------------------------------------------+
```

## Tab: Subcontract Fees (RQ-010)

```
+---------------------------------------------------------------------+
| Subcontract Fee Reconciliation                                       |
+---------------------------------------------------------------------+
| SC Order | Supplier    | Fee Stmt  | Invoice   | Match | Actions    |
|          |             | Amount    | Amount    |       |            |
+----------+-------------+-----------+-----------+-------+------------+
| SC-008   | PrecisionM  | ¥5,000    | ¥5,000    | ✓     | [View]    |
| SC-011   | PrecisionM  | ¥6,000    | --        | Pend. | [Record]  |
| SC-014   | ExtFab      | ¥8,500    | ¥9,200    | ⚠ +8% | [Resolve] |
+----------+-------------+-----------+-----------+-------+------------+
```

## Tab: Payment Schedule

| Column | Content |
|---|---|
| Supplier | Supplier name |
| Invoice No. | Invoice reference |
| Amount | Invoice amount |
| Due Date | Payment due date |
| Status | Scheduled / Paid / Overdue |
| Actions | [Schedule Payment] [Mark Paid] |

## Actions
- [Record Invoice] — opens form to enter supplier invoice details
- [Resolve Mismatch] — opens resolution dialog with options
- [Export Reconciliation Report] — PDF/Excel
- [Post to Finance] — push approved reconciliations to finance system
