# Statement of Work (SOW)
## Functional Scope and Business Process Understanding

## 1. Document Purpose

- This document is prepared as a contract-facing functional scope list for the proposed ERP system.
- The focus of this version is business function, designed workflow, and operational process understanding.
- Technical and non-functional matters are mentioned only briefly in a separate section.
- This draft is based on:
  - current application code under `agilis-erp-demo/src/pages`
  - requirements and workflow documents under `docs/`
  - client-specific change direction captured in `20260314-changes.md`

## 2. Business Understanding Summary

- The client’s business is not a generic trading ERP flow. It is a regulated medical-device operation with strong control requirements over engineering versioning, production traceability, approvals, inspection, and audit history.
- Procurement is expected to follow a controlled `PR -> RFQ/quotation -> PO -> receipt -> inspection -> return/release -> AP/payment` chain rather than free-form purchasing.
- Manufacturing is expected to operate from order-driven or planning-driven build orders, with market and BOM eligibility checks, production batch split, controlled warehouse withdrawal, and Internal QC before release.
- Engineering control is expected to manage temporary and formal part numbers, versioned BOMs, substitute materials, and formal ECR/ECO release logic.
- Quality is expected to cover incoming inspection, Internal QC, complaints, CAPA, engineering-change linkage, and full forward/backward traceability.
- Finance is expected to follow procurement and warehouse events closely, especially PO payment milestones, payment requests, AP reconciliation, tax invoice follow-up, and finance blocking when goods return affects settlement.
- The system must show clear bilingual operation and preserve legacy field visibility while moving the client into a more controlled and searchable process.

## 3. Functional Scope by Module

### Module: Cross-System Controls

#### Submodule: Bilingual Operation
- Functional scope:
  - Chinese and English display across navigation, forms, tables, and document screens.
  - Bilingual display for core business names such as item, supplier, and selected master-data values.
  - User-level language switching and preference persistence.
- Designed workflow and process:
  - Users enter the same business process regardless of language.
  - The system presents the same documents, statuses, and actions in the selected language while preserving one canonical underlying data structure.
  - Document numbers and system identifiers remain stable across both languages.

#### Submodule: Roles, Permissions, and Controlled Actions
- Functional scope:
  - User management.
  - Role and permission management.
  - Access control for view, edit, submit, approve, reject, release, and override actions.
  - Department- or site-aware control where needed.
- Designed workflow and process:
  - A user first gains access based on assigned role and organizational responsibility.
  - The system then determines which records can be created, viewed, edited, or approved by that user.
  - Controlled actions such as approval, rejection, or override are not treated as ordinary edits; they are treated as governed events with stronger authentication and trace requirements.

#### Submodule: Workflow, Approval, and E-Signature
- Functional scope:
  - Workflow submission.
  - Multi-step approval routing.
  - Approval history and approval timeline.
  - Electronic signature capture for regulated actions.
  - GM override for exceptional release scenarios.
- Designed workflow and process:
  - A business document is created in draft status.
  - The requester explicitly submits the document into a workflow.
  - The system routes the document to the required approvers according to document type and policy.
  - Each approval or rejection is recorded as a distinct controlled event.
  - Where the process requires a higher-level override, the system forces a reason and signature before allowing the exception.

#### Submodule: Audit Trail and Change Control
- Functional scope:
  - Immutable audit history by document and action.
  - Recording of before/after field changes where required.
  - Controlled deviation and change-request handling for scope or baseline changes.
- Designed workflow and process:
  - Every major business event such as create, edit, submit, approve, reject, release, or override is written into audit history.
  - Where key fields are changed, the system records old value, new value, actor, time, and reason.
  - If a requested process change affects approved baseline behavior, the change must move through formal review rather than informal configuration only.

#### Submodule: Document Sequence and Numbering Rules
- Functional scope:
  - Formal and informal numbering families.
  - Sequence behavior across order, procurement, manufacturing, inventory, and quality documents.
  - Internal-order sequence support.
- Designed workflow and process:
  - When a document is created, the system assigns it into the correct sequence family according to business context.
  - This sequence family is then preserved across the related downstream flow, so users can distinguish formal, informal, and internal business chains.
  - The same sequence logic supports traceability, approval routing, and cross-module review.

### Module: Home and Workbench

#### Submodule: Dashboard
- Functional scope:
  - KPI summary.
  - Alert summary.
  - Pending work visibility.
  - Quick access to high-frequency functions.
- Designed workflow and process:
  - Users begin the day from a role-aware operational view.
  - The dashboard highlights exceptions first, such as pending approvals, shortages, production status, or finance holds.
  - Users then drill into the underlying transaction page to take action.

#### Submodule: Approval Inbox
- Functional scope:
  - Central inbox for documents awaiting approval.
  - Cross-module approval queue.
  - Direct navigation to source records.
- Designed workflow and process:
  - Approvers do not need to visit each business module separately.
  - The system gathers all pending approval tasks into one controlled work queue.
  - From the inbox, the approver opens the document, reviews supporting information, signs, and completes the decision.

### Module: Order Management and Demand Planning

#### Submodule: Order Management
- Functional scope:
  - Unified handling of formal sales orders, informal sales orders, and internal orders.
  - Order list, search, status, and summary views.
  - Market and sequence-family filtering.
- Designed workflow and process:
  - The business begins with a demand signal that may come from an external customer order or an internal order.
  - The system classifies the order by order type and sequence family from the start.
  - This classification controls downstream manufacturing, inventory, and document numbering behavior.

#### Submodule: Order Detail and Market Control
- Functional scope:
  - Order header with order type, market, sequence family, and product rule.
  - Order-line control for market-eligible products.
  - Linked document view for downstream build orders and related records.
- Designed workflow and process:
  - The user selects market and order type at the order header.
  - The system limits product and BOM selection based on the selected market.
  - If no valid BOM exists for that market, the user is warned and cannot proceed as if the product were valid.
  - Once approved or released for execution, the order becomes the upstream driver for build-order generation and downstream traceability.

#### Submodule: Sales Forecast
- Functional scope:
  - Forecast creation and maintenance by period.
  - Excel import and export.
  - Forecast-line entry for finished goods, quantities, and planning confidence.
  - Forecast status management.
- Designed workflow and process:
  - Forecast is created for a defined planning period.
  - The planner can maintain forecast lines manually or via spreadsheet import.
  - When the forecast is accepted, it becomes a controlled input into procurement planning.
  - Accepted forecast data can then drive BOM explosion and requisition generation.

#### Submodule: Sales-Driven Procurement Planning
- Functional scope:
  - BOM explosion from accepted forecast or demand.
  - Net requirement calculation.
  - Grouping by preferred supplier.
  - PR generation from planning demand.
- Designed workflow and process:
  - The system takes finished-good demand and explodes it into component requirements.
  - It then subtracts on-hand and open-order quantities to determine net requirement.
  - Components are grouped by supplier logic.
  - Ready components are converted into PRs, while unresolved supplier situations are held for planner review.

### Module: Procurement

#### Submodule: Purchase Requisition (PR)
- Functional scope:
  - PR list, create, edit, and detail.
  - Item-level demand capture.
  - Priority, requester, department, warehouse, and required-date control.
  - Submission and approval.
- Designed workflow and process:
  - A department user raises a PR based on operational need, shortage, planning output, or engineering demand.
  - The PR records what is needed, when it is needed, and for which warehouse or purpose.
  - The requester submits the PR.
  - The PR then moves through the required approval chain.
  - Only approved PRs proceed to RFQ or PO creation.

#### Submodule: RFQ and Supplier Quotation Review
- Functional scope:
  - RFQ generation from approved PR.
  - Supplier quotation capture.
  - Commercial comparison and supplier selection.
  - Selection rationale recording.
- Designed workflow and process:
  - Procurement converts approved demand into RFQ activity.
  - Suppliers provide quotations.
  - The system compares suppliers on price, lead time, MOQ, and related commercial conditions.
  - The responsible buyer or reviewer selects the winning quotation and records the reason for selection.
  - The selected quote becomes the basis for PO creation.

#### Submodule: Purchase Order (PO)
- Functional scope:
  - PO creation, list, and detail.
  - PO lines, supplier details, buyer details, delivery date, totals, and notes.
  - PO status flow and received quantity tracking.
- Designed workflow and process:
  - Procurement creates the PO from approved PR and selected supplier terms.
  - The PO becomes the formal commitment document to the supplier.
  - Downstream receipt, inspection, return, invoice, and payment activity all reference this PO.

#### Submodule: PO Payment Plan
- Functional scope:
  - Payment schedule within the PO.
  - Support for prepay, COD, monthly settlement, or mixed payment mode.
  - Requested amount, paid amount, and outstanding balance tracking.
  - Re-approval trigger when payment arrangement changes.
- Designed workflow and process:
  - The PO is not treated only as a purchasing document; it also carries planned settlement logic.
  - Payment stages are defined according to the commercial agreement.
  - As milestones are reached, payment requests are generated from the open PO balance.
  - If payment mode changes materially after approval, the process returns to review rather than silently replacing the old logic.

#### Submodule: Goods Receipt
- Functional scope:
  - Receipt posting against PO.
  - Warehouse and receipt-date control.
  - Lot or serial capture.
  - Follow-up visibility for item check report, return status, and tax invoice status.
- Designed workflow and process:
  - Warehouse receives materials against a PO.
  - The system records the receipt and the associated lot or serial identity.
  - Where inspection is required, received material enters the appropriate inspection path instead of directly becoming unrestricted stock.
  - The GRN remains the reference point for inspection, goods return, and finance follow-up.

#### Submodule: Goods Return
- Functional scope:
  - Supplier-return document linked to source GRN and PO.
  - Return reason, warehouse, status, item check report status, and tax invoice status.
  - Return quantity and return-line control.
- Designed workflow and process:
  - If received goods fail inspection or otherwise require return, the user creates a supplier-return record from the source receipt.
  - The return tracks exactly what material is being returned, why, and under which source transaction.
  - Finance and AP status are updated accordingly so that tax invoice or settlement activity can be blocked or adjusted where necessary.

### Module: Inventory and Warehouse

#### Submodule: Stock Overview
- Functional scope:
  - Stock by item, revision, lot, warehouse, and location.
  - On-hand, reserved, and available quantity visibility.
  - Safety-stock visibility.
- Designed workflow and process:
  - Warehouse and planning users use the stock overview to understand current supply position.
  - The system presents both quantity and stock identity, not quantity alone.
  - This view supports shortage detection, allocation, transfer, and replenishment decisions.

#### Submodule: Material Withdrawal Request (`領料`)
- Functional scope:
  - Request-to-withdraw material for production execution.
  - Creation from detail page or summary batch mode.
  - Merge of same-material demand when rules match.
  - Warehouse-specific request handling.
- Designed workflow and process:
  - Production or planning identifies the need to withdraw material for a build order or batch.
  - The request is raised as a formal warehouse request document.
  - Where multiple lines qualify, the system can merge them into one controlled request to simplify warehouse picking.
  - The request then enters approval if required before physical issue occurs.

#### Submodule: Material Withdrawal Confirmation (`發料`)
- Functional scope:
  - Physical issue confirmation against approved withdrawal request.
  - Lot allocation and inventory deduction.
  - Warehouse and batch trace.
- Designed workflow and process:
  - Warehouse executes the approved withdrawal request.
  - The system records the actual lots issued and posts inventory deduction.
  - The confirmation remains linked to the source request, production batch, and warehouse so that material consumption can be fully traced later.

#### Submodule: Shortage Handling
- Functional scope:
  - Shortage detection during issue.
  - Branch action to demand request, stock transfer, PR/PO conversion, or partial issue.
- Designed workflow and process:
  - If the warehouse cannot fully issue material, the system does not leave the user in an unstructured exception state.
  - It forces a controlled next step.
  - Depending on the situation, the shortage is handled through internal replenishment, transfer, procurement conversion, or a deliberate partial issue path.

#### Submodule: Stock Transfer
- Functional scope:
  - Inter-warehouse transfer order.
  - Transfer execution and stock movement trace.
- Designed workflow and process:
  - When another warehouse can supply the shortage, a stock transfer is created as a formal movement document.
  - The transfer records source, destination, and resulting movement.
  - This becomes part of the same end-to-end material history.

#### Submodule: Cycle Count and Periodic Check
- Functional scope:
  - Count plan generation.
  - Count execution.
  - Variance approval and stock adjustment.
- Designed workflow and process:
  - The system schedules periodic counting according to the business cycle.
  - Warehouse executes the count and submits variances.
  - Approved differences are posted through a controlled adjustment process with audit history.

#### Submodule: Safety Stock Alert
- Functional scope:
  - Alert rules and thresholds.
  - Repeated reminder cycle.
  - Recipient routing and message configuration.
- Designed workflow and process:
  - The system checks stock against configured thresholds.
  - If stock drops below the threshold, it raises immediate or scheduled reminders.
  - Alerts continue until the stock position recovers or the policy is changed.

### Module: Manufacturing

#### Submodule: Build Order
- Functional scope:
  - Build-order list and detail.
  - Source-order linkage.
  - Market and sequence-family visibility.
  - Quantity and completion tracking.
- Designed workflow and process:
  - A valid order or planning demand creates the need for execution.
  - The system generates a build order tied back to the source order context.
  - The build order becomes the central execution record for material issue, production progress, Internal QC, and traceability.

#### Submodule: Module Readiness and Release Gate
- Functional scope:
  - Readiness check before release.
  - Prevention of release when dependent modules are not ready.
- Designed workflow and process:
  - Before production starts, the system checks whether the required modules, components, or prerequisites are ready.
  - If not, the build order is held from release.
  - This protects the business from incomplete or uncontrolled production starts.

#### Submodule: Production Batch Split
- Functional scope:
  - Parent build-order split into child production batches.
  - Batch-level quantity, status, and downstream document trace.
- Designed workflow and process:
  - The client’s execution model requires one build order to be splittable into multiple production batches.
  - This allows execution flexibility without losing the original planning intent.
  - Each child batch then carries its own withdrawal request, withdrawal confirmation, QC, and progress trace.

#### Submodule: Production Progress
- Functional scope:
  - Progress visibility by build order and production batch.
  - Stage-based progress such as issue, assembly, QC, and completion.
- Designed workflow and process:
  - Production management needs a practical execution view rather than only a static order record.
  - The system shows which batch is in which stage and where delays or bottlenecks are occurring.
  - This supports daily coordination between production, warehouse, and quality.

#### Submodule: Subcontract Processing
- Functional scope:
  - Subcontract order.
  - Material issue to subcontractor.
  - Receipt of processed goods.
  - Subcontract fee statement and reconciliation linkage.
- Designed workflow and process:
  - When external processing is required, the system creates a subcontract order.
  - It checks whether required materials are available.
  - If materials are sufficient, they are issued to the subcontractor.
  - If not, procurement is triggered to close the gap.
  - Returned processed goods are received and inspected.
  - Fees are then matched for reconciliation.

### Module: Engineering and PLM

#### Submodule: Item Master
- Functional scope:
  - Item master maintenance.
  - Base category plus three additional category fields.
  - Sourcing type, lifecycle, supplier, lead time, MOQ, safety stock, and related master data.
- Designed workflow and process:
  - Engineering or master-data management creates and maintains item identity.
  - The item record becomes the upstream definition used by procurement, manufacturing, quality, and traceability.
  - Additional category fields support Internal QC logic and template selection rather than replacing the original category structure.

#### Submodule: Item Revision and Part Number Lifecycle
- Functional scope:
  - Revision tracking.
  - Temporary part number in R&D.
  - Formal part number at mass-production stage.
  - Version effectivity and history.
- Designed workflow and process:
  - New parts may begin as temporary engineering numbers during development.
  - Once released to formal production, the part is converted into a controlled formal number.
  - The system preserves the relationship between temporary and formal identity so that change history and trace remain intact.

#### Submodule: BOM Management
- Functional scope:
  - BOM structure maintenance.
  - Permanent layer numbering.
  - Custom row ordering.
  - Header tags for market or applicability.
  - Multi-source line classification.
  - Semi-product and final-product BOM classification.
  - Substitute-material support.
- Designed workflow and process:
  - Engineering defines product structure through controlled BOM versions.
  - The system preserves stable layer numbering so that users can reference structure consistently over time.
  - BOM classification and market tags then control whether a product is valid for a given order and whether it can be used in a formal or informal execution context.

#### Submodule: BOM Comparison
- Functional scope:
  - Version-to-version BOM comparison.
  - Detection of added, removed, replaced, and quantity-changed parts.
  - Tag and market-difference visibility.
- Designed workflow and process:
  - When a BOM changes, users need to understand not only that it changed, but exactly where and why.
  - The comparison view allows business, engineering, quality, and procurement teams to review part-level impact quickly.
  - This supports engineering review, CAPA follow-up, and implementation planning.

#### Submodule: ECR / ECO
- Functional scope:
  - ECR submission and review.
  - ECO release package.
  - Impacted item, BOM, and document linkage.
  - Parent-revision update propagation.
- Designed workflow and process:
  - A change begins with an ECR, usually driven by engineering need, quality issue, material change, or customer complaint.
  - The ECR moves through review and approval.
  - Once approved, the ECO applies the controlled changes to item revision, BOM structure, substitute logic, and effectivity.
  - Parent and child revision relationships are updated so the released structure remains consistent.

#### Submodule: Controlled Documents
- Functional scope:
  - Document upload, revision, approval, and release.
  - Linkage of controlled documents to item, BOM, PO, and build order.
  - Retrieval of the effective released document at point of use.
- Designed workflow and process:
  - Controlled documents are created and revised through a formal review path.
  - Once released, they become the approved documents used by procurement, production, and quality.
  - Obsolete versions remain available for historical review but are no longer active operational documents.

### Module: Quality and Compliance

#### Submodule: Inspection
- Functional scope:
  - Incoming, in-process, and final inspection records.
  - Result capture for pass, fail, or conditional disposition.
  - Linkage to GRN, lot, work/build order, and source template.
- Designed workflow and process:
  - Inspection is triggered by receipt, production stage, or final release requirement.
  - The result determines whether material is released, held, reworked, rejected, or routed into further quality handling.
  - Inspection results also become part of the permanent traceability story.

#### Submodule: Internal QC
- Functional scope:
  - Internal QC document by build order and production batch.
  - AQL calculation.
  - Market- and category-driven QC template selection.
  - Printable QC packet generation.
- Designed workflow and process:
  - Internal QC is designed as a controlled shop-floor process, not merely an inspection list.
  - The build order, market, and item category fields determine the correct QC template and sample rule.
  - The system then generates a printable QC packet for execution and record retention.

#### Submodule: Internal QC Template Editor
- Functional scope:
  - WYSIWYG authoring of Internal QC templates.
  - Fixed-layout printable form design.
  - Reusable blocks and template rules.
- Designed workflow and process:
  - The client wants the QC form structure maintained inside the ERP rather than managed outside the system.
  - Quality or process owners define the template once.
  - The system then applies the template repeatedly according to product, market, and category logic.

#### Submodule: Complaints
- Functional scope:
  - Complaint intake and tracking.
  - Product, customer, market, and severity capture.
  - Link to CAPA initiation.
- Designed workflow and process:
  - A complaint enters as the first quality signal from the field or customer side.
  - The complaint identifies the affected product, market, and severity.
  - Where warranted, it opens a CAPA process and can eventually drive engineering change.

#### Submodule: CAPA and Change Chain
- Functional scope:
  - CAPA record management.
  - Linkage from complaint to CAPA to ECR to BOM change to released version.
  - Open and approved CAPA visibility.
- Designed workflow and process:
  - The CAPA flow is designed as the business backbone for corrective and preventive action.
  - The system should make it clear how a complaint becomes a corrective action, then an engineering change, then a released BOM or part revision.
  - This demonstrates closed-loop quality management rather than isolated quality records.

#### Submodule: Traceability
- Functional scope:
  - Search from document number, item number, product number, lot, or similar operational key.
  - Forward and backward trace.
  - Workflow-oriented lineage view across business documents.
- Designed workflow and process:
  - Users may start from any meaningful point, such as a customer order, finished product, component lot, receipt, return, or quality event.
  - The system then shows how that record connects to upstream and downstream documents.
  - The intended presentation is a business workflow view so the trace is understandable to operations, quality, engineering, and client stakeholders.

### Module: Finance

#### Submodule: Costing
- Functional scope:
  - Cost visibility within ERP.
  - Support for procurement, production, and subcontract cost understanding.
- Designed workflow and process:
  - Finance and management need cost information tied back to operational records rather than separated in an unrelated system.
  - Costing therefore follows actual procurement, production, and subcontract activity inside the same business flow.

#### Submodule: Payment Request
- Functional scope:
  - Payment request creation from one or multiple POs or payment milestones.
  - Payment request list, detail, and approval.
  - Outstanding balance visibility.
- Designed workflow and process:
  - When a payable amount is due according to PO terms, finance or procurement prepares a payment request.
  - The request may group multiple related payable lines for the same supplier.
  - The request then moves through approval before payment execution.

#### Submodule: AP Reconciliation
- Functional scope:
  - Matching of invoice, PO, GRN, and goods return.
  - Tax invoice upload and status tracking.
  - Finance hold visibility where return affects settlement.
- Designed workflow and process:
  - AP reconciliation begins from actual commercial and physical events, not from standalone invoice entry only.
  - The system checks whether invoice, receipt, and return status are aligned.
  - If a goods return affects settlement, the invoice or payment flow is visibly blocked until resolved.

#### Submodule: Integration Monitor
- Functional scope:
  - Monitoring of Feishu, WMS, finance, ERP sync, and related interfaces.
  - Recent sync-log review.
  - Error and degraded-status visibility.
- Designed workflow and process:
  - Operational support users review integration health from one screen.
  - The system shows whether data was sent, received, delayed, or failed.
  - This helps users understand whether a business issue is process-related or interface-related.

### Module: Reports

#### Submodule: Operational Reports
- Functional scope:
  - PR aging.
  - PO aging.
  - Approval turnaround.
  - Quotation comparison and award rationale.
  - Stock and shortage risk.
  - Subcontract WIP and reconciliation.
  - Production progress and supplier performance.
- Designed workflow and process:
  - These reports help management monitor whether the business process is flowing correctly and where delays or exceptions are accumulating.
  - They are intended for daily and periodic operational review, not just data export.

#### Submodule: Compliance and Traceability Reports
- Functional scope:
  - Full genealogy report.
  - Reverse impact report.
  - Revision history report.
  - Audit-trail report.
  - E-signature evidence report.
  - CAPA and quality trend reporting.
- Designed workflow and process:
  - These reports show not only business performance but also compliance evidence.
  - The system should be able to demonstrate what happened, who approved it, what version was active, and which products or customers were affected.

### Module: Administration

#### Submodule: Users and Roles
- Functional scope:
  - User setup and maintenance.
  - Role assignment.
  - Access governance.
- Designed workflow and process:
  - Administration establishes the permission framework before business users execute controlled activities.
  - This module supports the full approval, audit, and document-control structure.

#### Submodule: Approval Policy
- Functional scope:
  - Approval-policy setup by document type.
  - Approval levels and approver-role definition.
  - Coverage for withdrawal request, withdrawal confirmation, goods return, CAPA/ECR, and other controlled documents.
- Designed workflow and process:
  - Administration defines the approval rule once.
  - Business documents then automatically inherit the correct routing behavior when submitted.
  - This avoids manual approval assignment on each transaction.

#### Submodule: Custom Fields
- Functional scope:
  - Configurable custom fields and option sets.
  - Searchable and filterable custom data.
- Designed workflow and process:
  - Where the business needs additional fields beyond the standard structure, the system supports controlled extension.
  - These fields should still participate in search, filter, display, and reporting rather than existing as hidden or unusable metadata.

#### Submodule: System Configuration
- Functional scope:
  - Company settings.
  - Language and timezone defaults.
  - Integration toggles.
  - Notification rules.
  - Sequence setup.
  - Safety-stock alert setup.
- Designed workflow and process:
  - Administration configures system-wide behavior centrally.
  - These settings then influence how documents are numbered, how alerts are sent, and how integrations behave across modules.

## 4. Technical and Other Points

- Primary technical direction already reflected in project documents:
  - React-based front end for operational UI
  - PostgreSQL-centered transactional data model
  - REST/API and event-driven integration approach
  - object/document storage for controlled attachments
- Core compliance and control expectations:
  - role-based access control
  - approval and e-signature support
  - immutable audit history
  - long-term traceability retention
- Core integration direction:
  - Feishu notifications and workflow messages
  - finance-system integration
  - WMS or related warehouse/inventory synchronization where applicable
- Scope interpretation note:
  - This SOW version is intentionally functional and process-oriented.
  - Technical architecture, schema detail, API detail, test strategy, infrastructure design, migration detail, and deployment plan should be kept in supporting technical appendices or implementation documents.

## 5. Scope Boundary Notes

- The current active scope does not include a standalone `Project Management` module as a first-class page in the implemented application direction.
- If the client requires standalone project management, training management, or additional regulated modules beyond those already documented, they should be listed as separate scope additions or change requests.
- Detailed field dictionary, legacy migration mapping, report layouts, and full validation scripts are outside the purpose of this functional SOW and should be maintained as supporting project documents.
