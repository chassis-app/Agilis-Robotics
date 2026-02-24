> **Note:** This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

# Development Plan, Delivery Roadmap, and Governance

## 1) Integrated Delivery Roadmap (52 Weeks)

### Master Timeline

- **Weeks 1–2:** Inception and validation baseline (blueprint Phase 0)
- **Weeks 3–8:** Platform foundation + workflow/audit core (blueprint Phases 1–2)
- **Weeks 9–16:** Master data, PLM, document controls (blueprint Phase 3)
- **Weeks 17–24:** Procurement, receiving, warehouse execution (blueprint Phases 4–5)
- **Weeks 25–32:** Subcontracting, production, quality hardening (blueprint Phases 6–7)
- **Weeks 33–38:** Engineering change automation + costing integration (blueprint Phases 8–9)
- **Weeks 39–44:** Reporting, migration readiness, regulatory reporting hardening (blueprint Phase 10 pre-cutover)
- **Weeks 45–52:** Validation, IQ/OQ/PQ, UAT, training, go-live, hypercare (from CLAUDE.md validation/go-live phase)

### Mandatory Delivery Artifacts

- Requirement traceability matrix (RQ-\* to design, code, tests)
- Workflow evidence packs (WF-\* UAT + approvals + e-signature logs)
- Migration reconciliation reports (master + transactional data)
- Traceability validation reports (forward/backward lot/serial genealogy)
- Security, performance, and backup/restore sign-off

## 2) Detailed Implementation Phases

### Phase 0: Inception and Validation Baseline (2 weeks)

- Confirm requirement IDs RQ-001..RQ-027 with business owners
- Define glossary for Chinese business terms (PR/PO/BOM/ECR/ECO etc.)
- Define compliance profile for medical-device traceability and e-signature expectations
- **Deliverables:** Approved BRD with traceability matrix, To-be process maps, Regulatory constraint checklist

### Phase 1: Platform Foundation (3 weeks)

- Setup monorepo, CI/CD, environment strategy (dev/test/stage/prod)
- Provision PostgreSQL, object storage, message queue, cache
- Implement identity, RBAC, tenant/site/dept hierarchy
- Implement global numbering service for docs
- **Deliverables:** Running platform skeleton with auth and base APIs

### Phase 2: Workflow + Audit Framework (3 weeks)

- Build generic approval workflow engine with submit action
- Build e-signature module and immutable audit log (hash chain)
- Build notification engine (in-app/email/Feishu adaptor)
- **Deliverables:** Reusable workflow component used by PR/PO/ECR and others

### Phase 3: Master Data and PLM Core (4 weeks)

- Implement items/revisions/category/risk/custom fields
- Implement temp-to-formal part conversion lifecycle
- Implement BOM with sourcing type per line and substitute support
- Implement DMS (controlled revisions + linking)
- Implement project and milestone module
- **Deliverables:** Released master-data APIs/UI with search including custom fields

### Phase 4: Procurement and Supplier Collaboration (4 weeks)

- PR module + two-level approval policies
- RFQ/quotation compare and selection
- PO module with versioned change log
- Receiving (GRN) integration with inspection trigger
- **Deliverables:** End-to-end PR->RFQ->PO->GR flow

### Phase 5: Inventory and Warehouse Operations (4 weeks)

- Inventory ledger/lot/serial and transaction posting engine
- Material issue notice/request/outbound note
- Summary-page batch issue request + same-item merge logic
- Stock transfer and demand request flows
- Cycle count quarterly/yearly planning + adjustments
- **Deliverables:** Robust warehouse execution with shortage branches

### Phase 6: Subcontracting and Production Control (4 weeks)

- Subcontract order/material issue/receipt/fee statement/reconciliation
- Production work order with module readiness gate
- Operation tracking + WIP states + production receipt
- **Deliverables:** Integrated make + subcontract flows with trace links

### Phase 7: Quality and Traceability Hardening (3 weeks)

- Incoming/in-process/final inspection plans and records
- NC/CAPA basic process
- DHR assembly and shipment genealogy queries
- **Deliverables:** End-to-end lot/serial forward/backward traceability

### Phase 8: Engineering Change Automation (3 weeks)

- ECR/ECO workflows with impact matrix
- Child-to-parent revision auto-propagation engine
- Effectivity date and transition rules for open docs
- **Deliverables:** Controlled engineering change with approval/audit evidence

### Phase 9: Costing and Finance Integration (3 weeks)

- Cost element and cost transaction capture from inventory/production/subcontract
- AP reconciliation for subcontract fee and invoices
- Finance posting queue + connector to external finance system
- **Deliverables:** Cost visibility and posting reliability dashboard

### Phase 10: Reporting, Migration, and Go-Live Readiness (4 weeks)

- Build operational dashboards and compliance trace reports
- Migrate master/transaction legacy data with validation scripts
- Performance, security, DR, and UAT sign-off
- Conduct training and go-live cutover
- **Deliverables:** Production-ready ERP with hypercare runbook

## 3) Build Order for AI Coding Agent (Direct Execution Sequence)

1. Implement shared platform modules: auth, RBAC, numbering, audit, workflow
2. Implement master data (items, revisions, category, supplier, warehouse, custom fields)
3. Implement BOM + document management + ECR/ECO core
4. Implement procurement (PR/RFQ/quotation/PO)
5. Implement receiving + inspection + inventory ledger
6. Implement material issue/transfer/shortage workflows
7. Implement subcontract + production modules
8. Implement shipment + traceability queries + DHR
9. Implement safety stock scheduler + notifications + Feishu adapter
10. Implement costing/AP/finance connector
11. Add reports, migration tools, hardening, and full test suite

## 4) Success Metrics (Program Acceptance)

- **Audit trail completeness:** 100%
- **UDI compliance:** 100%
- **Lot traceability:** 100% forward/backward
- **Inventory accuracy:** >99%
- **On-time delivery:** >98%
- **Supplier quality score:** >90%
- **OEE:** >85%
- **Complaint/CAPA closure effectiveness:** aligned to regulated SLA targets

## 5) Testing and Validation Strategy

### Test Layers

- Unit tests for domain rules (state transitions, revision propagation, merge logic)
- Integration tests for PR->PO->GR, subcontract, WO, shipment genealogy
- Workflow approval tests with multi-role policy and GM override path
- Data integrity tests for lot/serial genealogy and inventory balance consistency
- Performance tests for stock queries and traceability queries

### Validation Packs

- Requirement-to-test mapping using RQ-\* IDs
- UAT scripts for each workflow WF-\*
- Regression suite for audit and signature non-bypass

## 6) Key Risks and Mitigation

- **Risk:** Unclear effectivity rules for auto-upgrade revisions.
  **Mitigation:** Define change policy matrix and simulate on open documents before go-live.

- **Risk:** Traceability data gaps if users bypass scanning.
  **Mitigation:** Enforce lot/serial mandatory scan and block posting on missing trace fields.

- **Risk:** Integration instability (Feishu/finance).
  **Mitigation:** Queue + retry + dead-letter + monitoring.

- **Risk:** Over-customized forms without governance.
  **Mitigation:** Custom field governance workflow and searchable index policy.

## 7) Open Decisions (Before Coding Freeze)

1. Single-tenant vs multi-tenant deployment model
2. Exact approval matrix by document type and amount thresholds
3. Whether CAPA depth is basic ERP-level or full QMS-grade
4. Costing method: standard vs moving average vs actual lot cost
5. Finance integration direction: keep external finance as source of truth or migrate fully
6. Regulatory scope expectations (internal traceability only vs full external compliance framework)

## 8) Governance Rules

Any deviation from this consolidated plan requires a controlled change request with:

- Impact analysis (RQ, WF, schema, field compatibility, compliance)
- Approver e-signature
- Migration/backward compatibility plan
- Updated traceability matrix
