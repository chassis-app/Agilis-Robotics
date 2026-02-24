# Screen Prompt: Admin - System Configuration & Integration Settings

## Screen ID
`ADMIN-SYSTEM-CONFIG`

## Route
- System: `/admin/system-config`
- Integrations: `/admin/integrations`

## Purpose
Global system configuration including tenant settings, numbering sequences, localization, and integration endpoint management for Feishu and external systems.

## Workflows
WF-14 (integration configuration)

## Requirements
RQ-001 (bilingual configuration), RQ-027 (Feishu integration + finance integration)

## System Configuration Page

### Section: General Settings

| Setting | Type | Description |
|---|---|---|
| Tenant Name | Text | Organization name |
| Default Language | Select | 中文 / English |
| Default Currency | Select | RMB / USD |
| Date Format | Select | YYYY-MM-DD / DD/MM/YYYY |
| Timezone | Select | System timezone |
| Logo | File upload | Company logo for reports and UI |

### Section: Numbering Sequences

```
+---------------------------------------------------------------------+
| Document Numbering Templates                                         |
+---------------------------------------------------------------------+
| Document Type | Template           | Next Number | Preview           |
+---------------+--------------------+-------------+-------------------+
| PR            | PR-{YYYY}-{0000}   | 0049        | PR-2024-0049     |
| PO            | PO-{YYYY}-{0000}   | 0034        | PO-2024-0034     |
| WO            | WO-{YYYY}-{0000}   | 0062        | WO-2024-0062     |
| GRN           | GRN-{YYYY}-{0000}  | 0090        | GRN-2024-0090    |
| ECR           | ECR-{YYYY}-{0000}  | 0013        | ECR-2024-0013    |
| LOT           | LOT-{YYYY}-{0000}  | 0235        | LOT-2024-0235    |
| SC            | SC-{YYYY}-{0000}   | 0015        | SC-2024-0015     |
+---------------+--------------------+-------------+-------------------+
```

Each template editable with variables: `{YYYY}`, `{YY}`, `{MM}`, `{0000}` (zero-padded sequence), `{SITE}` (site code).

### Section: Warehouse Configuration

| Column | Content |
|---|---|
| Warehouse Code | Short code (e.g., WH-01) |
| Name | Full name |
| Site | Associated site |
| Type | Raw Material / WIP / Finished Goods / Quarantine / Subcontract |
| Active | Toggle |
| Locations | Count of storage locations |
| Actions | Edit, Manage Locations |

### Section: Audit Trail Settings

| Setting | Value |
|---|---|
| Hash Chain Algorithm | SHA-256 |
| Retention Period | 10 years (minimum, per regulatory) |
| Export Format | PDF / CSV |
| Chain Integrity Check | [Run Now] — verifies all hash chains |

## Integration Settings Page

### Feishu Integration (RQ-027)

```
+---------------------------------------------------------------------+
| Feishu Integration                                                   |
+---------------------------------------------------------------------+
| Status: ✓ Connected                           [Test Connection]     |
|                                                                      |
| Webhook URL: * [https://open.feishu.cn/open-apis/bot/v2/hook/...]   |
| App ID: * [cli_xxxxxxxxxxxx]                                        |
| App Secret: * [••••••••••••] [Show]                                 |
|                                                                      |
| Notification Templates:                                              |
| +---------------------------------------------------------------+   |
| | Event Type              | Template        | Enabled            |   |
| +-------------------------+-----------------+--------------------+   |
| | workflow.submitted       | Approval Request| ✓                 |   |
| | workflow.approved        | Approved Notice | ✓                 |   |
| | workflow.rejected        | Rejected Notice | ✓                 |   |
| | safety_stock.alert       | Stock Alert     | ✓                 |   |
| | quality.inspection.failed| QA Alert        | ✓                 |   |
| +-------------------------+-----------------+--------------------+   |
|                                                                      |
| Rich Message Preview:                                                |
| +---------------------------------------------------------------+   |
| | 📋 Approval Request                                            |   |
| | Document: PR-2024-0047                                         |   |
| | Submitted by: Zhang Wei                                        |   |
| | Items: Widget-A (100 pcs), Sensor-B (50 pcs)                 |   |
| | Total: ¥45,000.00                                             |   |
| | [View in ERP]                                                  |   |
| +---------------------------------------------------------------+   |
|                                                                      |
| [Save Settings]                                                      |
+---------------------------------------------------------------------+
```

### External Finance System

```
+---------------------------------------------------------------------+
| Finance System Integration                                           |
+---------------------------------------------------------------------+
| Status: ✓ Connected                           [Test Connection]     |
|                                                                      |
| API Endpoint: * [https://finance.api.company.com/v1]                |
| Authentication: * [OAuth 2.0 ▼]                                    |
| Client ID: * [finance_client_xxxx]                                  |
| Client Secret: * [••••••••••••] [Show]                              |
|                                                                      |
| Posting Configuration:                                               |
| ☑ Post inventory transactions                                      |
| ☑ Post AP reconciliation results                                   |
| ☑ Post cost transactions                                           |
| ☐ Post payroll (not configured)                                    |
|                                                                      |
| Retry Policy:                                                        |
| Max retries: [5]  Backoff: [Exponential ▼]  Initial delay: [30s]   |
|                                                                      |
| [Save Settings]                                                      |
+---------------------------------------------------------------------+
```

### Webhook Endpoints

```
+---------------------------------------------------------------------+
| Custom Webhook Endpoints                       [+ Add Endpoint]      |
+---------------------------------------------------------------------+
| Name            | URL                    | Events  | Status | Actions|
+-----------------+------------------------+---------+--------+--------+
| Backup Notify   | https://backup.co/hook | 3       | Active | [Edit] |
| Analytics       | https://bi.co/ingest   | 5       | Paused | [Edit] |
+-----------------+------------------------+---------+--------+--------+
```

Each endpoint: name, URL, auth type, subscribed events, active/paused toggle, test button.

## Footer
- All settings changes require confirmation dialog
- Sensitive fields (secrets, API keys) masked with show/hide toggle
- Audit trail on all configuration changes
