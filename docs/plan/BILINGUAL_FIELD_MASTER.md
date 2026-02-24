# Bilingual Field Master (Chinese + English, Single Canonical Version)

## 1) Alignment Verdict
Chinese legacy field labels and English architecture fields are largely aligned in core ERP domains, but not fully identical.

Alignment result:
- `Aligned`: core master data, PR/PO, inventory, warehouse, subcontract, production, quality, BOM/ECO, approvals, traceability.
- `Partially aligned`: pricing dictionaries, finance dictionaries, and some legacy UI operation labels.
- `Merged in this master`: all Chinese fields now mapped to canonical English labels and keys; where no direct match existed, explicit extension keys are defined.

## 2) Canonical Naming Rules
- English canonical keys use `snake_case`.
- Chinese screen labels remain the display standard for CN users.
- One logical field can have many UI labels; one canonical key only.
- Legacy UI action labels are modeled as workflow actions/permissions, not business data columns.

## 3) Unified Dictionary

### 3.1 Base Setup, Master Navigation, and Dictionaries
| Chinese | English | Canonical key | Entity/Module | Status |
|---|---|---|---|---|
| 部门 | Department | `department` | Org master | aligned |
| 员工 | Employee/User | `user_account` | Security/HR | aligned |
| 往来单位 | Business Partner | `business_partner` | Master extension | aligned_extension |
| 计量单位 | Unit of Measure | `uom` | Master data | aligned |
| 存货 | Item/Inventory Item | `item` | Master data | aligned |
| 往来单位存货设置 | Partner-Item Setup | `partner_item_policy` | Procurement/Sales extension | aligned_extension |
| 序列号方案 | Serial Number Scheme | `serial_scheme` | Traceability | aligned_extension |
| 序列号解析生成规则 | Serial Parse/Generation Rule | `serial_parse_rule` | Traceability | aligned_extension |
| 条码方案 | Barcode Scheme | `barcode_scheme` | Warehouse/Label | aligned_extension |
| 电商商品 | E-commerce Item | `ecommerce_item_profile` | Sales extension | aligned_extension |
| 班组 | Team/Shift Group | `work_team` | Manufacturing | aligned_extension |
| 替代方案 | Substitute Strategy | `item_substitute` | BOM/Planning | aligned |
| 物料清单 | BOM | `bom_header` | PLM | aligned |
| 物料清单正向查询 | BOM Where-Used Forward | `bom_forward_query` | PLM query | aligned_extension |
| 物料清单反向查询 | BOM Reverse Where-Used | `bom_reverse_query` | PLM query | aligned_extension |
| 物料清单对比 | BOM Comparison | `bom_comparison` | PLM query | aligned_extension |
| 地区 | Region | `region` | Master extension | aligned_extension |
| 项目 | Project | `project` | PLM/Execution | aligned |
| 出入库类别 | Inventory In/Out Category | `inventory_io_category` | Inventory | aligned_extension |
| 业务类型 | Business Type | `business_type` | Transaction dictionary | aligned_extension |
| 配货仓库关系设置 | Allocation Warehouse Mapping | `allocation_warehouse_map` | Warehouse rules | aligned_extension |
| 物流网点 | Logistics Node | `logistics_node` | Logistics extension | aligned_extension |
| 不合格原因 | Nonconformance Reason | `nc_reason_code` | Quality | aligned |
| 收入 | Revenue Item | `revenue_item` | Finance extension | aligned_extension |
| 费用 | Expense Item | `expense_item` | Finance extension | aligned_extension |
| 科目 | Account | `gl_account` | Finance | aligned_extension |
| 凭证类别 | Voucher Type | `voucher_type` | Finance | aligned_extension |
| 常用凭证 | Common Voucher | `common_voucher_template` | Finance | aligned_extension |
| 常用摘要 | Common Description | `common_summary_template` | Finance | aligned_extension |
| 结算方式 | Settlement Method | `settlement_method` | Finance/AP/AR | aligned_extension |
| 币种 | Currency | `currency` | Finance | aligned |
| 现金流量项目 | Cash Flow Item | `cashflow_item` | Finance | aligned_extension |
| 资产属性 | Asset Attribute | `asset_attribute` | Asset mgmt extension | aligned_extension |
| 资产分类 | Asset Category | `asset_category` | Asset mgmt extension | aligned_extension |
| 增减方式 | Increase/Decrease Method | `asset_change_method` | Asset mgmt extension | aligned_extension |
| 使用状况 | Usage Status | `asset_usage_status` | Asset mgmt extension | aligned_extension |
| 处理原因 | Disposal Reason | `disposal_reason` | Asset/Inventory extension | aligned_extension |
| 存放位置 | Storage Position | `storage_position` | Warehouse location | aligned_extension |
| 经济用途 | Economic Purpose | `economic_purpose` | Finance/asset extension | aligned_extension |
| 进价设置导航 | Purchase Price Setup Nav | `purchase_price_setup_nav` | UI capability | aligned_extension |
| 进价带出策略 | Purchase Price Derivation Strategy | `purchase_price_strategy` | Procurement pricing | aligned_extension |
| 供应商价格本 | Supplier Price Book | `supplier_price_book` | Procurement pricing | aligned_extension |
| 供应商价格本调价单 | Supplier Price Adjustment | `supplier_price_adjustment` | Procurement pricing | aligned_extension |
| 采购价格查询 | Purchase Price Query | `purchase_price_query` | Reporting/query | aligned_extension |
| 采购价格波动分析表 | Purchase Price Volatility Report | `purchase_price_volatility_report` | Reporting | aligned_extension |
| 销价设置导航 | Sales Price Setup Nav | `sales_price_setup_nav` | UI capability | aligned_extension |
| 销价带出策略 | Sales Price Derivation Strategy | `sales_price_strategy` | Sales pricing | aligned_extension |
| 存货价格本 | Item Price Book | `item_price_book` | Pricing | aligned_extension |
| 存货价格本调价单 | Item Price Adjustment | `item_price_adjustment` | Pricing | aligned_extension |
| 存货效期价格本 | Shelf-life Price Book | `shelf_life_price_book` | Pricing | aligned_extension |
| 客户价格本 | Customer Price Book | `customer_price_book` | Sales pricing | aligned_extension |
| 客户价格本调价单 | Customer Price Adjustment | `customer_price_adjustment` | Sales pricing | aligned_extension |
| 客户折扣 | Customer Discount | `customer_discount` | Sales pricing | aligned_extension |
| 存货数量档位价格 | Quantity Tier Pricing | `quantity_tier_price` | Pricing | aligned_extension |
| 部门价格本 | Department Price Book | `department_price_book` | Pricing | aligned_extension |
| 销售价格查询 | Sales Price Query | `sales_price_query` | Reporting/query | aligned_extension |
| 销售价格波动分析表 | Sales Price Volatility Report | `sales_price_volatility_report` | Reporting | aligned_extension |
| 委外价设置导航 | Subcontract Price Setup Nav | `subcontract_price_setup_nav` | Subcontract pricing | aligned_extension |

### 3.2 Item and Inventory Master Fields
| Chinese | English | Canonical key |
|---|---|---|
| 存货分类 | Item Category | `item_category` |
| 序号 | Sequence No. | `line_no` |
| 存货编码 | Item Code | `item_no` |
| 存货名称 | Item Name (ZH default) | `item_name_zh` |
| 存货名称(英文) | Item Name (EN) | `item_name_en` |
| 助记码 | Mnemonic Code | `item_mnemonic_code` |
| 计价方式 | Costing Method | `costing_method` |
| 规格型号 | Specification/Model | `spec_model` |
| 所属类别 | Category | `category_id` |
| 基本信息 | Basic Info tab | `ui_tab_basic_info` |
| 库存信息 | Inventory Info tab | `ui_tab_inventory_info` |
| 条形码 | Barcode tab/field | `barcode` |
| 价格 | Price tab | `ui_tab_price` |
| 图片 | Image tab | `ui_tab_image` |
| 开票 | Invoicing tab | `ui_tab_invoicing` |
| 税率% | Tax Rate % | `tax_rate` |
| 品牌 | Brand | `brand` |
| 新品 | New Item Flag | `is_new_item` |
| 停用 | Inactive Flag | `inactive_flag` |
| 新品周期(天) | New-item Cycle (days) | `new_item_cycle_days` |
| 建档日期 | Record Creation Date | `record_created_date` |
| 体积(m³) | Volume (m3) | `volume_m3` |
| 重量(kg) | Weight (kg) | `weight_kg` |
| 产地 | Country/Place of Origin | `origin` |
| 自动生成项目档案 | Auto-generate Project Profile | `auto_create_project_profile` |
| 计量方式 | UOM Mode | `uom_mode` |
| 计量单位 | Primary UOM | `primary_uom` |
| 报表单位 | Reporting UOM | `report_uom` |
| 库存常用单位 | Default Inventory UOM | `default_inventory_uom` |
| 采购常用单位 | Default Purchase UOM | `default_purchase_uom` |
| 销售常用单位 | Default Sales UOM | `default_sales_uom` |
| 生产常用单位 | Default Production UOM | `default_production_uom` |
| 包装常用单位 | Default Packaging UOM | `default_packaging_uom` |
| 外购 | Purchased Flag | `is_purchased` |
| 销售 | Sellable Flag | `is_sellable` |
| 自制 | Manufactured Flag | `is_manufactured` |
| 生产耗用 | Production Consumption Flag | `is_production_consumable` |
| 委外 | Subcontract Flag | `is_subcontracted` |
| 虚拟件 | Phantom Item Flag | `is_phantom_item` |
| 劳务费用 | Service Cost Flag | `is_service_cost_item` |
| 电商 | E-commerce Flag | `is_ecommerce_item` |
| 存货描述 | Item Description | `item_description` |
| 配件版本号 | Component Revision No. | `component_revision_no` |
| 成品质量风险 | Finished Goods Quality Risk | `finished_goods_quality_risk` |
| 存货分类-枚举 | Item Category Enum | `item_category_enum` |
| 参考成本 | Reference Cost | `reference_cost` |
| 最新成本 | Latest Cost | `latest_cost` |
| 平均成本 | Average Cost | `average_cost` |
| 最低库存 | Minimum Stock | `min_stock_qty` |
| 最高库存 | Maximum Stock | `max_stock_qty` |
| 安全库存 | Safety Stock | `safety_stock_qty` |
| 标准周转天数 | Standard Turnover Days | `standard_turnover_days` |
| 需要检验 | Inspection Required | `inspection_required` |
| 来料入库检验 | Incoming Inspection Required | `incoming_inspection_required` |
| 来料检验方式 | Incoming Inspection Method | `incoming_inspection_method` |
| 来料抽检比例 | Incoming Sampling Ratio | `incoming_sampling_ratio` |
| 生产入库检验 | Production Receipt Inspection Required | `production_receipt_inspection_required` |
| 生产检验方式 | Production Inspection Method | `production_inspection_method` |
| 生产抽检比例 | Production Sampling Ratio | `production_sampling_ratio` |
| 委外入库检验 | Subcontract Receipt Inspection Required | `subcontract_receipt_inspection_required` |
| 委外检验方式 | Subcontract Inspection Method | `subcontract_inspection_method` |
| 委外抽检比例 | Subcontract Sampling Ratio | `subcontract_sampling_ratio` |
| 检验要求 | Inspection Requirement | `inspection_requirement` |
| 生产过程检验 | In-process Inspection Flag | `in_process_inspection_required` |
| 采购最小批量 | Purchase MOQ | `purchase_moq` |
| 生产委外最小批量 | Min Batch for Production/Subcontract | `production_subcontract_min_batch` |
| 生产委外批量倍量 | Production/Subcontract Batch Multiple | `production_subcontract_batch_multiple` |

### 3.3 Common Document Header and Line Fields
| Chinese | English | Canonical key |
|---|---|---|
| 单据日期 | Document Date | `doc_date` |
| 单据编号 | Document No. | `doc_no` |
| 部门 | Department | `department_id` |
| 业务员 | Sales/Business Owner | `owner_user_id` |
| 负责人 | Responsible Person | `responsible_user_id` |
| 经手人 | Handler | `handler_user_id` |
| 请购人 | Requisition Requester | `requester_user_id` |
| 领用人 | Material Receiver | `material_receiver_user_id` |
| 领料申请人 | Material Issue Applicant | `material_issue_requester_user_id` |
| 业务类型 | Business Type | `business_type` |
| 仓库 | Warehouse | `warehouse_id` |
| 生产车间 | Production Workshop | `workshop_id` |
| 委外供应商 | Subcontract Supplier | `supplier_id` |
| 客户 | Customer | `customer_id` |
| 结算客户 | Billing Customer | `billing_customer_id` |
| 需求日期 | Required Date | `required_date` |
| 到货地址 | Delivery Address | `delivery_address` |
| 预开工日 | Planned Start Date | `planned_start_date` |
| 预完工日 / 预计完工日 | Planned Completion Date | `planned_end_date` |
| 单据状态 | Document Status | `doc_status` |
| 明细 | Detail tab | `ui_tab_detail` |
| 汇总 | Summary tab | `ui_tab_summary` |
| 物料编码/存货编码 | Material/Item Code | `item_no` |
| 名称 | Name | `item_name` |
| 材料名称 | Material Name | `material_name` |
| 材料编码 | Material Code | `material_code` |
| 材料规格 | Material Spec | `material_spec` |
| 计量单位 | UOM | `uom` |
| 数量 | Quantity | `qty` |
| 单价 | Unit Price | `unit_price` |
| 含税单价 | Tax-inclusive Unit Price | `unit_price_tax_incl` |
| 金额 | Amount | `amount` |
| 税额 | Tax Amount | `tax_amount` |
| 含税金额 | Tax-inclusive Amount | `amount_tax_incl` |
| 批号 | Lot No. | `lot_no` |
| 来源单号 | Source Document No. | `source_doc_no` |
| 现存量 | On-hand Quantity | `on_hand_qty` |
| 现存量说明 | On-hand Quantity Note | `on_hand_note` |
| 预出仓库 | Planned Issue Warehouse | `planned_issue_warehouse_id` |
| 预入仓库 | Planned Receipt Warehouse | `planned_receipt_warehouse_id` |
| 材料倒冲方式 / 倒冲方式 | Backflush Method | `backflush_method` |
| 启用领料申请 | Enable Material Issue Request | `enable_material_issue_request` |
| 行中止 | Line Stop Flag | `line_stop_flag` |

### 3.4 Process-Specific Fields and Actions
| Chinese | English | Canonical key | Module |
|---|---|---|---|
| 销售订单号 | Sales Order No. | `sales_order_no` | PR/Planning |
| 存货图片 | Item Image | `item_image_uri` | Item/Docs |
| 出库类别 | Outbound Category | `outbound_category` | Warehouse |
| 项目 | Project | `project_id` | Cross-module |
| 需用数量 | Required Quantity | `required_qty` | Production/Subcontract |
| 计划数量 | Planned Quantity | `planned_qty` | Production/Subcontract |
| 适用BOM | Applicable BOM | `applicable_bom_id` | Production/Subcontract |
| BOM展开方式 | BOM Explosion Mode | `bom_explosion_mode` | Production/Subcontract |
| 生产单位 | Production UOM | `production_uom` | Production/Subcontract |
| 票据类型 | Invoice/Bill Type | `bill_type` | AP/Finance |
| 发票号 | Invoice No. | `invoice_no` | AP/Finance |
| 付款方式 | Payment Method | `payment_method` | AP/Finance |
| 付款到期日 | Payment Due Date | `payment_due_date` | AP/Finance |
| 产品编码 | Product Code | `product_code` | Production |
| 产品名称 | Product Name | `product_name` | Production |
| 退货原因 | Return Reason | `return_reason` | Sales outbound |
| 智能选单 | Smart Source-Doc Selection | `smart_doc_selection` | Sales/Warehouse UI |
| 转成采购订单 | Convert to Purchase Order | `action_convert_to_po` | Workflow action |
| 生成领料申请单 | Generate Material Issue Request | `action_generate_material_issue_request` | Workflow action |
| 生成委外发料单 | Generate Subcontract Issue Note | `action_generate_subcontract_issue_note` | Workflow action |
| 生成委外发料单(退料) | Generate Subcontract Return-Issue Note | `action_generate_subcontract_return_issue_note` | Workflow action |
| 生成成品报检单 | Generate Finished Goods Inspection Request | `action_generate_fg_inspection_request` | Workflow action |
| 生成委外入库单 | Generate Subcontract Receipt Note | `action_generate_subcontract_receipt_note` | Workflow action |
| 生成委外入库单(退库) | Generate Subcontract Return Receipt Note | `action_generate_subcontract_return_receipt_note` | Workflow action |
| 生成调拨单 | Generate Stock Transfer Order | `action_generate_stock_transfer` | Workflow action |
| 生成调拨单(分单) | Generate Split Stock Transfer | `action_generate_stock_transfer_split` | Workflow action |

### 3.5 Engineering and BOM Fields
| Chinese | English | Canonical key |
|---|---|---|
| 工程变更部门 | Engineering Change Department | `eco_department_id` |
| 工程变更人 | Engineering Change Requester | `eco_requester_user_id` |
| 变更类型 | Change Type | `change_type` |
| 变更原因 | Change Reason | `change_reason` |
| 变更内容 | Change Content | `change_content` |
| 变更影响类型 | Change Impact Type | `change_impact_type` |
| 变更状态 | Change Status | `change_status` |
| 备注 | Remark | `remark` |
| 文件变更明细 | File Change Detail | `file_change_detail` |
| 材料变更明细 | Material Change Detail | `material_change_detail` |
| 变更差异 | Change Delta | `change_delta` |
| 文件编码 | File Code | `document_code` |
| 文件名称 | File Name | `document_name` |
| 版本号 | Revision No. | `revision_no` |
| 工艺路线 | Routing | `routing_code` |
| 生产数量 | Production Quantity | `production_qty` |
| 默认BOM | Default BOM | `default_bom_flag` |
| BOM版本号 | BOM Revision No. | `bom_revision_no` |
| BOM层级 | BOM Level | `bom_level` |
| 总成本 | Total Cost | `total_cost` |
| 成本取值 | Cost Source/Rule | `cost_value_rule` |
| 子件编码 | Child Component Code | `child_item_code` |
| 子件名称 | Child Component Name | `child_item_name` |
| 子件BOM | Child BOM | `child_bom_id` |
| 需用数量 | Required Usage Quantity | `required_usage_qty` |
| 成品率% | Yield % | `yield_percent` |

### 3.6 Receiving/Inspection Menus and Quality Objects
| Chinese | English | Canonical key |
|---|---|---|
| 报检单 | Inspection Request | `inspection_request` |
| 到货单 | Arrival Note / Goods Receipt | `goods_receipt` |
| 成品报检单 | Finished Goods Inspection Request | `fg_inspection_request` |
| 检验单 | Inspection Record | `inspection_record` |
| 来料/成品检验单 | Incoming/FG Inspection Record | `incoming_fg_inspection_record` |
| 生产过程检验单 | In-process Inspection Record | `in_process_inspection_record` |
| 到货单执行表 | Receipt Execution Report | `receipt_execution_report` |
| 成品报检单执行表 | FG Inspection Execution Report | `fg_inspection_execution_report` |
| 质量统计分析表 | Quality Statistical Analysis Report | `quality_stat_analysis_report` |
| 检验单综合明细表 | Inspection Comprehensive Detail Report | `inspection_comprehensive_detail_report` |
| 检验单综合统计表 | Inspection Comprehensive Summary Report | `inspection_comprehensive_summary_report` |

### 3.7 Approval, Audit, and Toolbar Actions
| Chinese | English | Canonical key |
|---|---|---|
| 审核日期 | Approval Date | `approval_date` |
| 审批时长 | Approval Duration | `approval_duration` |
| 审批人 | Approver | `approver_user_id` |
| 审批情况 | Approval Result | `approval_result` |
| 单据状态(如: 已审) | Document State (e.g. Approved) | `doc_status` |
| 新增 | Create | `action_create` |
| 选单 | Select Source Doc | `action_select_doc` |
| 保存 | Save | `action_save` |
| 删除 | Delete | `action_delete` |
| 弃审 | Unapprove/Withdraw Approval | `action_unapprove` |
| 审核 | Approve | `action_approve` |
| 生单 | Generate Document | `action_generate_doc` |
| 变更 | Change/Revise | `action_change` |
| 工具 | Tools | `action_tools` |
| 联查 | Linked Inquiry/Trace | `action_linked_query` |
| 设置 | Settings | `action_settings` |
| 打印 | Print | `action_print` |
| 更多 | More | `action_more` |

### 3.8 Advanced Regulated Fields (Merged from Recommended Additions)
| Chinese | English | Canonical key |
|---|---|---|
| 物料主数据版本生命周期状态 | Item Master Lifecycle Status | `item_lifecycle_status` |
| 器械分类 | Device Class | `device_class` |
| UDI-DI, UDI-PI规则 | UDI DI/PI Rule | `udi_rule` |
| GMDN code / product family code | GMDN/Product Family Code | `gmdn_or_family_code` |
| 注册证号/备案号/国家地区适用性 | Registration/Filing/Country Applicability | `regulatory_registration_profile` |
| 无菌方式/灭菌批次规则 | Sterilization Method/Batch Rule | `sterilization_rule` |
| 有效期管理策略 | Shelf-life Policy | `shelf_life_policy` |
| 关键件标识 | Critical Component Flag | `critical_component_flag` |
| RoHS/REACH/生物相容性属性 | RoHS/REACH/Biocompatibility Attributes | `compliance_attributes` |
| 供应商批准状态 | Supplier Approval Status | `supplier_approval_status` |
| 供应商资质状态 | Supplier Qualification Status | `supplier_qualification_status` |
| 到期日 | Expiry Date | `expiry_date` |
| 审核结论 | Audit Conclusion | `audit_conclusion` |
| 供应商绩效评分 | Supplier Performance Score | `supplier_performance_score` |
| 报价有效期 | Quote Validity | `quote_valid_until` |
| 价格生效区间 | Price Effective Window | `price_effective_window` |
| MOQ/MPQ | MOQ/MPQ | `moq_mpq` |
| 交期承诺 | Lead-time Commitment | `lead_time_commitment` |
| 采购审批风险等级 | Procurement Approval Risk Level | `procurement_approval_risk_level` |
| 风险原因 | Risk Reason | `risk_reason` |
| 采购变更原因码 | Procurement Change Reason Code | `procurement_change_reason_code` |
| 工单批次号 | Work Order Batch No. | `wo_batch_no` |
| 工序号 | Operation No. | `operation_no` |
| 工位号 | Workstation No. | `workstation_no` |
| 班次 | Shift | `shift_code` |
| 操作员 | Operator | `operator_user_id` |
| 工艺配方版本 | Process Recipe Revision | `process_recipe_revision` |
| 作业指导书版本 | Work Instruction Revision | `work_instruction_revision` |
| 实际开工时间/完工时间 | Actual Start/End Time | `actual_start_end_time` |
| 停机原因 | Downtime Reason | `downtime_reason` |
| 报废原因 | Scrap Reason | `scrap_reason` |
| 关键过程参数记录字段 | CPP Record Fields | `cpp_record_fields` |
| 批记录电子签名链 | Batch E-signature Chain | `batch_esign_chain` |
| 检验计划版本 | Inspection Plan Revision | `inspection_plan_revision` |
| 抽样标准版本 | Sampling Standard Revision | `sampling_standard_revision` |
| 检验项目明细 | Inspection Characteristic Detail | `inspection_characteristic_detail` |
| 不合格处置结论 | Nonconformance Disposition | `nc_disposition` |
| CAPA编号 | CAPA No. | `capa_no` |
| 根因分类 | Root Cause Category | `root_cause_category` |
| 纠正/预防措施 | Corrective/Preventive Action | `corrective_preventive_action` |
| 截止日期 | Due Date | `due_date` |
| 偏差/变更/投诉关联号 | Deviation/Change/Complaint Link No. | `deviation_change_complaint_link_no` |
| DHR编号 | Device History Record No. | `dhr_no` |
| DMR编号 | Device Master Record No. | `dmr_no` |
| 序列号生成规则版本 | Serial Rule Revision | `serial_rule_revision` |
| 序列号状态 | Serial Status | `serial_status` |
| 母子件装配关系层级 | Parent-child Assembly Hierarchy | `assembly_hierarchy` |
| 发货行与组件批次映射明细 | Shipment-to-Component Lot Mapping | `shipment_component_lot_map` |
| 召回影响范围标识与召回批次号 | Recall Scope Marker and Recall Batch No. | `recall_scope_batch` |
| 创建人/时间 | Created By/At | `created_by_at` |
| 修改人/时间 | Updated By/At | `updated_by_at` |
| 最后审批人/时间 | Last Approver/At | `last_approver_at` |
| 审批意见 | Approval Comment | `approval_comment` |
| 驳回原因 | Rejection Reason | `rejection_reason` |
| override原因 | Override Reason | `override_reason` |
| 电子签名方式 | E-sign Method | `esign_method` |
| 签名哈希 | Signature Hash | `signature_hash` |
| 签名原因码 | Signature Reason Code | `signature_reason_code` |
| 事件哈希链 | Event Hash Chain | `event_hash_chain` |
| 客户端IP | Client IP | `client_ip` |
| 设备信息 | Device Info | `device_info` |
| 会话ID | Session ID | `session_id` |
| 成本中心 | Cost Center | `cost_center` |
| 成本要素 | Cost Element | `cost_element` |
| 订单归集号 | Order Collection No. | `order_collection_no` |
| 汇率类型 | Exchange Rate Type | `exchange_rate_type` |
| 汇率日期 | Exchange Rate Date | `exchange_rate_date` |
| 本位币金额 | Functional Currency Amount | `functional_currency_amount` |
| 标准成本/移动平均/实际成本标识 | Costing Method Flag | `costing_method_flag` |
| 委外费用对账差异原因 | Subcontract Fee Reconciliation Variance Reason | `subcontract_fee_recon_variance_reason` |
| 财务过账状态与失败重试计数 | Financial Posting Status and Retry Count | `finance_posting_status_retry_count` |
| 安全库存提醒策略ID | Safety Stock Alert Policy ID | `safety_stock_alert_policy_id` |
| 首次提醒时间 | First Alert Time | `first_alert_time` |
| 重复提醒间隔 | Repeat Alert Interval | `repeat_alert_interval` |
| 通知渠道偏好 | Notification Channel Preference | `notification_channel_preference` |
| 集成事件ID | Integration Event ID | `integration_event_id` |
| 幂等键 | Idempotency Key | `idempotency_key` |
| 重试次数 | Retry Count | `retry_count` |
| 最后错误 | Last Error | `last_error` |
| 外部系统回执号 | External Receipt No. | `external_receipt_no` |
| 外部系统回执时间 | External Receipt Time | `external_receipt_time` |

## 4) Gap Closure Notes (Now Unified)
Fields that were not explicit in the English blueprint/CLAUDE core but are now explicitly defined in this single version:
- Finance dictionaries: voucher/account/common summary/cash flow/asset dictionaries.
- Legacy price-book dictionary family and volatility reports.
- Legacy toolbar/system action labels.
- E-commerce item profile and warehouse allocation mapping dictionaries.

This file is the canonical bilingual field master for implementation, migration mapping, UI labels, and API contract dictionaries.
