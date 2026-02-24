# Screen Prompt: Engineering Change Request / Order (ECR/ECO)

## Screen ID
`ENG-ECR`

## Route
- List: `/engineering/ecr`
- Detail: `/engineering/ecr/:id`
- Create: `/engineering/ecr/new`

## Purpose
Submit, review, and approve engineering change requests (ECRs). On approval, create Engineering Change Orders (ECOs) that implement item revision updates, BOM changes, and auto-propagation of child revision changes to parent BOMs.

## Workflows
WF-09 (Engineering Change + BOM Change Request/Approval)

## Requirements
RQ-016 (temp→formal part conversion), RQ-017 (version management + auto-upgrade), RQ-018 (auto-propagation of child revision to parents), RQ-022 (change request approval)

## List View

| Column | Content |
|---|---|
| ECR No. | Mono ID, clickable |
| Status | Draft / Submitted / In Review / Approved / Rejected / ECO Created / ECO Released |
| Change Type | Item / BOM / Process / Document (badges) |
| Impact Level | Low / Medium / High / Critical (colored badges) |
| Severity | Minor / Major / Critical |
| Submitter | User name |
| Created Date | Date |
| Affected Items | Count of impacted items |
| Actions | View, Edit (draft) |

Status tabs: All | Draft | In Review | Approved | ECO In Progress | Released

## ECR Detail / Create View

### Header Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| ECR Number | Mono | Auto | Auto-generated |
| Status | Badge | Auto | Colored by status |
| Change Type | Multi-select | Yes | Item, BOM, Process, Document (can affect multiple) |
| Impact Level | Select | Yes | Low / Medium / High / Critical — determines approval routing |
| Severity | Select | Yes | Minor / Major / Critical |
| Description | Rich text | Yes | Full description of the proposed change |
| Justification | Rich text | Yes | Business/technical justification |
| Requested Effective Date | Date picker | No | When change should take effect |

### Tab: Impacted Items

```
+---------------------------------------------------------------------+
| Impacted Items & BOMs                            [+ Add Impact Item] |
+---------------------------------------------------------------------+
| Item         | Current Rev | Proposed Rev | Change Description       |
+--------------+-------------+--------------+--------------------------+
| Widget-A     | Rev B       | Rev C        | Update material spec     |
| Assembly-X   | Rev C       | Rev D        | BOM change (new module)  |
+--------------+-------------+--------------+--------------------------+
```

### BOM Impact Matrix (RQ-018)

Shows cascade effect of child revision changes on parent BOMs:

```
+---------------------------------------------------------------------+
| BOM Impact Analysis (Auto-Propagation Preview)                       |
+---------------------------------------------------------------------+
| Changed Item  | Current → New | Parent BOMs Affected                |
+---------------+---------------+--------------------------------------+
| Widget-A      | Rev B → Rev C | Assembly-X (Rev C → Rev D)          |
|               |               | Assembly-Y (Rev A → Rev B)          |
+---------------+---------------+--------------------------------------+
| Module-Z      | Rev D → Rev E | Assembly-X (Rev C → Rev D)          |
+---------------+---------------+--------------------------------------+
|                                                                      |
| Auto-propagation: ☑ Enabled                                        |
| ⚠ 2 parent BOMs will be automatically revised                      |
| ⚠ 1 active WO (WO-2024-056) uses Assembly-X Rev C                 |
|   → Added to exception list (will complete on current revision)      |
+---------------------------------------------------------------------+
```

Features:
- Auto-propagation toggle (RQ-018): when enabled, changing a child component revision automatically creates new parent BOM revisions
- Exception list: active WOs and POs that should NOT be affected by the change
- Effectivity date controls: when new revisions become active

### Tab: Approval Routing

Auto-determined by impact level per approval policy:

```
+---------------------------------------------------------------------+
| Approval Routing (determined by Impact: High)                        |
+---------------------------------------------------------------------+
| Step | Role                    | Approver        | Status            |
+------+-------------------------+-----------------+-------------------+
| 1    | R&D Lead                | Li Hua          | ✓ Approved        |
| 2    | Quality Manager         | Wang Jun        | ○ Pending         |
| 3    | Supply Chain Manager    | Zhang Wei       | ○ Locked          |
| 4    | Production Manager      | Chen Ping       | ○ Locked          |
+------+-------------------------+-----------------+-------------------+
```

### Tab: ECO Implementation (After ECR Approval)

When ECR is approved, this tab becomes active with the implementation checklist:

```
+---------------------------------------------------------------------+
| ECO Implementation Package: ECO-2024-0012                            |
+---------------------------------------------------------------------+
| ☑ Create Widget-A Rev C (draft)                     [→ Open]        |
| ☑ Update Assembly-X BOM: replace Widget-A Rev B → C [→ Open]       |
| ☐ Create Assembly-X Rev D (auto-propagated)         [→ Create]      |
| ☐ Update Assembly-Y BOM: replace Widget-A Rev B → C [→ Create]      |
| ☐ Release all new revisions                         [→ Release All]  |
| ☐ Set effectivity date: 2024-04-01                  [→ Set]         |
| ☐ Sunset old revisions after effectivity            [→ Schedule]     |
+---------------------------------------------------------------------+
| [Complete ECO Implementation]                                        |
+---------------------------------------------------------------------+
```

Each checklist item links to the relevant creation/edit page. Completing all items enables [Complete ECO Implementation] → releases all changes and updates ECR status to "ECO Released."

### Tab: Documents
- Linked supporting documents (test reports, specifications, drawings)

### Tab: Audit Trail
- Full change history including all approvals, ECO actions, propagation events

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Discard] [Save Draft] [Submit for Review] |
| Submitted | Read-only |
| In Review | Approve/Reject (per approval inbox) |
| Approved | [Create ECO] (generates implementation package) |
| ECO Created | [Complete ECO Implementation] (when all items done) |
| ECO Released | Read-only, [View Revision History] |
