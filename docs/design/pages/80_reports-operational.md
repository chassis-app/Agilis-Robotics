# Screen Prompt: Reports - Operational Dashboards

## Screen ID
`RPT-OPERATIONAL`

## Route
`/reports/operational`

## Purpose
Operational reporting dashboards covering PR/PO aging, approval cycle times, supplier performance, stock shortage risk, production progress, and subcontract WIP. Configurable date ranges and export capabilities.

## Workflows
All (reporting aggregation)

## Requirements
Per API doc Section 3: PR Aging, PO Aging, Approval Cycle Time, Supplier Quotation Comparison, Stock/Shortage Risk, Subcontract WIP, Production Progress

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Reports > Operational Dashboards                         |
| Operational Dashboards                    [Period: Mar 2024 ▼] [↓]  |
+---------------------------------------------------------------------+
| [Sub-tabs: Procurement | Inventory | Production | Suppliers]         |
+---------------------------------------------------------------------+
```

## Sub-tab: Procurement

### PR Aging Chart
- Horizontal stacked bar chart
- X-axis: age buckets (0-3 days, 4-7, 8-14, 15-30, 30+)
- Bars segmented by status (Draft, Submitted, In Approval)
- Click bar segment → drills into PR list filtered to that bucket

### PO Aging Chart
- Same format as PR aging
- Segmented by status (Sent, Partially Received)
- Highlight overdue POs in red

### Approval Cycle Time
- Box plot or bar chart showing average approval turnaround by step/role
- Breakdown: Level 1 avg, Level 2 avg, total avg
- Trend line over last 6 months

## Sub-tab: Inventory

### Stock & Shortage Risk
- Table: items at risk of shortage sorted by severity
- Columns: Item, Available, Safety Threshold, Shortage, Days of Supply, Risk Level
- Risk levels: Critical (< 3 days supply), Warning (< 7 days), OK (>= 7 days)
- Sparkline for stock trend over last 30 days

### Inventory Turnover
- Bar chart by item category
- Turnover ratio = cost of goods issued / average inventory value

## Sub-tab: Production

### Production Progress by WO/Module/Operation
- Gantt-style chart showing WO timeline with actual vs planned
- Color coding: green (on track), amber (at risk), red (overdue)
- Drill-down: click WO bar → shows operation-level progress

### WO Completion Rate
- Line chart: WOs completed vs planned per week
- KPI card: on-time completion percentage

## Sub-tab: Suppliers

### Supplier Performance Scorecards
- Radar chart (max 6 axes): On-time delivery, Quality, Price competitiveness, Responsiveness, Compliance, Overall
- Dropdown to select supplier
- Trend table showing score change over time

### Quotation Winner Rationale Report
- Table: RFQ → winning supplier → selection rationale → price comparison
- Per API doc: Supplier Quotation Comparison and Winner Rationale

## Common Features
- Date range selector: This Month, Last Month, Last Quarter, YTD, Custom
- [Export PDF] / [Export Excel] for each chart/table
- Print-optimized layout
- Accessible data table alternative for every chart
