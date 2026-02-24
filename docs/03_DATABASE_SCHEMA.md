> **Note:** This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` for the original unified source.

# Database Schema

---

## 1) Global Conventions

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

- Every status change must write `audit_event`
- Any approval action must require `electronic_signature` and reason/comment
- Every inventory movement must create immutable `inventory_txn` records
- Every lot/serial shipment must preserve genealogy links

---

## 2) Security, Workflow, and Audit Schema (Entities 1--20)

1. `tenant` - code, name, default_currency_code, timezone
2. `legal_entity` - tenant_id FK, code, name, tax_id, country
3. `site` - legal_entity_id FK, code, name, address
4. `department` - site_id FK, code, name, manager_user_id
5. `user_account` - username, display_name_zh, display_name_en, email, mobile, status
6. `role` - code, name, description
7. `permission` - resource, action, scope
8. `user_role` - user_id FK, role_id FK, effective_from, effective_to
9. `role_permission` - role_id FK, permission_id FK
10. `approval_policy` - doc_type, site_id, amount_min, amount_max, active_flag
11. `approval_policy_step` - approval_policy_id FK, step_no, approver_role_id, approver_user_id NULL, required_flag, allow_override_by_role_id
12. `workflow_instance` - doc_type, doc_id, status (draft/submitted/in_approval/approved/rejected/cancelled), current_step_no
13. `workflow_task` - workflow_instance_id FK, step_no, assignee_user_id, decision, decision_at, comment
14. `electronic_signature` - workflow_task_id FK, signed_by, signed_at, signature_method, signature_hash, reason_code
15. `notification_template` - code, channel (inapp/email/feishu/webhook), subject_tpl, body_tpl
16. `notification_message` - template_id FK, recipient_user_id, status, sent_at, payload_json
17. `integration_endpoint` - system_code, endpoint_url, auth_type, secret_ref, enabled_flag
18. `integration_event` - event_type, entity_type, entity_id, payload_json, status, retry_count, last_error
19. `audit_event` - entity_type, entity_id, action (create/update/submit/approve/reject/override/post), before_json, after_json, change_reason, event_at, event_by, ip_address, user_agent, event_hash, prev_event_hash
20. `audit_field_change` - audit_event_id FK, field_name, old_value, new_value

---

## 3) Master Data Schema (Entities 21--39)

21. `currency` - code PK, name, decimal_places, active_flag
22. `exchange_rate` - from_currency_code, to_currency_code, rate_type, rate, effective_date
23. `uom` - code, name_zh, name_en, category
24. `uom_conversion` - item_id FK, from_uom, to_uom, factor
25. `item_category` - parent_id NULL, category_level (major/minor), code, name_zh, name_en
26. `risk_level` - code, name_zh, name_en, severity_score
27. `item` - item_no, item_type (raw/semi/finished/service/tooling), category_id, default_uom, sourcing_type (purchase/make/subcontract), risk_level_id, active_flag
28. `item_revision` - item_id FK, revision_code, revision_status (draft/released/obsolete), effective_from, effective_to, is_current, lifecycle_stage (rd/pilot/mass_production)
29. `temp_formal_part_map` - temp_item_id, temp_revision_id, formal_item_id, formal_revision_id, conversion_reason, approved_change_id
30. `item_substitute` - item_id, revision_id, substitute_item_id, substitute_revision_id, priority, effective_from, effective_to, approval_required_flag
31. `supplier` - supplier_code, name_zh, name_en, payment_terms, currency_code, status
32. `supplier_site` - supplier_id FK, site_code, address, contact_name, contact_phone, email
33. `supplier_item` - supplier_id, item_id, supplier_part_no, lead_time_days, moq, price, currency_code
34. `customer` - customer_code, name_zh, name_en, status
35. `warehouse` - site_id, warehouse_code, name, warehouse_type
36. `warehouse_location` - warehouse_id, location_code, location_type (raw/wip/fg/quarantine/subcontract), pick_sequence
37. `safety_stock_policy` - item_id, revision_id, warehouse_id, min_qty, reorder_qty, first_alert_offset_days, repeat_interval_days, active_flag
38. `custom_field_definition` - entity_type, field_key, field_label_zh, field_label_en, data_type, is_required, is_searchable, options_json
39. `custom_field_value` - entity_type, entity_id, field_key, value_text, value_number, value_date, value_json

**Indexes required:**

- Fulltext or btree index on searchable custom fields per entity
- Composite index: `(entity_type, field_key, value_*)`

---

## 4) PLM / BOM / Engineering Change Schema (Entities 40--51)

40. `project` - project_code, name, project_type (rd/npi/improvement), start_date, target_end_date, status
41. `project_milestone` - project_id, milestone_code, name, planned_date, actual_date, status
42. `document` - doc_no, doc_type, title_zh, title_en, owner_dept_id, security_level, status
43. `document_revision` - document_id, revision_code, file_uri, checksum, released_flag, effective_from, obsolete_at
44. `document_link` - document_revision_id, entity_type, entity_id, link_role (spec/drawing/work_instruction/quality_plan)
45. `bom_header` - parent_item_id, parent_revision_id, bom_code, status, version_note
46. `bom_line` - bom_header_id, line_no, component_item_id, component_revision_id, qty_per, uom, scrap_rate, sourcing_type, is_critical_component, module_code, is_optional
47. `bom_line_substitute` - bom_line_id, substitute_item_id, substitute_revision_id, priority
48. `engineering_change_request` (ECR) - ecr_no, change_type (item/bom/process/doc), title, description, impact_level, status, project_id
49. `engineering_change_impact` - ecr_id, entity_type, entity_id, impact_action (add/revise/replace/obsolete), from_revision_id, to_revision_id
50. `engineering_change_order` (ECO) - eco_no, source_ecr_id, implementation_date, status, auto_propagate_parent_revision_flag
51. `eco_parent_revision_update` - eco_id, child_item_id, child_from_rev, child_to_rev, parent_item_id, parent_from_rev, parent_to_rev, update_mode (auto/manual_override)

---

## 5) Procurement Schema (Entities 52--63)

52. `purchase_requisition` - pr_no, request_dept_id, requester_id, currency_code, required_date, status, priority, reason
53. `purchase_requisition_line` - pr_id, line_no, item_id, revision_id, req_qty, uom, need_by_date, estimated_price, warehouse_id, project_id, risk_level_id
54. `supplier_rfq` - rfq_no, pr_id, issue_date, status
55. `supplier_rfq_line` - rfq_id, line_no, pr_line_id, item_id, revision_id, qty, uom
56. `supplier_quotation` - quotation_no, rfq_id, supplier_id, quote_date, currency_code, valid_until, status
57. `supplier_quotation_line` - quotation_id, line_no, item_id, revision_id, unit_price, lead_time_days, moq, incoterm, selected_flag
58. `purchase_order` - po_no, supplier_id, site_id, currency_code, order_date, status, source_pr_id, approval_workflow_id
59. `purchase_order_line` - po_id, line_no, item_id, revision_id, order_qty, uom, unit_price, tax_rate, need_by_date, source_pr_line_id, source_quote_line_id
60. `po_change_log` - po_id, change_seq, change_type, change_note, changed_by, changed_at
61. `goods_receipt` - gr_no, supplier_id, po_id, receipt_date, status, warehouse_id
62. `goods_receipt_line` - gr_id, line_no, po_line_id, received_qty, accepted_qty, rejected_qty, lot_no, mfg_date, exp_date, inspection_required_flag
63. `supplier_invoice` - invoice_no, supplier_id, invoice_date, currency_code, status, linked_po_id, linked_subcontract_fee_id

---

## 6) Inventory, Warehouse, and Material Movement Schema (Entities 64--80)

64. `inventory_lot` - lot_no, item_id, revision_id, supplier_id NULL, mfg_date, exp_date, qa_status, trace_status
65. `inventory_serial` - serial_no, item_id, revision_id, lot_id, status
66. `inventory_balance` - item_id, revision_id, warehouse_id, location_id, lot_id, on_hand_qty, allocated_qty, available_qty
67. `inventory_txn` - txn_no, txn_type (receipt/issue/transfer/adjust/subcontract_issue/subcontract_return/production_issue/production_receipt/sales_issue), txn_date, item_id, revision_id, warehouse_id, from_location_id, to_location_id, lot_id, serial_id, qty, uom, unit_cost, doc_type, doc_id, doc_line_id, posted_flag
68. `material_issue_notice` - notice_no, source_doc_type, source_doc_id, warehouse_id, status, approved_by_warehouse, gm_override_flag, gm_override_reason
69. `material_issue_notice_line` - notice_id, line_no, item_id, revision_id, required_qty, issued_qty, lot_control_required
70. `material_issue_request` - request_no, source_doc_type, source_doc_id, request_mode (detail/summary_batch), status
71. `material_issue_request_line` - request_id, line_no, item_id, revision_id, requested_qty, merged_from_line_ids_json
72. `material_outbound_note` - outbound_no, warehouse_id, issue_date, status, source_notice_id
73. `stock_transfer_order` - transfer_no, from_warehouse_id, to_warehouse_id, status, reason
74. `stock_transfer_line` - transfer_id, line_no, item_id, revision_id, qty, lot_id
75. `material_demand_request` - demand_no, request_dept_id, status, required_date, reason
76. `material_demand_request_line` - demand_id, line_no, item_id, revision_id, qty, uom
77. `cycle_count_plan` - plan_no, warehouse_id, count_type (quarterly/yearly/ad_hoc), planned_start, planned_end, status
78. `cycle_count_task` - plan_id, item_id, revision_id, location_id, system_qty, counted_qty, variance_qty, status
79. `inventory_adjustment` - adjust_no, warehouse_id, reason_code, status, approved_by
80. `inventory_adjustment_line` - adjust_id, line_no, item_id, revision_id, lot_id, adjust_qty, unit_cost

---

## 7) Subcontracting and Production Schema (Entities 81--93)

81. `subcontract_order` - sco_no, supplier_id, site_id, status, planned_start, planned_end, linked_project_id
82. `subcontract_order_line` - sco_id, line_no, item_id, revision_id, order_qty, uom, source_bom_id
83. `subcontract_material_issue` - sco_id, issue_doc_no, issue_date, status
84. `subcontract_material_issue_line` - issue_id, line_no, item_id, revision_id, qty, lot_id
85. `subcontract_receipt` - sco_id, receipt_no, receipt_date, status
86. `subcontract_receipt_line` - receipt_id, line_no, item_id, revision_id, received_qty, accepted_qty, rejected_qty, lot_no
87. `subcontract_fee_statement` - fee_no, supplier_id, period_start, period_end, currency_code, status, total_amount
88. `subcontract_fee_line` - fee_id, line_no, sco_line_id, service_qty, unit_fee, amount, reconciliation_status
89. `work_order` - wo_no, item_id, revision_id, order_qty, uom, planned_start, planned_end, status, project_id
90. `work_order_module` - wo_id, module_code, required_flag, ready_flag, ready_checked_at
91. `work_order_material` - wo_id, line_no, item_id, revision_id, required_qty, issued_qty, shortage_qty, sourcing_type
92. `work_order_operation` - wo_id, op_seq, work_center, operation_name, status, actual_start, actual_end
93. `production_receipt` - receipt_no, wo_id, receipt_date, item_id, revision_id, received_qty, lot_no, status

---

## 8) Quality and Medical-Device Traceability Schema (Entities 94--103)

94. `inspection_plan` - plan_code, inspection_type (incoming/in_process/final), item_id, revision_id, sampling_rule, active_flag
95. `inspection_record` - record_no, inspection_type, source_doc_type, source_doc_id, item_id, revision_id, lot_id, sample_qty, pass_qty, fail_qty, result, status
96. `inspection_defect` - inspection_record_id, defect_code, defect_desc, severity, qty
97. `nonconformance` - nc_no, source_inspection_id, item_id, revision_id, lot_id, disposition (rework/scrap/return/use_as_is), status
98. `capa` - capa_no, source_nc_id, root_cause, corrective_action, preventive_action, owner_id, due_date, status
99. `trace_genealogy` - relation_type (consumes/produces/assembled_into/shipped_in), parent_entity_type, parent_entity_id, child_entity_type, child_entity_id, qty
100. `device_history_record` (DHR) - dhr_no, finished_item_id, finished_revision_id, finished_lot_id, serial_no, wo_id, final_inspection_id, release_status
101. `shipment` - shipment_no, customer_id, shipment_date, status, sales_order_ref
102. `shipment_line` - shipment_id, line_no, item_id, revision_id, qty, uom, lot_id, serial_no
103. `shipment_trace_link` - shipment_line_id, component_item_id, component_revision_id, component_lot_id, component_serial_no, source_wo_id

---

## 9) Finance and Costing Schema (Entities 104--109)

104. `cost_center` - code, name, dept_id
105. `cost_element` - code, name, type (material/labor/overhead/subcontract)
106. `cost_transaction` - txn_date, item_id, revision_id, lot_id, cost_element_id, qty, amount, currency_code, source_doc_type, source_doc_id
107. `cost_rollup` - item_id, revision_id, effective_date, material_cost, labor_cost, overhead_cost, subcontract_cost, total_cost
108. `ap_reconciliation` - recon_no, supplier_id, period_start, period_end, status, difference_amount
109. `finance_posting_queue` - source_doc_type, source_doc_id, posting_status, attempts, last_error, posted_at

---

## 10) Critical Constraints and Indexes

### Must-have constraints

- Unique business keys (`*_no`, `item_no`, `lot_no`, `serial_no`) per tenant
- `item_revision`: unique `(item_id, revision_code)`
- `bom_line`: unique `(bom_header_id, line_no)`
- `workflow_task`: unique `(workflow_instance_id, step_no, assignee_user_id)`
- `inventory_balance`: unique `(item_id, revision_id, warehouse_id, location_id, lot_id)`

### Must-have indexes

- Document state queries: `(status, updated_at)`
- Traceability: `(lot_id)`, `(serial_no)`, `(item_id, revision_id, lot_id)`
- Workflow inbox: `(assignee_user_id, decision, step_no)`
- Custom search: `(entity_type, field_key, value_text)`
- Audit lookup: `(entity_type, entity_id, event_at)`
