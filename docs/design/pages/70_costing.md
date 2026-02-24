# Screen Prompt: Costing

## Screen ID
`FIN-COSTING`

## Route
`/finance/costing`

## Purpose
Track and analyze cost elements across inventory, production, and subcontracting. Monitor cost accumulation per work order and lot. Support standard, moving average, or actual lot costing methods.

## Workflows
WF-14 (Finance integration)

## Requirements
RQ-010 (subcontract fee reconciliation), RQ-027 (finance/cost integration)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Finance > Costing                                        |
| Costing                                           [Period: Mar 2024] |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Total    | | Material | | Labor    | | Subcontr.|                  |
| | Cost MTD | | Cost     | | Cost     | | Cost     |                  |
| | ¥2.4M    | | ¥1.6M    | | ¥480K    | | ¥320K    |                  |
| | +8% ▲    | | +5% ▲    | | +12% ▲   | | +15% ▲   |                  |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| [Tabs: Cost by Item | Cost by WO | Cost Transactions | Variance]     |
+---------------------------------------------------------------------+
```

## Tab: Cost by Item

| Column | Content |
|---|---|
| Item | Item name + revision |
| Type | Raw / Semi / Finished |
| Standard Cost | Defined standard cost per unit |
| Actual Cost | Calculated actual cost per unit |
| Variance | Actual - Standard (green if favorable, red if unfavorable) |
| Variance % | Percentage |
| Total Cost MTD | Month-to-date total |

## Tab: Cost by Work Order

| Column | Content |
|---|---|
| WO No. | Clickable link |
| Item | Item produced |
| Planned Cost | BOM cost x planned qty |
| Actual Cost | Sum of all cost transactions |
| Material Cost | Material consumption cost |
| Labor Cost | Operation labor cost |
| Overhead | Allocated overhead |
| Variance | Planned - Actual |
| Status | On Budget / Over Budget / Under Budget |

## Tab: Cost Transactions

Detailed ledger of all cost-creating events:

| Column | Content |
|---|---|
| Timestamp | Date and time |
| Transaction Type | Receipt / Issue / Production / Adjustment / Subcontract Fee |
| Source Document | GRN / WO / SC / Adjustment ID (clickable) |
| Item | Item name |
| Lot | Lot number |
| Quantity | Qty affected |
| Unit Cost | Per-unit cost |
| Total | Line total |
| Posted to Finance | ✓ / Pending / Failed |

## Tab: Variance Analysis

Charts and tables showing cost variance analysis:
- Standard vs actual cost bar chart by item category
- Variance trend line chart over time
- Top 10 items by absolute variance
- Drill-down to source transactions

## Export
- [Export Cost Report] — formatted PDF/Excel for accounting
- [Post to Finance] — push pending transactions to external finance system (RQ-027)
