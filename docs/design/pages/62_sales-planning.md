# Screen Prompt: Sales Planning & Forecast

## Screen ID
`SALES-PLANNING`

## Route
- Planning List: `/sales/planning`
- Planning Detail: `/sales/planning/:id`

## Purpose
Sales forecast management with Excel import, manual adjustment, and auto-generation of purchase requisitions. Drives procurement planning from sales demand through BOM explosion and net requirement calculation.

## Workflows
- WF-15 (Sales-Driven Procurement Planning)

## Requirements
- New: Sales estimation → Manufacturing forecast → PR generation
- New: Excel-based forecast with manual adjustment
- New: Multi-supplier conflict resolution

## Planning List

### Filters
- Period (month/quarter/year)
- Status (Draft / Accepted / Processed / Closed)
- Created by
- Date range

### Table Columns

| Column | Content |
|---|---|
| Forecast No. | Mono ID, clickable |
| Period | e.g., "2024 Q2" or "2024-03" |
| Description | Text |
| Total Forecast Qty | Sum of all line quantities |
| Status | Draft / Accepted / Processed / Closed |
| Created | Date + user |
| PRs Generated | Count with link |
| Actions | View, Edit, Accept, Generate PRs, Delete |

### Header Actions
- **[+ New Forecast]**: Create blank forecast
- **[Import Excel]**: Upload forecast from Excel file
- **[Export Template]**: Download Excel template

## Forecast Detail

### Header Section

| Field | Type | Required |
|---|---|---|
| Forecast No. | Mono | Auto |
| Period | Date picker (month) | Yes |
| Description | Text | No |
| Status | Badge | Auto |
| Created By | Text | Auto |
| Created At | Datetime | Auto |
| Accepted By | Text | Auto (when accepted) |
| Accepted At | Datetime | Auto (when accepted) |

### Forecast Lines Tab

Manual entry or imported from Excel.

| Column | Content |
|---|---|
| Line # | Auto |
| Item | Searchable select (finished goods) |
| Item Description | Auto |
| Revision | Select (released) |
| Forecast Qty | Number |
| UOM | Auto |
| Unit Price | Number (optional) |
| Line Total | Calculated |
| Confidence % | Select (High/Medium/Low) |
| Notes | Text |

### Actions Bar
- **[Add Line]**: New row
- **[Import Excel]**: Replace/merge from file
- **[Export to Excel]**: Download for offline editing
- **[Accept Forecast]**: Lock for PR generation

## Excel Import/Export

### Template Structure

| Column | Description |
|---|---|
| Item No. | Item number (must exist in master) |
| Revision | Revision code (optional, defaults to current) |
| Forecast Qty | Quantity |
| Unit Price | Optional |
| Confidence | High/Medium/Low |
| Notes | Optional text |

### Import Workflow

```
+-----------------------------------------------------------------------+
| Import Forecast from Excel                                            |
+-----------------------------------------------------------------------+
| File: 2024_Q2_Forecast.xlsx                                          |
|                                                                       |
| [Preview] [Import]                                                    |
+-----------------------------------------------------------------------+
```

### Import Preview

Shows validation results before committing:

| Row | Item No. | Qty | Status | Message |
|---|---|---|---|---|
| 2 | FG-001 | 100 | ✓ Valid | — |
| 3 | FG-002 | 50 | ✓ Valid | — |
| 4 | FG-999 | 25 | ✗ Error | Item not found |
| 5 | FG-003 | — | ✗ Error | Qty required |

## BOM Explosion Preview Tab

After forecast is accepted, shows material requirements.

```
+-----------------------------------------------------------------------+
| BOM Explosion Preview                                    [Calculate]  |
+-----------------------------------------------------------------------+
| Source: Forecast FC-2024-015 (Accepted)                              |
+-----------------------------------------------------------------------+
| Finished Good | Rev | Forecast Qty | Components | Total Req.          |
+---------------+-----+--------------+------------+---------------------+
| Assembly-X    | C   | 100          | 12         | 1,200 parts         |
| Assembly-Y    | D   | 50           | 8          | 400 parts           |
| Device-Z      | A   | 25           | 15         | 375 parts           |
+---------------+-----+--------------+------------+---------------------+
| [Expand All] [Collapse All] [Export to Excel]                        |
+-----------------------------------------------------------------------+
```

### Expanded View

```
+-----------------------------------------------------------------------+
| Assembly-X (Rev C) — Forecast: 100 units                              |
+-----------------------------------------------------------------------+
| Component   | Rev | Qty/Unit | Total Req | On Hand | On Order | Net  |
+-------------+-----+----------+-----------+---------+----------+------+
| Widget-A    | B   | 3        | 300       | 150     | 50       | 100  |
| Module-Y    | D   | 1        | 100       | 80      | 0        | 20   |
| Sensor-B    | A   | 2        | 200       | 200     | 0        | 0    |
| Housing-C   | A   | 1        | 100       | 30      | 0        | 70   |
+-------------+-----+----------+-----------+---------+----------+------+
```

## Net Requirements Calculation

### Calculation Formula

```
Net Requirement = Forecast Qty × BOM Qty/Unit
                - On Hand Inventory
                - Open PO Remaining Qty
                - WIP (Work in Progress)
```

### Consideration for Partial POs

- **On Order** = Sum of (PO line qty - GRN received qty) for open POs
- Excludes cancelled/closed POs
- Includes POs in "Partially Received" status

## PR Generation Dialog

```
+-----------------------------------------------------------------------+
| Generate Purchase Requisitions                             [X]       |
+-----------------------------------------------------------------------+
| Source: Forecast FC-2024-015                                          |
| Period: 2024 Q2                                                       |
+-----------------------------------------------------------------------+
| Summary                                                               |
+-----------------------------------------------------------------------+
| Total Components Required:     1,975 parts                           |
| Already Available (On Hand):   460 parts                             |
| On Order (Open POs):           50 parts                              |
| Net Requirements:              1,465 parts                           |
+-----------------------------------------------------------------------+
| PR Grouping Preview                                                   |
+-----------------------------------------------------------------------+
| Supplier         | Items | Total Qty | Est. Amount | Action          |
+------------------+-------+-----------+-------------+-----------------+
| Acme Parts       | 5     | 850       | ¥42,500     | ✓ Ready         |
| PrecisionMfg     | 3     | 200       | ¥18,000     | ✓ Ready         |
| SensorCo         | 2     | 300       | ¥12,000     | ✓ Ready         |
| ⚠ Multi-Supplier | 4     | 115       | —           | ⚠ Manual Review |
+------------------+-------+-----------+-------------+-----------------+
|                                                                       |
| [Cancel] [Create PRs (Skip Unresolved)] [Resolve Multi-Supplier]     |
+-----------------------------------------------------------------------+
```

## Multi-Supplier Resolution Dialog

For components with multiple suppliers, no automatic decision is made.

```
+-----------------------------------------------------------------------+
| Resolve Multi-Supplier Components                          [X]       |
+-----------------------------------------------------------------------+
| Component: Housing-C (Rev A)                                         |
| Required: 70 units                                                   |
+-----------------------------------------------------------------------+
| Available Suppliers:                                                  |
+-----------------------------------------------------------------------+
| Supplier       | Lead Time | Price  | MOQ  | Rating   | Select     |
+----------------+-----------+--------+------+----------+------------+
| Acme Parts     | 14 days   | ¥15.00 | 50   | ★★★★☆    | [Select]   |
| TechSupply     | 21 days   | ¥12.50 | 100  | ★★★☆☆    | [Select]   |
| GlobalParts    | 7 days    | ¥18.00 | 25   | ★★★★★    | [Select]   |
+----------------+-----------+--------+------+----------+------------+
| [Skip This Item] [Split Across Vendors]                              |
+-----------------------------------------------------------------------+
```

### Options

1. **Select**: Choose single supplier for this component
2. **Skip This Item**: Do not include in PR, handle manually later
3. **Split Across Vendors**: Open dialog to allocate quantities

## Procurement Status Tab

After PRs are generated, shows status of linked procurement.

| PR No. | Supplier | Status | PO No. | PO Status | Expected Date |
|---|---|---|---|---|---|
| PR-0456 | Acme Parts | Approved | PO-0234 | Sent | 2024-04-15 |
| PR-0457 | PrecisionMfg | In Review | — | — | — |
| PR-0458 | SensorCo | Draft | — | — | — |

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Delete] [Save] [Import Excel] [Export Excel] [Accept] |
| Accepted | [Generate PRs] [View PRs] [Reopen] |
| Processed | [View PRs] [View POs] |
| Closed | Read-only |