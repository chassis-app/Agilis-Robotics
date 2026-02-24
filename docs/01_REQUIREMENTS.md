# Requirements

> This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

---

## Mandatory Requirement Baseline

Requirements RQ-001 through RQ-027 are drawn from the blueprint and define the mandatory functional and regulatory baseline for the ERP system. Every requirement listed below must be addressed in design, implementation, validation, and deployment.

### Legacy Field Preservation Policy

All visible fields from the current system must be preserved in the new ERP. No user-facing data point may be dropped, hidden, or structurally altered without explicit change-request approval.

### Implementation Rule for Every Preserved Field

For every preserved field, the following attributes must be defined and enforced:

| Attribute | Description |
|---|---|
| **Datatype** | The storage and display data type (e.g., string, decimal, date, enum). |
| **Required flag** | Whether the field is mandatory at creation, at approval, or at both stages. |
| **Default** | The default value applied when no user input is provided. |
| **Validation** | Business rules, format constraints, and cross-field consistency checks. |
| **Permission scope** | Which roles may view, edit, or approve changes to the field. |
| **Workflow relevance** | Which workflow transitions read or write the field. |
| **Audit trail** | Whether changes to the field are logged, and at what granularity. |
| **Migration mapping** | The source column/field in the legacy system and any transformation rules. |

### Compliance Baseline

The ERP system must satisfy the following regulatory frameworks from day one:

- **EU MDR 2017/745** -- European Medical Device Regulation
- **ISO 13485:2016** -- Medical devices Quality Management System
- **FDA 21 CFR Part 820** -- US Quality System Regulation
- **21 CFR Part 11** -- Electronic records and electronic signatures
- **UDI lifecycle** -- Unique Device Identification creation, assignment, and maintenance

---

## Requirement Extraction Table (RQ-001 to RQ-027)

The table below captures every requirement from the blueprint, with a source summary (translated from the original Chinese) and the intended implementation approach.

| Req ID | Source summary (translated) | Implementation intent |
|---|---|---|
| RQ-001 | UI fields must support Chinese + English. | Multi-language master data and document fields. |
| RQ-002 | Orders may use RMB or USD. | Multi-currency pricing, FX rates, accounting currency conversion. |
| RQ-003 | Custom options exist but cannot be linked-searched (e.g., risk level classification). | Dynamic custom fields with indexed search/filter/grouping. |
| RQ-004 | Process must be PR first, then PO. | Enforce requisition-to-order workflow and state rules. |
| RQ-005 | Two-level approvals (Supply Chain + GM); system needs `Submit` and notifications on approve/reject. | Workflow engine with submit action, approval matrix, notifications. |
| RQ-006 | During shipment, use material issue notice; warehouse approves then ships; GM can override. | Controlled warehouse release with role-based override + audit reason. |
| RQ-007 | After that, material outbound note; if shortage in production use demand request or transfer order. | Inventory shortage branch workflows and transfer handling. |
| RQ-008 | Subcontract order: send materials to subcontractor; if insufficient materials, convert to PO. | Subcontract workflow with automatic procurement fallback. |
| RQ-009 | If materials sufficient, generate material issue request; warehouse does quarterly/yearly checks. | Auto-generation of issue requests + cycle count planning. |
| RQ-010 | After subcontract complete, generate subcontract fee sheet for supplier reconciliation. | Subcontract cost document + AP reconciliation flow. |
| RQ-011 | Production process currently manual/non-automated; need trackable progress. | Work order scheduling/progress tracking and dependencies. |
| RQ-012 | Inventory can be divided by types. | Category hierarchy and item type segmentation. |
| RQ-013 | Production order specifics: semi-finished input; modules must all be ready before production; subcontract as small batch integrated processing. | BOM/module gating, readiness checks, batch routing logic. |
| RQ-014 | Material issue request can only be started from detail page; same material cannot be merged; summary page not supported. | Add summary-page batch launch + merge same material lines. |
| RQ-015 | After receipt use arrival note + finished product inspection note. | Receiving + QA inspection integrated flow. |
| RQ-016 | Engineering change needs: temporary part number in R&D, formal part number at mass production. | Temporary-to-formal part number lifecycle with mapping history. |
| RQ-017 | Need version management and auto-upgrade for updated versions. | Revision control and controlled auto-upgrade rules. |
| RQ-018 | Child part version change currently requires manual parent version update; need automatic parent update. | BOM impact engine + parent revision propagation. |
| RQ-019 | Add substitute material support. | Substitution matrix and ATP/issue planning support. |
| RQ-020 | Need document management; procurement users must access docs while issuing work orders. | PLM-style DMS with document links to item/BOM/order. |
| RQ-021 | In sales, assembled machine should expose component version + batch for traceability; use sales outbound order. | Full forward/backward genealogy on shipment lines. |
| RQ-022 | Change requests and approval needed for engineering change / BOM change. | ECR/ECO request + approval workflows. |
| RQ-023 | Need supplier quotation and review under procurement. | RFQ/quotation comparison and approval module. |
| RQ-024 | BOM UI should be simpler and indicate outsourced vs purchased modules. | BOM visualization by sourcing type. |
| RQ-025 | Add project management / PLM capability. | Project, milestones, linked engineering/production artifacts. |
| RQ-026 | Safety stock reminders with configurable quantity threshold and reminder cycle (today, +5 days, etc.). | Rule-based inventory alert engine with repeat schedule. |
| RQ-027 | Feishu integration; finance currently connected to another system; propose bringing cost mgmt into ERP. | Feishu notifier + finance/cost integration architecture. |

---

## Compliance Standards Reference

The following regulatory standards form the compliance foundation. All ERP modules that handle device data, quality records, or production controls must demonstrate conformance to the applicable standard(s).

| Standard | Purpose | Key Requirements |
|----------|---------|------------------|
| EU MDR 2017/745 | European Medical Device Regulation | UDI, Post-market surveillance, Technical documentation |
| ISO 13485:2016 | Medical devices QMS | Document control, Risk management, Process validation |
| FDA 21 CFR Part 820 | US Quality System Regulation | Design controls, Production controls, CAPA |
