# FULLPLAN - Consolidated ERP Implementation Plan (Medical Device Manufacturer)

## 1) Purpose and Consolidation Rules
This document consolidates and normalizes the following source documents into one execution-ready plan:
- `CLAUDE.md` (full ERP architecture proposal with expanded SQL schema and operational workflows)
- `ERP_Field_Catalog_From_Requirement_Screens.md` (screen-derived field catalog from existing ERP)
- `ERP_Medical_Device_Implementation_Blueprint.md` (requirement-driven logical model, workflows, APIs, delivery plan)

Consolidation objectives:
- Preserve all source details with zero data loss.
- Remove duplicate definitions in the main executable plan.
- Resolve naming and structure inconsistencies between documents.
- Keep one canonical implementation baseline for engineering delivery.

Non-loss strategy used:
- Main body below contains the normalized canonical plan.
- Full source details are embedded in appendices to ensure nothing is omitted.

## 2) Canonical Model and Normalization Decisions

### 2.1 Canonical data-model strategy
- Canonical logical model: the 109-entity blueprint model in `ERP_Medical_Device_Implementation_Blueprint.md` is the system-of-record domain model.
- Canonical physical schema detail: `CLAUDE.md` SQL tables are retained as implementation-level detail for column-level requirements.
- Legacy UI fidelity: all fields from `ERP_Field_Catalog_From_Requirement_Screens.md` are mandatory migration/compatibility fields.

### 2.2 Naming harmonization (resolved)
- `item`/`item_revision` is the canonical product-material domain object.
- `products`, `materials`, and BOM-related entities in `CLAUDE.md` are treated as physical/module-level specializations of canonical `item` structures.
- `purchase_requisition` -> `purchase_order` sequence is mandatory and enforced by workflow state machine.
- Approval baseline is fixed at two levels (Supply Chain + GM) where required by `RQ-005`; policy engine remains extensible for amount/site-based routing.
- Material issue flow is unified under `material_issue_notice` -> `material_issue_request` -> `material_outbound_note`, with GM override and mandatory reason.

### 2.3 Illogical/duplicate handling (resolved)
- Duplicate workflow topics across `CLAUDE.md` and blueprint are merged by keeping blueprint WF-IDs (`WF-01` to `WF-14`) as canonical references, while preserving CLAUDE operational details in appendices.
- Phase plans (52-week macro in `CLAUDE.md` and 11-phase detailed build in blueprint) are merged into one integrated 52-week delivery map (Section 5).
- Repeated MDM sections are interpreted as complementary: base MDM + governance/lineage/sync controls.

## 3) Mandatory Requirement Baseline (Canonical)

### 3.1 Requirement IDs
`RQ-001` to `RQ-027` from the blueprint are mandatory and traceable to implementation and test artifacts.

### 3.2 Legacy field preservation policy
All visible current-system fields extracted from requirement screenshots are mandatory unless formally deprecated by approved change control.

Implementation rule for every preserved field:
- Define datatype, required flag, default, and validation.
- Add permission scope and workflow relevance.
- Persist old/new values in immutable audit trail.
- Include migration mapping from legacy system.

### 3.3 Compliance baseline
Mandatory compliance controls:
- EU MDR 2017/745
- ISO 13485:2016
- FDA 21 CFR Part 820
- 21 CFR Part 11 (electronic signatures + immutable audit trails)
- UDI lifecycle support (DI/PI, labeling, registration, traceability)

## 4) Canonical End-to-End Process Baseline
Canonical process references use blueprint IDs:
- `WF-01` Requisition to PO (2-level approval, submit, notify)
- `WF-02` Supplier RFQ and quotation review
- `WF-03` Receiving and incoming/final inspection
- `WF-04` Material issue notice and outbound control
- `WF-05` Material issue request (detail + summary merge mode)
- `WF-06` Shortage handling (demand/transfer/PO conversion)
- `WF-07` Subcontract processing
- `WF-08` Production order with module readiness gating
- `WF-09` Engineering change and BOM change approval
- `WF-10` Document management for procurement and production
- `WF-11` Sales outbound traceability and genealogy
- `WF-12` Safety stock alerts and periodic reminders
- `WF-13` Quarterly/yearly warehouse cycle checks
- `WF-14` Feishu and external finance integration

Operational enhancement from `CLAUDE.md` retained:
- Full Customer-to-Cash orchestration (Quote -> Sales Order -> Allocation -> Pick/Pack -> Ship -> Invoice -> Revenue Recognition).
- Procure-to-Pay operational sub-steps (3-way match, payment scheduling, bank reconciliation).
- Make-to-stock detail depth (RCCP, ATP, backflush, CoA, release).
- Supplier quality scorecards + SCAR loop.

## 5) Integrated Delivery Roadmap (52 Weeks)

### 5.1 Master timeline
- Weeks 1-2: Inception and validation baseline (blueprint Phase 0)
- Weeks 3-8: Platform foundation + workflow/audit core (blueprint Phases 1-2)
- Weeks 9-16: Master data, PLM, document controls (blueprint Phase 3)
- Weeks 17-24: Procurement, receiving, warehouse execution (blueprint Phases 4-5)
- Weeks 25-32: Subcontracting, production, quality hardening (blueprint Phases 6-7)
- Weeks 33-38: Engineering change automation + costing integration (blueprint Phases 8-9)
- Weeks 39-44: Reporting, migration readiness, regulatory reporting hardening (blueprint Phase 10 pre-cutover)
- Weeks 45-52: Validation, IQ/OQ/PQ, UAT, training, go-live, hypercare (from `CLAUDE.md` validation/go-live phase)

### 5.2 Mandatory delivery artifacts
- Requirement traceability matrix (`RQ-*` to design, code, tests).
- Workflow evidence packs (`WF-*` UAT + approvals + e-signature logs).
- Migration reconciliation reports (master + transactional data).
- Traceability validation reports (forward/backward lot/serial genealogy).
- Security, performance, and backup/restore sign-off.

## 6) API, Events, Reporting, and Non-Functional Baseline
- API groups, event topics, mandatory reports, NFRs, test strategy, risk controls, and open decisions are adopted from the blueprint as canonical implementation controls.
- `CLAUDE.md` technology stack guidance is retained as reference architecture options.

## 7) Success Metrics (Program Acceptance)
- Audit trail completeness: 100%
- UDI compliance: 100%
- Lot traceability: 100% forward/backward
- Inventory accuracy: >99%
- On-time delivery: >98%
- Supplier quality score: >90%
- OEE: >85%
- Complaint/CAPA closure effectiveness aligned to regulated SLA targets

## 8) Final Governance Rule
Any deviation from this consolidated plan requires controlled change request with:
- impact analysis (`RQ`, `WF`, schema, field compatibility, compliance)
- approver e-signature
- migration/backward compatibility plan
- updated traceability matrix

## 9) Unified Chinese-English Field Version (Single Source)
The bilingual merged field baseline is maintained in:
- `BILINGUAL_FIELD_MASTER.md`

Usage rules:
- Treat `BILINGUAL_FIELD_MASTER.md` as canonical for field naming, UI labels, migration mapping, and API/dictionary alignment.
- If any Chinese screen label or English schema key conflicts, update the mapping in `BILINGUAL_FIELD_MASTER.md` first, then propagate to schema/API/UI.
- All new fields must be added with both Chinese label and canonical English key.

---

## Appendix A - Full Source: ERP Medical Device Implementation Blueprint
Source file: `ERP_Medical_Device_Implementation_Blueprint.md`

# ERP Medical Device System Blueprint (from `Requirement.pdf`)

## 0) Requirement extraction from PDF (source-grounded)

Below are the requirements extracted from `Requirement.pdf` (Chinese meeting notes), normalized into implementable IDs.

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

## 1) Complete schema (implementation-ready logical model)

## 1.1 Global conventions (apply to all business tables)

Common columns (all tables unless stated otherwise):
- `id UUID PK`
- `tenant_id UUID NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `created_by UUID NOT NULL`
- `updated_at TIMESTAMPTZ NOT NULL`
- `updated_by UUID NOT NULL`
- `is_deleted BOOLEAN DEFAULT FALSE`
- `row_version INT NOT NULL DEFAULT 1` (optimistic lock)
- `source_doc_type VARCHAR(50) NULL` / `source_doc_id UUID NULL` / `source_line_id UUID NULL`

Audit and traceability controls:
- Every status change must write `audit_event`.
- Any approval action must require `electronic_signature` and reason/comment.
- Every inventory movement must create immutable `inventory_txn` records.
- Every lot/serial shipment must preserve genealogy links.

## 1.2 Security, workflow, and audit schema

1. `tenant`
- `code`, `name`, `default_currency_code`, `timezone`

2. `legal_entity`
- `tenant_id FK`, `code`, `name`, `tax_id`, `country`

3. `site`
- `legal_entity_id FK`, `code`, `name`, `address`

4. `department`
- `site_id FK`, `code`, `name`, `manager_user_id`

5. `user_account`
- `username`, `display_name_zh`, `display_name_en`, `email`, `mobile`, `status`

6. `role`
- `code`, `name`, `description`

7. `permission`
- `resource`, `action`, `scope`

8. `user_role`
- `user_id FK`, `role_id FK`, `effective_from`, `effective_to`

9. `role_permission`
- `role_id FK`, `permission_id FK`

10. `approval_policy`
- `doc_type`, `site_id`, `amount_min`, `amount_max`, `active_flag`

11. `approval_policy_step`
- `approval_policy_id FK`, `step_no`, `approver_role_id`, `approver_user_id NULL`, `required_flag`, `allow_override_by_role_id`

12. `workflow_instance`
- `doc_type`, `doc_id`, `status` (`draft/submitted/in_approval/approved/rejected/cancelled`), `current_step_no`

13. `workflow_task`
- `workflow_instance_id FK`, `step_no`, `assignee_user_id`, `decision`, `decision_at`, `comment`

14. `electronic_signature`
- `workflow_task_id FK`, `signed_by`, `signed_at`, `signature_method`, `signature_hash`, `reason_code`

15. `notification_template`
- `code`, `channel` (`inapp/email/feishu/webhook`), `subject_tpl`, `body_tpl`

16. `notification_message`
- `template_id FK`, `recipient_user_id`, `status`, `sent_at`, `payload_json`

17. `integration_endpoint`
- `system_code`, `endpoint_url`, `auth_type`, `secret_ref`, `enabled_flag`

18. `integration_event`
- `event_type`, `entity_type`, `entity_id`, `payload_json`, `status`, `retry_count`, `last_error`

19. `audit_event`
- `entity_type`, `entity_id`, `action` (`create/update/submit/approve/reject/override/post`), `before_json`, `after_json`, `change_reason`, `event_at`, `event_by`, `ip_address`, `user_agent`, `event_hash`, `prev_event_hash`

20. `audit_field_change`
- `audit_event_id FK`, `field_name`, `old_value`, `new_value`

## 1.3 Master data schema

21. `currency`
- `code PK`, `name`, `decimal_places`, `active_flag`

22. `exchange_rate`
- `from_currency_code`, `to_currency_code`, `rate_type`, `rate`, `effective_date`

23. `uom`
- `code`, `name_zh`, `name_en`, `category`

24. `uom_conversion`
- `item_id FK`, `from_uom`, `to_uom`, `factor`

25. `item_category`
- `parent_id NULL`, `category_level` (`major/minor`), `code`, `name_zh`, `name_en`

26. `risk_level`
- `code`, `name_zh`, `name_en`, `severity_score`

27. `item`
- `item_no`, `item_type` (`raw/semi/finished/service/tooling`), `category_id`, `default_uom`, `sourcing_type` (`purchase/make/subcontract`), `risk_level_id`, `active_flag`

28. `item_revision`
- `item_id FK`, `revision_code`, `revision_status` (`draft/released/obsolete`), `effective_from`, `effective_to`, `is_current`, `lifecycle_stage` (`rd/pilot/mass_production`)

29. `temp_formal_part_map`
- `temp_item_id`, `temp_revision_id`, `formal_item_id`, `formal_revision_id`, `conversion_reason`, `approved_change_id`

30. `item_substitute`
- `item_id`, `revision_id`, `substitute_item_id`, `substitute_revision_id`, `priority`, `effective_from`, `effective_to`, `approval_required_flag`

31. `supplier`
- `supplier_code`, `name_zh`, `name_en`, `payment_terms`, `currency_code`, `status`

32. `supplier_site`
- `supplier_id FK`, `site_code`, `address`, `contact_name`, `contact_phone`, `email`

33. `supplier_item`
- `supplier_id`, `item_id`, `supplier_part_no`, `lead_time_days`, `moq`, `price`, `currency_code`

34. `customer`
- `customer_code`, `name_zh`, `name_en`, `status`

35. `warehouse`
- `site_id`, `warehouse_code`, `name`, `warehouse_type`

36. `warehouse_location`
- `warehouse_id`, `location_code`, `location_type` (`raw/wip/fg/quarantine/subcontract`), `pick_sequence`

37. `safety_stock_policy`
- `item_id`, `revision_id`, `warehouse_id`, `min_qty`, `reorder_qty`, `first_alert_offset_days`, `repeat_interval_days`, `active_flag`

38. `custom_field_definition`
- `entity_type`, `field_key`, `field_label_zh`, `field_label_en`, `data_type`, `is_required`, `is_searchable`, `options_json`

39. `custom_field_value`
- `entity_type`, `entity_id`, `field_key`, `value_text`, `value_number`, `value_date`, `value_json`

Indexes required:
- Fulltext or btree index on searchable custom fields per entity.
- Composite index: (`entity_type`, `field_key`, `value_*`).

## 1.4 PLM / BOM / engineering change schema

40. `project`
- `project_code`, `name`, `project_type` (`rd/npi/improvement`), `start_date`, `target_end_date`, `status`

41. `project_milestone`
- `project_id`, `milestone_code`, `name`, `planned_date`, `actual_date`, `status`

42. `document`
- `doc_no`, `doc_type`, `title_zh`, `title_en`, `owner_dept_id`, `security_level`, `status`

43. `document_revision`
- `document_id`, `revision_code`, `file_uri`, `checksum`, `released_flag`, `effective_from`, `obsolete_at`

44. `document_link`
- `document_revision_id`, `entity_type`, `entity_id`, `link_role` (`spec/drawing/work_instruction/quality_plan`)

45. `bom_header`
- `parent_item_id`, `parent_revision_id`, `bom_code`, `status`, `version_note`

46. `bom_line`
- `bom_header_id`, `line_no`, `component_item_id`, `component_revision_id`, `qty_per`, `uom`, `scrap_rate`, `sourcing_type`, `is_critical_component`, `module_code`, `is_optional`

47. `bom_line_substitute`
- `bom_line_id`, `substitute_item_id`, `substitute_revision_id`, `priority`

48. `engineering_change_request` (ECR)
- `ecr_no`, `change_type` (`item/bom/process/doc`), `title`, `description`, `impact_level`, `status`, `project_id`

49. `engineering_change_impact`
- `ecr_id`, `entity_type`, `entity_id`, `impact_action` (`add/revise/replace/obsolete`), `from_revision_id`, `to_revision_id`

50. `engineering_change_order` (ECO)
- `eco_no`, `source_ecr_id`, `implementation_date`, `status`, `auto_propagate_parent_revision_flag`

51. `eco_parent_revision_update`
- `eco_id`, `child_item_id`, `child_from_rev`, `child_to_rev`, `parent_item_id`, `parent_from_rev`, `parent_to_rev`, `update_mode` (`auto/manual_override`)

## 1.5 Procurement schema

52. `purchase_requisition`
- `pr_no`, `request_dept_id`, `requester_id`, `currency_code`, `required_date`, `status`, `priority`, `reason`

53. `purchase_requisition_line`
- `pr_id`, `line_no`, `item_id`, `revision_id`, `req_qty`, `uom`, `need_by_date`, `estimated_price`, `warehouse_id`, `project_id`, `risk_level_id`

54. `supplier_rfq`
- `rfq_no`, `pr_id`, `issue_date`, `status`

55. `supplier_rfq_line`
- `rfq_id`, `line_no`, `pr_line_id`, `item_id`, `revision_id`, `qty`, `uom`

56. `supplier_quotation`
- `quotation_no`, `rfq_id`, `supplier_id`, `quote_date`, `currency_code`, `valid_until`, `status`

57. `supplier_quotation_line`
- `quotation_id`, `line_no`, `item_id`, `revision_id`, `unit_price`, `lead_time_days`, `moq`, `incoterm`, `selected_flag`

58. `purchase_order`
- `po_no`, `supplier_id`, `site_id`, `currency_code`, `order_date`, `status`, `source_pr_id`, `approval_workflow_id`

59. `purchase_order_line`
- `po_id`, `line_no`, `item_id`, `revision_id`, `order_qty`, `uom`, `unit_price`, `tax_rate`, `need_by_date`, `source_pr_line_id`, `source_quote_line_id`

60. `po_change_log`
- `po_id`, `change_seq`, `change_type`, `change_note`, `changed_by`, `changed_at`

61. `goods_receipt`
- `gr_no`, `supplier_id`, `po_id`, `receipt_date`, `status`, `warehouse_id`

62. `goods_receipt_line`
- `gr_id`, `line_no`, `po_line_id`, `received_qty`, `accepted_qty`, `rejected_qty`, `lot_no`, `mfg_date`, `exp_date`, `inspection_required_flag`

63. `supplier_invoice`
- `invoice_no`, `supplier_id`, `invoice_date`, `currency_code`, `status`, `linked_po_id`, `linked_subcontract_fee_id`

## 1.6 Inventory, warehouse, and material movement schema

64. `inventory_lot`
- `lot_no`, `item_id`, `revision_id`, `supplier_id NULL`, `mfg_date`, `exp_date`, `qa_status`, `trace_status`

65. `inventory_serial`
- `serial_no`, `item_id`, `revision_id`, `lot_id`, `status`

66. `inventory_balance`
- `item_id`, `revision_id`, `warehouse_id`, `location_id`, `lot_id`, `on_hand_qty`, `allocated_qty`, `available_qty`

67. `inventory_txn`
- `txn_no`, `txn_type` (`receipt/issue/transfer/adjust/subcontract_issue/subcontract_return/production_issue/production_receipt/sales_issue`), `txn_date`, `item_id`, `revision_id`, `warehouse_id`, `from_location_id`, `to_location_id`, `lot_id`, `serial_id`, `qty`, `uom`, `unit_cost`, `doc_type`, `doc_id`, `doc_line_id`, `posted_flag`

68. `material_issue_notice`
- `notice_no`, `source_doc_type`, `source_doc_id`, `warehouse_id`, `status`, `approved_by_warehouse`, `gm_override_flag`, `gm_override_reason`

69. `material_issue_notice_line`
- `notice_id`, `line_no`, `item_id`, `revision_id`, `required_qty`, `issued_qty`, `lot_control_required`

70. `material_issue_request`
- `request_no`, `source_doc_type`, `source_doc_id`, `request_mode` (`detail/summary_batch`), `status`

71. `material_issue_request_line`
- `request_id`, `line_no`, `item_id`, `revision_id`, `requested_qty`, `merged_from_line_ids_json`

72. `material_outbound_note`
- `outbound_no`, `warehouse_id`, `issue_date`, `status`, `source_notice_id`

73. `stock_transfer_order`
- `transfer_no`, `from_warehouse_id`, `to_warehouse_id`, `status`, `reason`

74. `stock_transfer_line`
- `transfer_id`, `line_no`, `item_id`, `revision_id`, `qty`, `lot_id`

75. `material_demand_request`
- `demand_no`, `request_dept_id`, `status`, `required_date`, `reason`

76. `material_demand_request_line`
- `demand_id`, `line_no`, `item_id`, `revision_id`, `qty`, `uom`

77. `cycle_count_plan`
- `plan_no`, `warehouse_id`, `count_type` (`quarterly/yearly/ad_hoc`), `planned_start`, `planned_end`, `status`

78. `cycle_count_task`
- `plan_id`, `item_id`, `revision_id`, `location_id`, `system_qty`, `counted_qty`, `variance_qty`, `status`

79. `inventory_adjustment`
- `adjust_no`, `warehouse_id`, `reason_code`, `status`, `approved_by`

80. `inventory_adjustment_line`
- `adjust_id`, `line_no`, `item_id`, `revision_id`, `lot_id`, `adjust_qty`, `unit_cost`

## 1.7 Subcontracting and production schema

81. `subcontract_order`
- `sco_no`, `supplier_id`, `site_id`, `status`, `planned_start`, `planned_end`, `linked_project_id`

82. `subcontract_order_line`
- `sco_id`, `line_no`, `item_id`, `revision_id`, `order_qty`, `uom`, `source_bom_id`

83. `subcontract_material_issue`
- `sco_id`, `issue_doc_no`, `issue_date`, `status`

84. `subcontract_material_issue_line`
- `issue_id`, `line_no`, `item_id`, `revision_id`, `qty`, `lot_id`

85. `subcontract_receipt`
- `sco_id`, `receipt_no`, `receipt_date`, `status`

86. `subcontract_receipt_line`
- `receipt_id`, `line_no`, `item_id`, `revision_id`, `received_qty`, `accepted_qty`, `rejected_qty`, `lot_no`

87. `subcontract_fee_statement`
- `fee_no`, `supplier_id`, `period_start`, `period_end`, `currency_code`, `status`, `total_amount`

88. `subcontract_fee_line`
- `fee_id`, `line_no`, `sco_line_id`, `service_qty`, `unit_fee`, `amount`, `reconciliation_status`

89. `work_order`
- `wo_no`, `item_id`, `revision_id`, `order_qty`, `uom`, `planned_start`, `planned_end`, `status`, `project_id`

90. `work_order_module`
- `wo_id`, `module_code`, `required_flag`, `ready_flag`, `ready_checked_at`

91. `work_order_material`
- `wo_id`, `line_no`, `item_id`, `revision_id`, `required_qty`, `issued_qty`, `shortage_qty`, `sourcing_type`

92. `work_order_operation`
- `wo_id`, `op_seq`, `work_center`, `operation_name`, `status`, `actual_start`, `actual_end`

93. `production_receipt`
- `receipt_no`, `wo_id`, `receipt_date`, `item_id`, `revision_id`, `received_qty`, `lot_no`, `status`

## 1.8 Quality and medical-device traceability schema

94. `inspection_plan`
- `plan_code`, `inspection_type` (`incoming/in_process/final`), `item_id`, `revision_id`, `sampling_rule`, `active_flag`

95. `inspection_record`
- `record_no`, `inspection_type`, `source_doc_type`, `source_doc_id`, `item_id`, `revision_id`, `lot_id`, `sample_qty`, `pass_qty`, `fail_qty`, `result`, `status`

96. `inspection_defect`
- `inspection_record_id`, `defect_code`, `defect_desc`, `severity`, `qty`

97. `nonconformance`
- `nc_no`, `source_inspection_id`, `item_id`, `revision_id`, `lot_id`, `disposition` (`rework/scrap/return/use_as_is`), `status`

98. `capa`
- `capa_no`, `source_nc_id`, `root_cause`, `corrective_action`, `preventive_action`, `owner_id`, `due_date`, `status`

99. `trace_genealogy`
- `relation_type` (`consumes/produces/assembled_into/shipped_in`), `parent_entity_type`, `parent_entity_id`, `child_entity_type`, `child_entity_id`, `qty`

100. `device_history_record` (DHR)
- `dhr_no`, `finished_item_id`, `finished_revision_id`, `finished_lot_id`, `serial_no`, `wo_id`, `final_inspection_id`, `release_status`

101. `shipment`
- `shipment_no`, `customer_id`, `shipment_date`, `status`, `sales_order_ref`

102. `shipment_line`
- `shipment_id`, `line_no`, `item_id`, `revision_id`, `qty`, `uom`, `lot_id`, `serial_no`

103. `shipment_trace_link`
- `shipment_line_id`, `component_item_id`, `component_revision_id`, `component_lot_id`, `component_serial_no`, `source_wo_id`

## 1.9 Finance and costing schema (for integration/internal cost)

104. `cost_center`
- `code`, `name`, `dept_id`

105. `cost_element`
- `code`, `name`, `type` (`material/labor/overhead/subcontract`)

106. `cost_transaction`
- `txn_date`, `item_id`, `revision_id`, `lot_id`, `cost_element_id`, `qty`, `amount`, `currency_code`, `source_doc_type`, `source_doc_id`

107. `cost_rollup`
- `item_id`, `revision_id`, `effective_date`, `material_cost`, `labor_cost`, `overhead_cost`, `subcontract_cost`, `total_cost`

108. `ap_reconciliation`
- `recon_no`, `supplier_id`, `period_start`, `period_end`, `status`, `difference_amount`

109. `finance_posting_queue`
- `source_doc_type`, `source_doc_id`, `posting_status`, `attempts`, `last_error`, `posted_at`

## 1.10 Critical constraints and indexes

Must-have constraints:
- Unique business keys (`*_no`, `item_no`, `lot_no`, `serial_no`) per tenant.
- `item_revision`: unique (`item_id`, `revision_code`).
- `bom_line`: unique (`bom_header_id`, `line_no`).
- `workflow_task`: unique (`workflow_instance_id`, `step_no`, `assignee_user_id`).
- `inventory_balance`: unique (`item_id`, `revision_id`, `warehouse_id`, `location_id`, `lot_id`).

Must-have indexes:
- Document state queries: (`status`, `updated_at`).
- Traceability: (`lot_id`), (`serial_no`), (`item_id`, `revision_id`, `lot_id`).
- Workflow inbox: (`assignee_user_id`, `decision`, `step_no`).
- Custom search: (`entity_type`, `field_key`, `value_text`).
- Audit lookup: (`entity_type`, `entity_id`, `event_at`).

---

## 2) Detailed workflow descriptions (end-to-end)

## WF-01 Requisition to PO (2-level approval + submit + notify)

Actors:
- Requester
- Supply Chain Approver (Level 1)
- General Manager (Level 2)
- Buyer

Flow:
1. Requester creates `purchase_requisition` + lines.
2. System validates item/revision, stock on hand, safety stock impact.
3. Requester clicks `Submit` (mandatory new action). Status: `draft -> submitted`.
4. System creates `workflow_instance` from `approval_policy` and sends notifications.
5. Level-1 approver approves/rejects with e-signature.
6. Level-2 GM approves/rejects with e-signature.
7. On full approval status becomes `approved`; buyer can create RFQ/PO.
8. PO created from approved PR only. Status chain: `po_draft -> po_submitted -> po_approved -> po_sent`.

Audit/traceability:
- Every submit/approve/reject writes `audit_event`.
- Approval comments and signature hash must be immutable.

## WF-02 Supplier RFQ and quotation review

Actors:
- Buyer
- Supplier
- Procurement Reviewer

Flow:
1. Buyer generates `supplier_rfq` from approved PR lines.
2. Supplier quotes captured in `supplier_quotation`.
3. System compares price/lead time/MOQ and highlights variance.
4. Reviewer selects winning quote lines; optional approval workflow for high value.
5. PO line links to selected quotation line for audit (`source_quote_line_id`).

Audit/traceability:
- Quote version history retained.
- Selection rationale stored in audit reason.

## WF-03 Receiving and incoming/final inspection

Actors:
- Warehouse Receiver
- QA Inspector

Flow:
1. Goods received against PO -> `goods_receipt`.
2. Lots/serials generated or scanned.
3. If inspection required, lot status `quarantine` and `inspection_record` created.
4. QA records defects/pass-fail.
5. Accepted qty moves to available location; rejected qty to NC flow.
6. For finished products, use final product inspection flow before release.

Audit/traceability:
- Receipt-to-lot link, inspection result, and disposition are immutable.

## WF-04 Material issue notice and outbound control

Actors:
- Planner/Production
- Warehouse Approver
- GM (override role)

Flow:
1. Production/subcontract triggers `material_issue_notice`.
2. Warehouse reviews stock and approves/rejects.
3. If exceptional case, GM can override with reason.
4. System posts `material_outbound_note` and creates `inventory_txn` issue records.

Status model:
- `draft -> submitted -> warehouse_approved -> issued`
- `gm_overridden` as exceptional status path.

## WF-05 Material issue request (detail and summary batch mode)

Problem solved:
- Existing limitation: only detail page trigger, cannot merge same item.

Target flow:
1. User selects source lines from detail page or summary page.
2. System groups by (`item`, `revision`, `warehouse`, `lot strategy`).
3. Creates one merged `material_issue_request` with `merged_from_line_ids_json`.
4. Warehouse processes one consolidated pick list.

Rules:
- Merge allowed only when UOM and required date tolerance match.
- Full audit trail of merged source lines retained.

## WF-06 Shortage handling (demand request / transfer / convert to PO)

Actors:
- Warehouse
- Planner
- Buyer

Flow:
1. Issue attempt detects shortage (`shortage_qty > 0`).
2. Branch options:
- Create `material_demand_request`.
- Create `stock_transfer_order` from other warehouse.
- For subcontract/production shortage, create PR/PO conversion.
3. Once replenished, issue flow resumes from pending shortage lines.

## WF-07 Subcontract processing

Actors:
- Planner
- Buyer
- Warehouse
- Supplier
- AP/Finance

Flow:
1. Create `subcontract_order` with quantities and BOM-based required material.
2. System checks availability.
3. If insufficient material -> create PR/PO branch.
4. If sufficient -> create `subcontract_material_issue` and ship components.
5. Supplier returns processed goods -> `subcontract_receipt` + inspection.
6. Generate `subcontract_fee_statement` periodically.
7. Reconcile with supplier invoice in `ap_reconciliation`.

Audit/traceability:
- Must track which material lots were sent and which finished lots returned.

## WF-08 Production order and module readiness gating

Actors:
- Production Planner
- Manufacturing
- QA

Flow:
1. Create `work_order` for semi-finished or finished item revision.
2. System expands BOM and creates `work_order_module` list.
3. Gate check: all required modules must be `ready_flag = true` before release.
4. Material issue to WO; execute operations.
5. Post production receipt lot/serial.
6. Final inspection and DHR generation before release.

## WF-09 Engineering change + BOM change request/approval

Actors:
- R&D Engineer
- Change Review Board
- Supply Chain / Production / QA approvers

Flow:
1. Submit ECR with impacted items/BOM/docs.
2. Workflow approval routes by impact/severity.
3. On approval create ECO implementation package.
4. Apply item revision updates, BOM line changes, substitute rules.
5. Auto-propagate child revision change to parent revision (`eco_parent_revision_update`).
6. Release new revisions with effective dates and sunset old revision.

Special requirements:
- Temporary part number in R&D can be converted to formal part number at MP stage.
- Auto-upgrade rules must not break active orders; controlled by effectivity date and exception list.

## WF-10 Document management for procurement and production

Actors:
- Document Controller
- Buyer
- Manufacturing User

Flow:
1. Upload controlled document (`document`, `document_revision`).
2. Route for review/approval and release.
3. Link released revision to item/BOM/PO/work order.
4. When user opens PO/WO, system resolves latest effective released document.
5. Obsolete revisions remain read-only for audit.

## WF-11 Sales outbound traceability (component version + batch)

Actors:
- Sales Ops
- Warehouse
- QA/Regulatory

Flow:
1. Create shipment and allocate finished goods lot/serial.
2. On posting shipment, system writes genealogy links from finished lot/serial to consumed component lots/serials via source WO.
3. Query supports:
- Forward trace: component lot -> affected shipped devices/customers.
- Backward trace: shipped serial -> all component lots + revisions + suppliers.

## WF-12 Safety stock alerting and periodic reminders

Actors:
- Inventory Controller
- Buyer

Flow:
1. Configure `safety_stock_policy` with threshold + cycle parameters.
2. Scheduler checks balances daily.
3. If below threshold, create alert event immediately (day 0), then recurring reminders (e.g., +5 days).
4. Alert closes when available qty >= threshold or policy disabled.

## WF-13 Warehouse periodic checks (quarterly/yearly)

Flow:
1. Auto-generate cycle count plans by period.
2. Freeze count scope and capture blind counts.
3. Approve variances with reason and e-signature.
4. Post adjustments with complete audit chain.

## WF-14 Feishu and external finance integration

Flow:
1. Approval and alert events push to Feishu via `integration_event` queue.
2. Cost/AP/stock posting pushes to external finance or internal costing engine.
3. Retry/error handling uses dead-letter status and support dashboard.

---

## 3) Implementation plan (high-detail, build-from-scratch)

## Phase 0: Inception and validation baseline (2 weeks)
- Confirm requirement IDs RQ-001..RQ-027 with business owners.
- Define glossary for Chinese business terms (PR/PO/BOM/ECR/ECO etc.).
- Define compliance profile for medical-device traceability and e-signature expectations.
- Deliverables:
- Approved BRD with traceability matrix.
- To-be process maps.
- Regulatory constraint checklist.

## Phase 1: Platform foundation (3 weeks)
- Setup monorepo, CI/CD, environment strategy (dev/test/stage/prod).
- Provision PostgreSQL, object storage, message queue, cache.
- Implement identity, RBAC, tenant/site/dept hierarchy.
- Implement global numbering service for docs.
- Deliverables:
- Running platform skeleton with auth and base APIs.

## Phase 2: Workflow + audit framework (3 weeks)
- Build generic approval workflow engine with submit action.
- Build e-signature module and immutable audit log (hash chain).
- Build notification engine (in-app/email/Feishu adaptor).
- Deliverables:
- Reusable workflow component used by PR/PO/ECR and others.

## Phase 3: Master data and PLM core (4 weeks)
- Implement items/revisions/category/risk/custom fields.
- Implement temp-to-formal part conversion lifecycle.
- Implement BOM with sourcing type per line and substitute support.
- Implement DMS (controlled revisions + linking).
- Implement project and milestone module.
- Deliverables:
- Released master-data APIs/UI with search including custom fields.

## Phase 4: Procurement and supplier collaboration (4 weeks)
- PR module + two-level approval policies.
- RFQ/quotation compare and selection.
- PO module with versioned change log.
- Receiving (GRN) integration with inspection trigger.
- Deliverables:
- End-to-end PR->RFQ->PO->GR flow.

## Phase 5: Inventory and warehouse operations (4 weeks)
- Inventory ledger/lot/serial and transaction posting engine.
- Material issue notice/request/outbound note.
- Summary-page batch issue request + same-item merge logic.
- Stock transfer and demand request flows.
- Cycle count quarterly/yearly planning + adjustments.
- Deliverables:
- Robust warehouse execution with shortage branches.

## Phase 6: Subcontracting and production control (4 weeks)
- Subcontract order/material issue/receipt/fee statement/reconciliation.
- Production work order with module readiness gate.
- Operation tracking + WIP states + production receipt.
- Deliverables:
- Integrated make + subcontract flows with trace links.

## Phase 7: Quality and traceability hardening (3 weeks)
- Incoming/in-process/final inspection plans and records.
- NC/CAPA basic process.
- DHR assembly and shipment genealogy queries.
- Deliverables:
- End-to-end lot/serial forward/backward traceability.

## Phase 8: Engineering change automation (3 weeks)
- ECR/ECO workflows with impact matrix.
- Child-to-parent revision auto-propagation engine.
- Effectivity date and transition rules for open docs.
- Deliverables:
- Controlled engineering change with approval/audit evidence.

## Phase 9: Costing and finance integration (3 weeks)
- Cost element and cost transaction capture from inventory/production/subcontract.
- AP reconciliation for subcontract fee and invoices.
- Finance posting queue + connector to external finance system.
- Deliverables:
- Cost visibility and posting reliability dashboard.

## Phase 10: Reporting, migration, and go-live readiness (4 weeks)
- Build operational dashboards and compliance trace reports.
- Migrate master/transaction legacy data with validation scripts.
- Performance, security, DR, and UAT sign-off.
- Conduct training and go-live cutover.
- Deliverables:
- Production-ready ERP with hypercare runbook.

---

## 4) Must-have API surface (for coding agent scaffolding)

Core API groups:
- `/auth/*`, `/users/*`, `/roles/*`, `/permissions/*`
- `/workflow/*`, `/approvals/*`, `/notifications/*`
- `/items/*`, `/item-revisions/*`, `/bom/*`, `/ecr/*`, `/eco/*`, `/documents/*`, `/projects/*`
- `/pr/*`, `/rfq/*`, `/quotations/*`, `/po/*`, `/receipts/*`
- `/inventory/*`, `/lots/*`, `/serials/*`, `/material-issues/*`, `/transfers/*`, `/cycle-count/*`
- `/subcontract/*`, `/work-orders/*`, `/production-receipts/*`
- `/inspections/*`, `/nonconformance/*`, `/capa/*`, `/traceability/*`, `/shipments/*`
- `/costing/*`, `/ap-recon/*`, `/finance-posting/*`
- `/integrations/feishu/*`

Event topics (message bus):
- `workflow.submitted`, `workflow.approved`, `workflow.rejected`
- `inventory.shortage.detected`, `inventory.transaction.posted`
- `engineering.eco.released`
- `quality.inspection.failed`
- `traceability.shipment.posted`
- `safety_stock.alert.triggered`

---

## 5) Reports and trace queries (mandatory)

Operational reports:
- PR aging, PO aging, approval cycle time by step/role.
- Supplier quotation comparison and winner rationale.
- Stock by item/revision/lot/location and shortage risk list.
- Subcontract WIP and fee reconciliation.
- Production progress by WO/module/operation.

Compliance and traceability reports:
- Full genealogy report (shipment serial -> components -> suppliers).
- Reverse impact report (component lot -> shipped customers/devices).
- Revision history report (item/BOM/doc and effective timeline).
- Audit trail report by document (who changed what, when, why).
- E-signature evidence report.

---

## 6) Non-functional requirements

- Availability: 99.9% target for production.
- Performance: p95 read < 400ms, p95 write < 800ms for standard documents.
- Concurrency: optimistic locking on all transactional documents.
- Security: role-based and site-based data permissions, encrypted secrets, full API audit.
- Data retention: immutable audit/events minimum 10 years (medical-device traceability).
- Backups: daily full + PITR, tested restore runbook.

---

## 7) Testing and validation strategy

Test layers:
- Unit tests for domain rules (state transitions, revision propagation, merge logic).
- Integration tests for PR->PO->GR, subcontract, WO, shipment genealogy.
- Workflow approval tests with multi-role policy and GM override path.
- Data integrity tests for lot/serial genealogy and inventory balance consistency.
- Performance tests for stock queries and traceability queries.

Validation packs:
- Requirement-to-test mapping using `RQ-*` IDs.
- UAT scripts for each workflow `WF-*`.
- Regression suite for audit and signature non-bypass.

---

## 8) Key risks and mitigation

- Risk: Unclear effectivity rules for auto-upgrade revisions.
- Mitigation: define change policy matrix and simulate on open documents before go-live.

- Risk: Traceability data gaps if users bypass scanning.
- Mitigation: enforce lot/serial mandatory scan and block posting on missing trace fields.

- Risk: Integration instability (Feishu/finance).
- Mitigation: queue + retry + dead-letter + monitoring.

- Risk: Over-customized forms without governance.
- Mitigation: custom field governance workflow and searchable index policy.

---

## 9) Open decisions to confirm before coding freeze

1. Single-tenant vs multi-tenant deployment model.
2. Exact approval matrix by document type and amount thresholds.
3. Whether CAPA depth is basic ERP-level or full QMS-grade.
4. Costing method: standard vs moving average vs actual lot cost.
5. Finance integration direction: keep external finance as source of truth or migrate fully.
6. Regulatory scope expectations (internal traceability only vs full external compliance framework).

---

## 10) Build order for AI coding agent (direct execution sequence)

1. Implement shared platform modules: auth, RBAC, numbering, audit, workflow.
2. Implement master data (items, revisions, category, supplier, warehouse, custom fields).
3. Implement BOM + document management + ECR/ECO core.
4. Implement procurement (PR/RFQ/quotation/PO).
5. Implement receiving + inspection + inventory ledger.
6. Implement material issue/transfer/shortage workflows.
7. Implement subcontract + production modules.
8. Implement shipment + traceability queries + DHR.
9. Implement safety stock scheduler + notifications + Feishu adapter.
10. Implement costing/AP/finance connector.
11. Add reports, migration tools, hardening, and full test suite.


---

## Appendix B - Full Source: ERP Field Catalog From Requirement Screens
Source file: `ERP_Field_Catalog_From_Requirement_Screens.md`

# ERP Field Catalog From `Requirement.pdf` Screens

## 1) Extraction scope and method
- Source: `Requirement.pdf` (17 pages), including narrative text + embedded screenshots.
- Method: page rendering (`gs`) + manual zoom/crop review of each screen capture.
- Coverage target: all visible field labels, line columns, and key action/menu entries shown in captures.
- Confidence tags:
- `Confirmed`: clearly readable label in screenshot.
- `Context-confirmed`: partially truncated but strongly inferable from neighboring labels or repeated screens.

## 2) Complete field/column extraction from existing system screens

## 2.1 Base setup and master-data navigation (基础设置)

### A) Base Setup domains shown
`Confirmed` navigation entries visible:
- 部门
- 员工
- 往来单位
- 计量单位
- 存货
- 往来单位存货设置
- 序列号方案
- 序列号解析生成规则
- 条码方案
- 电商商品
- 班组
- 替代方案
- 物料清单
- 物料清单正向查询
- 物料清单反向查询
- 物料清单对比

`Confirmed` additional basic/master entries:
- 地区
- 项目
- 出入库类别
- 业务类型
- 配货仓库关系设置
- 物流网点
- 不合格原因

`Confirmed` settlement/finance dictionary entries:
- 收入
- 费用
- 科目
- 凭证类别
- 常用凭证
- 常用摘要
- 结算方式
- 币种
- 现金流量项目
- 资产属性
- 资产分类
- 增减方式
- 使用状况
- 处理原因
- 存放位置
- 经济用途

`Confirmed` pricing dictionary/report entries:
- 进价设置导航
- 进价带出策略
- 供应商价格本
- 供应商价格本调价单
- 采购价格查询
- 采购价格波动分析表
- 销价设置导航
- 销价带出策略
- 存货价格本
- 存货价格本调价单
- 存货效期价格本
- 客户价格本
- 客户价格本调价单
- 客户折扣
- 存货数量档位价格
- 部门价格本
- 销售价格查询
- 销售价格波动分析表
- 委外价设置导航

### B) Stock category tree/list (存货分类/存货)
`Confirmed` list/tree fields:
- 存货分类 (tree)
- 序号
- 存货编码
- 存货名称
- 规格型号

## 2.2 Inventory master form (存货) - detailed

### A) Header fields
`Confirmed`:
- 存货编码
- 助记码
- 计价方式
- 存货名称
- 规格型号
- 所属类别

### B) Tabs shown
`Confirmed`:
- 基本信息
- 库存信息
- 条形码
- 价格
- 图片
- 开票

### C) Basic Information tab fields (基本信息)
`Confirmed`:
- 税率%
- 品牌
- 新品 (checkbox)
- 停用 (checkbox)
- 新品周期(天)
- 建档日期
- 体积(m³)
- 重量(kg)
- 产地
- 自动生成项目档案 (checkbox)

### D) Unit conversion/usage fields (计量单位)
`Confirmed`:
- 计量方式
- 计量单位
- 报表单位
- 库存常用单位
- 采购常用单位
- 销售常用单位
- 生产常用单位
- 包装常用单位

### E) Stock attribute flags (存货属性)
`Confirmed`:
- 外购
- 销售
- 自制
- 生产耗用
- 委外
- 虚拟件
- 劳务费用
- 电商

### F) Other/custom fields
`Confirmed`:
- 存货描述
- 配件版本号
- 成品质量风险
- 存货名称(英文)
- 存货分类-枚举

### G) Inventory/Cost/Quality/Planning fields (库存信息/成本信息/质量信息/计划信息)
`Confirmed`:
- 参考成本
- 最新成本
- 平均成本
- 最低库存
- 最高库存
- 安全库存
- 标准周转天数
- 需要检验
- 来料入库检验
- 来料检验方式
- 来料抽检比例
- 生产入库检验
- 生产检验方式
- 生产抽检比例
- 委外入库检验
- 委外检验方式
- 委外抽检比例
- 检验要求
- 生产过程检验
- 采购最小批量
- 生产委外最小批量
- 生产委外批量倍量

## 2.3 Purchase requisition / request form (请购单)

### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 部门
- 请购人
- 需求日期
- 到货地址
- 销售订单号

### B) Tabs
`Confirmed`:
- 明细
- 汇总

### C) Line columns (visible)
`Confirmed`:
- 序号
- 存货名称
- 存货图片
- 存货编码
- 规格型号
- 数量
- 需求日期

`Context-confirmed` (partially truncated in screenshot but consistent with other forms):
- 配件版本号
- 成品质量风险
- 计量单位

### D) Approval progress popup (审批进度)
`Confirmed` columns:
- 审核日期
- 审批时长
- 审批人
- 审批情况

## 2.4 Material outbound and issue request flows (材料出库单 / 领料申请)

### A) Material outbound header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 出库类别
- 领用人
- 项目
- 仓库
- 生产车间
- 领料申请人

### B) Material outbound line columns (明细)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 材料规格
- 计量单位
- 数量
- 批号

### C) Summary columns (汇总)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 材料规格
- 数量
- 金额
- 批号
- 来源单号

`Context-confirmed`:
- 计量单位

### D) Production material detail columns used in issue-request scenarios
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 现存量
- 损耗数量
- 材料倒冲方式
- 预出仓库
- 启用领料申请
- 行中止

`Context-confirmed`:
- 需用数量
- 计划数量(列名被截断)

## 2.5 Subcontract order and subcontract cost

### A) Subcontract order header fields (委外加工单)
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 委外供应商
- 部门
- 业务员
- 预开工日
- 预完工日
- 启用领料申请

### B) Product detail columns (产品明细)
`Confirmed`:
- 序号
- 规格型号
- 适用BOM
- BOM展开方式
- 预入仓库
- 生产单位
- 数量
- 单价
- 税率%
- 含税单价
- 金额
- 税额
- 含税金额

### C) Material detail columns (材料明细)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 预出仓库
- 材料倒冲方式
- 启用领料申请
- 行中止

### D) Subcontract process actions shown (生单/转换)
`Confirmed` action entries:
- 转成采购订单
- 生成领料申请单
- 生成委外发料单
- 生成委外发料单(退料)
- 生成成品报检单
- 生成委外入库单
- 生成委外入库单(退库)
- 生成调拨单
- 生成调拨单(分单)

### E) Subcontract fee statement (委外加工费用单)
Header fields `Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 票据类型
- 发票号
- 委外供应商
- 部门
- 业务员
- 付款方式
- 付款到期日

Line columns `Confirmed`:
- 序号
- 存货编码
- 存货名称
- 规格型号
- 仓库
- 生产单位
- 数量
- 单价
- 税率%
- 含税单价
- 金额
- 税额
- 含税金额

## 2.6 Production order (生产加工单)

### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 生产车间
- 负责人
- 预开工日
- 启用领料申请

`Context-confirmed`:
- 预计完工日 (同类单据结构一致)

### B) Product detail columns
`Confirmed`:
- 序号
- 产品编码
- 产品名称
- 规格型号
- 适用BOM
- BOM展开方式
- 预入仓库
- 生产单位
- 数量

### C) Material detail columns
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 现存量
- 损耗数量
- 材料倒冲方式
- 预出仓库
- 启用领料申请
- 行中止

`Context-confirmed`:
- 需用数量
- 计划数量

## 2.7 Engineering change order (工程变更单)

### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 工程变更部门
- 工程变更人
- 变更类型
- 变更原因
- 变更内容
- 变更影响类型

### B) Material list info grid (物料清单信息)
`Confirmed`:
- 序号
- 存货名称
- 规格型号
- 变更类型
- BOM版本号
- 变更状态
- 备注

### C) Change detail tabs
`Confirmed`:
- 文件变更明细
- 材料变更明细

### D) File change detail columns
`Confirmed`:
- 序号
- 变更差异
- 文件编码
- 文件名称
- 规格型号
- 版本号
- 工艺路线
- 计量单位
- 生产数量
- 生产车间
- 预入仓库
- 默认BOM
- 成品率%

## 2.8 BOM / item structure (物料清单, 物料清单维护)

### A) Parent/item header fields (visible in BOM maintenance area)
`Confirmed`:
- 文件编码
- 文件名称
- 规格型号
- 配件版本号
- 版本号
- 计量单位
- 生产数量
- 成品率%
- 品牌
- 生产车间
- 预入仓库
- 默认BOM
- BOM层级
- 总成本
- 成本取值
- 停用
- 虚拟件

### B) Child material columns (子件明细)
`Confirmed`:
- 序号
- 子件编码
- 成品质量风险
- 子件名称
- 需用数量
- 规格型号
- 配件版本号

### C) Substitute/related child area (替代料相关显示)
`Confirmed`/`Context-confirmed`:
- 序号
- 子件编码
- 子件名称
- 虚拟件
- 子件BOM
- 预出仓库
- 计量单位

## 2.9 Receiving and inspection menus (到货单/报检)

`Confirmed` quality menu entries:
- 报检单
- 到货单
- 成品报检单
- 检验单
- 来料/成品检验单
- 生产过程检验单
- 到货单执行表
- 成品报检单执行表
- 质量统计分析表
- 检验单综合明细表
- 检验单综合统计表

## 2.10 Sales outbound order (销售出库单)

### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 退货原因
- 客户
- 结算客户
- 经手人
- 仓库

### B) Tabs
`Confirmed`:
- 明细
- 汇总

### C) Line columns
`Confirmed`:
- 序号
- 条形码
- 仓库
- 存货名称
- 规格型号
- 数量
- 智能选单
- 来源单号
- 现存量
- 现存量说明
- 退货原因

`Context-confirmed`:
- 计量单位

## 2.11 Workflow/system action fields repeatedly shown

`Confirmed` common status/toolbar fields:
- 单据状态(如: 已审)
- 新增/选单/保存/删除/弃审/审核/审批情况/生单/变更/工具/联查/设置/打印/更多

## 3) Consolidated “must-have current-system fields” by module
This section normalizes the above into implementation entities so no field is dropped in new ERP.

### 3.1 Item/Inventory Master entity
Fields to preserve exactly:
- 存货编码, 助记码, 计价方式, 存货名称(中), 存货名称(英), 规格型号, 所属类别
- 税率%, 品牌, 新品, 停用, 新品周期(天), 建档日期, 体积, 重量, 产地
- 计量方式, 主计量单位, 报表单位, 库存常用单位, 采购常用单位, 销售常用单位, 生产常用单位, 包装常用单位
- 成本信息(参考/最新/平均), 库存信息(最低/最高/安全/周转天数)
- 质量信息(需检标识 + 来料/生产/委外检验方式及抽检比例 + 检验要求 + 过程检验)
- 计划信息(采购最小批量, 生产委外最小批量, 生产委外批量倍量)
- 属性标识(外购/销售/自制/生产耗用/委外/虚拟件/劳务费用/电商)
- 存货描述, 配件版本号, 成品质量风险, 存货分类-枚举

### 3.2 Transaction document common header
Fields to preserve:
- 单据日期, 单据编号, 业务类型, 部门, 业务员/负责人/经手人
- 仓库/生产车间
- 供应商/客户/结算客户
- 需求日期/到货地址/开工完工日期
- 单据状态

### 3.3 Document line common columns
Fields to preserve:
- 序号
- 物料编码/存货编码
- 名称
- 规格型号
- 计量单位
- 数量
- 单价/税率/含税单价/金额/税额/含税金额 (when financial)
- 批号
- 来源单号
- 现存量/现存量说明
- 预出仓库/预入仓库
- 倒冲方式
- 启用领料申请
- 行中止

### 3.4 Engineering/BOM specific
Fields to preserve:
- 变更类型/原因/内容/影响类型/状态
- BOM版本号, 默认BOM, BOM层级
- 文件编码/名称/版本/工艺路线
- 子件编码/子件名称/需用数量/质量风险/配件版本号
- 预出仓库, 生产车间, 成品率

### 3.5 Approval/trace fields currently visible
Fields to preserve:
- 审核日期, 审批时长, 审批人, 审批情况

## 4) Additional fields recommended for a sophisticated medical-device ERP
Below are recommended additions beyond current screenshots to meet robust auditability, traceability, quality, and regulatory expectations.

## 4.1 Item/Regulatory master
Add fields:
- 物料主数据版本生命周期状态 (`Draft/Released/Obsolete`)
- 器械分类 (Class I/II/III)
- UDI-DI, UDI-PI rules
- GMDN code / product family code
- 注册证号/备案号/国家地区适用性
- 无菌方式/灭菌批次规则
- 有效期管理策略 (shelf-life control)
- 关键件标识 (critical component)
- RoHS/REACH/生物相容性属性
- 供应商批准状态 (Approved/Conditional/Blocked)

## 4.2 Procurement and supplier quality
Add fields:
- 供应商资质状态, 到期日, 审核结论
- 供应商绩效评分 (PPM, OTD, CAPA关闭率)
- 报价有效期, 价格生效区间, MOQ/MPQ, 交期承诺
- 采购审批风险等级, 风险原因
- 采购变更原因码

## 4.3 Production execution and genealogy
Add fields:
- 工单批次号, 工序号, 工位号, 班次, 操作员
- 工艺配方版本/作业指导书版本
- 实际开工/完工时间, 停机原因, 报废原因
- 关键过程参数 (CPP) 记录字段
- 批记录电子签名链 (E-sign per operation)

## 4.4 QA/QC and compliance
Add fields:
- 检验计划版本, 抽样标准版本
- 检验项目明细 (项目代码, 规格上下限, 实测值)
- 不合格处置结论 (`返工/报废/让步接收/退货`)
- CAPA编号, 根因分类, 纠正/预防措施, 截止日期
- 偏差/变更/投诉关联号
- DHR (Device History Record) 编号
- DMR (Device Master Record) 编号

## 4.5 Serialization and traceability
Add fields:
- 序列号生成规则版本
- 序列号状态 (`created/issued/shipped/returned/scrapped`)
- 母子件装配关系层级
- 发货行与组件批次映射明细
- 召回影响范围标识与召回批次号

## 4.6 Audit trail and security
Add fields (all critical docs):
- 创建人/时间, 修改人/时间, 最后审批人/时间
- 审批意见, 驳回原因, override原因
- 电子签名方式, 签名哈希, 签名原因码
- 事件哈希链 (`event_hash`, `prev_event_hash`)
- 客户端IP, 设备信息, 会话ID

## 4.7 Finance/cost control
Add fields:
- 成本中心, 成本要素, 订单归集号
- 汇率类型/汇率日期/本位币金额
- 标准成本/移动平均/实际成本标识
- 委外费用对账差异原因
- 财务过账状态与失败重试计数

## 4.8 Alerting and integration
Add fields:
- 安全库存提醒策略ID, 首次提醒时间, 重复提醒间隔
- 通知渠道偏好 (`Feishu/Email/In-app`)
- 集成事件ID, 幂等键, 重试次数, 最后错误
- 外部系统回执号/回执时间

## 5) Implementation note for coding agent
- Treat Section 2 as “legacy-visible fields that must not be dropped”.
- Treat Section 4 as “recommended advanced fields for target medical-device ERP maturity”.
- For every field in Sections 2 + 4, enforce:
- datatype + required flag + default + validation rule
- change history (old/new value)
- permission scope (who can view/edit)
- workflow and audit coupling


---

## Appendix C - Full Source: CLAUDE ERP Architecture Proposal
Source file: `CLAUDE.md`

# Medical Device ERP System - Implementation Plan

> **Project:** End-to-End ERP System for Medical Device Manufacturing
> **Framework:** EU MDR 2017/745, ISO 13485, FDA 21 CFR Part 820
> **Version:** 1.0

---

## 1. Executive Summary

This document outlines the complete implementation plan for a medical device ERP system designed to meet EU MDR 2017/745 compliance, ISO 13485 quality management, FDA 21 CFR Part 820 (QSR). The system must provide full audit trail, traceability, electronic signatures, and regulatory compliance across all operations.

### 1.1 Key Compliance Requirements

| Standard | Purpose | Key Requirements |
|----------|---------|------------------|
| EU MDR 2017/745 | European Medical Device Regulation | UDI, Post-market surveillance, Technical documentation |
| ISO 13485:2016 | Medical devices QMS | Document control, Risk management, Process validation |
| FDA 21 CFR Part 820 | US Quality System Regulation | Design controls, Production controls, CAPA |



---

## 2. Complete Database Schema

### 2.1 Core Entities Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEDICAL DEVICE ERP SCHEMA                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐  │
│  │    ORGANIZATIONS │     │      USERS       │     │      ROLES       │  │
│  ├──────────────────┤     ├──────────────────┤     ├──────────────────┤  │
│  │ org_id (PK)     │     │ user_id (PK)     │     │ role_id (PK)     │  │
│  │ org_code        │────<│ org_id (FK)      │     │ role_code        │  │
│  │ org_name        │     │ role_id (FK)     │────<│ role_name        │  │
│  │ org_type        │     │ employee_id      │     │ description      │  │
│  │ address         │     │ email            │     │ is_system_role   │  │
│  │ country         │     │ password_hash    │     │ created_at       │  │
│  │ timezone        │     │ is_active        │     └────────┬─────────┘  │
│  │ regulatory_body │     │ last_login       │              │            │
│  └────────┬─────────┘     └────────┬─────────┘              │            │
│           │                        │                        │            │
│           │                        │                        │            │
│  ┌────────┴────────────────────────┴────────────────────────┴─────────┐  │
│  │                       AUDIT TRAIL (CRITICAL)                       │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ audit_id (PK), entity_type, entity_id, action, old_value,         │  │
│  │ new_value, user_id, ip_address, timestamp, session_id,            │  │
│  │ change_reason, signature_hash, is_electronic_signature           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Detailed Schema by Module

#### 2.2.1 Master Data Management (MDM)

```sql
-- Organizations
CREATE TABLE organizations (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_code VARCHAR(50) UNIQUE NOT NULL,
    org_name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL, -- 'headquarters', 'subsidiary', 'plant'
    legal_entity_name VARCHAR(255),
    registration_number VARCHAR(100),
    vat_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(3) NOT NULL, -- ISO 3166-1 alpha-3
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency_code VARCHAR(3) DEFAULT 'EUR',
    regulatory_body VARCHAR(100), -- 'FDA', 'EMA', 'PMDA', etc.
    mdrm_registration_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Organizational Units
CREATE TABLE organizational_units (
    ou_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    parent_ou_id UUID REFERENCES organizational_units(ou_id),
    ou_code VARCHAR(50) NOT NULL,
    ou_name VARCHAR(255) NOT NULL,
    ou_type VARCHAR(50) NOT NULL, -- 'department', 'division', 'plant', 'warehouse'
    manager_user_id UUID REFERENCES users(user_id),
    cost_center VARCHAR(50),
    is_production_unit BOOLEAN DEFAULT FALSE,
    is_warehouse BOOLEAN DEFAULT FALSE,
    address_id UUID REFERENCES addresses(address_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Addresses
CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_type VARCHAR(50), -- 'billing', 'shipping', 'warehouse', 'manufacturing'
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    address_line3 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(3),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    role_id UUID NOT NULL REFERENCES roles(role_id),
    employee_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES organizational_units(ou_id),
    job_title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_system_admin BOOLEAN DEFAULT FALSE,
    must_change_password BOOLEAN DEFAULT TRUE,
    password_changed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    signature_hash VARCHAR(255), -- For 21 CFR Part 11 electronic signatures
    signature_password_hash VARCHAR(255),
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Roles
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    role_level VARCHAR(20), -- 'system', 'organization', 'department'
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Role Permissions
CREATE TABLE role_permissions (
    permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(role_id),
    module_code VARCHAR(50) NOT NULL,
    permission_type VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'execute', 'approve'
    resource_id UUID, -- Optional: specific resource (e.g., specific document type)
    conditions JSONB, -- Conditional permissions
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- User Session Tracking (for audit)
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    session_token VARCHAR(500) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL
);
```

#### 2.2.2 Customer Management (CRM)

```sql
-- Customers
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_type VARCHAR(50) NOT NULL, -- 'hospital', 'distributor', 'OEM', 'end_user'
    customer_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    vat_number VARCHAR(50),
    duns_number VARCHAR(20), -- D-U-N-S number
    website VARCHAR(255),
    industry VARCHAR(100),
    customer_tier VARCHAR(20), -- 'gold', 'silver', 'bronze'
    credit_limit DECIMAL(15, 2),
    payment_terms VARCHAR(50),
    tax_exempt BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Customer Contacts
CREATE TABLE customer_contacts (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    contact_type VARCHAR(50), -- 'primary', 'billing', 'technical', 'regulatory'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    fax VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Customer Addresses
CREATE TABLE customer_addresses (
    customer_address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    address_id UUID NOT NULL REFERENCES addresses(address_id),
    address_type VARCHAR(50) NOT NULL, -- 'billing', 'shipping', 'plant'
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Customer Quality Certificates
CREATE TABLE customer_certificates (
    certificate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    certificate_type VARCHAR(50) NOT NULL, -- 'ISO13485', 'ISO9001', 'FDA'
    certificate_number VARCHAR(100),
    issuing_authority VARCHAR(255),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    document_url TEXT,
    verification_status VARCHAR(50), -- 'verified', 'pending', 'expired'
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Customer Plants/Facilities
CREATE TABLE customer_plants (
    plant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    plant_code VARCHAR(50) NOT NULL,
    plant_name VARCHAR(255) NOT NULL,
    address_id UUID REFERENCES addresses(address_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.3 Supplier Management

```sql
-- Suppliers
CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    vat_number VARCHAR(50),
    duns_number VARCHAR(20),
    website VARCHAR(255),
    supplier_type VARCHAR(50) NOT NULL, -- 'raw_material', 'component', 'service', 'contract_manufacturer'
    supplier_category VARCHAR(50), -- 'tier1', 'tier2', 'tier3'
    country_of_origin VARCHAR(3),
    year_established INTEGER,
    employee_count INTEGER,
    annual_revenue DECIMAL(15, 2),
    quality_rating VARCHAR(10), -- 'A', 'B', 'C', 'D'
    on_time_delivery_rating VARCHAR(10),
    payment_terms VARCHAR(50),
    credit_limit DECIMAL(15, 2),
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Supplier Contacts
CREATE TABLE supplier_contacts (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    contact_type VARCHAR(50), -- 'primary', 'sales', 'quality', 'technical', 'regulatory'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Supplier Addresses
CREATE TABLE supplier_addresses (
    supplier_address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    address_id UUID NOT NULL REFERENCES addresses(address_id),
    address_type VARCHAR(50) NOT NULL, -- 'headquarters', 'manufacturing', 'warehouse'
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Supplier Quality Agreements
CREATE TABLE supplier_agreements (
    agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    agreement_type VARCHAR(50) NOT NULL, -- 'quality', 'nda', 'supply', 'service'
    agreement_number VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    value DECIMAL(15, 2),
    currency VARCHAR(3),
    document_url TEXT,
    document_id UUID, -- Reference to DMS
    is_auto_renew BOOLEAN DEFAULT FALSE,
    renewal_notice_days INTEGER,
    status VARCHAR(50), -- 'draft', 'pending', 'active', 'expired', 'terminated'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Supplier Certifications
CREATE TABLE supplier_certifications (
    certification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    certification_type VARCHAR(50) NOT NULL, -- 'ISO13485', 'ISO9001', 'FDA', 'CE'
    certification_number VARCHAR(100),
    issuing_body VARCHAR(255),
    scope VARCHAR(500),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    document_url TEXT,
    document_id UUID REFERENCES documents(document_id),
    verification_status VARCHAR(50), -- 'verified', 'pending', 'expired', 'rejected'
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Supplier Audits
CREATE TABLE supplier_audits (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    audit_type VARCHAR(50) NOT NULL, -- 'initial', 'routine', 'follow_up', 'special'
    audit_standard VARCHAR(100), -- 'ISO13485', 'ISO9001', 'customer_specific'
    audit_date DATE NOT NULL,
    auditor_name VARCHAR(255),
    auditor_organization VARCHAR(255),
    location VARCHAR(255),
    scope VARCHAR(500),
    findings_count INTEGER,
    critical_findings INTEGER,
    major_findings INTEGER,
    minor_findings INTEGER,
    overall_result VARCHAR(50), -- 'passed', 'passed_with_conditions', 'failed'
    report_url TEXT,
    next_audit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Supplier Evaluation
CREATE TABLE supplier_evaluations (
    evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    evaluation_period VARCHAR(50), -- 'Q1_2024', 'annual_2024'
    evaluation_date DATE NOT NULL,
    evaluator_id UUID REFERENCES users(user_id),
    quality_score DECIMAL(5, 2),
    delivery_score DECIMAL(5, 2),
    price_score DECIMAL(5, 2),
    technical_score DECIMAL(5, 2),
    service_score DECIMAL(5, 2),
    overall_score DECIMAL(5, 2),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Supplier Material Authorization
CREATE TABLE supplier_materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    material_code VARCHAR(100) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    material_type VARCHAR(50),
    specification_url TEXT,
    material_status VARCHAR(50), -- 'approved', 'pending', 'rejected', 'discontinued'
    approval_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.4 Product Lifecycle Management (PLM)

```sql
-- Products (Finished Medical Devices)
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    product_type VARCHAR(50) NOT NULL, -- 'medical_device', 'component', 'raw_material', 'kit'
    device_classification VARCHAR(10), -- 'I', 'IIa', 'IIb', 'III' (EU MDR)
    us_device_classification VARCHAR(10), -- 'I', 'II', 'III' (FDA)
    product_category VARCHAR(100),
    therapeutic_area VARCHAR(100), -- 'cardiovascular', 'orthopedic', etc.
    intended_use TEXT,
    indications_for_use TEXT,
    contraindications TEXT,
    target_population VARCHAR(100),
    target_anatomy VARCHAR(100),
    sterilization_method VARCHAR(50), -- 'sterile', 'non_sterile', 'eto', 'gamma', 'steam'
    shelf_life_months INTEGER,
    storage_conditions VARCHAR(100), -- 'room_temp', 'refrigerated', 'frozen'
    is_udi_enabled BOOLEAN DEFAULT TRUE,
    udi_base VARCHAR(50), -- UDI-DI
    udi_device VARCHAR(50), -- UDI-PI
    mdrm_product_code VARCHAR(50), -- EUDAMED product code
    is_active BOOLEAN DEFAULT TRUE,
    lifecycle_status VARCHAR(50), -- 'development', 'design_verification', 'clinical', 'launched', 'obsolete'
    launched_date DATE,
    discontinued_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Product Versions
CREATE TABLE product_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    version_number VARCHAR(20) NOT NULL,
    version_name VARCHAR(100),
    description TEXT,
    BOM_version VARCHAR(20),
    drawing_version VARCHAR(20),
    specification_version VARCHAR(20),
    change_description TEXT,
    change_reason TEXT,
    release_date DATE,
    released_by UUID REFERENCES users(user_id),
    is_current BOOLEAN DEFAULT FALSE,
    status VARCHAR(50), -- 'draft', 'under_review', 'released', 'obsolete'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Bill of Materials (BOM)
CREATE TABLE boms (
    bom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    version_id UUID REFERENCES product_versions(version_id),
    bom_level INTEGER NOT NULL DEFAULT 0,
    bom_code VARCHAR(50),
    bom_name VARCHAR(255),
    quantity DECIMAL(15, 5) NOT NULL,
    unit_code VARCHAR(20),
    is_optional BOOLEAN DEFAULT FALSE,
    is_alternative BOOLEAN DEFAULT FALSE,
    reference_designator VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- BOM Components
CREATE TABLE bom_components (
    bom_component_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bom_id UUID NOT NULL REFERENCES boms(bom_id),
    component_id UUID NOT NULL, -- Can reference product (component) or raw material
    component_type VARCHAR(50) NOT NULL, -- 'product', 'raw_material', 'subassembly'
    quantity DECIMAL(15, 5) NOT NULL,
    unit_code VARCHAR(20),
    position_number VARCHAR(50),
    is_optional BOOLEAN DEFAULT FALSE,
    is_alternative BOOLEAN DEFAULT FALSE,
    scrap_percentage DECIMAL(5, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Product Specifications
CREATE TABLE product_specifications (
    specification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    specification_type VARCHAR(50) NOT NULL, -- 'dimensional', 'material', 'performance', 'regulatory'
    specification_name VARCHAR(255) NOT NULL,
    specification_value TEXT,
    tolerance_min DECIMAL(15, 5),
    tolerance_max DECIMAL(15, 5),
    unit_code VARCHAR(20),
    test_method_id UUID REFERENCES test_methods(test_method_id),
    is_critical BOOLEAN DEFAULT FALSE, -- Critical to quality (CTQ)
    is_specification_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Product Regulatory Documents
CREATE TABLE product_regulatory_docs (
    doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    document_type VARCHAR(50) NOT NULL, -- 'technical_file', 'design_dossier', 'ce_certificate', '510k', 'dfs'
    document_number VARCHAR(100),
    document_title VARCHAR(255) NOT NULL,
    document_version VARCHAR(20),
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    document_url TEXT,
    document_id UUID REFERENCES documents(document_id),
    status VARCHAR(50), -- 'draft', 'under_review', 'approved', 'expired'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Design History File (DHF)
CREATE TABLE design_history (
    design_review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    review_phase VARCHAR(50) NOT NULL, -- 'concept', 'design_input', 'design_output', 'design_verification', 'design_validation', 'design_transfer'
    review_number INTEGER NOT NULL,
    review_date DATE NOT NULL,
    review_type VARCHAR(50), -- 'formal', 'informal'
    attendees JSONB,
    review_items JSONB NOT NULL,
    decisions JSONB,
    action_items JSONB,
    output_documents JSONB,
    review_status VARCHAR(50) NOT NULL, -- 'scheduled', 'in_progress', 'completed', 'approved'
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    document_id UUID REFERENCES documents(document_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Design Verification & Validation
CREATE TABLE design_verification (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    verification_type VARCHAR(50) NOT NULL, -- 'design_verification', 'design_validation'
    test_plan_id UUID, -- Reference to test plan
    test_protocol_id UUID, -- Reference to test protocol
    test_results_id UUID, -- Reference to test results
    sample_size INTEGER,
    test_date DATE,
    test_location VARCHAR(255),
    test_standard VARCHAR(100),
    result_summary TEXT,
    is_passed BOOLEAN,
    deviations TEXT,
    conclusion TEXT,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    document_id UUID REFERENCES documents(document_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Change Control (For Design Changes)
CREATE TABLE change_requests (
    change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_number VARCHAR(50) UNIQUE NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- 'design_change', 'process_change', 'supplier_change', 'specification_change'
    product_id UUID REFERENCES products(product_id),
    affected_items JSONB, -- Array of affected documents/materials
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    change_reason TEXT NOT NULL,
    impact_assessment TEXT,
    proposed_solution TEXT,
    affected_cost DECIMAL(15, 2),
    affected_schedule VARCHAR(100),
    requestor_id UUID REFERENCES users(user_id),
    request_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'draft', 'pending_review', 'under_evaluation', 'approved', 'rejected', 'implemented'
    priority VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    due_date DATE,
    evaluated_by UUID REFERENCES users(user_id),
    evaluated_at TIMESTAMPTZ,
    approval_route VARCHAR(50), -- 'standard', 'expedited'
    approvers JSONB,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    implemented_by UUID REFERENCES users(user_id),
    implemented_at TIMESTAMPTZ,
    effectiveness_check_required BOOLEAN DEFAULT FALSE,
    effectiveness_check_date DATE,
    effectiveness_check_result VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);
```

#### 2.2.5 Inventory Management

```sql
-- Materials (Raw Materials & Components)
CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    material_code VARCHAR(50) UNIQUE NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(50) NOT NULL, -- 'raw_material', 'component', 'packaging', 'label', 'consumable'
    material_category VARCHAR(100),
    base_unit VARCHAR(20) NOT NULL,
    density DECIMAL(10, 4),
    weight_kg DECIMAL(10, 4),
    volume_l DECIMAL(10, 4),
    shelf_life_months INTEGER,
    storage_conditions VARCHAR(100),
    temperature_min DECIMAL(8, 2),
    temperature_max DECIMAL(8, 2),
    humidity_min DECIMAL(5, 2),
    humidity_max DECIMAL(5, 2),
    is_hazardous BOOLEAN DEFAULT FALSE,
    hazard_class VARCHAR(50),
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    is_udi_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    min_stock_level DECIMAL(15, 5),
    reorder_point DECIMAL(15, 5),
    max_stock_level DECIMAL(15, 5),
    standard_cost DECIMAL(15, 4),
    standard_cost_currency VARCHAR(3),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Material Specifications
CREATE TABLE material_specifications (
    spec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(material_id),
    specification_type VARCHAR(50) NOT NULL, -- 'chemical', 'physical', 'mechanical', 'visual'
    specification_name VARCHAR(255) NOT NULL,
    spec_value TEXT,
    tolerance_min DECIMAL(15, 5),
    tolerance_max DECIMAL(15, 5),
    unit_code VARCHAR(20),
    test_method_id UUID REFERENCES test_methods(test_method_id),
    is_critical BOOLEAN DEFAULT FALSE,
    is_spec_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Material Suppliers (Sourcing)
CREATE TABLE material_suppliers (
    material_supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(material_id),
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id),
    supplier_material_code VARCHAR(100),
    supplier_material_name VARCHAR(255),
    is_preferred BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATE,
    lead_time_days INTEGER,
    moq DECIMAL(15, 5),
    unit_price DECIMAL(15, 4),
    currency VARCHAR(3),
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Inventory Lots/Batches
CREATE TABLE inventory_lots (
    lot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    lot_number VARCHAR(50) NOT NULL,
    lot_type VARCHAR(20) NOT NULL, -- 'production', 'purchase', 'rework', 'repack'
    material_id UUID NOT NULL REFERENCES materials(material_id),
    product_id UUID REFERENCES products(product_id), -- For finished goods
    supplier_id UUID REFERENCES suppliers(supplier_id),
    production_date DATE,
    expiration_date DATE,
    manufacturing_date DATE,
    shelf_life_remaining_days INTEGER,
    quantity DECIMAL(15, 5) NOT NULL,
    quantity_unit VARCHAR(20),
    available_quantity DECIMAL(15, 5),
    allocated_quantity DECIMAL(15, 5),
    quarantine_quantity DECIMAL(15, 5),
    rejected_quantity DECIMAL(15, 5),
    lot_status VARCHAR(50) NOT NULL, -- 'available', 'allocated', 'quarantine', 'released', 'rejected', 'expired'
    quarantine_reason TEXT,
    release_date DATE,
    released_by UUID REFERENCES users(user_id),
    coa_required BOOLEAN DEFAULT TRUE,
    coa_received BOOLEAN DEFAULT FALSE,
    coa_document_id UUID REFERENCES documents(document_id),
    specification_conformance VARCHAR(50), -- 'conforming', 'non_conforming', 'pending'
    notes TEXT,
    source_lot_id UUID REFERENCES inventory_lots(lot_id), -- For rework/reprocess
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- UDI (Unique Device Identification) Registry
CREATE TABLE udi_registry (
    udi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    udi_di VARCHAR(50) UNIQUE NOT NULL, -- Device Identifier
    udi_pi VARCHAR(50), -- Production Identifier
    udi_format VARCHAR(20), -- 'hibc', 'gs1', 'iccbba'
    product_id UUID NOT NULL REFERENCES products(product_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    serial_number VARCHAR(100),
    expiration_date DATE,
    manufacturing_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    used_for_order_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    transaction_type VARCHAR(50) NOT NULL, -- 'receipt', 'issue', 'transfer', 'adjustment', 'reservation', 'allocation', 'consumption'
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(material_id),
    product_id UUID REFERENCES products(product_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    warehouse_id UUID REFERENCES warehouses(warehouse_id),
    from_warehouse_id UUID REFERENCES warehouses(warehouse_id),
    to_warehouse_id UUID REFERENCES warehouses(warehouse_id),
    quantity DECIMAL(15, 5) NOT NULL,
    quantity_unit VARCHAR(20),
    unit_cost DECIMAL(15, 4),
    currency VARCHAR(3),
    reference_type VARCHAR(50), -- 'po', 'wo', 'so', 'inventory_adjustment'
    reference_id UUID,
    reference_number VARCHAR(50),
    notes TEXT,
    is_quality_hold BOOLEAN DEFAULT FALSE,
    is_reversed BOOLEAN DEFAULT FALSE,
    reversed_by UUID REFERENCES users(user_id),
    reversed_at TIMESTAMPTZ,
    reversal_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Inventory Reservations
CREATE TABLE inventory_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_type VARCHAR(50) NOT NULL, -- 'sales', 'production', 'transfer'
    reference_type VARCHAR(50) NOT NULL,
    reference_id UUID NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(material_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    warehouse_id UUID REFERENCES warehouses(warehouse_id),
    quantity DECIMAL(15, 5) NOT NULL,
    reserved_quantity DECIMAL(15, 5) NOT NULL,
    allocated_quantity DECIMAL(15, 5) DEFAULT 0,
    consumed_quantity DECIMAL(15, 5) DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- 'pending', 'partial', 'fulfilled', 'cancelled'
    required_date DATE,
    fulfillment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Inventory Cycle Counts
CREATE TABLE cycle_counts (
    cycle_count_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_count_number VARCHAR(50) NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    count_date DATE NOT NULL,
    count_type VARCHAR(50) NOT NULL, -- 'full', 'partial', 'abc', 'blind'
    status VARCHAR(50), -- 'draft', 'in_progress', 'completed', 'approved'
    counted_by UUID REFERENCES users(user_id),
    verified_by UUID REFERENCES users(user_id),
    approved_by UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Cycle Count Details
CREATE TABLE cycle_count_details (
    detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_count_id UUID NOT NULL REFERENCES cycle_counts(cycle_count_id),
    material_id UUID NOT NULL REFERENCES materials(material_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    location_id UUID REFERENCES locations(location_id),
    system_quantity DECIMAL(15, 5),
    counted_quantity DECIMAL(15, 5),
    variance_quantity DECIMAL(15, 5),
    variance_percentage DECIMAL(8, 4),
    variance_reason VARCHAR(50),
    is_counted BOOLEAN DEFAULT FALSE,
    counted_at TIMESTAMPTZ,
    counted_by UUID REFERENCES users(user_id),
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    notes TEXT
);

-- Quarantine Management
CREATE TABLE quarantine_records (
    quarantine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quarantine_number VARCHAR(50) NOT NULL,
    lot_id UUID NOT NULL REFERENCES inventory_lots(lot_id),
    warehouse_id UUID REFERENCES warehouses(warehouse_id),
    location_id UUID REFERENCES locations(location_id),
    quantity DECIMAL(15, 5),
    quarantine_type VARCHAR(50) NOT NULL, -- 'quality_hold', 'supplier_return', 'customer_return', 'inventory_adjustment'
    hold_reason VARCHAR(50) NOT NULL, -- 'out_of_spec', 'documentation_missing', 'damage', 'expired', 'suspected_contamination'
    detailed_reason TEXT,
    disposition VARCHAR(50), -- 'use_as_is', 'rework', 'return_to_supplier', 'scrap', 'downgrade'
    disposition_reason TEXT,
    disposition_date DATE,
    disposition_approved_by UUID REFERENCES users(user_id),
    disposition_notes TEXT,
    status VARCHAR(50) NOT NULL, -- 'pending', 'under_investigation', 'dispositioned', 'released', 'closed'
    investigation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);
```

#### 2.2.6 Warehouse Management

```sql
-- Warehouses
CREATE TABLE warehouses (
    warehouse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    warehouse_type VARCHAR(50) NOT NULL, -- 'raw_material', 'finished_goods', 'consignment', 'returns', 'quarantine'
    address_id UUID REFERENCES addresses(address_id),
    is_temp_controlled BOOLEAN DEFAULT FALSE,
    temp_range_min DECIMAL(8, 2),
    temp_range_max DECIMAL(8, 2),
    is_hazardous_storage BOOLEAN DEFAULT FALSE,
    is_gs1_compliant BOOLEAN DEFAULT TRUE,
    is_gdp_compliant BOOLEAN DEFAULT FALSE,
    capacity_cubic_meters DECIMAL(15, 2),
    capacity_pallets INTEGER,
    picking_strategy VARCHAR(50), -- 'fifo', 'lifo', 'fefo', 'random'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Locations (Within Warehouse)
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    location_code VARCHAR(50) NOT NULL,
    location_type VARCHAR(50) NOT NULL, -- 'rack', 'shelf', 'bin', 'floor', 'cold_room'
    zone VARCHAR(20),
    aisle VARCHAR(10),
    bay VARCHAR(10),
    level VARCHAR(10),
    position VARCHAR(10),
    row VARCHAR(10),
    column VARCHAR(10),
    x_coord DECIMAL(10, 2),
    y_coord DECIMAL(10, 2),
    z_coord DECIMAL(10, 2),
    length_m DECIMAL(8, 2),
    width_m DECIMAL(8, 2),
    height_m DECIMAL(8, 2),
    max_weight_kg DECIMAL(10, 2),
    is_pickable BOOLEAN DEFAULT TRUE,
    is_storable BOOLEAN DEFAULT TRUE,
    is_temp_controlled BOOLEAN DEFAULT FALSE,
    is_hazardous BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Warehouse Operations
CREATE TABLE warehouse_operations (
    operation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(50) NOT NULL, -- 'receiving', 'putaway', 'picking', 'packing', 'shipping', 'internal_transfer'
    operation_number VARCHAR(50) NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    operation_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'draft', 'in_progress', 'completed', 'cancelled'
    priority VARCHAR(20),
    planned_start_date TIMESTAMPTZ,
    planned_end_date TIMESTAMPTZ,
    actual_start_date TIMESTAMPTZ,
    actual_end_date TIMESTAMPTZ,
    operator_id UUID REFERENCES users(user_id),
    supervisor_id UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Operation Lines (Items being processed)
CREATE TABLE operation_lines (
    line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id UUID NOT NULL REFERENCES warehouse_operations(operation_id),
    material_id UUID NOT NULL REFERENCES materials(material_id),
    product_id UUID REFERENCES products(product_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    from_location_id UUID REFERENCES locations(location_id),
    to_location_id UUID REFERENCES locations(location_id),
    quantity DECIMAL(15, 5) NOT NULL,
    quantity_unit VARCHAR(20),
    is_picked BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    picked_at TIMESTAMPTZ,
    picked_by UUID REFERENCES users(user_id),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    notes TEXT
);

-- Pick Lists
CREATE TABLE pick_lists (
    pick_list_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pick_list_number VARCHAR(50) NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    pick_list_type VARCHAR(50) NOT NULL, -- 'sales', 'production', 'transfer'
    reference_type VARCHAR(50),
    reference_id UUID,
    priority VARCHAR(20),
    status VARCHAR(50), -- 'draft', 'released', 'in_progress', 'completed', 'cancelled'
    assigned_to UUID REFERENCES users(user_id),
    picking_strategy VARCHAR(50),
    wave_number VARCHAR(50),
    planned_pick_date DATE,
    actual_pick_date DATE,
    completed_by UUID REFERENCES users(user_id),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Pick List Lines
CREATE TABLE pick_list_lines (
    line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pick_list_id UUID NOT NULL REFERENCES pick_lists(pick_list_id),
    line_number INTEGER NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(material_id),
    product_id UUID REFERENCES products(product_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    location_id UUID REFERENCES locations(location_id),
    quantity_to_pick DECIMAL(15, 5) NOT NULL,
    quantity_picked DECIMAL(15, 5),
    quantity_unit VARCHAR(20),
    is_picked BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    pick_sequence INTEGER,
    picked_at TIMESTAMPTZ,
    picked_by UUID REFERENCES users(user_id),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    notes TEXT
);

-- Shipping
CREATE TABLE shipments (
    shipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_number VARCHAR(50) NOT NULL,
    shipment_type VARCHAR(50) NOT NULL, -- 'outbound', 'intercompany', 'return'
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    customer_id UUID REFERENCES customers(customer_id),
    order_id UUID,
    carrier_id UUID REFERENCES carriers(carrier_id),
    carrier_service VARCHAR(100),
    tracking_number VARCHAR(100),
    ship_date DATE,
    delivery_date DATE,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    shipping_status VARCHAR(50), -- 'pending', 'picked', 'packed', 'shipped', 'in_transit', 'delivered', 'exception'
    ship_to_address_id UUID REFERENCES addresses(address_id),
    bill_to_address_id UUID REFERENCES addresses(address_id),
    number_of_packages INTEGER,
    total_weight_kg DECIMAL(10, 2),
    total_volume_cbm DECIMAL(10, 4),
    is_temp_controlled BOOLEAN DEFAULT FALSE,
    temperature_override_count INTEGER DEFAULT 0,
    documents_attached JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Shipment Lines
CREATE TABLE shipment_lines (
    line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipments(shipment_id),
    line_number INTEGER NOT NULL,
    product_id UUID NOT NULL REFERENCES products(product_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    serial_number VARCHAR(100),
    quantity DECIMAL(15, 5) NOT NULL,
    quantity_unit VARCHAR(20),
    uom_conversion_factor DECIMAL(10, 4),
    weight_kg DECIMAL(10, 4),
    volume_cbm DECIMAL(10, 6),
    is_packed BOOLEAN DEFAULT FALSE,
    packing_location_id UUID REFERENCES locations(location_id),
    notes TEXT
);

-- Carriers
CREATE TABLE carriers (
    carrier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    carrier_code VARCHAR(50) NOT NULL,
    carrier_name VARCHAR(255) NOT NULL,
    carrier_type VARCHAR(50), -- 'air', 'ground', 'sea', 'courier'
    tracking_url_template VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Receiving
CREATE TABLE receipts (
    receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) NOT NULL,
    receipt_type VARCHAR(50) NOT NULL, -- 'purchase', 'return', 'intercompany', 'production'
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id),
    supplier_id UUID REFERENCES suppliers(supplier_id),
    purchase_order_id UUID REFERENCES purchase_orders(po_id),
    expected_date DATE,
    actual_date DATE,
    receiving_status VARCHAR(50), -- 'pending', 'partial', 'completed', 'cancelled'
    receipt_condition VARCHAR(50), -- 'as_expected', 'damaged', 'partial_damage'
    total_lines INTEGER,
    received_lines INTEGER,
    is_quarantine_required BOOLEAN DEFAULT TRUE,
    notes TEXT,
    received_by UUID REFERENCES users(user_id),
    verified_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Receipt Lines
CREATE TABLE receipt_lines (
    line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID NOT NULL REFERENCES receipts(receipt_id),
    line_number INTEGER NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(material_id),
    po_line_id UUID REFERENCES po_lines(line_id),
    expected_lot_number VARCHAR(50),
    received_lot_number VARCHAR(50),
    expected_quantity DECIMAL(15, 5) NOT NULL,
    received_quantity DECIMAL(15, 5),
    rejected_quantity DECIMAL(15, 5),
    quantity_unit VARCHAR(20),
    expected_expiry_date DATE,
    received_expiry_date DATE,
    inspection_status VARCHAR(50), -- 'pending', 'inspected', 'approved', 'rejected'
    inspection_result VARCHAR(50), -- 'accepted', 'accepted_with_deviation', 'rejected'
    is_putaway_complete BOOLEAN DEFAULT FALSE,
    putaway_location_id UUID REFERENCES locations(location_id),
    putaway_completed_by UUID REFERENCES users(user_id),
    putaway_completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.7 Production Management

```sql
-- Work Centers
CREATE TABLE work_centers (
    work_center_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    work_center_code VARCHAR(50) NOT NULL,
    work_center_name VARCHAR(255) NOT NULL,
    work_center_type VARCHAR(50) NOT NULL, -- 'assembly', 'fabrication', 'packaging', 'testing', 'sterilization'
    organizational_unit_id UUID REFERENCES organizational_units(ou_id),
    location_id UUID REFERENCES locations(location_id),
    capacity_type VARCHAR(50), -- 'machine', 'labor', 'both'
    capacity_hours DECIMAL(10, 2),
    efficiency_factor DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Work Center Capabilities
CREATE TABLE work_center_capabilities (
    capability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_center_id UUID NOT NULL REFERENCES work_centers(work_center_id),
    capability_type VARCHAR(50), -- 'assembly', 'welding', 'testing', 'sterilization'
    capability_name VARCHAR(255),
    is_qualified BOOLEAN DEFAULT FALSE,
    qualification_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Routing/Process Plans
CREATE TABLE routings (
    routing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    version_id UUID REFERENCES product_versions(version_id),
    routing_code VARCHAR(50) NOT NULL,
    routing_name VARCHAR(255),
    routing_type VARCHAR(50), -- 'production', 'repair', 'rework'
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    default_quantity DECIMAL(15, 5) DEFAULT 1,
    yield_percentage DECIMAL(5, 2) DEFAULT 100,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Routing Operations
CREATE TABLE routing_operations (
    operation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routing_id UUID NOT NULL REFERENCES routings(routing_id),
    sequence_number INTEGER NOT NULL,
    operation_code VARCHAR(50),
    operation_name VARCHAR(255) NOT NULL,
    operation_type VARCHAR(50), -- 'assembly', 'fabrication', 'testing', 'inspection', 'packaging'
    work_center_id UUID REFERENCES work_centers(work_center_id),
    description TEXT,
    standard_time_minutes DECIMAL(10, 2),
    setup_time_minutes DECIMAL(10, 2),
    run_time_minutes DECIMAL(10, 2),
    queue_time_minutes DECIMAL(10, 2),
    move_time_minutes DECIMAL(10, 2),
    is_critical_path BOOLEAN DEFAULT FALSE,
    is_inspection_point BOOLEAN DEFAULT FALSE,
    is_approval_point BOOLEAN DEFAULT FALSE,
    is_final_assembly BOOLEAN DEFAULT FALSE,
    is_sterilization BOOLEAN DEFAULT FALSE,
    is_clean_room_required BOOLEAN DEFAULT FALSE,
    is_ncr_required BOOLEAN DEFAULT FALSE,
    tool_requirements JSONB,
    skill_requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Operation Instructions
CREATE TABLE operation_instructions (
    instruction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id UUID NOT NULL REFERENCES routing_operations(operation_id),
    instruction_type VARCHAR(50), -- 'work_instruction', 'specification', 'quality_check'
    document_id UUID REFERENCES documents(document_id),
    instruction_number VARCHAR(50),
    instruction_version VARCHAR(20),
    title VARCHAR(255),
    content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Production Orders (Work Orders)
CREATE TABLE production_orders (
    wo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_number VARCHAR(50) UNIQUE NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    order_type VARCHAR(50) NOT NULL, -- 'production', 'rework', 'repair'
    product_id UUID NOT NULL REFERENCES products(product_id),
    routing_id UUID REFERENCES routings(routing_id),
    order_quantity DECIMAL(15, 5) NOT NULL,
    completed_quantity DECIMAL(15, 5) DEFAULT 0,
    scrapped_quantity DECIMAL(15, 5) DEFAULT 0,
    rejected_quantity DECIMAL(15, 5) DEFAULT 0,
    quantity_unit VARCHAR(20),
    bom_id UUID REFERENCES boms(bom_id),
    bom_version VARCHAR(20),
    priority VARCHAR(20), -- 'low', 'medium', 'high', 'urgent'
    production_status VARCHAR(50), -- 'planned', 'released', 'in_progress', 'on_hold', 'completed', 'cancelled'
    schedule_start_date DATE,
    schedule_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    due_date DATE,
    warehouse_id UUID REFERENCES warehouses(warehouse_id),
    finished_goods_warehouse_id UUID REFERENCES warehouses(warehouse_id),
    production_unit_id UUID REFERENCES organizational_units(ou_id),
    is_locked BOOLEAN DEFAULT FALSE,
    hold_reason VARCHAR(100),
    hold_by UUID REFERENCES users(user_id),
    released_by UUID REFERENCES users(user_id),
    released_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users(user_id),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Production Order Materials (Material Requirements)
CREATE TABLE wo_materials (
    material_requirement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_id UUID NOT NULL REFERENCES production_orders(wo_id),
    material_id UUID NOT NULL REFERENCES materials(material_id),
    required_quantity DECIMAL(15, 5) NOT NULL,
    issued_quantity DECIMAL(15, 5) DEFAULT 0,
    consumed_quantity DECIMAL(15, 5) DEFAULT 0,
    returned_quantity DECIMAL(15, 5) DEFAULT 0,
    scrap_quantity DECIMAL(15, 5) DEFAULT 0,
    unit_code VARCHAR(20),
    is_backflushed BOOLEAN DEFAULT FALSE,
    is_sterile_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Production Order Operations
CREATE TABLE wo_operations (
    wo_operation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_id UUID NOT NULL REFERENCES production_orders(wo_id),
    operation_id UUID REFERENCES routing_operations(operation_id),
    sequence_number INTEGER NOT NULL,
    work_center_id UUID REFERENCES work_centers(work_center_id),
    planned_quantity DECIMAL(15, 5) NOT NULL,
    completed_quantity DECIMAL(15, 5) DEFAULT 0,
    rejected_quantity DECIMAL(15, 5) DEFAULT 0,
    scrapped_quantity DECIMAL(15, 5) DEFAULT 0,
    setup_start_time TIMESTAMPTZ,
    setup_end_time TIMESTAMPTZ,
    production_start_time TIMESTAMPTZ,
    production_end_time TIMESTAMPTZ,
    operation_status VARCHAR(50), -- 'pending', 'in_progress', 'completed', 'on_hold'
    is_inspection_passed BOOLEAN,
    is_approval_required BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    operator_id UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Production Order Lots (Finished Goods Batches)
CREATE TABLE wo_lots (
    wo_lot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_id UUID NOT NULL REFERENCES production_orders(wo_id),
    lot_number VARCHAR(50) NOT NULL,
    sub_lot_number VARCHAR(50),
    quantity DECIMAL(15, 5) NOT NULL,
    quantity_unit VARCHAR(20),
    lot_status VARCHAR(50), -- 'pending', 'in_process', 'completed', 'released', 'on_hold'
    production_date DATE,
    expiration_date DATE,
    is_sterile BOOLEAN DEFAULT FALSE,
    sterilization_method VARCHAR(50),
    sterilization_date DATE,
    sterilization_batch VARCHAR(50),
    is_qc_passed BOOLEAN,
    qc_release_by UUID REFERENCES users(user_id),
    qc_release_date DATE,
    is_released BOOLEAN DEFAULT FALSE,
    released_by UUID REFERENCES users(user_id),
    released_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Production Transactions (Bookings)
CREATE TABLE production_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_id UUID NOT NULL REFERENCES production_orders(wo_id),
    transaction_type VARCHAR(50) NOT NULL, -- 'material_issue', 'material_return', 'operation_start', 'operation_complete', 'scrap', 'rework'
    operation_id UUID REFERENCES routing_operations(operation_id),
    material_id UUID REFERENCES materials(material_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    quantity DECIMAL(15, 5),
    quantity_unit VARCHAR(20),
    work_center_id UUID REFERENCES work_centers(work_center_id),
    operator_id UUID REFERENCES users(user_id),
    transaction_time TIMESTAMPTZ DEFAULT NOW(),
    is_qc_required BOOLEAN DEFAULT FALSE,
    is_qc_passed BOOLEAN,
    qc_technician_id UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Production Labels
CREATE TABLE production_labels (
    label_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_id UUID REFERENCES production_orders(wo_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    label_type VARCHAR(50) NOT NULL, -- 'product_label', 'box_label', 'pallet_label', 'shipper_label'
    label_format VARCHAR(50), -- 'PDF', 'ZPL', 'HTML'
    label_content JSONB NOT NULL,
    print_count INTEGER DEFAULT 1,
    printed_by UUID REFERENCES users(user_id),
    printed_at TIMESTAMPTZ,
    is_printed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Clean Room Monitoring
CREATE TABLE clean_room_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_center_id UUID NOT NULL REFERENCES work_centers(work_center_id),
    log_date DATE NOT NULL,
    log_time TIMESTAMPTZ NOT NULL,
    temperature DECIMAL(8, 2),
    humidity DECIMAL(5, 2),
    pressure_differential DECIMAL(8, 2),
    particle_count INTEGER,
    is_within_spec BOOLEAN DEFAULT TRUE,
    deviation_notes TEXT,
    recorded_by UUID REFERENCES users(user_id),
    verified_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.2.8 Quality Management

```sql
-- Quality Control Plans
CREATE TABLE qc_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    material_id UUID REFERENCES materials(material_id),
    plan_code VARCHAR(50) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'incoming', 'in_process', 'final', 'release'
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- QC Plan Items
CREATE TABLE qc_plan_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES qc_plans(plan_id),
    sequence_number INTEGER NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'visual', 'dimensional', 'functional', 'performance', 'chemical', 'microbiological'
    test_description TEXT,
    specification_id UUID REFERENCES product_specifications(specification_id),
    acceptance_criteria TEXT,
    sample_size INTEGER,
    sampling_plan VARCHAR(50), -- 'AQL', 'c=0', '100%'
    aql_level VARCHAR(10),
    aql_acceptance_number INTEGER,
    test_method_id UUID REFERENCES test_methods(test_method_id),
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_critical_test BOOLEAN DEFAULT FALSE,
    is_destructive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Test Methods
CREATE TABLE test_methods (
    test_method_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    method_code VARCHAR(50) NOT NULL,
    method_name VARCHAR(255) NOT NULL,
    method_type VARCHAR(50), -- 'physical', 'chemical', 'biological', 'microbiological'
    description TEXT,
    procedure_url TEXT,
    document_id UUID REFERENCES documents(document_id),
    is_validated BOOLEAN DEFAULT FALSE,
    validation_date DATE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(user_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Inspection Lots
CREATE TABLE inspection_lots (
    inspection_lot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_lot_number VARCHAR(50) NOT NULL,
    inspection_type VARCHAR(50) NOT NULL, -- 'incoming', 'in_process', 'final', 'release'
    source_type VARCHAR(50), -- 'receipt', 'production', 'returned_goods'
    source_id UUID,
    source_reference VARCHAR(50),
    product_id UUID REFERENCES products(product_id),
    material_id UUID REFERENCES materials(material_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    sample_size INTEGER,
    inspected_quantity DECIMAL(15, 5),
    accepted_quantity DECIMAL(15, 5),
    rejected_quantity DECIMAL(15, 5),
    inspection_date DATE,
    inspector_id UUID REFERENCES users(user_id),
    status VARCHAR(50), -- 'pending', 'in_progress', 'completed', 'approved', 'rejected'
    overall_result VARCHAR(50), -- 'accepted', 'accepted_with_deviation', 'rejected'
    approval_status VARCHAR(50), -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Inspection Results
CREATE TABLE inspection_results (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_lot_id UUID NOT NULL REFERENCES inspection_lots(inspection_lot_id),
    item_id UUID REFERENCES qc_plan_items(item_id),
    test_type VARCHAR(50),
    test_description VARCHAR(255),
    specification_id UUID REFERENCES product_specifications(specification_id),
    test_method_id UUID REFERENCES test_methods(test_method_id),
    acceptance_criteria TEXT,
    result_value TEXT,
    result_numeric DECIMAL(15, 5),
    unit_code VARCHAR(20),
    is_within_spec BOOLEAN,
    is_passed BOOLEAN NOT NULL,
    deviation_description TEXT,
    is_critical_deviation BOOLEAN DEFAULT FALSE,
    is_major_deviation BOOLEAN DEFAULT FALSE,
    is_minor_deviation BOOLEAN DEFAULT FALSE,
    inspector_id UUID REFERENCES users(user_id),
    inspection_datetime TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Non-Conformance Reports (NCR)
CREATE TABLE non_conformances (
    ncr_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ncr_number VARCHAR(50) UNIQUE NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    ncr_type VARCHAR(50) NOT NULL, -- 'supplier', 'internal', 'customer', 'process', 'product'
    severity VARCHAR(20) NOT NULL, -- 'critical', 'major', 'minor'
    category VARCHAR(50), -- 'material', 'process', 'design', 'documentation', 'equipment'
    source_type VARCHAR(50),
    source_id UUID,
    source_reference VARCHAR(50),
    product_id UUID REFERENCES products(product_id),
    material_id UUID REFERENCES materials(material_id),
    lot_id UUID REFERENCES inventory_lots(lot_id),
    wo_id UUID REFERENCES production_orders(wo_id),
    description TEXT NOT NULL,
    identified_date DATE NOT NULL,
    identified_by UUID REFERENCES users(user_id),
    isolation_required BOOLEAN DEFAULT TRUE,
    isolation_location_id UUID REFERENCES locations(location_id),
    isolation_quantity DECIMAL(15, 5),
    immediate_action TEXT,
    root_cause_analysis TEXT,
    root_cause_category VARCHAR(50),
    root_cause_code VARCHAR(50),
    corrective_action TEXT,
    preventive_action TEXT,
    ncr_status VARCHAR(50) NOT NULL, -- 'open', 'under_investigation', 'pending_approval', 'closed', 'void'
    disposition VARCHAR(50), -- 'use_as_is', 'rework', 'return', 'regrade', 'scrap'
    disposition_approved_by UUID REFERENCES users(user_id),
    disposition_approved_at TIMESTAMPTZ,
    effectiveness_check_required BOOLEAN DEFAULT FALSE,
    effectiveness_check_date DATE,
    effectiveness_check_result VARCHAR(50),
    closed_by UUID REFERENCES users(user_id),
    closed_at TIMESTAMPTZ,
    related_ncr_id UUID REFERENCES non_conformances(ncr_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Deviation Management
CREATE TABLE deviations (
    deviation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deviation_number VARCHAR(50) UNIQUE NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    deviation_type VARCHAR(50) NOT NULL, -- 'specification', 'process', 'procedure', 'regulatory'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    product_id UUID REFERENCES products(product_id),
    material_id UUID REFERENCES materials(material_id),
    deviation_date DATE NOT NULL,
    requested_by UUID REFERENCES users(user_id),
    justification TEXT,
    impact_assessment TEXT,
    proposed_action TEXT,
    status VARCHAR(50) NOT NULL, -- 'pending', 'under_review', 'approved', 'rejected', 'implemented'
    reviewer_id UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMPTZ,
    approver_id UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    is_extended BOOLEAN DEFAULT FALSE,
    extension_justification TEXT,
    related_ncr_id UUID REFERENCES non_conformances(ncr_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Corrective and Preventive Actions (CAPA)
CREATE TABLE capas (
    capa_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_number VARCHAR(50) UNIQUE NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    capa_type VARCHAR(50) NOT NULL, -- 'corrective', 'preventive'
    source_type VARCHAR(50) NOT NULL, -- 'ncr', 'audit', 'complaint', 'incident', 'management_review'
    source_id UUID NOT NULL,
    source_reference VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    root_cause_found BOOLEAN DEFAULT FALSE,
    root_cause_category VARCHAR(50),
    root_cause_code VARCHAR(50),
    root_cause_description TEXT,
    root_cause_investigator_id UUID REFERENCES users(user_id),
    root_cause_investigation_date DATE,
    corrective_action TEXT,
    preventive_action TEXT,
    action_due_date DATE,
    action_responsibility_id UUID REFERENCES users(user_id),
    action_completed_date DATE,
    action_verification_required BOOLEAN DEFAULT TRUE,
    action_verified_by UUID REFERENCES users(user_id),
    action_verified_date DATE,
    effectiveness_criteria TEXT,
    effectiveness_check_date DATE,
    effectiveness_check_result VARCHAR(50), -- 'effective', 'ineffective', 'pending'
    effectiveness_check_notes TEXT,
    status VARCHAR(50) NOT NULL, -- 'open', 'under_investigation', 'pending_approval', 'in_progress', 'completed', 'closed'
    is_escalated BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    closed_by UUID REFERENCES users(user_id),
    closed_at TIMESTAMPTZ,
    cost_impact DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- CAPA Effectiveness Verification
CREATE TABLE capa_effectiveness (
    effectiveness_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID NOT NULL REFERENCES capas(capa_id),
    verification_date DATE NOT NULL,
    verification_type VARCHAR(50), -- 'data_review', 'audit', 'inspection', 'metrics'
    verification_method TEXT,
    sample_size INTEGER,
    findings TEXT,
    is_effective BOOLEAN NOT NULL,
    evidence_documents JSONB,
    verified_by UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Out-of-Specification (OOS) Investigations
CREATE TABLE oos_investigations (
    oos_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oos_number VARCHAR(50) UNIQUE NOT NULL,
    investigation_type VARCHAR(50) NOT NULL, -- 'laboratory', 'production'
    source_type VARCHAR(50),
    source_id UUID,
    test_result_id UUID REFERENCES inspection_results(result_id),
    initial_result_value TEXT,
    initial_result_numeric DECIMAL(15, 5),
    specification_range TEXT,
    is_lab_error BOOLEAN,
    lab_error_reason TEXT,
    is_market_action_required BOOLEAN DEFAULT FALSE,
    retest_required BOOLEAN DEFAULT TRUE,
    retest_results JSONB,
    final_disposition VARCHAR(50), -- ' invalidate', 'hold', 'release'
    investigation_summary TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    completed_by UUID REFERENCES users(user_id),
    completed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.9 Document Management System (DMS)

```sql
-- Documents
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    document_number VARCHAR(50) UNIQUE NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'sop', 'work_instruction', 'specification', 'drawing', 'certificate', 'form', 'policy'
    document_category VARCHAR(100),
    document_subcategory VARCHAR(100),
    product_id UUID REFERENCES products(product_id),
    material_id UUID REFERENCES materials(material_id),
    document_version VARCHAR(20) NOT NULL,
    revision_date DATE NOT NULL,
    revision_description TEXT,
    document_status VARCHAR(50) NOT NULL, -- 'draft', 'under_review', 'approved', 'obsolete', 'superseded'
    effective_date DATE,
    expiry_date DATE,
    is_latest_version BOOLEAN DEFAULT TRUE,
    superseded_by_id UUID REFERENCES documents(document_id),
    supersedes_id UUID REFERENCES documents(document_id),
    document_url TEXT,
    file_name VARCHAR(255),
    file_size_bytes INTEGER,
    file_hash VARCHAR(64), -- SHA-256 for integrity
    file_format VARCHAR(20),
    is_electronically_signed BOOLEAN DEFAULT FALSE,
    signer_id UUID REFERENCES users(user_id),
    signed_at TIMESTAMPTZ,
    signature_hash VARCHAR(255),
    is_controlled_copy BOOLEAN DEFAULT TRUE,
    copy_number VARCHAR(50),
    print_count INTEGER DEFAULT 0,
    storage_location VARCHAR(255),
    retention_period_years INTEGER,
    retention_start_date DATE,
    is_confidential BOOLEAN DEFAULT FALSE,
    confidentiality_level VARCHAR(20),
    owner_department_id UUID REFERENCES organizational_units(ou_id),
    owner_user_id UUID REFERENCES users(user_id),
    reviewer_id UUID REFERENCES users(user_id),
    reviewer_deadline DATE,
    is_reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMPTZ,
    approver_id UUID REFERENCES users(user_id),
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Document Distribution
CREATE TABLE document_distribution (
    distribution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(document_id),
    distributed_to_ou_id UUID REFERENCES organizational_units(ou_id),
    distributed_to_user_id UUID REFERENCES users(user_id),
    distribution_date DATE,
    acknowledgment_required BOOLEAN DEFAULT FALSE,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES users(user_id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Document Training Requirements
CREATE TABLE document_training (
    training_requirement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(document_id),
    training_type VARCHAR(50), -- 'read', 'understand', 'certified'
    training_method VARCHAR(50), -- 'classroom', 'online', 'on_job'
    is_mandatory BOOLEAN DEFAULT TRUE,
    validity_months INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Document Links
CREATE TABLE document_links (
    link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_document_id UUID NOT NULL REFERENCES documents(document_id),
    target_document_id UUID REFERENCES documents(document_id),
    target_material_id UUID REFERENCES materials(material_id),
    target_product_id UUID REFERENCES products(product_id),
    link_type VARCHAR(50), -- 'references', 'supersedes', 'related', 'required'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.10 Maintenance Management

```sql
-- Equipment
CREATE TABLE equipment (
    equipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    equipment_code VARCHAR(50) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL, -- 'production', 'testing', 'packaging', 'utility'
    equipment_category VARCHAR(100),
    manufacturer VARCHAR(255),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    year_of_manufacture INTEGER,
    location_id UUID REFERENCES locations(location_id),
    work_center_id UUID REFERENCES work_centers(work_center_id),
    installation_date DATE,
    warranty_expiry_date DATE,
    is_critical BOOLEAN DEFAULT FALSE,
    criticality_level VARCHAR(20), -- 'a', 'b', 'c'
    is_calibration_required BOOLEAN DEFAULT FALSE,
    calibration_frequency_months INTEGER,
    is_pm_required BOOLEAN DEFAULT FALSE,
    pm_frequency_months INTEGER,
    operating_power_kw DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Equipment History
CREATE TABLE equipment_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID NOT NULL REFERENCES equipment(equipment_id),
    event_type VARCHAR(50) NOT NULL, -- 'maintenance', 'repair', 'calibration', 'modification', 'inspection'
    event_date DATE NOT NULL,
    description TEXT,
    performed_by VARCHAR(255),
    downtime_hours DECIMAL(10, 2),
    cost DECIMAL(15, 2),
    parts_replaced JSONB,
    next_action_date DATE,
    document_id UUID REFERENCES documents(document_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Maintenance Work Orders
CREATE TABLE maintenance_wo (
    wo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_number VARCHAR(50) UNIQUE NOT NULL,
    equipment_id UUID NOT NULL REFERENCES equipment(equipment_id),
    maintenance_type VARCHAR(50) NOT NULL, -- 'preventive', 'corrective', 'predictive', 'calibration'
    priority VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    requested_by UUID REFERENCES users(user_id),
    request_date DATE NOT NULL,
    scheduled_date DATE,
    assigned_to UUID REFERENCES users(user_id),
    actual_start_date DATE,
    actual_end_date DATE,
    downtime_hours DECIMAL(10, 2),
    labor_hours DECIMAL(10, 2),
    parts_cost DECIMAL(15, 2),
    total_cost DECIMAL(15, 2),
    work_performed TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    status VARCHAR(50), -- 'requested', 'approved', 'scheduled', 'in_progress', 'completed', 'cancelled'
    is_calibration BOOLEAN DEFAULT FALSE,
    calibration_due_date DATE,
    is_calibration_passed BOOLEAN,
    calibration_document_id UUID REFERENCES documents(document_id),
    completed_by UUID REFERENCES users(user_id),
    completed_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Calibration Records
CREATE TABLE calibration_records (
    calibration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID NOT NULL REFERENCES equipment(equipment_id),
    calibration_date DATE NOT NULL,
    next_calibration_date DATE,
    calibration_type VARCHAR(50), -- 'internal', 'external', 'vendor'
    calibration_provider VARCHAR(255),
    calibration_standard VARCHAR(100),
    results_summary TEXT,
    is_within_tolerance BOOLEAN NOT NULL,
    adjustment_made BOOLEAN DEFAULT FALSE,
    adjustment_description TEXT,
    certificate_url TEXT,
    certificate_number VARCHAR(100),
    technician_id UUID REFERENCES users(user_id),
    reviewed_by UUID REFERENCES users(user_id),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);
```

#### 2.2.11 Business Intelligence & Reporting

```sql
-- Report Definitions
CREATE TABLE report_definitions (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    report_code VARCHAR(50) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'operational', 'analytical', 'regulatory', 'audit'
    category VARCHAR(100),
    description TEXT,
    query_definition JSONB NOT NULL,
    parameters JSONB,
    is_standard BOOLEAN DEFAULT FALSE,
    is_regulatory BOOLEAN DEFAULT FALSE, -- Required for compliance
    regulatory_requirement VARCHAR(100), -- 'EU_MDR', 'FDA_21CFR', 'ISO13485'
    schedule_type VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'on_demand'
    schedule_cron_expression VARCHAR(100),
    recipients JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(user_id)
);

-- Report Executions
CREATE TABLE report_executions (
    execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES report_definitions(report_id),
    executed_by UUID REFERENCES users(user_id),
    execution_start TIMESTAMPTZ NOT NULL,
    execution_end TIMESTAMPTZ,
    parameters_used JSONB,
    status VARCHAR(50), -- 'running', 'completed', 'failed'
    row_count INTEGER,
    output_format VARCHAR(20),
    output_url TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.2.12 Audit Trail (CRITICAL - Full Compliance)

```sql
-- Central Audit Trail Table (21 CFR Part 11 Compliant)
CREATE TABLE audit_trail (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(org_id),
    entity_type VARCHAR(100) NOT NULL, -- Table/entity name
    entity_id UUID NOT NULL, -- Primary key of affected record
    entity_reference VARCHAR(100), -- Human-readable reference (e.g., document number)
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', 'logout', 'print', 'export', 'sign', 'approve'
    action_detail VARCHAR(255),
    field_name VARCHAR(100), -- For updates: specific field changed
    old_value TEXT,
    new_value TEXT,
    old_value_numeric DECIMAL(20, 6),
    new_value_numeric DECIMAL(20, 6),
    is_electronic_signature BOOLEAN DEFAULT FALSE,
    signature_hash VARCHAR(255), -- SHA-256 hash of signature data
    signature_meaning VARCHAR(255), -- "Approved by", "Signed by"
    user_id UUID REFERENCES users(user_id),
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_role VARCHAR(100),
    session_id UUID REFERENCES user_sessions(session_id),
    ip_address INET,
    user_agent TEXT,
    hostname VARCHAR(255),
    application_name VARCHAR(100),
    module_code VARCHAR(50),
    workstation_id VARCHAR(100),
    change_reason TEXT, -- Required for regulated records
    is_regulatory_record BOOLEAN DEFAULT FALSE, -- Part of 21 CFR Part 11
    is_immutable BOOLEAN DEFAULT TRUE, -- Cannot be modified/deleted
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (timestamp);

-- Create partitions by month for performance
-- CREATE TABLE audit_trail_2024_01 PARTITION OF audit_trail FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
-- CREATE TABLE audit_trail_2024_02 PARTITION OF audit_trail FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Audit Trail Indexes (for performance)
CREATE INDEX idx_audit_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_trail(user_id, timestamp);
CREATE INDEX idx_audit_timestamp ON audit_trail(timestamp);
CREATE INDEX idx_audit_action ON audit_trail(action);
CREATE INDEX idx_audit_signature ON audit_trail(signature_hash) WHERE signature_hash IS NOT NULL;

-- Electronic Signature Records
CREATE TABLE electronic_signatures (
    signature_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audit_trail(audit_id),
    user_id UUID REFERENCES users(user_id),
    signature_type VARCHAR(50) NOT NULL, -- 'approval', 'review', 'certification', 'release'
    signature_meaning VARCHAR(255) NOT NULL,
    signature_purpose TEXT,
    password_hash VARCHAR(255) NOT NULL,
    signature_hash VARCHAR(255) NOT NULL,
    signature_timestamp TIMESTAMPTZ NOT NULL,
    ip_address INET,
    is_valid BOOLEAN DEFAULT TRUE,
    invalidation_reason TEXT,
    signed_document_id UUID REFERENCES documents(document_id),
    signed_record_type VARCHAR(100),
    signed_record_id UUID,
    non_repudiation_token VARCHAR(500), -- For legal non-repudiation
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.2.13 Notifications & Alerts

```sql
-- Notification Templates
CREATE TABLE notification_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 'email', 'sms', 'in_app', 'webhook'
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    is_html BOOLEAN DEFAULT FALSE,
    sender_email VARCHAR(255),
    sender_name VARCHAR(255),
    priority VARCHAR(20), -- 'low', 'normal', 'high', 'urgent'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Notifications
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES notification_templates(template_id),
    user_id UUID REFERENCES users(user_id),
    recipient_email VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    channel VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50), -- 'pending', 'sent', 'delivered', 'failed', 'read'
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    reference_type VARCHAR(100),
    reference_id UUID,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Rules
CREATE TABLE alert_rules (
    alert_rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    alert_code VARCHAR(50) NOT NULL,
    alert_name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- 'inventory', 'quality', 'production', 'compliance', 'maintenance'
    condition_expression TEXT NOT NULL,
    evaluation_frequency VARCHAR(50), -- 'realtime', 'hourly', 'daily'
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'critical'
    notification_template_id UUID REFERENCES notification_templates(template_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Alert History
CREATE TABLE alert_history (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id UUID REFERENCES alert_rules(alert_rule_id),
    alert_type VARCHAR(50),
    severity VARCHAR(20),
    title VARCHAR(255),
    message TEXT,
    triggered_by UUID REFERENCES users(user_id),
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(user_id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);
```

#### 2.2.14 Master Data Management (MDM)

```sql
-- MDM Data Stewardship
CREATE TABLE data_stewards (
    steward_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    user_id UUID NOT NULL REFERENCES users(user_id),
    domain_type VARCHAR(50) NOT NULL, -- 'product', 'customer', 'supplier', 'material'
    domain_id UUID, -- Specific domain instance
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Data Lineage
CREATE TABLE data_lineage (
    lineage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(50) NOT NULL,
    source_entity VARCHAR(100) NOT NULL,
    source_id VARCHAR(255) NOT NULL,
    target_system VARCHAR(50) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    transformation_rule TEXT,
    last_sync_at TIMESTAMPTZ,
    sync_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Data Synchronization Log
CREATE TABLE md_sync_log (
    sync_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(50) NOT NULL,
    source_system VARCHAR(50),
    target_system VARCHAR(50),
    status VARCHAR(50),
    error_message TEXT,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Detailed Workflow Descriptions

### 3.1 Customer to Cash (Order Fulfillment)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CUSTOMER TO CASH WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Quote  │───>│  Sales  │───>│Inventory│───>│Picking & │───>│Shipping │  │
│  │ Request │    │  Order  │    │Allocation│   │ Packing │    │         │  │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘  │
│       │              │              │              │              │        │
│       v              v              v              v              v        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Quote  │    │Credit   │    │  Batch  │    │  Print  │    │  Ship   │  │
│  │ Approval│    │Check    │    │ Release │    │ Labels  │    │Confirm  │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘  │
│                                                                   │        │
│                                                   ┌───────────────┘        │
│                                                   v                        │
│                                            ┌─────────────┐                 │
│                                            │  Invoice   │                 │
│                                            │ Generation │                 │
│                                            └──────┬──────┘                 │
│                                                   │                        │
│                                                   v                        │
│                                            ┌─────────────┐                 │
│                                            │  Revenue    │                 │
│                                            │ Recognition│                 │
│                                            └─────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Quote Request Processing**
   - Customer submits RFQ via portal/email/EDI
   - System captures customer, product requirements, quantity, requested delivery
   - Automated pricing calculation based on customer tier, volume, contracts
   - Quote approval workflow (for high-value quotes)
   - Quote validity period management
   - Quote-to-order conversion tracking

2. **Sales Order Entry**
   - Order validation (customer status, credit limit, product availability)
   - Multi-address shipping (split shipments)
   - Order configuration (product variants, kitting)
   - Pricing verification and discounts
   - Credit check integration
   - Order confirmation generation

3. **Inventory Allocation**
   - Real-time inventory checking across warehouses
   - Lot/serial number selection (FIFO, FEFO, specific lot)
   - Allocation rules based on customer priority, shipping location
   - Backorder management
   - Reservation creation with expiration

4. **Picking and Packing**
   - Wave management (group orders for efficient picking)
   - Pick list generation based on warehouse zone/location
   - Barcode scanning for pick verification
   - Weight verification for shipping accuracy
   - Packaging material selection
   - Label generation (product, shipping, UDI)

5. **Shipping**
   - Carrier integration and rate shopping
   - Shipping label generation
   - Shipment tracking integration
   - Temperature monitoring (for cold chain)
   - Proof of delivery capture
   - ASN (Advance Ship Notice) to customer

6. **Invoice Generation**
   - Automatic invoicing upon shipment
   - Invoice validation against sales order
   - Multi-currency support
   - Tax calculation and compliance
   - Invoice approval workflow

7. **Revenue Recognition**
   - Recognition rules based on revenue standards
   - Deferred revenue management
   - Financial posting integration

### 3.2 Procure to Pay

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROCURE TO PAY WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │Purchase  │    │  PO      │    │Goods     │    │Invoice   │              │
│  │Requisition│──>│ Approval │───>│Receipt   │───>│Matching  │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │               │                     │
│       v               v               v               v                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │Supplier  │    │  Send    │    │ QC       │    │ 3-Way    │              │
│  │Selection │    │   PO     │    │ Inspection│   │ Match    │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │               │                     │
│       └───────────────┴───────────────┴───────────────┘                     │
│                                           │                                   │
│                                           v                                   │
│                                    ┌─────────────┐                           │
│                                    │   Payment   │                           │
│                                    │  Processing │                           │
│                                    └─────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Purchase Requisition**
   - Material requirement identification (MRP, production orders, safety stock)
   - Requisition creation with justification
   - Budget validation
   - Approval workflow based on amount thresholds

2. **Supplier Selection**
   - Approved supplier list verification
   - RFQ to qualified suppliers
   - Price comparison and negotiation tracking
   - Supplier performance scoring
   - Contract compliance checking

3. **Purchase Order Management**
   - PO creation with terms, conditions, delivery schedule
   - Multi-line PO support (materials, services)
   - PO approval workflow (based on value, type)
   - PO amendment and cancellation
   - PO acknowledgement tracking

4. **Goods Receipt**
   - ASN (Advance Ship Notice) matching
   - Quantity and quality verification
   - Lot assignment and tracking
   - Hold for inspection flagging
   - Put-away direction to warehouse

5. **Quality Inspection**
   - Inspection lot creation based on QC plan
   - Sampling per AQL or 100% inspection
   - Test execution and result recording
   - Acceptance/rejection decision
   - Release to inventory or quarantine

6. **Invoice Processing**
   - Three-way matching (PO, Receipt, Invoice)
   - Variance detection and resolution
   - Invoice approval workflow
   - Payment terms tracking

7. **Payment Processing**
   - Payment scheduling based on terms
   - Payment method selection
   - Payment run execution
   - Bank reconciliation

### 3.3 Make to Stock (Production)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MAKE TO STOCK WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │Demand   │    │Production│    │Material │    │Production│   │ QC &    │  │
│  │Planning │───>│ Order   │───>│ Issue   │───>│ Execution│──>│ Release │  │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘  │
│       │              │              │              │              │        │
│       v              v              v              v              v        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐│
│  │  MPS    │    │  BOM    │    │Backflush│    │  Work   │    │Finished ││
│  │Generation│   │ Explosion│   │         │    │ Center  │    │ Goods   ││
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    │ Stock   ││
│                                                                  └────┬────┘│
│                                                                       │     │
│   ┌──────────────────────────────────────────────────────────────────┘     │
│   │                                                                      │
│   v                                                                      │
│  ┌─────────┐                                                              │
│  │ UDI      │                                                              │
│  │ Generation│                                                             │
│  └─────────┘                                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Demand Planning**
   - Statistical forecasting
   - Customer forecast integration
   - Safety stock calculation
   - Available-to-Promise (ATP) calculation
   - Master Production Schedule (MPS) generation

2. **Production Order Creation**
   - Rough-Cut Capacity Planning (RCCP)
   - Job scheduling (finite/infinite)
   - BOM explosion
   - Material requirements calculation
   - Work center load balancing

3. **Material Issue**
   - Pick list generation for materials
   - Lot/serial tracking from issue
   - Backflush from consumption
   - Material substitution handling
   - Shortage management

4. **Production Execution**
   - Operation scheduling on work centers
   - Time tracking (setup, run)
   - Scrap and rework recording
   - In-process quality checks
   - Non-conformance capture

5. **Quality Control and Release**
   - Final inspection per QC plan
   - Sampling and testing
   - Certificate of Analysis (CoA) generation
   - Batch release approval
   - Quarantine management for rejects

6. **Finished Goods Stocking**
   - Put-away to warehouse location
   - UDI assignment and registration
   - Inventory update
   - Shelf-life tracking

### 3.4 Quality Management Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       QUALITY MANAGEMENT WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│  │   Incoming   │    │   In-Process │    │    Final     │                │
│  │  Inspection  │───>│   QC         │───>│   Release    │                │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│         │                   │                   │                          │
│         v                   v                   v                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│  │ Supplier    │    │ In-process   │    │ Batch        │                │
│  │ Performance │    │ Monitoring   │    │ Certification│                │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│         │                   │                   │                          │
│         └───────────────────┴───────────────────┘                          │
│                             │                                              │
│                             v                                              │
│                    ┌────────────────┐                                      │
│                    │    NCR        │                                      │
│                    │ Management    │                                      │
│                    └───────┬────────┘                                      │
│                            │                                               │
│                            v                                               │
│                    ┌────────────────┐                                      │
│                    │    CAPA        │                                      │
│                    │ Management    │                                      │
│                    └────────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Incoming Inspection**
   - Inspection lot creation upon receipt
   - Sampling per QC plan (AQL, c=0)
   - Physical, chemical, microbiological testing
   - Specification conformance verification
   - Supplier quality performance tracking

2. **In-Process Quality Control**
   - Critical process parameters monitoring
   - In-process testing at defined stages
   - Statistical Process Control (SPC)
   - Process capability analysis
   - Clean room environmental monitoring

3. **Final Release**
   - Final product testing per specifications
   - Batch record review
   - Certificate of Analysis generation
   - Regulatory release (for Class IIb/III devices)
   - UDI finalization and registration

4. **Non-Conformance Management**
   - NCR creation with detailed description
   - Containment actions (isolation, hold)
   - Root cause investigation (5 Why, Fishbone)
   - Disposition decision (use as-is, rework, scrap)
   - Effectiveness verification

5. **CAPA Management**
   - CAPA initiation from NCR, complaint, audit
   - Root cause analysis validation
   - Corrective action implementation
   - Preventive action extension
   - Effectiveness check and closure

### 3.5 Document Control Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DOCUMENT CONTROL WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐│
│  │Document │───>│ Review  │───>│Approval │───>│ Release │───>│ Distri- ││
│  │ Creation│    │         │    │         │    │         │    │  bution ││
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘│
│       │              │              │              │              │     │
│       v              v              v              v              v     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐│
│  │ Draft   │    │ Review  │    │Electron-│    │ Effective│    │Training ││
│  │ Version │    │ Comments│    │  ic     │    │   Date   │    │ Required││
│  │         │    │         │    │Signature│    │   Set    │    │         ││
│  └─────────┘    └─────────┘    └────┬─────┘    └─────────┘    └─────────┘│
│                                           │                                 │
│                                           v                                 │
│                                    ┌─────────────┐                          │
│                                    │  Audit      │                          │
│                                    │  Trail      │                          │
│                                    └─────────────┘                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Document Creation**
   - New document request
   - Document type and category assignment
   - Draft creation with version control
   - Link to related documents

2. **Review Process**
   - Reviewer assignment based on document type
   - Review deadline tracking
   - Comment collection and resolution
   - Review cycle management

3. **Approval and Signature**
   - Approver assignment (role-based)
   - Electronic signature capture (21 CFR Part 11)
   - Signature verification
   - Audit trail generation

4. **Release**
   - Effective date setting
   - Supersession of previous version
   - Controlled copy distribution
   - Document library update

5. **Training and Acknowledgment**
   - Training requirement assignment
   - Training completion tracking
   - Acknowledgment recording

6. **Revision and Obsolescence**
   - Change request initiation
   - Revision cycle
   - Obsolete document handling
   - Retention management

### 3.6 Supplier Quality Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SUPPLIER QUALITY MANAGEMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│  │Supplier  │    │Supplier  │    │ Supplier │    │ Ongoing  │           │
│  │Qualifi-  │───>│ Audits   │───>│Performance│──>│ Monitoring│           │
│  │cation    │    │          │    │  Rating  │    │          │           │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘           │
│       │               │               │               │                   │
│       v               v               v               v                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│  │Approved  │    │  Audit   │    │ Scorecard│    │  SCAR    │           │
│  │Supplier  │    │ Findings │    │ Analysis │    │ (if      │           │
│  │List      │    │ Resolution│   │          │    │ needed)  │           │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Steps:**

1. **Supplier Qualification**
   - Initial supplier questionnaire
   - Document collection (certifications, licenses)
   - Capability assessment
   - Sample evaluation

2. **Supplier Audits**
   - Audit scheduling (initial, routine, special)
   - Audit execution and findings
   - CAPA requirement if findings
   - Follow-up verification
   - Audit history maintenance

3. **Performance Rating**
   - Quality performance (defect rate, rejections)
   - Delivery performance (on-time, complete)
   - Cost performance (price competitiveness)
   - Technical support rating
   - Overall composite score

4. **Ongoing Monitoring**
   - Monthly/quarterly scorecards
   - Trend analysis
   - Periodic review meetings
   - Continuous improvement initiatives

5. **SCAR (Supplier Corrective Action Request)**
   - SCAR initiation for quality issues
   - Root cause analysis by supplier
   - Corrective action review
   - Effectiveness verification

---

## 4. Regulatory Compliance Features

### 4.1 Audit Trail Requirements (21 CFR Part 11)

| Requirement | Implementation |
|-------------|----------------|
| Computer-generated, time-stamped audit trails | All entity changes recorded with timestamp, user, old/new values |
| Record changes cannot obscure previous entries | Immutable audit records, full history retained |
| Audit trail availability for agency review | Exportable audit reports, retention per regulations |
| System security and access controls | RBAC, session management, IP tracking |
| Electronic signatures | Password + hash, non-repudiation token, meaning captured |

### 4.2 UDI (Unique Device Identification) Compliance

| UDI Component | Implementation |
|---------------|----------------|
| UDI-DI (Device Identifier) | Product-level unique identifier |
| UDI-PI (Production Identifier) | Lot number, serial number, expiration date |
| UDI Labeling | GS1/HIBC format support |
| UDI Database Registration | EUDAMED, FDA GUDID integration |
| Traceability | Full forward/backward lot traceability |

### 4.3 Electronic Signatures (21 CFR Part 11)

- Linked to electronic records
- Unique to individual
- Password protected
- Signature meaning captured (approve, review, etc.)
- Signature date/time captured
- Non-repudiation via hash

---

## 5. System Architecture Recommendations

### 5.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js / Python / Java (Spring Boot) |
| Database | PostgreSQL (with JSONB support) |
| Frontend | React / Vue.js |
| API | REST + GraphQL |
| Search | Elasticsearch |
| Cache | Redis |
| Message Queue | RabbitMQ / Apache Kafka |
| Container | Docker / Kubernetes |

### 5.2 Integration Points

| System | Integration Method |
|--------|-------------------|
| ERP (SAP/Oracle) | EDI, API |
| CRM (Salesforce) | REST API |
| LMS (Training) | SCORM, API |
| QMS (Existing) | API, File Exchange |
| Regulatory (EUDAMED) | API, XML |
| FDA (GUDID) | API |

---

## 6. Implementation Phases

### Phase 1: Foundation (Weeks 1-8)
- Master Data Management
- User Management & RBAC
- Audit Trail Infrastructure
- Document Management

### Phase 2: Core Operations (Weeks 9-20)
- Inventory Management
- Warehouse Management
- Procurement
- Production Planning

### Phase 3: Quality & Compliance (Weeks 21-32)
- Quality Control
- Non-Conformance
- CAPA
- Complaint Management

### Phase 4: Integration & Reporting (Weeks 33-44)
- BI & Reporting
- System Integrations
- Regulatory Reporting

### Phase 5: Validation & Go-Live (Weeks 45-52)
- User Acceptance Testing
- IQ/OQ/PQ
- Training
- Go-Live

---

## 7. Key Success Metrics

| Metric | Target |
|--------|--------|
| Audit Trail Completeness | 100% |
| UDI Compliance | 100% |
| Lot Traceability | 100% forward/backward |
| Customer Complaint Closure | < 30 days |
| Supplier Quality Score | > 90% |
| OEE (Overall Equipment Effectiveness) | > 85% |
| On-Time Delivery | > 98% |
| Inventory Accuracy | > 99% |

---

*Document prepared for AI coding agent. All schema and workflows based on Requirement.pdf specifications.*
