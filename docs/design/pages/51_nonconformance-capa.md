# Screen Prompt: Nonconformance & CAPA

## Screen ID
`QA-NC-CAPA`

## Route
- NC List: `/quality/nonconformance`
- NC Detail: `/quality/nonconformance/:id`
- CAPA List: `/quality/capa`
- CAPA Detail: `/quality/capa/:id`

## Purpose
Track nonconforming materials/products from detection through investigation, disposition, and corrective/preventive action. Links to source inspections, affected lots, and CAPA effectiveness verification.

## Workflows
WF-03 (inspection failure → NC)

## Requirements
21 CFR Part 820 (CAPA requirement), ISO 13485 (nonconformance control)

## Nonconformance List

| Column | Content |
|---|---|
| NC No. | Mono ID, clickable |
| Status | Open / Investigation / Disposition / CAPA Created / Closed |
| Source | Inspection / Production / Customer Complaint / Audit |
| Item | Item name + revision |
| Lot/Serial | Affected lot |
| Severity | Critical / Major / Minor |
| Opened Date | Date |
| Days Open | Calculated |
| Assigned To | Investigator |
| Actions | View, Update |

## NC Detail View

### Header

| Field | Type | Required |
|---|---|---|
| NC Number | Mono | Auto |
| Status | Badge | Auto |
| Source Inspection | Link | Auto (if from inspection) |
| Item + Revision | Text | Yes |
| Lot/Serial | Text | Yes |
| Affected Quantity | Number | Yes |
| NC Type | Select | Yes (Dimensional / Functional / Cosmetic / Material / Process / Other) |
| Severity | Select | Yes |
| Description | Rich text | Yes |

### Investigation Section

```
+---------------------------------------------------------------------+
| Investigation                                                        |
+---------------------------------------------------------------------+
| Root Cause Category: * [Process deviation ▼]                        |
|                                                                      |
| Root Cause Description: *                                            |
| [____________________________________________________________]       |
|                                                                      |
| Investigation Method: * [5-Why ▼]  (5-Why / Fishbone / 8D / Other) |
|                                                                      |
| Evidence / Attachments:                                              |
| [+ Upload Evidence]                                                  |
| • root_cause_analysis.pdf (uploaded 03-16)                          |
+---------------------------------------------------------------------+
```

### Disposition Section

```
+---------------------------------------------------------------------+
| Disposition Decision                                                 |
+---------------------------------------------------------------------+
| Decision: * ○ Use As-Is  ○ Rework  ○ Scrap  ○ Return to Supplier  |
|                                                                      |
| Justification: * [________________________________]                 |
|                                                                      |
| Lot action:                                                          |
| • Use As-Is → Move to available with condition flag                 |
| • Rework → Create rework WO, lot stays in quarantine               |
| • Scrap → Adjust inventory, lot marked scrapped                    |
| • Return → Create supplier return, lot marked returned              |
|                                                                      |
| [Approve Disposition & Sign] (e-signature required)                  |
+---------------------------------------------------------------------+
```

### CAPA Section

```
+---------------------------------------------------------------------+
| Corrective / Preventive Action                                       |
+---------------------------------------------------------------------+
| CAPA Required: * ○ Yes  ○ No (justify if no)                       |
|                                                                      |
| If Yes:                                                              |
| CAPA No: CAPA-2024-0023 [→ View CAPA]                              |
| Corrective Action: [________________________________]                |
| Preventive Action: [________________________________]                |
| Target Completion: [date picker]                                     |
| Assigned To: [user select]                                           |
+---------------------------------------------------------------------+
```

## CAPA Detail View

| Field | Type | Required |
|---|---|---|
| CAPA Number | Mono | Auto |
| Status | Open / In Progress / Verification / Closed |
| Source NC | Link | From NC that triggered CAPA |
| Corrective Action Description | Rich text | Yes |
| Preventive Action Description | Rich text | Yes |
| Responsible Person | User | Yes |
| Target Date | Date | Yes |
| Actual Completion Date | Date | On closure |

### Effectiveness Verification

```
+---------------------------------------------------------------------+
| Effectiveness Verification                                           |
+---------------------------------------------------------------------+
| Verification Method: [Re-inspection of next 3 lots ▼]              |
| Verification Date: [2024-04-15]                                     |
| Verified By: [Inspector name]                                        |
| Result: ○ Effective  ○ Not Effective (requires new CAPA)            |
|                                                                      |
| Evidence: [+ Upload]                                                 |
|                                                                      |
| [Close CAPA & Sign] (e-signature required)                           |
+---------------------------------------------------------------------+
```

If "Not Effective" → system prompts creation of a new CAPA iteration.
