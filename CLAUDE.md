# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agilis-Robotics is a medical device manufacturing ERP system. The repository is currently in the **design complete / pre-implementation phase** — architecture, planning, and UI design are done; no application source code exists yet. The project consolidates requirements from three source documents into a unified implementation blueprint.

## Project Status

- **Architecture & planning**: Complete (docs 01–08)
- **UI/UX design system**: Complete (`docs/design/09_UIUX_DESIGN.md`)
- **Screen specifications**: Complete — 28 page prompts in `docs/design/pages/`
- **UI mockups**: Complete — all 28 screens built in `docs/design/ui.pen` with 22 reusable components
- **Application source code**: Not started

## Documentation

**Core specs** (under `docs/`):

| File | Content |
|------|---------|
| `docs/README.md` | Index linking all documents below |
| `docs/01_REQUIREMENTS.md` | 27 requirement IDs (RQ-001–RQ-027), compliance baseline (EU MDR, ISO 13485, FDA 21 CFR) |
| `docs/02_SYSTEM_DESIGN.md` | Architecture decisions, canonical data model, naming harmonization, NFRs, governance |
| `docs/03_DATABASE_SCHEMA.md` | Complete 109-entity logical model with columns, constraints, and indexes |
| `docs/04_WORKFLOWS.md` | 14 end-to-end workflow definitions (WF-01–WF-14) |
| `docs/05_API_AND_REPORTING.md` | API surface, event bus topics, operational and compliance reports |
| `docs/06_DEVELOPMENT_PLAN.md` | 52-week roadmap, 11 phases, build order, testing strategy, risks, open decisions |
| `docs/07_DATA_DICTIONARY.md` | Bilingual Chinese/English canonical field master (389 fields) |
| `docs/08_FIELD_CATALOG_LEGACY.md` | Legacy system fields extracted from requirement screenshots |

**Design** (under `docs/design/`):

| File | Content |
|------|---------|
| `docs/design/09_UIUX_DESIGN.md` | UI/UX design system: visual language, components, screen specs, interaction patterns, accessibility |
| `docs/design/pages/README.md` | Index of all 28 screen prompts with route map and workflow/requirement coverage |
| `docs/design/pages/*.md` | Individual screen specifications (layout, fields, interactions, workflow refs) |
| `docs/design/ui.pen` | Pencil design file — 22 reusable components + 28 screen mockups (read only via Pencil MCP tools) |

**Screen prompts** follow numbered prefixes grouped by module: `00_` global, `01-02_` home, `10-15_` procurement, `20-25_` inventory, `30-32_` manufacturing, `40-44_` engineering, `50-52_` quality, `60_` sales, `70-72_` finance, `80-81_` reports, `90-93_` admin.

Original consolidated sources are preserved in `docs/plan/` for reference.

## UI Design File (`docs/design/ui.pen`)

The `.pen` file is encrypted and must be accessed exclusively via Pencil MCP tools — never use `Read`, `Grep`, or `cat` on it.

**22 reusable components** (design system):

| Component | ID | Key Override IDs |
|---|---|---|
| Button/Primary | `PbftL` | `2wD1d` (icon), `0Cd1t` (label) |
| Button/Secondary | `B84ZJ` | `esGd0` (icon), `0ScOm` (label) |
| Button/Danger | `xUKjt` | `pyQQL` (icon), `IpaQC` (label) |
| Button/Ghost | `CuNkm` | `FoLuQ` (icon), `I5sYd` (label) |
| Badge/Draft | `htCSL` | Badge/Submitted `PrH95` | Badge/InApproval `BHdKA` | Badge/Approved `EEQgh` | Badge/Rejected `dAf29` | Badge/Cancelled `0EAGN` |
| Input/Text | `1WRKy` | `iB5tt` (label), `elGkT` (star), `TBCMb` (field), `Mp66U` (placeholder) |
| Input/Select | `UH7nI` | `QjnWf` (label), `9yYwf` (field), `u5uoM` (placeholder) |
| Input/Textarea | `QaHWD` | `fCv3Z` (label), `C85j2` (field) |
| Card/KPI | `pTHs8` | `PFE4v` (label), `u51BC` (value), `qtZZy` (change text) |
| Nav/ItemActive | `QhtBQ` | `ddkga` (icon), `hmwGS` (label) |
| Nav/ItemDefault | `WkuwE` | `jewHS` (icon), `6CERG` (label) |
| Nav/SectionTitle | `CATiF` | `ZDrS4` (label) |
| Sidebar | `ZvNPP` | `fVhkh` (header), `mrv86` (nav slot), `vOZ2v` (brand) |
| TopBar | `qv7GI` | `xRprm` (breadcrumb-1), `0II2m` (breadcrumb-2) |
| Card | `eVbzC` | `vBvHY` (header), `ox73T` (title), `1xCYu` (content) |
| Table/HeaderRow | `Letlo` | Table/DataRow `IFgqW` |

**28 screens** arranged in a 5-column grid (1440×900px each, spaced 100px apart):

| Row | y | Screens (left → right) |
|---|---|---|
| 1 | 1908 | Dashboard `sOUYy` · PR-List `11Q0P` · PR-Detail `cjRoS` · Approval-Inbox `RYiUd` · PO-List `3boPm` |
| 2 | 3008 | PO-Detail `W4u1Q` · RFQ `adDKS` · GRN `ZFcoR` · Stock-Overview `0gjp4` · Material-Issue-Notice `PGkov` |
| 3 | 4108 | MIR `jarED` · Stock-Transfers `CXfJT` · Cycle-Count `gSsQu` · Safety-Stock `a4FkL` · Work-Order `5ED8G` |
| 4 | 5208 | Subcontract `5T4bo` · Prod-Progress `1ovhE` · Item-Master `8iN41` · BOM `whkth` · ECR-ECO `5CKUj` |
| 5 | 6308 | Documents `VSVvC` · Projects `sWYmJ` · Inspections `8N2Nh` · NC-CAPA `gGj2w` · Traceability `MmexA` |
| 6 | 7408 | Sales `deltH` · Costing `BsVZP` · AP-Recon `Bpobe` · Integration `gTy2J` · Reports-Ops `35L7L` |
| 7 | 8508 | Reports-Compliance `pGawa` · Admin-Users `IsZYB` · Approval-Policies `P3Ora` · Custom-Fields `rSQVo` · System-Config `r593p` |

**Design variables** — color tokens use `$--` prefix:
- Primary: `--color-primary-50` (#EFF6FF) through `-900` (#1E3A8A), main: `-500` (#3B82F6), `-600` (#2563EB)
- Neutral: `-0` (#FFFFFF) through `-900` (#0F172A)
- Semantic: success `-500` (#22C55E), warning `-500` (#F59E0B), danger `-500` (#EF4444), info `-500` (#0891B2)
- Radius: sm(4), md(6), lg(8), xl(12)
- Font: use `"Inter"` directly (not variable refs) for fontFamily

**Pencil MCP conventions:**
- Every screen follows: main frame (horizontal) → Sidebar ref (`ZvNPP`, 240px) → right column (fill, vertical) → TopBar ref (`qv7GI`) → content area (fill, vertical, padding 24, gap 16)
- Max ~25 operations per `batch_design` call
- Icon names: `pencil` (not `edit`), `ellipsis` (not `more-horizontal`), `sliders-horizontal` (not `filter`)

## Domain Context

This is a **regulated medical device ERP** subject to:
- EU MDR 2017/745, ISO 13485:2016, FDA 21 CFR Part 820
- 21 CFR Part 11 (electronic signatures, immutable audit trails)
- UDI (Unique Device Identifier) lifecycle support

All design decisions must account for full lot/serial traceability, immutable audit trails with hash chaining, and electronic signature compliance.

## Architecture Decisions (Canonical)

- **Multi-tenant SaaS** with tenant → legal_entity → site hierarchy
- **109 domain entities** across security, master data, PLM, procurement, inventory, production, quality, and sales
- **14 canonical workflows** (`WF-01` through `WF-14`) — referenced by ID throughout
- **27 requirements** (`RQ-001` through `RQ-027`) — all mandatory and traceable
- **Bilingual support**: Chinese display labels + English `snake_case` canonical keys
- **Global columns on all business tables**: `id` (UUID PK), `tenant_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `is_deleted`, `row_version`, `source_doc_type`, `source_doc_id`, `source_line_id`
- **Naming**: `item`/`item_revision` is the canonical product-material entity (not "product" or "material")
- **Approval baseline**: two-level (Supply Chain + GM), extensible via policy engine
- **Material issue flow**: `material_issue_notice` → `material_issue_request` → `material_outbound_note`
- **Document statuses**: `draft/submitted/in_approval/approved/rejected/cancelled`
- **Item lifecycle stages**: `rd/pilot/mass_production`

## Conventions

- Canonical keys use `snake_case` English — never Chinese in schema definitions
- Workflow references use `WF-XX` IDs; requirement references use `RQ-XXX` IDs
- All field changes must be persisted in the immutable audit trail (before/after values)
- Custom fields system supports dynamic extension of any entity
- Feishu is the Chinese collaboration platform used for notifications
