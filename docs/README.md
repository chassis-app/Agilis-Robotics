# ERP Implementation Documentation

Medical Device ERP System - Consolidated documentation split by functional area.

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Requirements](01_REQUIREMENTS.md) | Requirement IDs (RQ-001 to RQ-027), compliance baseline (EU MDR, ISO 13485, FDA 21 CFR), legacy field preservation policy |
| 02 | [System Design](02_SYSTEM_DESIGN.md) | Architecture decisions, canonical data model strategy, naming harmonization, NFRs, governance rules |
| 03 | [Database Schema](03_DATABASE_SCHEMA.md) | Complete 109-entity logical model with columns, constraints, and indexes |
| 04 | [Workflows](04_WORKFLOWS.md) | All 14 end-to-end workflow definitions (WF-01 to WF-14) |
| 05 | [API and Reporting](05_API_AND_REPORTING.md) | API surface, event bus topics, operational and compliance reports |
| 06 | [Development Plan](06_DEVELOPMENT_PLAN.md) | 52-week roadmap, 11 implementation phases, build order, success metrics, testing strategy, risks, open decisions |
| 07 | [Data Dictionary](07_DATA_DICTIONARY.md) | Bilingual (Chinese/English) canonical field master with unified dictionary |
| 08 | [Field Catalog (Legacy)](08_FIELD_CATALOG_LEGACY.md) | Legacy system field catalog extracted from requirement screenshots |
| 09 | [UI/UX Design](design/09_UIUX_DESIGN.md) | Visual language, component library, screen specifications, interaction patterns, accessibility and regulatory UI requirements |

## Original Source

The documents above are extracted from the consolidated plan files in [`plan/`](plan/):

- `plan/FULLPLAN.md` - Original monolithic consolidated plan
- `plan/BILINGUAL_FIELD_MASTER.md` - Original bilingual field master
