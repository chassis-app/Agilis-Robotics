# System Design

> This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

---

## 1) Consolidation and Normalization Decisions

This plan consolidates and normalizes the following source documents into one execution-ready baseline:

- `CLAUDE.md` -- full ERP architecture proposal with expanded SQL schema and operational workflows.
- `ERP_Field_Catalog_From_Requirement_Screens.md` -- screen-derived field catalog from the existing ERP.
- `ERP_Medical_Device_Implementation_Blueprint.md` -- requirement-driven logical model, workflows, APIs, and delivery plan.

### Consolidation Objectives

- Preserve all source details with zero data loss.
- Remove duplicate definitions in the main executable plan.
- Resolve naming and structure inconsistencies between documents.
- Keep one canonical implementation baseline for engineering delivery.

### Non-Loss Strategy

- The main body contains the normalized canonical plan.
- Full source details are embedded in appendices to ensure nothing is omitted.
- Any original detail not surfaced in the main body is preserved verbatim in the corresponding appendix.

---

## 2) Canonical Data Model Strategy

### Canonical Logical Model

The 109-entity blueprint model (from `ERP_Medical_Device_Implementation_Blueprint.md`) is the system-of-record domain model. All entity names, relationships, and requirement traceability IDs originate from this model.

### Canonical Physical Schema Detail

`CLAUDE.md` SQL tables are retained as implementation-level detail for column-level requirements. These provide the concrete DDL guidance (data types, indexes, constraints) that complement the logical model.

### Legacy UI Fidelity

All fields from `ERP_Field_Catalog_From_Requirement_Screens.md` are mandatory migration/compatibility fields. Every visible current-system field extracted from requirement screenshots is mandatory unless formally deprecated by approved change control.

Implementation rule for every preserved field:

- Define datatype, required flag, default, and validation.
- Add permission scope and workflow relevance.
- Persist old/new values in immutable audit trail.
- Include migration mapping from legacy system.

---

## 3) Naming Harmonization

The following naming decisions have been resolved and are canonical:

| Topic | Resolution |
|---|---|
| Product-material domain object | `item` / `item_revision` is the canonical domain object. |
| CLAUDE.md specializations | `products`, `materials`, and BOM-related entities in `CLAUDE.md` are treated as physical/module-level specializations of canonical `item` structures. |
| Procurement sequence | `purchase_requisition` -> `purchase_order` sequence is mandatory and enforced by workflow state machine. |
| Approval baseline | Fixed at two levels (Supply Chain + GM) where required by `RQ-005`; policy engine remains extensible for amount/site-based routing. |
| Material issue flow | Unified under `material_issue_notice` -> `material_issue_request` -> `material_outbound_note`, with GM override and mandatory reason. |

---

## 4) Duplicate/Illogical Resolution

| Issue | Resolution |
|---|---|
| Duplicate workflow topics | Duplicate workflow topics across `CLAUDE.md` and blueprint are merged by keeping blueprint WF-IDs (`WF-01` to `WF-14`) as canonical references, while preserving CLAUDE operational details in appendices. |
| Phase plans | Phase plans (52-week macro in `CLAUDE.md` and 11-phase detailed build in blueprint) are merged into one integrated 52-week delivery map. |
| Repeated MDM sections | Repeated MDM sections are interpreted as complementary: base MDM + governance/lineage/sync controls. |

---

## 5) Canonical Naming Rules (from Bilingual Field Master)

These rules govern the relationship between Chinese UI labels and English schema keys across the entire system:

- **English canonical keys use `snake_case`.** All schema columns, API fields, and internal identifiers follow this convention.
- **Chinese screen labels remain the display standard for CN users.** The UI rendering layer maps canonical keys to localized display labels.
- **One logical field can have many UI labels; one canonical key only.** Multiple screens may present the same data under different Chinese labels, but the underlying schema key is singular and authoritative.
- **Legacy UI action labels are modeled as workflow actions/permissions, not business data columns.** Buttons and action labels from the existing system (e.g., "Submit", "Approve") map to workflow state transitions and permission checks, not to columns in business tables.

The canonical field dictionary is maintained in `BILINGUAL_FIELD_MASTER.md`. If any Chinese screen label or English schema key conflicts, the mapping in `BILINGUAL_FIELD_MASTER.md` must be updated first, then propagated to schema/API/UI. All new fields must be added with both a Chinese label and a canonical English key.

---

## 6) Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Availability** | 99.9% uptime target for production environment. |
| **Performance** | p95 read latency < 400ms; p95 write latency < 800ms for standard documents. |
| **Concurrency** | Optimistic locking on all transactional documents (via `row_version` column). |
| **Security** | Role-based and site-based data permissions; encrypted secrets; full API audit logging. |
| **Data Retention** | Immutable audit/event records retained minimum 10 years (medical-device traceability requirement). |
| **Backups** | Daily full backups + point-in-time recovery (PITR); tested restore runbook maintained and exercised. |

---

## 7) System Architecture

### Technology Stack

Technology stack guidance from `CLAUDE.md` is retained as reference architecture options:

| Layer | Technology Options |
|---|---|
| Backend | Node.js / Python / Java (Spring Boot) |
| Database | PostgreSQL (with JSONB support) |
| Frontend | React / Vue.js |
| API | REST + GraphQL |
| Search | Elasticsearch |
| Cache | Redis |
| Message Queue | RabbitMQ / Apache Kafka |
| Container | Docker / Kubernetes |

### Core Infrastructure

The following are identified as core infrastructure components:

- **PostgreSQL** -- primary relational store for all transactional and master data.
- **Object storage** -- for document management (PLM attachments, regulatory filings, labels).
- **Message queue** -- for asynchronous event processing, integration events, and notification dispatch.
- **Cache layer** -- for session management, frequently-accessed master data, and read optimization.

### CI/CD and Environments

- Monorepo CI/CD pipeline structure.
- Four-environment promotion path: `dev` -> `test` -> `stage` -> `prod`.

### API Groups

API groups from the blueprint (Section 6) are adopted as canonical implementation controls. These define the surface area for all system integrations, covering:

- Master data CRUD and search APIs.
- Workflow and approval action APIs.
- Procurement, inventory, production, and quality transaction APIs.
- Reporting and traceability query APIs.
- Integration and notification dispatch APIs.

---

## 8) Governance Rules

Any deviation from this consolidated plan requires a controlled change request with the following mandatory elements:

1. **Impact analysis** -- covering affected requirements (`RQ-*`), workflows (`WF-*`), schema changes, field compatibility implications, and compliance impact.
2. **Approver e-signature** -- electronic signature from authorized approver(s) per 21 CFR Part 11 requirements.
3. **Migration/backward compatibility plan** -- documenting how existing data, integrations, and user workflows will be preserved or transitioned.
4. **Updated traceability matrix** -- reflecting the change across requirement-to-design, design-to-code, and code-to-test mappings.

No changes to the canonical plan baseline may be implemented without completing this change control process.
