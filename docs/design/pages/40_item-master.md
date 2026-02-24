# Screen Prompt: Item Master

## Screen ID
`ENG-ITEM-MASTER`

## Route
- List: `/engineering/items`
- Detail: `/engineering/items/:id`
- Create: `/engineering/items/new`

## Purpose
Central repository for all items (raw materials, semi-finished, finished goods, services, tooling). Supports bilingual names, category hierarchy, custom fields, lifecycle stages, and revision management.

## Workflows
WF-09 (via ECR/ECO), WF-10 (document links)

## Requirements
RQ-001 (bilingual), RQ-003 (custom fields with indexed search), RQ-012 (type segmentation), RQ-016 (temp→formal part number lifecycle), RQ-017 (version management), RQ-019 (substitutes)

## List View

| Column | Content |
|---|---|
| Item No. | Mono ID, clickable |
| Name (CN) | Chinese name |
| Name (EN) | English name |
| Type | Badge: Raw / Semi-Finished / Finished / Service / Tooling (RQ-012) |
| Category | Category path (e.g., "Electronics > Sensors") |
| Sourcing | Badge: Purchase (blue) / Make (green) / Subcontract (orange) |
| Current Rev | Latest released revision code |
| Lifecycle | R&D / Pilot / Mass Production (RQ-016) |
| Status | Active / Obsolete |
| Risk Level | Custom field (RQ-003) |
| Actions | View, Edit, Clone |

Filters: Search (item no., name CN/EN), Type, Category (tree), Sourcing, Lifecycle, Status, Risk Level, Custom fields

## Detail View

### Tab: Basic Information

```
+---------------------------------------------------------------------+
| Item: ITM-001                              [Active] [Mass Prod.]     |
+---------------------------------------------------------------------+
| +-------------------------------+  +-----------------------------+   |
| | Item Number *                 |  | Mnemonic Code               |   |
| | [ITM-001]                     |  | [WGT-A]                     |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Name (中文) *                 |  | Name (English) *            |   |
| | [传感器A]                      |  | [Widget-A]                  |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Item Type *                   |  | Sourcing Type *             |   |
| | [Raw Material ▼]             |  | [Purchase ▼]                |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Category *                    |  | Default UOM *               |   |
| | [Electronics > Sensors ▼]    |  | [pcs ▼]                     |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Risk Level (RQ-003)          |  | Lifecycle Stage (RQ-016)    |   |
| | [Medium ▼]                   |  | [Mass Production ▼]        |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Spec / Model                 |  | Default Currency            |   |
| | [SEN-TYPE-B-V2]              |  | [RMB ▼]                     |   |
| +-------------------------------+  +-----------------------------+   |
| +---------------------------------------------------------------+   |
| | Description (textarea)                                        |   |
| +---------------------------------------------------------------+   |
| +---------------------------------------------------------------+   |
| | Image                                   [Upload image]        |   |
| | [thumbnail preview]                                           |   |
| +---------------------------------------------------------------+   |
```

### Tab: Revisions (RQ-017)

```
+---------------------------------------------------------------------+
| Revision History                                  [+ Create Revision]|
+---------------------------------------------------------------------+
| Rev Code | Status   | Effective From | Effective To | Lifecycle | Cr.|
+----------+----------+----------------+--------------+-----------+----+
| C        | Released | 2024-02-01     | --           | Mass Prod | Li |
| B        | Released | 2023-10-01     | 2024-01-31   | Mass Prod | Li |
| A        | Obsolete | 2023-05-01     | 2023-09-30   | Pilot     | Zh |
| T-001    | Obsolete | 2023-01-15     | 2023-04-30   | R&D       | Zh |
+----------+----------+----------------+--------------+-----------+----+
```

- Current/active revision highlighted (primary-50 background)
- T-prefix indicates temporary part number (RQ-016)
- Click revision → opens revision detail with BOM link, document links
- Timeline visualization option: horizontal timeline showing revision history with effective date ranges

### Tab: Bill of Materials
- Shows BOMs where this item is the parent (header item)
- Tree view with sourcing color coding (RQ-024)
- Link to full BOM detail page
- Also shows "Where Used" — BOMs where this item appears as a component

### Tab: Substitutes (RQ-019)

```
+---------------------------------------------------------------------+
| Substitutes for ITM-001 (Widget-A)                [+ Add Substitute] |
+---------------------------------------------------------------------+
| Substitute Item | Rev | Priority | Conversion Factor | Notes        |
+-----------------+-----+----------+-------------------+--------------+
| ITM-047 Alt-A   | A   | 1        | 1:1               | Direct swap  |
| ITM-089 Alt-B   | B   | 2        | 1:1.2             | Oversized ok |
+-----------------+-----+----------+-------------------+--------------+
```

### Tab: Supplier Items
- Suppliers who provide this item with their part numbers, prices, lead times, MOQ

### Tab: Custom Fields (RQ-003)
- Dynamic custom fields defined for this item's type/category
- All custom fields are searchable and filterable from the list view
- [Manage Custom Fields] link → Admin custom field configuration

### Tab: Documents (RQ-020)
- Linked controlled documents (specifications, drawings, certificates)

### Tab: Audit Trail
- Full change history

## Lifecycle Conversion Wizard (RQ-016)

When lifecycle stage transitions from R&D → Pilot → Mass Production:

```
+------------------------------------------+
| Lifecycle Stage Conversion               |
+------------------------------------------+
| Current: R&D (Temp Part: T-001)          |
| Target: Mass Production                  |
|                                          |
| Formal Part Number: *                    |
| [ITM-_____]                              |
|                                          |
| Conversion Notes:                        |
| [________________________________]       |
|                                          |
| ⚠ This will:                            |
| • Assign formal part number              |
| • Update all BOM references              |
| • Create revision mapping history        |
| • Require approval                       |
|                                          |
| [Cancel]         [Convert & Submit]      |
+------------------------------------------+
```

## Footer Actions

| Context | Actions |
|---|---|
| Create | [Cancel] [Save Draft] [Save & Create Another] |
| Edit | [Cancel] [Save Changes] |
| View (active) | [Edit] [Clone] [Create Revision] [Convert Lifecycle] |
| View (obsolete) | [Clone] (read-only) |
