> **Note:** This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

# Workflows and End-to-End Process Definitions

---

## Canonical Process References

The following 15 workflow IDs are defined:

| ID    | Summary |
|-------|---------|
| WF-01 | Requisition to PO (2-level approval + submit + notify) |
| WF-02 | Supplier RFQ and quotation review |
| WF-03 | Receiving and incoming/final inspection |
| WF-04 | Material issue notice and outbound control |
| WF-05 | Material issue request (detail and summary batch mode) |
| WF-06 | Shortage handling (demand request / transfer / convert to PO) |
| WF-07 | Subcontract processing |
| WF-08 | Production order and module readiness gating |
| WF-09 | Engineering change + BOM change request/approval |
| WF-10 | Document management for procurement and production |
| WF-11 | Sales outbound traceability (component version + batch) |
| WF-12 | Safety stock alerting and periodic reminders |
| WF-13 | Warehouse periodic checks (quarterly/yearly) |
| WF-14 | Feishu and external finance integration |
| WF-15 | Sales-driven procurement planning (forecast → BOM explosion → PR generation) |

### Operational Enhancements Retained from CLAUDE.md

The following operational enhancements from the CLAUDE.md source were retained and integrated into the consolidated plan:

- **Full Customer-to-Cash orchestration** -- Quote -> Sales Order -> Allocation -> Pick/Pack -> Ship -> Invoice -> Revenue Recognition
- **Procure-to-Pay operational sub-steps** -- 3-way match, payment scheduling, bank reconciliation
- **Make-to-stock detail depth** -- RCCP, ATP, backflush, CoA, release
- **Supplier quality scorecards + SCAR loop**

---

## WF-01 Requisition to PO (2-level approval + submit + notify)

**Actors:** Requester, Supply Chain Approver (Level 1), General Manager (Level 2), Buyer

**Flow:**

1. Requester creates `purchase_requisition` + lines.
2. System validates item/revision, stock on hand, safety stock impact.
3. Requester clicks `Submit` (mandatory new action). Status: `draft -> submitted`.
4. System creates `workflow_instance` from `approval_policy` and sends notifications.
5. Level-1 approver approves/rejects with e-signature.
6. Level-2 GM approves/rejects with e-signature.
7. On full approval status becomes `approved`; buyer can create RFQ/PO.
8. PO created from approved PR only. Status chain: `po_draft -> po_submitted -> po_approved -> po_sent`.

**Audit:** Every submit/approve/reject writes `audit_event`. Approval comments and signature hash must be immutable.

---

## WF-02 Supplier RFQ and Quotation Review

**Actors:** Buyer, Supplier, Procurement Reviewer

**Flow:**

1. Buyer generates `supplier_rfq` from approved PR lines.
2. Supplier quotes captured in `supplier_quotation`.
3. System compares price/lead time/MOQ and highlights variance.
4. Reviewer selects winning quote lines; optional approval workflow for high value.
5. PO line links to selected quotation line for audit (`source_quote_line_id`).

**Audit:** Quote version history retained. Selection rationale stored in audit reason.

---

## WF-03 Receiving and Incoming/Final Inspection

**Actors:** Warehouse Receiver, QA Inspector

**Flow:**

1. Goods received against PO -> `goods_receipt`.
2. Lots/serials generated or scanned.
3. If inspection required, lot status `quarantine` and `inspection_record` created.
4. QA records defects/pass-fail.
5. Accepted qty moves to available location; rejected qty to NC flow.
6. For finished products, use final product inspection flow before release.

**Audit:** Receipt-to-lot link, inspection result, and disposition are immutable.

---

## WF-04 Material Issue Notice and Outbound Control

**Actors:** Planner/Production, Warehouse Approver, GM (override role)

**Flow:**

1. Production/subcontract triggers `material_issue_notice`.
2. Warehouse reviews stock and approves/rejects.
3. If exceptional case, GM can override with reason.
4. System posts `material_outbound_note` and creates `inventory_txn` issue records.

**Status model:** `draft -> submitted -> warehouse_approved -> issued`, `gm_overridden` as exceptional status path.

---

## WF-05 Material Issue Request (Detail and Summary Batch Mode)

**Problem solved:** Existing limitation -- only detail page trigger, cannot merge same item.

**Target flow:**

1. User selects source lines from detail page or summary page.
2. System groups by (`item`, `revision`, `warehouse`, `lot strategy`).
3. Creates one merged `material_issue_request` with `merged_from_line_ids_json`.
4. Warehouse processes one consolidated pick list.

**Rules:** Merge allowed only when UOM and required date tolerance match. Full audit trail of merged source lines retained.

---

## WF-06 Shortage Handling (Demand Request / Transfer / Convert to PO)

**Actors:** Warehouse, Planner, Buyer

**Flow:**

1. Issue attempt detects shortage (`shortage_qty > 0`).
2. Branch options:
   - Create `material_demand_request`.
   - Create `stock_transfer_order` from other warehouse.
   - For subcontract/production shortage create PR/PO conversion.
3. Once replenished, issue flow resumes from pending shortage lines.

---

## WF-07 Subcontract Processing

**Actors:** Planner, Buyer, Warehouse, Supplier, AP/Finance

**Flow:**

1. Create `subcontract_order` with quantities and BOM-based required material.
2. System checks availability.
3. If insufficient material -> create PR/PO branch.
4. If sufficient -> create `subcontract_material_issue` and ship components.
5. Supplier returns processed goods -> `subcontract_receipt` + inspection.
6. Generate `subcontract_fee_statement` periodically.
7. Reconcile with supplier invoice in `ap_reconciliation`.

**Audit:** Must track which material lots were sent and which finished lots returned.

---

## WF-08 Production Order and Module Readiness Gating

**Actors:** Production Planner, Manufacturing, QA

**Flow:**

1. Create `work_order` for semi-finished or finished item revision.
2. System expands BOM and creates `work_order_module` list.
3. Gate check: all required modules must be `ready_flag = true` before release.
4. Material issue to WO; execute operations.
5. Post production receipt lot/serial.
6. Final inspection and DHR generation before release.

---

## WF-09 Engineering Change + BOM Change Request/Approval

**Actors:** R&D Engineer, Change Review Board, Supply Chain / Production / QA approvers

**Flow:**

1. Submit ECR with impacted items/BOM/docs.
2. Workflow approval routes by impact/severity.
3. On approval create ECO implementation package.
4. Apply item revision updates, BOM line changes, substitute rules.
5. Auto-propagate child revision change to parent revision (`eco_parent_revision_update`).
6. Release new revisions with effective dates and sunset old revision.

**Special requirements:** Temporary part number in R&D can be converted to formal part number at MP stage. Auto-upgrade rules must not break active orders; controlled by effectivity date and exception list.

---

## WF-10 Document Management for Procurement and Production

**Actors:** Document Controller, Buyer, Manufacturing User

**Flow:**

1. Upload controlled document (`document`, `document_revision`).
2. Route for review/approval and release.
3. Link released revision to item/BOM/PO/work order.
4. When user opens PO/WO, system resolves latest effective released document.
5. Obsolete revisions remain read-only for audit.

---

## WF-11 Sales Outbound Traceability (Component Version + Batch)

**Actors:** Sales Ops, Warehouse, QA/Regulatory

**Flow:**

1. Create shipment and allocate finished goods lot/serial.
2. On posting shipment, system writes genealogy links from finished lot/serial to consumed component lots/serials via source WO.
3. Query supports:
   - **Forward trace:** component lot -> affected shipped devices/customers.
   - **Backward trace:** shipped serial -> all component lots + revisions + suppliers.

---

## WF-12 Safety Stock Alerting and Periodic Reminders

**Actors:** Inventory Controller, Buyer

**Flow:**

1. Configure `safety_stock_policy` with threshold + cycle parameters.
2. Scheduler checks balances daily.
3. If below threshold, create alert event immediately (day 0), then recurring reminders (e.g., +5 days).
4. Alert closes when available qty >= threshold or policy disabled.

---

## WF-13 Warehouse Periodic Checks (Quarterly/Yearly)

**Flow:**

1. Auto-generate cycle count plans by period.
2. Freeze count scope and capture blind counts.
3. Approve variances with reason and e-signature.
4. Post adjustments with complete audit chain.

---

## WF-14 Feishu and External Finance Integration

**Flow:**

1. Approval and alert events push to Feishu via `integration_event` queue.
2. Cost/AP/stock posting pushes to external finance or internal costing engine.
3. Retry/error handling uses dead-letter status and support dashboard.

---

## WF-15 Sales-Driven Procurement Planning

**Actors:** Sales Planner, Buyer, Procurement Manager

**Purpose:** Generate purchase requisitions from sales demand via BOM explosion and net requirement calculation.

**Flow:**

1. **Sales Forecast Creation**
   - Create forecast manually or import from Excel
   - Define forecast period and line items (finished goods + quantities)
   - Optionally adjust forecast lines in Excel and re-import

2. **Accept Forecast**
   - User accepts forecast to lock for processing
   - Status changes from `draft` to `accepted`

3. **BOM Explosion & Net Requirements**
   - System explodes each finished good to component parts via BOM
   - Calculate net requirement: `Required - On Hand - On Order (open PO remaining)`
   - Consider partially received POs: `remaining_qty = order_qty - received_qty`

4. **Supplier Grouping**
   - Group components by preferred supplier (`supplier_item.is_preferred = true`)
   - Components with single preferred supplier → ready for PR
   - Components with multiple suppliers or no preferred supplier → flagged for manual resolution

5. **PR Generation**
   - Create one PR per supplier with all components for that supplier
   - PR lines include: item, revision, net required qty, unit price estimate
   - Link PR lines back to source SO/forecast via `source_so_id`, `source_forecast_id`

6. **Multi-Supplier Resolution**
   - User manually selects supplier for flagged components
   - Options: select single vendor, split quantity, or skip

7. **PR Approval**
   - Generated PRs follow standard WF-01 approval flow
   - Once approved, buyer proceeds with RFQ/PO

**Data Links:**

- `sales_order` → `sales_order_line` → BOM explosion → `pr_generation_log` → `purchase_requisition`
- `sales_forecast` → `sales_forecast_line` → BOM explosion → `pr_generation_log` → `purchase_requisition`

**Audit:** All PRs generated from SO/forecast must maintain traceable link. Source document reference stored in PR header and lines.

**Key Rules:**

1. Never auto-select when multiple suppliers exist — require human decision
2. Partial PO remaining quantities must be deducted from net requirement
3. "Make" items do not generate PRs — they generate work orders instead
4. Forecast acceptance is irreversible without admin intervention
