# Screen Prompt: Reports - Compliance Reports

## Screen ID
`RPT-COMPLIANCE`

## Route
`/reports/compliance`

## Purpose
Regulatory compliance reports for auditors and regulatory submissions. Includes full genealogy reports, revision history, audit trail exports, and e-signature evidence packages. Designed for EU MDR, ISO 13485, and FDA 21 CFR Part 820/Part 11 compliance.

## Workflows
WF-11 (traceability), All (audit trail)

## Requirements
Per API doc Section 3: Full Genealogy Report, Reverse Impact Report, Revision History Report, Audit Trail Report, E-Signature Evidence Report

## Layout

```
+---------------------------------------------------------------------+
| Breadcrumb: Reports > Compliance Reports                             |
| Compliance Reports                                                   |
+---------------------------------------------------------------------+
| Select report type:                                                  |
+---------------------------------------------------------------------+
| +----------------------------------------------------------------+  |
| | [icon] Full Genealogy Report                                   |  |
| | Trace from shipment serial → all components, suppliers         |  |
| | [Generate Report]                                              |  |
| +----------------------------------------------------------------+  |
| +----------------------------------------------------------------+  |
| | [icon] Reverse Impact Report                                   |  |
| | Component lot → all affected shipped devices/customers         |  |
| | [Generate Report]                                              |  |
| +----------------------------------------------------------------+  |
| +----------------------------------------------------------------+  |
| | [icon] Revision History Report                                 |  |
| | Complete change history for any item, BOM, or document         |  |
| | [Generate Report]                                              |  |
| +----------------------------------------------------------------+  |
| +----------------------------------------------------------------+  |
| | [icon] Audit Trail Report                                      |  |
| | Chronological change log for any document or record            |  |
| | [Generate Report]                                              |  |
| +----------------------------------------------------------------+  |
| +----------------------------------------------------------------+  |
| | [icon] E-Signature Evidence Report                             |  |
| | Collected signatures for a document or workflow                |  |
| | [Generate Report]                                              |  |
| +----------------------------------------------------------------+  |
+---------------------------------------------------------------------+
```

## Report: Full Genealogy

### Parameters
- Input: Shipment serial number or lot number
- Options: Include inspection records (checkbox), Include document links (checkbox)

### Output
- Backward trace tree (same as Traceability Query backward trace)
- Additional: compliance-formatted header with company name, report date, report ID
- Each section signed off with verification stamp
- Export: PDF (regulatory submission format), CSV

## Report: Reverse Impact

### Parameters
- Input: Component lot number
- Options: Include customer contact info (checkbox), Include shipment dates (checkbox)

### Output
- Forward trace tree showing affected devices and customers
- Impact summary: total devices, total customers, total units
- Useful for recall management
- Export: PDF, CSV, Excel

## Report: Revision History

### Parameters
- Entity type: Item / BOM / Document (select)
- Entity ID: searchable select
- Date range: optional

### Output
- Timeline showing all revisions with effective date ranges
- For each revision: change description, changed by, approval chain, ECR/ECO reference
- Visual timeline + table format

## Report: Audit Trail

### Parameters
- Document type: select (PR, PO, WO, Item, BOM, ECR, Inspection, etc.)
- Document ID: text input or select
- Date range: optional
- Action filter: optional (Created, Updated, Submitted, Approved, Rejected)

### Output
- Chronological event log (same format as Audit Trail tab on document detail pages)
- Includes: timestamp (UTC), user, action, field changes (before → after), comment, hash chain reference
- Hash chain integrity indicator: overall status (all valid / chain broken at event X)
- Export: PDF (suitable for regulatory audit), CSV

## Report: E-Signature Evidence

### Parameters
- Document type and ID, or Workflow instance ID
- Date range: optional

### Output
- Table of all signature events:
  - Signer identity (user ID, full name, role)
  - Timestamp (UTC)
  - Meaning of signature (recorded text)
  - Authentication method (password)
  - Signature hash
  - Document state at time of signature
- 21 CFR Part 11 compliance statement at report header
- Export: PDF (regulatory package format)

## Common Report Features
- Every report includes: company name, report title, generation timestamp, generated by (user), report ID
- Print-optimized CSS with proper page breaks
- PDF export with company letterhead template
- Reports are immutable once generated — stored with their own audit record
- [Schedule Report] option: generate weekly/monthly and email to distribution list
