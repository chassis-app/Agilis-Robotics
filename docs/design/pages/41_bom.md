# Screen Prompt: Bill of Materials

## Screen ID
`ENG-BOM`

## Route
- List: `/engineering/bom`
- Detail: `/engineering/bom/:id`

## Purpose
Manage Bills of Materials with hierarchical tree visualization, sourcing type color coding, module readiness indicators, critical component flags, and substitute support. The primary engineering view for product structure.

## Workflows
WF-08 (BOM in WO context), WF-09 (BOM changes via ECR/ECO)

## Requirements
RQ-013 (module readiness), RQ-018 (auto-propagation of child revisions), RQ-019 (substitutes), RQ-024 (sourcing type visualization)

## List View

| Column | Content |
|---|---|
| BOM ID | Mono ID |
| Parent Item | Item name (CN + EN) |
| Parent Rev | Revision code |
| Status | Draft / Released / Obsolete |
| Components | Count of direct child lines |
| Total Depth | Maximum nesting level |
| Effective From | Date |
| Last Modified | Date |
| Actions | View, Edit (draft), Compare |

## Detail View — BOM Tree (Key Feature per RQ-024)

```
+---------------------------------------------------------------------+
| BOM: Assembly-X (Rev C)                    [Expand All] [Collapse]   |
| Status: Released | Effective: 2024-02-01        [Edit] [Compare ▼]  |
+---------------------------------------------------------------------+
| Legend:                                                              |
| [■] Purchase  [■] Make  [■] Subcontract  [⭐] Critical  [⟳] Sub.  |
| (blue)        (green)   (orange)                                     |
+---------------------------------------------------------------------+
|                                                                      |
| ▼ Assembly-X (Rev C) — Make                         Qty per: 1      |
| │                                                                    |
| ├── [■] Widget-A (Rev B) — Purchase     ⭐          Qty: 2         |
| │   Supplier: Acme Parts | Lead: 14d | MOQ: 50                     |
| │   └── [⟳] Substitute: Widget-A-Alt (Rev A)        Priority: 1    |
| │                                                                    |
| ├── [■] Module-Y (Rev D) — Make         ⭐          Qty: 1         |
| │   ├── [■] Part-P (Rev A) — Purchase               Qty: 4         |
| │   └── [■] Part-Q (Rev B) — Purchase               Qty: 2         |
| │                                                                    |
| ├── [■] Module-Z (Rev D) — Subcontract  ⭐          Qty: 1         |
| │   Supplier: PrecisionMfg | Lead: 21d                              |
| │   ├── [■] Sensor-B (Rev A) — Purchase             Qty: 3         |
| │   └── [■] Connector-C (Rev A) — Purchase          Qty: 6         |
| │                                                                    |
| └── [■] Packaging (Rev A) — Purchase                Qty: 1         |
|                                                                      |
+---------------------------------------------------------------------+
```

### Tree Node Features
- **Color indicator** (square icon): blue=purchase, green=make, orange=subcontract
- **Critical flag**: ⭐ star icon on critical components
- **Substitute indicator**: ⟳ icon, expandable to show substitute list with priority
- **Quantity per parent**: displayed at each level
- **Scrap rate**: if > 0%, shown as "(+5% scrap)" next to qty
- **Supplier info**: for purchased items, show default supplier, lead time, MOQ on hover or expanded row
- **Click node**: opens item detail in right-side panel (480px drawer)
- **Module code**: shown if item is a module for WO gating purposes

### BOM Line Detail (Side Panel on Node Click)

```
+------------------------------------------+
| Widget-A (Rev B)                    [X]  |
+------------------------------------------+
| Item No: ITM-001                         |
| Type: Raw Material | Sourcing: Purchase  |
| Name (CN): 传感器A                        |
| Name (EN): Widget-A                      |
|                                          |
| In this BOM:                             |
| Qty: 2 per parent | Scrap: 0%           |
| Module Code: --                          |
| Critical: Yes                            |
| Optional: No                             |
|                                          |
| Substitutes:                             |
| 1. Widget-A-Alt (Rev A) — 1:1           |
|                                          |
| Suppliers:                               |
| • Acme Parts — ¥450/pc, 14d lead        |
| • SensorCo — ¥480/pc, 10d lead          |
|                                          |
| Current Stock: 165 pcs (WH-01)           |
|                                          |
| [Open Item Master] [View Revisions]      |
+------------------------------------------+
```

### BOM Comparison View

Compare two revisions of the same BOM side by side:

```
+---------------------------------------------------------------------+
| Compare: Assembly-X Rev B vs Rev C                                   |
+---------------------------------------------------------------------+
| Component    | Rev B              | Rev C              | Change     |
+--------------+--------------------+--------------------+------------+
| Widget-A     | Rev A, Qty: 2      | Rev B, Qty: 2      | Rev change |
| Module-Y     | Rev C, Qty: 1      | Rev D, Qty: 1      | Rev change |
| Module-Z     | (not present)      | Rev D, Qty: 1      | Added      |
| Part-R       | Rev A, Qty: 3      | (removed)          | Removed    |
+--------------+--------------------+--------------------+------------+
```

Color coding: Green rows = added, Red rows = removed, Amber rows = changed

### BOM Edit Mode (Draft status only)

When editing a draft BOM:
- [+ Add Component] button at each level
- Drag-and-drop to reorder components
- Inline edit: quantity, scrap rate, critical flag, optional flag, module code
- [Add Substitute] button per component line
- [Remove] button per component line (with confirmation)
- Save validates: no circular references, all items have released revisions

## Footer Actions

| Context | Actions |
|---|---|
| Draft BOM | [Discard] [Save Draft] [Release BOM] |
| Released BOM | [Create New Revision] [Compare Versions] [Export BOM] |
| Obsolete BOM | [View Only] [Compare Versions] |
