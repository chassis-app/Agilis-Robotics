# Screen Prompt: Admin - Custom Fields

## Screen ID
`ADMIN-CUSTOM-FIELDS`

## Route
`/admin/custom-fields`

## Purpose
Define and manage dynamic custom fields for any entity in the system. Custom fields support indexed search, filtering, and grouping. Addresses the requirement that custom options like risk level must be searchable and linkable (RQ-003).

## Workflows
All (custom fields extend any entity)

## Requirements
RQ-003 (dynamic custom fields with indexed search/filter/grouping)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Admin > Custom Fields                                    |
| Custom Fields                                   [+ Create Field]     |
+---------------------------------------------------------------------+
| [Entity filter: All | Items | PRs | POs | WOs | Suppliers | ...]    |
+---------------------------------------------------------------------+
| Field Name (EN)   | Field Name (CN) | Entity | Type    | Searchable |
|                   |                 |        |         | Filterable |
| Required | Status | Actions                                        |
+-------------------+-----------------+--------+---------+------------+
| Risk Level        | 风险等级         | Item   | Select  | ✓ / ✓     |
| ☐ No     | Active | [Edit] [Deactivate]                             |
+-------------------+-----------------+--------+---------+------------+
| Sterilization     | 灭菌方式         | Item   | Select  | ✓ / ✓     |
| Method            |                 |        |         |            |
| ☐ No     | Active | [Edit] [Deactivate]                             |
+-------------------+-----------------+--------+---------+------------+
| Supplier Rating   | 供应商评级        | Supplier| Number | ✓ / ✓    |
| ☐ No     | Active | [Edit] [Deactivate]                             |
+-------------------+-----------------+--------+---------+------------+
```

## Create / Edit Custom Field

```
+---------------------------------------------------------------------+
| Create Custom Field                                                  |
+---------------------------------------------------------------------+
| Entity: * [Item ▼]                                                  |
|   (Which entity type this field extends)                            |
|                                                                      |
| Field Name (English): * [risk_level____]                            |
|   (Canonical key, snake_case, used in API/schema)                   |
|                                                                      |
| Field Name (Chinese): * [风险等级________]                            |
|   (Display label for CN locale)                                     |
|                                                                      |
| Display Label (English): * [Risk Level___]                          |
|   (Display label for EN locale)                                     |
|                                                                      |
| Field Type: * [Select (single) ▼]                                  |
|   Options: Text, Number, Date, Select (single), Select (multi),    |
|   Boolean, URL, Rich Text                                           |
|                                                                      |
| --- Type-specific configuration ---                                  |
|                                                                      |
| For Select type:                                                     |
| Options:                                       [+ Add Option]       |
| +-----------------------------------------------------------+       |
| | Value (EN) | Value (CN) | Color    | Order | Default | Del |      |
| +------------+------------+----------+-------+---------+-----+      |
| | low        | 低          | #22C55E  | 1     | ☐       | 🗑  |      |
| | medium     | 中          | #F59E0B  | 2     | ☑       | 🗑  |      |
| | high       | 高          | #EF4444  | 3     | ☐       | 🗑  |      |
| +------------+------------+----------+-------+---------+-----+      |
|                                                                      |
| For Number type:                                                     |
| Min value: [___]  Max value: [___]  Decimal places: [0__]          |
|                                                                      |
| For Text type:                                                       |
| Max length: [200_]  Pattern (regex): [optional___]                  |
|                                                                      |
| --- Search & Filter Configuration ---                                |
|                                                                      |
| ☑ Searchable (include in global search index)                       |
| ☑ Filterable (show as filter option on list pages)                  |
| ☑ Groupable (allow group-by in list views)                          |
| ☐ Required (must be filled on creation)                             |
|                                                                      |
| --- Display Configuration ---                                        |
|                                                                      |
| Show on list view: ☑ Yes (as table column)                         |
| Show on detail view: ☑ Yes (in Custom Fields section)              |
| Display order: [10__]                                                |
|                                                                      |
| [Cancel]                                  [Save Custom Field]        |
+---------------------------------------------------------------------+
```

## Key Features

### Bilingual Labels (RQ-001)
- Every custom field requires both English canonical key (snake_case) and Chinese display label
- Select options also require bilingual values

### Indexed Search (RQ-003)
- When "Searchable" is enabled, field values are indexed in Elasticsearch
- Custom field values appear in global search results
- Custom field filters auto-appear on relevant list pages

### JSONB Storage
- Custom field values stored in PostgreSQL JSONB column on each entity
- Schema-less: no database migration required to add/modify fields
- Indexed via GIN index for query performance

## Validation
- Field name (EN) must be unique per entity, snake_case format
- Select options must have unique values
- Cannot change field type after creation if data exists (show warning)
- Deactivating a field hides it from UI but preserves data
