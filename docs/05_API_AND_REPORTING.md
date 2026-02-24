> **Note:** This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

# API Surface, Events, and Reporting

## 1) Must-Have API Surface

The following API groups define the core surface area of the system. Each group is a logical namespace under a versioned base path (e.g., `/api/v1/...`).

| Domain | Endpoints |
|---|---|
| **Identity & Access** | `/auth/*`, `/users/*`, `/roles/*`, `/permissions/*` |
| **Workflow & Collaboration** | `/workflow/*`, `/approvals/*`, `/notifications/*` |
| **Engineering & Documents** | `/items/*`, `/item-revisions/*`, `/bom/*`, `/ecr/*`, `/eco/*`, `/documents/*`, `/projects/*` |
| **Procurement** | `/pr/*`, `/rfq/*`, `/quotations/*`, `/po/*`, `/receipts/*` |
| **Inventory & Materials** | `/inventory/*`, `/lots/*`, `/serials/*`, `/material-issues/*`, `/transfers/*`, `/cycle-count/*` |
| **Manufacturing** | `/subcontract/*`, `/work-orders/*`, `/production-receipts/*` |
| **Quality & Compliance** | `/inspections/*`, `/nonconformance/*`, `/capa/*`, `/traceability/*`, `/shipments/*` |
| **Finance** | `/costing/*`, `/ap-recon/*`, `/finance-posting/*` |
| **Integrations** | `/integrations/feishu/*` |

## 2) Event Topics (Message Bus)

All domain events are published to a message bus for asynchronous consumption by internal services, notification handlers, and audit processors.

| Topic | Description |
|---|---|
| `workflow.submitted` | A workflow instance has been submitted for approval |
| `workflow.approved` | A workflow step or instance has been approved |
| `workflow.rejected` | A workflow step or instance has been rejected |
| `inventory.shortage.detected` | Projected or actual stock has fallen below the safety threshold |
| `inventory.transaction.posted` | An inventory transaction (receipt, issue, transfer, adjustment) has been committed |
| `engineering.eco.released` | An Engineering Change Order has been released to production |
| `quality.inspection.failed` | An inspection result has been recorded as failed |
| `traceability.shipment.posted` | A shipment record has been finalized and posted |
| `safety_stock.alert.triggered` | A safety-stock reorder point has been breached |

## 3) Reports and Trace Queries (Mandatory)

### Operational Reports

- **PR Aging** — Time elapsed since each Purchase Request was created, grouped by status and requester.
- **PO Aging** — Time elapsed since each Purchase Order was issued, grouped by status and supplier.
- **Approval Cycle Time by Step/Role** — Average and percentile durations for each approval step, broken down by role and workflow type.
- **Supplier Quotation Comparison and Winner Rationale** — Side-by-side comparison of supplier quotes per RFQ, including the recorded rationale for the selected winner.
- **Stock by Item/Revision/Lot/Location and Shortage Risk List** — Current on-hand, allocated, and available quantities with a flagged list of items at risk of shortage.
- **Subcontract WIP and Fee Reconciliation** — Work-in-progress quantities at each subcontractor, matched against invoiced fees and expected costs.
- **Production Progress by WO/Module/Operation** — Completion status of each Work Order, rolled up by module and individual operation.

### Compliance and Traceability Reports

- **Full Genealogy Report** — Traces from a shipment serial number down through every assembled component, sub-assembly lot, and originating supplier. *(Shipment Serial -> Components -> Suppliers)*
- **Reverse Impact Report** — Given a component lot, identifies all shipped customer devices and end-customers that contain that lot. *(Component Lot -> Shipped Customers/Devices)*
- **Revision History Report** — Complete change history for any item, BOM, or document, including the effective date timeline for each revision.
- **Audit Trail Report by Document** — Chronological log of every change to a document or record: who changed it, what was changed, when, and the stated reason.
- **E-Signature Evidence Report** — Collected electronic signature records for a given document or workflow, including signer identity, timestamp, meaning of signature, and authentication method.
