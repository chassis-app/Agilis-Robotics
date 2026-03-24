# Statement of Work (SOW) - Functional Scope List

## 1. Basis of This Draft

- This draft is consolidated from the current repository codebase, especially the functional pages under `agilis-erp-demo/src/pages`, and the existing project documents under `docs/`.
- Primary reference documents used:
  - `docs/01_REQUIREMENTS.md`
  - `docs/02_SYSTEM_DESIGN.md`
  - `docs/04_WORKFLOWS.md`
  - `docs/05_API_AND_REPORTING.md`
  - `docs/design/09_UIUX_DESIGN.md`
  - `20260314-changes.md`
- This list is intended to serve as a contract-facing functional scope baseline for the target ERP system, not merely a snapshot of the current front-end demo.
- Where the documentation baseline is broader than the current demo UI, the remarks call that out so the scope is clear and not overstated.
- Field-level preservation remains governed by the legacy field preservation rule and bilingual field master; this SOW is a function list, not a full field dictionary.

## 2. System-Wide Functional and Design Baseline

### Module: Cross-System Platform, Compliance, and Governance

#### Submodule: Bilingual UX and Canonical Data Governance
- Feature:
  - Chinese and English UI support across navigation, forms, tables, and document screens.
  - Bilingual master-data display for item names, supplier names, and other business labels.
  - Canonical English field keys for schema and API, with localized Chinese/English display labels in UI.
  - Preservation of all visible legacy-system fields unless removed through formal change control.
- Remarks on design:
  - English canonical keys follow `snake_case`; Chinese remains a presentation-layer label standard.
  - One logical field may have multiple UI labels, but only one canonical key.
  - The system must support instant language switching and user-level language preference persistence.

#### Submodule: Identity, Roles, and Access Control
- Feature:
  - User account management.
  - Role-based permissions for viewing, editing, approving, and administering records.
  - Department- and site-aware permission scope where relevant.
  - Regulated-action authentication for submit, approve, reject, override, and other controlled actions.
- Remarks on design:
  - Identity and access are part of the mandatory API surface (`/auth/*`, `/users/*`, `/roles/*`, `/permissions/*`).
  - Permission scope must be definable down to field, document, workflow, and approval level where required.

#### Submodule: Workflow, Approvals, and Electronic Signature
- Feature:
  - Configurable workflow engine for document submission, approval, rejection, and escalation.
  - Two-level approval baseline where mandated, with extensibility for more complex routing.
  - Electronic signature capture for regulated actions.
  - Approval timeline, approval history, and signature verification evidence.
  - GM override path for exceptional warehouse-release scenarios.
- Remarks on design:
  - Submit is a first-class workflow action, not only a status update.
  - Electronic signature behavior must align with 21 CFR Part 11 expectations: re-authentication, timestamp, meaning of signature, immutable record.
  - Workflow actions publish integration and audit events.

#### Submodule: Audit Trail, Change Control, and Record Integrity
- Feature:
  - Immutable audit trail per document and transaction.
  - Before/after value capture for material field changes.
  - Audit reporting by document and workflow.
  - Controlled change-request process for deviations from approved baseline.
- Remarks on design:
  - Audit records must preserve user, action, timestamp, reason, and signature context.
  - Medical-device traceability requires long-term retention of immutable audit and event records.
  - Hash-chain or equivalent integrity assurance is expected for signature-linked audit events.

#### Submodule: Document Numbering and Sequence Control
- Feature:
  - Formal and informal document numbering families across the end-to-end process.
  - Sequence-family visibility on transaction documents.
  - Internal-order numbering support where different from external/formal order numbering.
- Remarks on design:
  - Dual sequence rules apply across order, procurement, manufacturing, inventory, and quality documents.
  - Sequence behavior is centrally configured in system administration rather than handled separately by each page.

#### Submodule: Technical Architecture and Operational Controls
- Feature:
  - Versioned API surface for all major domains.
  - Event-driven integration support through a message bus.
  - PostgreSQL-centered transactional data model with document/object storage for attachments.
  - Backup, restore, concurrency control, and environment promotion controls.
- Remarks on design:
  - Reference architecture keeps backend implementation language flexible, but canonical storage and integration patterns are already defined.
  - Optimistic locking, full API audit logging, 10-year record retention, and PITR-capable backups are part of the design baseline.

## 3. Functional Modules

### Module: Home and User Workbench

#### Submodule: Dashboard
- Feature:
  - Home dashboard with KPI cards and summary metrics.
  - Role-aware visibility into operational queues, alerts, and recent activity.
  - Quick access to high-frequency operational areas.
- Remarks on design:
  - Dashboard is an entry-point surface, not a separate transaction engine.
  - KPI visuals should always have data-table alternatives for accessibility and auditability.

#### Submodule: Approval Inbox
- Feature:
  - Central approval inbox for pending actions across document types.
  - Display of requester, department, amount, date, document type, and status.
  - Navigation into source document for review and action.
- Remarks on design:
  - Approval inbox is a cross-module work queue and must aggregate PR, payment request, warehouse, quality, and change-control approvals.
  - The same approval engine and e-signature rules apply regardless of source module.

#### Submodule: Navigation, Shell, and Search
- Feature:
  - Module-based sidebar navigation.
  - Breadcrumbs and page context indicators.
  - Responsive shell for desktop, tablet, and mobile.
  - Global search entry design.
- Remarks on design:
  - Navigation follows the functional module structure defined by system architecture.
  - The design baseline is role-aware, bilingual, and optimized for dense transactional screens rather than marketing-style layouts.

### Module: Procurement

#### Submodule: Purchase Requisition (PR)
- Feature:
  - PR creation, edit, detail, and list views.
  - Line capture for item, revision, quantity, UOM, warehouse, required date, estimated price, and notes.
  - Priority handling and requester/department ownership.
  - Stock sufficiency and shortage-awareness during PR preparation.
  - Submission and approval routing before downstream purchasing.
- Remarks on design:
  - PR-first, then PO, is a mandatory business rule.
  - PR submit/approve/reject actions are controlled workflow events with audit and e-signature.
  - Approved PR is the contractual gate for RFQ and PO generation.

#### Submodule: Supplier RFQ and Quotation Review
- Feature:
  - RFQ creation from approved PR demand.
  - Supplier quotation capture and comparison.
  - Side-by-side evaluation of price, lead time, MOQ, and other commercial factors.
  - Winner selection with recorded rationale.
  - Optional additional approval for high-value sourcing decisions.
- Remarks on design:
  - Winning quotation lines should remain linked to PO lines for audit traceability.
  - Quote version history must be retained, not overwritten.

#### Submodule: Purchase Order (PO)
- Feature:
  - PO creation from approved PR and selected quotation data.
  - Supplier, buyer, delivery, notes, totals, and currency management.
  - Line-level received quantity tracking.
  - Status management through draft, submitted, approved, sent, and follow-up stages.
  - Payment-plan setup inside the PO, including milestone-driven payment schedules.
- Remarks on design:
  - Multi-currency handling must support RMB and USD.
  - PO lines should carry source quotation and requisition references where available.
  - The current demo explicitly models mixed payment modes within a single PO.

#### Submodule: PO Payment Scheduling
- Feature:
  - Mixed-mode payment support inside one PO, including prepayment, COD, and monthly settlement.
  - Payment milestone amounts, requested amounts, paid amounts, and outstanding balance tracking.
  - Linked payment-request generation from PO milestones.
  - Re-approval behavior when payment mode changes after initial approval.
- Remarks on design:
  - Payment scheduling is functionally part of procurement, but operationally linked to finance approval and AP reconciliation.
  - Existing UI and mock models already treat this as a first-class PO capability.

#### Submodule: Goods Receipt (GRN)
- Feature:
  - Receipt posting against PO.
  - Warehouse and received-date tracking.
  - Lot/serial generation or scan support per workflow baseline.
  - Item check report follow-up.
  - Tax invoice follow-up visibility.
  - Direct navigation to supplier return when needed.
- Remarks on design:
  - GRN acts as a parent transaction for inspection evidence, finance follow-up, and supplier-return traceability.
  - Incoming inspection should be triggered automatically where quarantine/release rules require it.

#### Submodule: Goods Return
- Feature:
  - Supplier-return document for materials received against GRN/PO.
  - Return header with source GRN, source PO, supplier, warehouse, reason, and status.
  - Check-report status and tax-invoice status on the return record.
  - Return quantity and line-level disposition tracking.
  - Links back to receipt, inspection, and AP reconciliation.
- Remarks on design:
  - Scope is supplier return, not generic customer return.
  - Finance blocking behavior for tax invoices affected by return is part of the intended process.
  - Approval policy support for goods return is already reflected in the current admin configuration.

### Module: Inventory and Warehouse

#### Submodule: Stock Overview and Lot Control
- Feature:
  - Inventory visibility by item, revision, lot, warehouse, and location.
  - On-hand, reserved, and available quantity tracking.
  - Lot status management such as available, reserved, quarantine, and consumed.
  - Safety-stock and reorder-point visibility at stock summary level.
- Remarks on design:
  - Inventory is not only quantity-based; lot-level identity is required for traceability.
  - The documented API surface includes inventory, lots, serials, and inventory-transaction namespaces.

#### Submodule: Material Withdrawal Request (`領料`)
- Feature:
  - Request-to-withdraw inventory for production or warehouse execution.
  - Launch from source detail pages and summary batch mode.
  - Merge same-material demand into one request when grouping rules match.
  - Required fields for reason, build order or production batch, warehouse, and approval status.
  - One-order-per-warehouse behavior where required by process rule.
- Remarks on design:
  - This document is a request stage, not the physical stock deduction stage.
  - Grouping and merge behavior must retain full audit of original source lines.
  - The current codebase explicitly repositions this document as `Material Withdrawal Request`.

#### Submodule: Material Withdrawal Confirmation (`發料`)
- Feature:
  - Warehouse execution and confirmation of inventory withdrawal against approved request.
  - Lot allocation and FIFO-based issue execution.
  - Trace back to warehouse, production batch, and source request.
  - Inventory transaction posting at execution time.
- Remarks on design:
  - Confirmation must reference the approved withdrawal request rather than exist independently.
  - This is the physical issue stage and should produce irreversible inventory movement records.

#### Submodule: Shortage Handling
- Feature:
  - Shortage detection during inventory issue.
  - Branch actions to create material demand request, stock transfer, PR/PO conversion, or partial issue.
  - Resume of pending issue flow after replenishment.
- Remarks on design:
  - Shortage handling is a controlled branch of the inventory process, not an ad hoc manual exception.
  - The UX baseline includes a guided shortage-resolution dialog to force explicit operator choice.

#### Submodule: Stock Transfers
- Feature:
  - Inter-warehouse transfer order creation.
  - Transfer use for shortage resolution and stock balancing.
  - Warehouse-to-warehouse movement trace.
- Remarks on design:
  - Transfer is a formal document flow and should generate inventory transactions at both source and destination.

#### Submodule: Cycle Count and Periodic Warehouse Checks
- Feature:
  - Quarterly and yearly count-plan generation.
  - Blind-count execution and variance capture.
  - Variance approval and adjustment posting with reasons.
- Remarks on design:
  - Periodic checks are a documented workflow requirement, not just a report.
  - Variance approval is expected to carry e-signature and audit evidence.

#### Submodule: Safety Stock Alerts
- Feature:
  - Configurable safety-stock thresholds and reminder cycles.
  - Immediate and recurring alert generation.
  - Low and critical alert-level handling.
  - Recipient targeting by role, department, named users, and extra email addresses.
  - Email template configuration and test-send support.
- Remarks on design:
  - Alerting is rule-driven and scheduler-driven.
  - Alert closure requires recovered inventory or explicit policy disablement.
  - The current system configuration UI already models cooldown, send mode, and recipient resolution.

### Module: Manufacturing

#### Submodule: Build Orders / Work Orders
- Feature:
  - Build-order list and detail management.
  - Source-order linkage to formal sales, informal sales, or internal orders.
  - Market, sequence family, and product-scope context on the manufacturing order.
  - BOM expansion and operation/module execution basis.
  - Completion progress tracking.
- Remarks on design:
  - The current codebase has already shifted terminology toward `Build Orders`.
  - Manufacturing release must respect market eligibility and formal/informal order rules from the order-management module.

#### Submodule: Module Readiness and Release Gating
- Feature:
  - Module readiness checks before production release.
  - Requirement that all required modules be ready before release of the build order.
  - Controlled release for semi-finished and finished goods.
- Remarks on design:
  - This gating rule comes directly from the documented workflow and manufacturing requirements.
  - The gate exists to prevent release of incomplete assemblies and protect device-history integrity.

#### Submodule: Production Batch Split
- Feature:
  - Split one parent build order into multiple child execution batches.
  - Batch numbering and visibility in detail and progress views.
  - Batch-level linkage to withdrawal request, withdrawal confirmation, and Internal QC.
  - Support for additional split actions on an existing build order.
- Remarks on design:
  - Batch split is an execution mechanism, not duplication of order intent.
  - The current UI explicitly models batch-wise warehouse and QC trace.

#### Submodule: Production Progress
- Feature:
  - Progress view by build order, batch, and stage.
  - Tracking of execution stages such as withdrawal confirmation, assembly, and Internal QC.
  - Queue and prioritization visibility.
- Remarks on design:
  - Progress should be readable from both operation-level and batch-level perspectives.
  - Design intent is to give planners a quick exception-oriented view of bottlenecks and pending releases.

#### Submodule: Subcontract Processing
- Feature:
  - Subcontract order creation for outsourced processing.
  - Material-availability check before issue to subcontractor.
  - PR/PO branch creation when subcontract materials are insufficient.
  - Shipment of components to subcontractor and receipt of processed goods.
  - Subcontract fee statement generation and AP reconciliation linkage.
- Remarks on design:
  - Sent material lots and returned finished lots must remain fully traceable.
  - This is a dedicated workflow, not just a PO subtype.

#### Submodule: Production Receipt and Device History Record
- Feature:
  - Production receipt posting for finished or semi-finished output.
  - Final-inspection gating before release.
  - Device history record aggregation from BOM, material consumption, operations, inspections, documents, and approvals.
- Remarks on design:
  - This capability is strongly documented in the design pack, although the current demo surfaces it mainly through traceability and quality views rather than a dedicated DHR page.

### Module: Engineering and PLM

#### Submodule: Item Master
- Feature:
  - Item master list, detail, search, and classification management.
  - Base category plus three additional structured category fields.
  - Sourcing type, part source, lifecycle, default supplier, lead time, MOQ, safety stock, and pricing attributes.
  - Revision-aware item display.
- Remarks on design:
  - The additional category fields are required for Internal QC template selection and rules.
  - The design baseline requires preservation of legacy visible fields and bilingual naming.

#### Submodule: Item Revision and Part Number Lifecycle
- Feature:
  - Revision records per item.
  - Temporary part numbering during R&D.
  - Formal part numbering at mass-production stage.
  - Effectivity and change-history support.
- Remarks on design:
  - Temporary-to-formal conversion must preserve mapping history.
  - Revision auto-upgrade logic must not break active orders and must respect effectivity dates.

#### Submodule: BOM Management
- Feature:
  - BOM tree and structure maintenance.
  - Permanent layer numbering such as `1`, `1.1`, `1.1.1`.
  - Custom row ordering independent of numbering.
  - Multi-source selection per BOM line.
  - BOM class tagging for final product vs semi-product.
  - BOM header tags for market or country applicability.
  - Substitute-material support.
- Remarks on design:
  - Layer numbers are permanent; deleted numbers are not reused; replacements keep the original number.
  - BOM classification directly affects order and build-order creation rules.
  - The BOM UI must clearly distinguish outsourced, purchased, and manufactured content.

#### Submodule: BOM Comparison
- Feature:
  - Comparison of two BOM versions down to lowest-level components.
  - Identification of added, removed, replaced, and quantity-changed parts.
  - Visibility into header-tag or market applicability changes.
  - Layer-number context carried through the diff view.
- Remarks on design:
  - This is a first-class review and audit function for engineering change, not only a convenience tool.
  - The current demo already includes a dedicated comparison screen.

#### Submodule: ECR / ECO and Controlled Engineering Change
- Feature:
  - ECR submission with impacted items, BOMs, and documents.
  - Reason modeling for CAPA-driven, material-driven, and part-driven changes.
  - Approval routing by impact and severity.
  - ECO package generation and release.
  - Parent-BOM revision propagation after child revision change.
  - Sunset and release control of old/new revisions.
- Remarks on design:
  - Engineering change is explicitly linked to downstream procurement, production, and quality consequences.
  - The current change-chain design places complaint -> CAPA -> ECR -> BOM/version release in one controlled flow.

#### Submodule: Controlled Documents
- Feature:
  - Upload, revision, review, approval, and release of controlled documents.
  - Document linkage to item, BOM, PO, build order, and other source objects.
  - Latest-effective released document resolution at point of use.
  - Retention of obsolete document revisions as read-only records.
- Remarks on design:
  - Document management is required for both procurement and production usage.
  - Object storage and immutable revision history are expected design controls.

#### Submodule: Project Management
- Feature:
  - No standalone project-management page is currently included in active UI scope.
- Remarks on design:
  - Earlier requirements mentioned project/PLM capability, but the 2026-03-14 approved change plan explicitly removed `Project Management` from current navigation and route scope.
  - If the client wants a standalone project module reinstated, it should be treated as a change request or a separately priced scope item.

### Module: Quality and Compliance

#### Submodule: Inspections
- Feature:
  - Incoming, in-process, and final inspection records.
  - Linkage to GRN, work/build order, lot, and quantity.
  - Pass, fail, and conditional result handling.
  - Visibility into source checklist/template where applicable.
  - Linkage to goods-return item check reports and Internal QC records.
- Remarks on design:
  - Receipt disposition and quarantine-release behavior depend on inspection outcome.
  - The inspection register remains generic, but it is now positioned inside a broader QC flow.

#### Submodule: Complaints
- Feature:
  - Complaint intake by market, product, customer, and severity.
  - Complaint list, detail, and status handling.
  - CAPA initiation from complaint.
  - Linkage to affected product and downstream engineering change.
- Remarks on design:
  - Complaint is the upstream entry point to regulated corrective-action flow.
  - Market context is important because complaint impact can be geography-specific.

#### Submodule: CAPA / Nonconformance
- Feature:
  - CAPA-centric workflow page.
  - Visibility of linked complaint, CAPA, ECR, BOM change, and released new BOM version.
  - Open/approved status management and change-chain review.
  - Retention of nonconformance records within the broader CAPA process.
- Remarks on design:
  - CAPA is treated as the primary controlled process; NC is subordinate or linked, not the whole quality model.
  - Approval routing can span quality, engineering, and GM depending on policy.

#### Submodule: Internal QC
- Feature:
  - Internal QC documents tied to build order and production batch.
  - AQL-based sample-size calculation.
  - QC template selection by market and Category A/B/C item classification.
  - Generated printable QC packet.
  - Recalculation of AQL logic and print operations.
- Remarks on design:
  - Internal QC is not the same as generic inspection; it is a dedicated major workflow.
  - The design is print-first because the shop-floor packet must exist as a fixed document, not just on-screen data entry.

#### Submodule: Internal QC Template Editor
- Feature:
  - WYSIWYG template authoring for printable QC forms.
  - Reusable template blocks including AQL blocks and controlled header areas.
  - Automatic injection of market, category, build-order, and batch metadata into template output.
  - System-stored template definitions and generated form output.
- Remarks on design:
  - The client requirement explicitly rejects dependence on externally managed PDFs for this flow.
  - Template design is an internal system capability and part of operational scope.

#### Submodule: Traceability and Genealogy
- Feature:
  - Search-driven trace entry from document number, item number, product number, lot, or serial.
  - Forward and backward traceability.
  - Workflow-style lineage across order, build order, withdrawal request, withdrawal confirmation, inspection/Internal QC, goods return, and quality change-chain documents where relevant.
  - Exportable genealogy and device-history evidence views.
- Remarks on design:
  - The latest design direction prefers a workflow view rather than a dense tree-only visualization.
  - This module is central to MDR, ISO 13485, and FDA traceability expectations.

#### Submodule: Regulatory Evidence and UDI Support
- Feature:
  - Audit-trail report by document.
  - E-signature evidence report.
  - Revision-history reporting.
  - UDI lifecycle support as part of compliance baseline.
- Remarks on design:
  - UDI is a required compliance capability from baseline documentation, although it is not yet surfaced as a dedicated first-class screen in the current demo.
  - Compliance reporting should be treated as contractual evidence generation, not only management analytics.

### Module: Order Management and Demand Planning

#### Submodule: Order Management
- Feature:
  - Unified management of formal sales orders, informal sales orders, and internal orders.
  - Order-type and market filtering.
  - Sequence-family visibility.
  - Summary metrics by order type, sequence family, and market.
- Remarks on design:
  - This module replaces a narrower `Sales Orders` concept with a broader operational order model.
  - Market and sequence family are core business controls, not optional labels.

#### Submodule: Order Detail and Market/BOM Eligibility
- Feature:
  - Order header capture for order type, market, sequence family, and product rule.
  - Market-specific BOM eligibility validation on order lines.
  - Visibility when no valid BOM exists for the selected market.
  - Restrictions on creation of semi-product build orders depending on order type.
  - Linked document chain to PR, build order, and Internal QC.
- Remarks on design:
  - Formal orders are intended to allow final-product BOMs only; informal/internal flows may allow semi-product creation where business rules permit.
  - This module is where market-specific engineering constraints become operationally enforceable.

#### Submodule: Sales Forecasts
- Feature:
  - Forecast list and period-based forecast detail management.
  - Manual creation and Excel import/export support.
  - Forecast-line capture by finished good, revision, quantity, price, and confidence.
  - Status flow through draft, accepted, processed, and closed.
  - Shortage warning indicator on forecast records.
- Remarks on design:
  - Forecast acceptance is a control point because only accepted demand should drive procurement generation.
  - Forecasting is operational planning scope, not only reporting.

#### Submodule: Sales-Driven Procurement Planning
- Feature:
  - BOM explosion from forecast or accepted sales demand.
  - Net-requirement calculation using required, on-hand, and remaining on-order quantities.
  - Grouping of components by preferred supplier.
  - PR generation by supplier.
  - Exception handling for multi-supplier or unresolved supplier selection.
  - Trace linkage back to source forecast or sales demand.
- Remarks on design:
  - This is documented as WF-15 and is part of the baseline workflow scope.
  - Procurement planning here is demand-driven and BOM-aware, not only manual requisition entry.

#### Submodule: Shipment and Outbound Genealogy
- Feature:
  - Shipment posting for finished goods.
  - Allocation of finished lots/serials to shipment documents.
  - Write-back of genealogy from shipped finished goods to consumed component lots through source build order.
  - Customer/device forward and reverse trace query support.
- Remarks on design:
  - This is a mandatory documented workflow capability even though the current demo expresses it mainly through traceability and reporting surfaces rather than a dedicated shipment page.

### Module: Finance and Integration

#### Submodule: Costing
- Feature:
  - Cost-management capability inside ERP.
  - Visibility into procurement, manufacturing, and subcontract cost drivers.
  - Cost roll-up and cost reporting support.
- Remarks on design:
  - The requirements baseline explicitly proposes bringing cost management into ERP rather than leaving it entirely external.

#### Submodule: Payment Requests
- Feature:
  - Group one or more open vendor balances into a payment request.
  - Generate requests from PO payment schedules.
  - Track draft, in-approval, approved, and other payment-request states.
  - Maintain payment-request lines linked to PO, schedule, trigger, requested amount, paid amount, and outstanding amount.
- Remarks on design:
  - The current codebase already treats payment request as a first-class finance document.
  - Payment-request approvals are part of cross-module workflow and inbox behavior.

#### Submodule: AP Reconciliation
- Feature:
  - Reconcile invoice, PO, GRN, and goods-return data.
  - Track tax invoice status as uploaded, pending, or blocked by return.
  - Maintain invoice attachments and finance follow-up status.
  - Expose return-driven finance hold conditions.
- Remarks on design:
  - This module is intentionally modeled as a finance-control page, not as a separate standalone tax-invoice document subsystem.
  - Goods return directly influences AP eligibility and invoice release status.

#### Submodule: Integration Monitor
- Feature:
  - Status overview of Feishu, ERP sync, WMS, finance-system, and other integrations.
  - Display of uptime, last sync, sync direction, record count, duration, and message.
  - Review of recent sync logs and error conditions.
- Remarks on design:
  - Integration monitoring is an operational support capability for exception handling and diagnostics.
  - Backend design should support retry, dead-letter, and support-dashboards rather than silent failure.

#### Submodule: Feishu and External Finance Integration
- Feature:
  - Push approval and alert notifications to Feishu.
  - Push cost, AP, and stock postings to external finance or internal costing engine.
  - Publish asynchronous domain events for workflow, inventory, engineering, quality, and traceability updates.
- Remarks on design:
  - Integration is both synchronous API-driven and asynchronous event-driven.
  - Core event topics are already defined in the documentation baseline and should be preserved in implementation.

### Module: Reports and Analytics

#### Submodule: Operational Reports
- Feature:
  - PR aging.
  - PO aging.
  - Approval cycle time by step and role.
  - Supplier quotation comparison and winner rationale.
  - Stock by item/revision/lot/location and shortage-risk list.
  - Subcontract WIP and fee reconciliation.
  - Production progress by work/build order, module, or operation.
  - Procurement summary, inventory aging, supplier performance, and delivery-performance views.
- Remarks on design:
  - Reports must support export and should preserve drill-back to source transactions where practical.
  - Charts should never be the only evidence form; accessible tabular alternatives are part of the UI standard.

#### Submodule: Compliance and Traceability Reports
- Feature:
  - Full genealogy report.
  - Reverse impact report.
  - Revision-history report.
  - Audit trail report by document.
  - E-signature evidence report.
  - CAPA summary and nonconformance trending.
  - Document-control and UDI-compliance reporting.
- Remarks on design:
  - These reports are regulatory evidence outputs and should be treated as controlled deliverables.
  - Some compliance report cards already appear in the current UI, but the contract scope should follow the documented evidence list, not only visual cards.

### Module: Administration and System Configuration

#### Submodule: Users and Roles
- Feature:
  - User administration.
  - Role assignment and access provisioning.
  - Locale-aware user preferences.
- Remarks on design:
  - User and role administration is a prerequisite for controlled approvals, audit traceability, and site/department permissions.

#### Submodule: Approval Policies
- Feature:
  - Document-type approval policy definition.
  - Configurable approval levels and approver roles.
  - Support for withdrawal request, withdrawal confirmation, goods return, CAPA/ECR chain, and other document families.
- Remarks on design:
  - The policy engine must preserve two-level approvals where mandatory, while remaining extensible for future routing logic.
  - The current demo already reflects newly added policy families from the client change plan.

#### Submodule: Custom Fields
- Feature:
  - Dynamic custom fields and option sets.
  - Searchable and filterable custom data points.
  - Availability of custom fields to downstream forms, lists, and workflows.
- Remarks on design:
  - This is required to preserve legacy-system flexibility without losing link-search and grouping capability.
  - Custom fields must still obey permission, validation, and audit rules.

#### Submodule: System Configuration
- Feature:
  - Company, language, and timezone defaults.
  - Integration toggles and notification settings.
  - Dual sequence rule setup.
  - Safety-stock alert configuration including levels, cooldown, routing, and email templates.
- Remarks on design:
  - System configuration changes should be controlled and auditable because they affect regulated workflows and notification behavior.
  - The current UI already includes system-wide sequence and alert configuration surfaces.

## 4. Scope Boundary Notes

- Standalone `Project Management` is currently removed from active UI scope and should be excluded unless reintroduced through approved change control.
- Where the current demo UI is lighter than the baseline documentation, the SOW scope should follow the approved requirements/workflow/design documents rather than only the visual completeness of the demo.
- Any removal of preserved legacy fields, deviation from mandatory workflows, or change to compliance behavior requires formal change control with impact analysis, approval, and updated traceability.
