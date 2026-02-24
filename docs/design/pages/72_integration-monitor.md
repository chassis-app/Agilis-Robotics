# Screen Prompt: Integration Monitor

## Screen ID
`FIN-INTEGRATION`

## Route
`/finance/integration-status`

## Purpose
Monitor real-time status of all system integrations: Feishu notifications, external finance system postings, and webhook deliveries. Manage dead-letter queue for failed events. Essential operations dashboard for system reliability.

## Workflows
WF-14 (Feishu and External Finance Integration)

## Requirements
RQ-027 (Feishu integration + finance integration)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Finance > Integration Status                             |
| Integration Monitor                               [Auto-refresh ⟳]  |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Events   | | Success  | | Failed   | | DLQ      |                  |
| | (24h)    | | Rate     | | (24h)    | | Depth    |                  |
| | 1,247    | | 99.2%    | | 10       | | 3        |                  |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| [Tabs: Event Log | Dead Letter Queue | Configuration]                |
+---------------------------------------------------------------------+
```

## Tab: Event Log

```
+---------------------------------------------------------------------+
| [🔍 Search] [Event Type ▼] [Target ▼] [Status ▼] [Date range]     |
+---------------------------------------------------------------------+
| Timestamp        | Event Type          | Target  | Status | Retries |
+------------------+---------------------+---------+--------+---------+
| 03-15 14:32:08   | workflow.approved    | Feishu  | ✓ Sent | 0      |
| 03-15 14:30:15   | safety_stock.alert   | Feishu  | ✓ Sent | 1      |
| 03-15 14:28:00   | inventory.txn.posted | Finance | ✗ Fail | 3      |
| 03-15 14:25:44   | workflow.submitted   | Feishu  | ✓ Sent | 0      |
+------------------+---------------------+---------+--------+---------+
```

Event types (from design spec event bus topics):
- `workflow.submitted` / `workflow.approved` / `workflow.rejected`
- `inventory.shortage.detected` / `inventory.transaction.posted`
- `engineering.eco.released`
- `quality.inspection.failed`
- `traceability.shipment.posted`
- `safety_stock.alert.triggered`

Target systems: Feishu, Finance, Webhook (external)

Statuses: Sent (green) / Pending (amber) / Failed (red) / DLQ (dark red)

### Event Detail (Expandable Row)

```
▼ 03-15 14:28:00 | inventory.txn.posted | Finance | Failed
+---------------------------------------------------------------------+
| Event ID: EVT-2024-0000891                                          |
| Created: 2024-03-15 14:28:00 UTC                                   |
| Target: External Finance System (https://finance.api/...)           |
| Retries: 3 of 5                                                     |
| Last Retry: 2024-03-15 14:35:00 UTC                                |
| Error: HTTP 503 Service Unavailable                                  |
|                                                                      |
| Payload Preview:                                                     |
| { "type": "inventory.txn.posted",                                   |
|   "doc_id": "GRN-2024-0089",                                       |
|   "amount": 45000.00, ... }                                        |
|                                                                      |
| [Retry Now] [Move to DLQ] [View Full Payload]                       |
+---------------------------------------------------------------------+
```

## Tab: Dead Letter Queue

Events that exceeded retry limits and require manual intervention:

```
+---------------------------------------------------------------------+
| Dead Letter Queue                                [Retry All] [Clear] |
+---------------------------------------------------------------------+
| Event ID       | Event Type          | Target  | Failed At | Error  |
+----------------+---------------------+---------+-----------+--------+
| EVT-0000891    | inventory.txn.posted| Finance | 03-15     | 503    |
| EVT-0000876    | workflow.approved   | Feishu  | 03-14     | Timeout|
| EVT-0000855    | safety_stock.alert  | Feishu  | 03-13     | 401    |
+----------------+---------------------+---------+-----------+--------+
```

Actions per event:
- [Retry] — re-queue for processing
- [View Payload] — inspect full event data
- [Mark Resolved] — manually acknowledge (e.g., handled out-of-band)
- [Delete] — permanently remove from DLQ (requires confirmation)

## Tab: Configuration

Integration endpoint management:

```
+---------------------------------------------------------------------+
| Integration Endpoints                         [+ Add Endpoint]       |
+---------------------------------------------------------------------+
| Name            | Type    | URL                    | Status | Actions|
+-----------------+---------+------------------------+--------+--------+
| Feishu Webhook  | Feishu  | https://feishu.cn/...  | Active | [Edit] |
| Finance API     | REST    | https://finance.api/.. | Active | [Edit] |
| Backup Notify   | Webhook | https://backup.co/...  | Paused | [Edit] |
+-----------------+---------+------------------------+--------+--------+
```

Endpoint configuration form:
- Name, Type (Feishu / REST / Webhook)
- URL, Authentication (API Key / OAuth / None)
- Subscribed event types (multi-select)
- Retry policy: max retries, backoff interval
- Active/Paused toggle
- [Test Connection] button

## Auto-Refresh
- Event log refreshes every 30 seconds
- KPI cards refresh every 15 seconds
- DLQ badge count shown in sidebar navigation
