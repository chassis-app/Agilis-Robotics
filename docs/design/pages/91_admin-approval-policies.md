# Screen Prompt: Admin - Approval Policies

## Screen ID
`ADMIN-APPROVAL`

## Route
`/admin/approval-policies`

## Purpose
Configure approval policies that determine routing rules for the two-level approval workflow. Define which document types require approval, amount thresholds, approver roles, and routing logic.

## Workflows
WF-01 (approval engine), All workflows with approval steps

## Requirements
RQ-005 (two-level approval), extensible policy engine

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Admin > Approval Policies                                |
| Approval Policies                              [+ Create Policy]     |
+---------------------------------------------------------------------+
| [🔍 Search] [Document Type ▼] [Active only ☑]                      |
+---------------------------------------------------------------------+
| Policy Name       | Doc Type | Threshold   | Levels | Status | Act. |
+-------------------+----------+-------------+--------+--------+------+
| Standard PR       | PR       | All amounts | 2      | Active | [Ed] |
| High-Value PR     | PR       | > ¥100,000  | 3      | Active | [Ed] |
| ECR Low Impact    | ECR      | Impact: Low | 1      | Active | [Ed] |
| ECR High Impact   | ECR      | Impact: High| 4      | Active | [Ed] |
| Standard PO       | PO       | All amounts | 2      | Active | [Ed] |
| Cycle Count Adj   | CycleAdj | All         | 1      | Active | [Ed] |
+-------------------+----------+-------------+--------+--------+------+
```

## Policy Detail / Create

### Policy Header

| Field | Type | Required | Notes |
|---|---|---|---|
| Policy Name | Text | Yes | Descriptive name |
| Document Type | Select | Yes | PR, PO, ECR, Material Issue, Cycle Count Adj, etc. |
| Active | Toggle | Yes | Only active policies are evaluated |
| Priority | Number | Yes | Higher priority policies evaluated first (for overlapping conditions) |

### Conditions (When to Apply)

```
+---------------------------------------------------------------------+
| Conditions (all must match)                        [+ Add Condition] |
+---------------------------------------------------------------------+
| Field            | Operator    | Value                               |
+------------------+-------------+-------------------------------------+
| Total Amount     | >=          | ¥100,000                            |
| Site             | equals      | Shanghai HQ                         |
+------------------+-------------+-------------------------------------+
```

Available condition fields (by doc type):
- Total Amount, Currency, Site, Priority, Item Type, Item Category, Supplier, Impact Level, etc.
- Operators: equals, not equals, >=, <=, in, not in, contains

### Approval Levels

```
+---------------------------------------------------------------------+
| Approval Levels                                     [+ Add Level]    |
+---------------------------------------------------------------------+
| Level | Approver Role          | Approver (specific) | Required     |
+-------+------------------------+---------------------+--------------+
| 1     | Supply Chain Manager   | (Any in role)       | Yes          |
| 2     | General Manager        | Chen Ping           | Yes          |
| 3     | Finance Director       | (Any in role)       | Optional     |
+-------+------------------------+---------------------+--------------+
```

Each level:
- Approver Role: select from system roles
- Specific Approver: optional — if set, only that user can approve; if blank, any user in role
- Required: Yes (must approve) / Optional (can skip if previous level sufficient)
- Timeout: auto-escalation after N days (optional)

### Notification Configuration

```
+---------------------------------------------------------------------+
| Notifications                                                        |
+---------------------------------------------------------------------+
| On Submit:     ☑ Email  ☑ In-App  ☑ Feishu                        |
| On Approve:    ☑ Email  ☑ In-App  ☐ Feishu                        |
| On Reject:     ☑ Email  ☑ In-App  ☑ Feishu                        |
| Reminder:      ☑ After 2 days if no action                         |
+---------------------------------------------------------------------+
```

### E-Signature Requirements

```
+---------------------------------------------------------------------+
| E-Signature Settings                                                 |
+---------------------------------------------------------------------+
| Require e-signature on Submit:   ☑ Yes                              |
| Require e-signature on Approve:  ☑ Yes                              |
| Require e-signature on Reject:   ☑ Yes                              |
| Signature meaning (Submit):  "I submit this [doc_type] for review"  |
| Signature meaning (Approve): "I approve this [doc_type]"            |
| Signature meaning (Reject):  "I reject this [doc_type]"            |
+---------------------------------------------------------------------+
```

## Footer Actions
- [Cancel] [Save Policy]
- Warning if modifying active policy: "This policy is currently active. Changes will affect new submissions immediately."
