# Screen Prompt: RFQ & Quotation

## Screen ID
`PROC-RFQ`

## Route
- List: `/procurement/rfq`
- Detail: `/procurement/rfq/:id`

## Purpose
Request for Quotation management and supplier quotation comparison. Allows buyers to generate RFQs from approved PR lines, collect supplier quotations, compare prices/lead times/MOQ, and select winning quotes with documented rationale.

## Workflows
WF-02 (Supplier RFQ and Quotation Review)

## Requirements
RQ-023 (supplier quotation and review)

## RFQ List View

Standard list page with columns:
| Column | Content |
|---|---|
| RFQ No. | Mono ID, clickable |
| Status | Open / Closed / Cancelled |
| Source PR | Linked PR number |
| Item | Item name (CN + EN) |
| Revision | Item revision |
| Qty Required | Quantity from PR |
| Quotations Received | Count (e.g., "3 of 5 invited") |
| Created Date | Date |
| Closing Date | Deadline for quotes |
| Actions | View, Compare, Close |

## RFQ Detail View

### Header
- RFQ Number, Status, Source PR link, Item + Revision, Quantity, Required Date
- Closing date for quotations
- Invited suppliers list

### Quotation Comparison Grid (Key Feature per RQ-023)

```
+---------------------------------------------------------------------+
| Quotation Comparison: Widget-A (Rev B), 100 pcs                      |
+---------------------------------------------------------------------+
| Criteria       | Acme Parts | SensorCo  | PrecisionMfg | Baseline  |
+---------------------------------------------------------------------+
| Unit Price     | ¥450.00    | ¥480.00 ▲ | ¥420.00 ▼    | ¥450.00  |
| Total Price    | ¥45,000    | ¥48,000   | ¥42,000      | ¥45,000  |
| Lead Time      | 14 days    | 10 days ▼ | 21 days ▲    | 14 days  |
| MOQ            | 50         | 100       | 25           | --       |
| Payment Terms  | Net 30     | Net 60    | Prepaid      | --       |
| Validity       | 30 days    | 15 days   | 45 days      | --       |
| Quote Date     | 03-10      | 03-11     | 03-12        | --       |
| Supplier Score | 92/100     | 87/100    | 78/100       | --       |
+---------------------------------------------------------------------+
| ▲ = above baseline (worse)  ▼ = below baseline (better)             |
+---------------------------------------------------------------------+
| Selection:                                                           |
| ○ Acme Parts  ● PrecisionMfg  ○ SensorCo                           |
| Rationale: * ________________________________________________       |
| [____________________________________________________________]       |
|                                                                      |
| [Cancel]                                [Select & Create PO Line]    |
+---------------------------------------------------------------------+
```

### Comparison Features
- Variance highlighting: green cell background if better than baseline, red if worse
- Arrows (▲ worse / ▼ better) next to values with significant variance
- Baseline column: shows historical average or last PO price
- Supplier score: from supplier quality scorecards
- Radio button to select winning supplier
- Mandatory rationale text field when selecting (audit requirement)
- [Select & Create PO Line] creates PO line linked to this quotation

### Quotation Entry (per supplier)
- Supplier name, contact
- Unit price, currency
- Lead time (days)
- MOQ
- Payment terms
- Validity period
- Notes/conditions
- Attachment (quotation document upload)
- Quote version history (if supplier revises)

## Interactions
- [+ Invite Supplier] button to add suppliers to RFQ
- [Record Quotation] button per supplier to enter their quote
- [Compare Quotations] button opens comparison grid
- Selection triggers optional high-value approval workflow if total exceeds threshold
