# Screen Prompt: Project Management

## Screen ID
`ENG-PROJECTS`

## Route
- List: `/engineering/projects`
- Detail: `/engineering/projects/:id`
- Create: `/engineering/projects/new`

## Purpose
Project and milestone management for R&D, NPI (New Product Introduction), and improvement initiatives. Link engineering artifacts (ECRs, BOMs, work orders) to projects for lifecycle tracking.

## Workflows
WF-09 (engineering changes linked to projects)

## Requirements
RQ-025 (project management / PLM capability)

## List View

| Column | Content |
|---|---|
| Project No. | Mono ID, clickable |
| Name | Project name |
| Type | R&D / NPI / Improvement (badge) |
| Status | Planning / Active / On Hold / Completed / Cancelled |
| Owner | Project owner |
| Start Date | Planned start |
| End Date | Planned end |
| Progress | Progress bar (% milestones completed) |
| Actions | View, Edit |

## Detail View

### Header

| Field | Type | Required |
|---|---|---|
| Project No. | Mono | Auto |
| Name | Text | Yes |
| Type | Select | Yes (R&D / NPI / Improvement) |
| Status | Select | Yes |
| Owner | User select | Yes |
| Description | Rich text | Yes |
| Planned Start | Date picker | Yes |
| Planned End | Date picker | Yes |
| Actual Start | Date (auto) | Set on first milestone start |
| Actual End | Date (auto) | Set on project completion |

### Tab: Milestones

```
+---------------------------------------------------------------------+
| Milestones                                      [+ Add Milestone]    |
+---------------------------------------------------------------------+
| Milestone         | Planned Date | Actual Date | Status    | Owner  |
+-------------------+--------------+-------------+-----------+--------+
| Concept Review    | 2024-01-15   | 2024-01-15  | ✓ Done    | Li Hua |
| Design Freeze     | 2024-02-28   | 2024-03-05  | ✓ Done    | Li Hua |
|                   |              | (5d late)   |           |        |
| Prototype Build   | 2024-03-30   | --          | ▶ Active  | Zhang  |
| Design Validation | 2024-04-30   | --          | ○ Pending | Wang   |
| Pilot Production  | 2024-06-15   | --          | ○ Pending | Chen   |
| Mass Production   | 2024-08-01   | --          | ○ Pending | Chen   |
+-------------------+--------------+-------------+-----------+--------+
```

### Gantt View (visual timeline)

```
+---------------------------------------------------------------------+
| Gantt View                             [Month ▼] [← Feb Mar Apr →]  |
+---------------------------------------------------------------------+
|                 Jan    Feb    Mar    Apr    May    Jun    Jul    Aug  |
| Concept Rev.   ████                                                  |
| Design Freeze         ██████████                                     |
| Prototype                     █████████████                          |
| Design Valid.                              ████████████              |
| Pilot Prod.                                          ████████████   |
| Mass Prod.                                                   ██████ |
+---------------------------------------------------------------------+
```

- Green bars: completed milestones
- Blue bars: active milestone
- Grey bars: future milestones
- Red indicator: if actual date exceeds planned date (late)
- Hover on bar: shows milestone details

### Tab: Linked Artifacts

```
+---------------------------------------------------------------------+
| Linked Artifacts                              [+ Link Artifact]      |
+---------------------------------------------------------------------+
| Type  | ID            | Name              | Status    | Milestone   |
+-------+---------------+-------------------+-----------+-------------+
| ECR   | ECR-2024-0012 | Widget-A redesign | Released  | Design Fr.  |
| BOM   | BOM-ASX-C     | Assembly-X Rev C  | Released  | Prototype   |
| WO    | WO-2024-0056  | Prototype batch   | Completed | Prototype   |
| Item  | ITM-001       | Widget-A          | Active    | --          |
| Doc   | DOC-2024-001  | Design spec v3    | Released  | Design Fr.  |
+-------+---------------+-------------------+-----------+-------------+
```

Each artifact links to its detail page. Can filter by milestone, type, or status.

### Tab: Team

| Member | Role | Availability | Milestones Assigned |
|---|---|---|---|
| Li Hua | R&D Lead | Full-time | Concept, Design Freeze |
| Zhang Wei | Manufacturing Eng | Part-time | Prototype |
| Wang Jun | QA Engineer | Part-time | Design Validation |

### Tab: Audit Trail
Full project change history.

## Footer Actions

| Status | Actions |
|---|---|
| Planning | [Save] [Activate Project] |
| Active | [Save] [Put On Hold] [Complete Project] |
| On Hold | [Resume Project] |
| Completed | Read-only, [Export Project Report] |
