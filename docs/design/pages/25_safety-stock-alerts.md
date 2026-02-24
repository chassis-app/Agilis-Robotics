# Screen Prompt: Safety Stock Alert Dashboard

## Screen ID
`INV-SAFETY-STOCK`

## Route
`/inventory/safety-stock-alerts`

## Purpose
Monitor and manage safety stock alerts. Configure alert policies per item/warehouse with threshold quantities, reorder quantities, and reminder schedules. View active alerts and take replenishment action.

## Workflows
WF-12 (Safety Stock Alerting and Periodic Reminders)

## Requirements
RQ-026 (configurable threshold + reminder cycle)

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Inventory > Safety Stock Alerts                          |
| Safety Stock Alerts                          [Manage Policies ⚙]    |
+---------------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+                  |
| | Active   | | Critical | | Items    | | Alerts   |                  |
| | Alerts   | | (<50%)   | | Needing  | | Ack'd    |                  |
| | 23       | | 8 🔴     | | Reorder  | | Today    |                  |
| |          | |          | | 15       | | 5        |                  |
| +----------+ +----------+ +----------+ +----------+                  |
+---------------------------------------------------------------------+
| [Tabs: Active Alerts | Acknowledged | Policy Management]             |
+---------------------------------------------------------------------+
```

## Tab: Active Alerts

```
+---------------------------------------------------------------------+
| [🔍 Search item] [Warehouse ▼] [Severity ▼] [Sort: Severity ▼]    |
+---------------------------------------------------------------------+
| Item          | Rev | WH    | Available | Threshold | Shortage |     |
|               |     |       |           |           |          |     |
| Alert Since   | Reminders Sent | Last Reminder | Actions           |
+---------------+-----+-------+-----------+-----------+----------+-----+
| Widget-A      | B   | WH-01 | 65        | 100       | 35       |     |
| (传感器A)     |     |       |           |           |          |     |
| 2024-03-10    | 3          | 03-15         | [Ack] [Create PR] [⋮]|
+---------------+-----+-------+-----------+-----------+----------+-----+
| Part-P        | A   | WH-02 | 10        | 50        | 40       |     |
| (零件P)       |     |       |           |           | 🔴 Crit  |     |
| 2024-03-08    | 5          | 03-14         | [Ack] [Create PR] [⋮]|
+---------------+-----+-------+-----------+-----------+----------+-----+
```

### Alert Row Features
- Severity indicator:
  - Critical (red): available < 50% of threshold
  - Warning (amber): available < threshold but >= 50%
  - Info (blue): first alert (day 0)
- Progress bar showing available vs threshold ratio
- Reminder count and last reminder date
- Actions:
  - [Acknowledge] — marks as seen (does not close alert)
  - [Create PR] — navigates to PR creation with item pre-filled
  - Overflow: [View Policy] [View Stock History] [Snooze 7 days]

## Tab: Acknowledged

Same table structure but showing acknowledged alerts. Alert auto-closes when available qty >= threshold.

## Tab: Policy Management

Admin view for configuring safety stock policies:

```
+---------------------------------------------------------------------+
| Safety Stock Policies                         [+ Create Policy]      |
+---------------------------------------------------------------------+
| [🔍 Search item] [Warehouse ▼] [Active only ☑]                    |
+---------------------------------------------------------------------+
| Item       | Rev | WH    | Threshold | Reorder | Alert  | Repeat   |
|            |     |       | Qty       | Qty     | Offset | Interval |
|            |     |       |           |         | (days) | (days)   |
| Active | Actions                                                    |
+------------+-----+-------+-----------+---------+--------+----------+
| Widget-A   | B   | WH-01 | 100       | 200     | 0      | 5        |
| ✓ Active   | [Edit] [Deactivate]                                   |
+------------+-----+-------+-----------+---------+--------+----------+
| Sensor-B   | A   | WH-01 | 50        | 100     | 0      | 7        |
| ✓ Active   | [Edit] [Deactivate]                                   |
+------------+-----+-------+-----------+---------+--------+----------+
```

### Policy Create/Edit Form (Dialog)

| Field | Type | Required | Notes |
|---|---|---|---|
| Item | Searchable select | Yes | Item from item master |
| Revision | Select | No | Specific revision or "All revisions" |
| Warehouse | Select | Yes | Warehouse to monitor |
| Threshold Quantity | Number | Yes | Alert triggered when available < this |
| Reorder Quantity | Number | Yes | Suggested reorder amount |
| Alert Offset (days) | Number | Yes | 0 = immediate alert when below threshold |
| Repeat Interval (days) | Number | Yes | Reminder frequency (e.g., every 5 days) |
| Active | Toggle | Yes | Enable/disable policy |

## Interactions
- KPI card click filters alert list to that category
- [Create PR] pre-fills: item, revision, warehouse, quantity = reorder qty from policy
- Alert auto-resolution: scheduler checks daily; closes alert when qty >= threshold
- Notification channels: in-app + email + Feishu (per RQ-027)
