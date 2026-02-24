# Screen Prompt: Traceability Query

## Screen ID
`QA-TRACEABILITY`

## Route
`/quality/traceability`

## Purpose
Perform forward and backward traceability queries across the full device genealogy. Trace from component lots to shipped devices (forward) or from shipped serials back to component lots, revisions, and suppliers (backward). Critical for regulatory compliance and recall management.

## Workflows
WF-11 (Sales Outbound Traceability)

## Requirements
RQ-021 (component version + batch traceability on shipment)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Quality > Traceability                                   |
| Traceability Query                                                   |
+---------------------------------------------------------------------+
|                                                                      |
| Search:                                                              |
| [🔍 Enter lot number, serial number, shipment ID, or item_______]  |
|                                                                      |
| Direction:                                                           |
| [● Forward Trace (Component → Devices)]                             |
| [○ Backward Trace (Device → Components)]                            |
|                                                                      |
| [Search]                                                             |
|                                                                      |
+---------------------------------------------------------------------+
```

## Forward Trace Result

From component lot → all affected devices and customers:

```
+---------------------------------------------------------------------+
| Forward Trace: LOT-2024-0234 (Widget-A, Rev B)                      |
| Supplier: Acme Parts | Received: 2024-02-20 | Qty: 200 pcs         |
+---------------------------------------------------------------------+
|                                                                      |
| ▼ LOT-2024-0234 (Widget-A, Rev B)                                  |
| │                                                                    |
| ├── ▼ WO-2024-0056 (Assembly-X, Rev C)                             |
| │   ├── FG Lot: FG-2024-0089 (100 units)                           |
| │   │   ├── Inspection: INSP-2024-0345 (Passed ✓)                  |
| │   │   └── Shipment: SH-2024-0012                                 |
| │   │       └── Customer: MedCorp Ltd (Shanghai)                    |
| │   │           Ship date: 2024-03-10                                |
| │   │                                                                |
| │   └── FG Lot: FG-2024-0090 (50 units)                            |
| │       ├── Inspection: INSP-2024-0348 (Passed ✓)                  |
| │       └── Shipment: SH-2024-0015                                  |
| │           └── Customer: HealthTech Inc (Beijing)                   |
| │               Ship date: 2024-03-15                                |
| │                                                                    |
| └── ▼ WO-2024-0061 (Assembly-Y, Rev A)                             |
|     └── FG Lot: FG-2024-0095 (75 units)                            |
|         └── Status: In warehouse (not shipped)                      |
|                                                                      |
+---------------------------------------------------------------------+
| Impact Summary:                                                      |
| Total work orders: 2                                                 |
| Total finished lots: 3 (225 units)                                   |
| Total shipped: 150 units to 2 customers                             |
| Still in warehouse: 75 units                                         |
+---------------------------------------------------------------------+
| [Export PDF] [Export CSV] [Print]                                     |
+---------------------------------------------------------------------+
```

## Backward Trace Result

From shipped serial → all component lots, revisions, and suppliers:

```
+---------------------------------------------------------------------+
| Backward Trace: SN-2024-X-00145                                     |
| Item: Assembly-X | Rev: C | Shipped: 2024-03-10                    |
| Customer: MedCorp Ltd (Shanghai)                                     |
+---------------------------------------------------------------------+
|                                                                      |
| ▼ SN-2024-X-00145 (Assembly-X, Rev C)                              |
| │                                                                    |
| ├── FG Lot: FG-2024-0089                                           |
| │   Production: WO-2024-0056 | Completed: 2024-03-08               |
| │                                                                    |
| ├── ▼ Components Consumed:                                          |
| │   ├── Widget-A (Rev B)                                            |
| │   │   Lot: LOT-2024-0234 | Qty: 2 pcs                           |
| │   │   Supplier: Acme Parts | PO: PO-2024-0022                   |
| │   │   Received: 2024-02-20 | Inspection: Passed ✓                |
| │   │                                                                |
| │   ├── Module-Y (Rev D) — Made in-house                           |
| │   │   Lot: LOT-2024-0198 | WO: WO-2024-0052                     |
| │   │   ├── Part-P (Rev A) | LOT-2024-0180 | Supplier: PartsCo    |
| │   │   └── Part-Q (Rev B) | LOT-2024-0185 | Supplier: PartsCo    |
| │   │                                                                |
| │   └── Module-Z (Rev D) — Subcontracted                           |
| │       Lot: LOT-2024-0210 | SC: SC-2024-0008                      |
| │       Subcontractor: PrecisionMfg                                  |
| │       ├── Sensor-B (Rev A) | LOT-2024-0195 | Supplier: SensorCo  |
| │       └── Connector-C (Rev A) | LOT-2024-0201 | Supplier: Acme   |
| │                                                                    |
| ├── ▼ Quality Records:                                              |
| │   ├── Incoming Inspections: 5 (all passed)                       |
| │   ├── In-Process Inspections: 2 (all passed)                     |
| │   └── Final Inspection: INSP-2024-0345 (Passed ✓)                |
| │                                                                    |
| └── ▼ Document References:                                          |
|     ├── Spec: DOC-2024-001 Rev C (Widget-A specification)           |
|     ├── WI: DOC-2024-015 Rev B (Assembly work instruction)         |
|     └── QP: DOC-2024-020 Rev A (Quality plan)                      |
|                                                                      |
+---------------------------------------------------------------------+
| Device History Record: [View DHR] [Export Regulatory Package]        |
+---------------------------------------------------------------------+
```

## Tree Interaction Features
- Each node is clickable → navigates to the source document detail
- Expand/collapse individual nodes or [Expand All] / [Collapse All]
- Color coding: blue=purchased, green=made, orange=subcontracted (consistent with BOM)
- Icons: checkmark for passed inspections, warning for failed
- Search within results: highlight matching nodes

## Device History Record (DHR) View

Accessible from backward trace result:

```
+---------------------------------------------------------------------+
| Device History Record                                                |
| Serial: SN-2024-X-00145 | Item: Assembly-X | Rev: C                |
+---------------------------------------------------------------------+
| Section                  | Status    | Records                       |
+--------------------------+-----------+-------------------------------+
| Bill of Materials        | Complete  | 12 components traced          |
| Material Consumption     | Complete  | 8 lots consumed               |
| Manufacturing Operations | Complete  | 5/5 operations recorded       |
| In-Process Inspections   | Complete  | 3 inspections passed          |
| Final Inspection         | Complete  | Passed (2024-03-10)           |
| Document Links           | Complete  | 4 controlled docs attached    |
| Approval Chain           | Complete  | 2/2 signatures verified       |
+--------------------------+-----------+-------------------------------+
| [Export PDF] [Export Regulatory Package]                              |
+---------------------------------------------------------------------+
```

## Export Options
- **Export PDF**: Formatted trace report with full tree, suitable for regulatory submission
- **Export CSV**: Flat data export for analysis
- **Export Regulatory Package**: ZIP containing DHR, all inspection records, approval evidence, and document copies
- **Print**: Print-optimized layout with company header
