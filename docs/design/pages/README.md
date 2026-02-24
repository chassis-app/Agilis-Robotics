# Screen Prompts Index

This directory contains individual screen creation prompts for every page in the Agilis-Robotics ERP application. Each file provides a complete specification for building that screen, including layout, fields, interactions, workflow references, and requirement traceability.

## File Naming Convention

Files use numbered prefixes grouped by module:
- `00_` — Application shell (global components)
- `01-02_` — Home and cross-cutting views
- `10-15_` — Procurement module
- `20-25_` — Inventory module
- `30-32_` — Manufacturing module
- `40-44_` — Engineering module
- `50-52_` — Quality module
- `60_` — Sales module
- `70-72_` — Finance module
- `80-81_` — Reports
- `90-93_` — Admin module

## Page Index

### Global & Home
| File | Screen | Route |
|---|---|---|
| [00_app-shell.md](00_app-shell.md) | Application Shell | (wraps all pages) |
| [01_home-dashboard.md](01_home-dashboard.md) | Home Dashboard | `/` |
| [02_approval-inbox.md](02_approval-inbox.md) | Approval Inbox | `/approvals` |

### Procurement
| File | Screen | Route |
|---|---|---|
| [10_pr-list.md](10_pr-list.md) | Purchase Requisition List | `/procurement/purchase-requisitions` |
| [11_pr-detail.md](11_pr-detail.md) | PR Detail / Create / Edit | `/procurement/purchase-requisitions/:id` |
| [12_po-list.md](12_po-list.md) | Purchase Order List | `/procurement/purchase-orders` |
| [13_po-detail.md](13_po-detail.md) | PO Detail / Create / Edit | `/procurement/purchase-orders/:id` |
| [14_rfq-quotation.md](14_rfq-quotation.md) | RFQ & Quotation | `/procurement/rfq` |
| [15_goods-receipt.md](15_goods-receipt.md) | Goods Receipt (GRN) | `/procurement/goods-receipts` |

### Inventory
| File | Screen | Route |
|---|---|---|
| [20_stock-overview.md](20_stock-overview.md) | Stock Overview | `/inventory/stock` |
| [21_material-issue-notice.md](21_material-issue-notice.md) | Material Issue Notice | `/inventory/material-issue-notices` |
| [22_material-issue-request.md](22_material-issue-request.md) | Material Issue Request (Batch) | `/inventory/material-issue-requests` |
| [23_stock-transfers.md](23_stock-transfers.md) | Stock Transfers | `/inventory/transfers` |
| [24_cycle-count.md](24_cycle-count.md) | Cycle Count | `/inventory/cycle-counts` |
| [25_safety-stock-alerts.md](25_safety-stock-alerts.md) | Safety Stock Alerts | `/inventory/safety-stock-alerts` |

### Manufacturing
| File | Screen | Route |
|---|---|---|
| [30_work-order.md](30_work-order.md) | Work Order List & Detail | `/manufacturing/work-orders` |
| [31_subcontract-order.md](31_subcontract-order.md) | Subcontract Order | `/manufacturing/subcontract-orders` |
| [32_production-progress.md](32_production-progress.md) | Production Progress Dashboard | `/manufacturing/production-progress` |

### Engineering
| File | Screen | Route |
|---|---|---|
| [40_item-master.md](40_item-master.md) | Item Master | `/engineering/items` |
| [41_bom.md](41_bom.md) | Bill of Materials | `/engineering/bom` |
| [42_ecr-eco.md](42_ecr-eco.md) | ECR / ECO | `/engineering/ecr` |
| [43_documents.md](43_documents.md) | Document Management | `/engineering/documents` |
| [44_projects.md](44_projects.md) | Project Management | `/engineering/projects` |

### Quality
| File | Screen | Route |
|---|---|---|
| [50_inspections.md](50_inspections.md) | Inspections | `/quality/inspections` |
| [51_nonconformance-capa.md](51_nonconformance-capa.md) | Nonconformance & CAPA | `/quality/nonconformance` |
| [52_traceability.md](52_traceability.md) | Traceability Query | `/quality/traceability` |

### Sales
| File | Screen | Route |
|---|---|---|
| [60_sales-shipments.md](60_sales-shipments.md) | Sales Orders & Shipments | `/sales/orders` |

### Finance
| File | Screen | Route |
|---|---|---|
| [70_costing.md](70_costing.md) | Costing | `/finance/costing` |
| [71_ap-reconciliation.md](71_ap-reconciliation.md) | AP Reconciliation | `/finance/ap-reconciliation` |
| [72_integration-monitor.md](72_integration-monitor.md) | Integration Monitor | `/finance/integration-status` |

### Reports
| File | Screen | Route |
|---|---|---|
| [80_reports-operational.md](80_reports-operational.md) | Operational Dashboards | `/reports/operational` |
| [81_reports-compliance.md](81_reports-compliance.md) | Compliance Reports | `/reports/compliance` |

### Admin
| File | Screen | Route |
|---|---|---|
| [90_admin-users-roles.md](90_admin-users-roles.md) | Users & Roles | `/admin/users` |
| [91_admin-approval-policies.md](91_admin-approval-policies.md) | Approval Policies | `/admin/approval-policies` |
| [92_admin-custom-fields.md](92_admin-custom-fields.md) | Custom Fields | `/admin/custom-fields` |
| [93_admin-system-config.md](93_admin-system-config.md) | System Config & Integrations | `/admin/system-config` |

## Total: 28 screen prompts covering all 14 workflows and 27 requirements

## Workflow Coverage

| Workflow | Screens |
|---|---|
| WF-01 | 10, 11, 12, 13, 02 |
| WF-02 | 14, 13 |
| WF-03 | 15, 50 |
| WF-04 | 21 |
| WF-05 | 22 |
| WF-06 | 21, 23 |
| WF-07 | 31, 71 |
| WF-08 | 30, 32 |
| WF-09 | 42, 41 |
| WF-10 | 43 |
| WF-11 | 60, 52 |
| WF-12 | 25 |
| WF-13 | 24 |
| WF-14 | 72, 93 |

## Requirement Coverage

All 27 requirements (RQ-001 through RQ-027) are addressed across the screen prompts. See Appendix A of `docs/design/09_UIUX_DESIGN.md` for the full requirement-to-UI traceability matrix.
