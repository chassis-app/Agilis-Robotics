# Screen Prompt: Document Management System

## Screen ID
`ENG-DMS`

## Route
- List: `/engineering/documents`
- Detail: `/engineering/documents/:id`
- Upload: `/engineering/documents/new`

## Purpose
PLM-style document management with revision control, approval workflow, and linking to items, BOMs, POs, and work orders. Ensures procurement and production users can access controlled documents during operations (RQ-020).

## Workflows
WF-10 (Document Management for Procurement and Production)

## Requirements
RQ-020 (document management with procurement/production access)

## List View

| Column | Content |
|---|---|
| Doc No. | Mono ID, clickable |
| Title | Document title |
| Type | Spec / Drawing / Work Instruction / Quality Plan / Certificate / Other |
| Current Rev | Latest revision code |
| Status | Draft / In Review / Released / Obsolete |
| Linked Items | Count of linked items/BOMs/orders |
| Owner | Document controller |
| Last Modified | Date |
| Actions | View, Edit (draft), Download, New Revision |

Filters: Search (doc no., title, content keywords), Type, Status, Linked Item

## Detail View

### Header

| Field | Type | Required |
|---|---|---|
| Document No. | Mono | Auto |
| Title | Text | Yes |
| Type | Select | Yes |
| Description | Textarea | No |
| Security Level | Select | No (default: Standard) |
| Owner | User select | Yes |

### Tab: Revisions

```
+---------------------------------------------------------------------+
| Revision History                             [+ Create New Revision] |
+---------------------------------------------------------------------+
| Rev | Status   | Upload Date | File          | Checksum    | Size   |
+-----+----------+-------------+---------------+-------------+--------+
| C   | Released | 2024-03-01  | spec_v3.pdf   | a3f2...8c1d | 2.4 MB |
| B   | Released | 2024-01-15  | spec_v2.pdf   | 7b1e...4f2a | 2.1 MB |
| A   | Obsolete | 2023-09-01  | spec_v1.pdf   | 9c4d...2e3f | 1.8 MB |
+-----+----------+-------------+---------------+-------------+--------+
```

- Current released revision highlighted
- Each revision shows file integrity checksum (document integrity verification)
- [Download] button per revision
- [Preview] button opens inline PDF viewer (if PDF)
- Obsolete revisions: read-only access for audit purposes
- Released revisions: cannot be modified (immutable)

### Tab: Linked Items

```
+---------------------------------------------------------------------+
| Document Links                                       [+ Link Item]   |
+---------------------------------------------------------------------+
| Entity      | ID           | Name         | Link Role               |
+-------------+--------------+--------------+-------------------------+
| Item        | ITM-001      | Widget-A     | Specification           |
| BOM         | BOM-ASX-C    | Assembly-X   | Work Instruction        |
| Work Order  | WO-2024-056  | Assembly-X   | Quality Plan            |
| PO          | PO-2024-033  | (Acme Parts) | Drawing                 |
+-------------+--------------+--------------+-------------------------+
```

Link roles: Specification, Drawing, Work Instruction, Quality Plan, Certificate, Test Report, Regulatory Filing

[+ Link Item] opens a dialog to search and select items/BOMs/WOs/POs and assign a link role.

### Tab: Approval (for documents in review)
- Approval flow visualization
- Release requires e-signature

### Tab: Audit Trail
- Upload, revision, link, and approval history

## Upload / New Revision

```
+---------------------------------------------------------------------+
| Upload Document Revision                                             |
+---------------------------------------------------------------------+
| Revision Code: * [C__]                                               |
| Change Notes: * [Updated tolerance specifications per ECO-2024-012] |
|                                                                      |
| +---------------------------------------------------------------+   |
| |                                                               |   |
| |   Drag and drop file here, or click to browse                |   |
| |                                                               |   |
| |   Supported: PDF, DOCX, XLSX, DWG, STEP, JPEG, PNG          |   |
| |   Max size: 50 MB                                            |   |
| +---------------------------------------------------------------+   |
|                                                                      |
| File: spec_v3.pdf (2.4 MB)                  ████████████ 100%       |
| Checksum (SHA-256): a3f2...8c1d                                     |
|                                                                      |
| [Cancel]                         [Save Draft] [Submit for Review]    |
+---------------------------------------------------------------------+
```

- File checksum computed client-side and server-side, displayed for integrity verification
- Supported file types configurable
- Progress bar during upload
- After upload, file preview if supported format

## Footer Actions by Status

| Status | Actions |
|---|---|
| Draft | [Delete Draft] [Save] [Submit for Review] |
| In Review | Read-only (approver sees in approval inbox) |
| Released | [Create New Revision] [Download] |
| Obsolete | [Download] (read-only) |
