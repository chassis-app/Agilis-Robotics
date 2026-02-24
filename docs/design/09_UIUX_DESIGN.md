# UI/UX Design Specification

> Document `09` in the Agilis-Robotics ERP documentation suite. Defines the visual language, interaction patterns, component library, and screen specifications for the medical device manufacturing ERP system.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Design System Foundation](#2-design-system-foundation)
3. [Typography System](#3-typography-system)
4. [Color System](#4-color-system)
5. [Spacing & Layout Grid](#5-spacing--layout-grid)
6. [Iconography](#6-iconography)
7. [Component Library](#7-component-library)
8. [Navigation & Information Architecture](#8-navigation--information-architecture)
9. [Page Templates](#9-page-templates)
10. [Workflow & Interaction Patterns](#10-workflow--interaction-patterns)
11. [Regulatory UI Patterns](#11-regulatory-ui-patterns)
12. [Bilingual & Localization](#12-bilingual--localization)
13. [Data Visualization](#13-data-visualization)
14. [Responsive & Accessibility](#14-responsive--accessibility)
15. [Screen Specifications](#15-screen-specifications)
16. [Anti-Patterns](#16-anti-patterns)

---

## 1. Design Principles

These principles are ordered by priority and govern every design decision in the system.

### P1: Compliance First

Every UI surface must support regulatory requirements (21 CFR Part 11, EU MDR, ISO 13485). Audit trails, electronic signatures, and traceability are not optional features -- they are structural elements of the interface.

### P2: Data Integrity Over Convenience

No destructive action without confirmation. No data modification without audit evidence. Immutable records are visually distinguished from editable content.

### P3: Progressive Disclosure

Medical device ERP is inherently complex. Surface primary actions and data first; reveal secondary details on demand. Use expandable sections, drawers, and detail panels rather than overloading a single view.

### P4: Bilingual Parity

Chinese and English interfaces must be functionally equivalent. No feature, label, or workflow may exist in one language but not the other. Layout must accommodate both CJK and Latin character widths.

### P5: Clarity Over Aesthetics

Prefer explicit labels over icons alone. Prefer data tables over charts when precision matters. Prefer verbose status indicators over color-only encoding. The system is used in regulated manufacturing -- ambiguity is unacceptable.

### P6: Role-Aware Surfaces

Each user role sees a tailored view. Navigation, dashboards, and available actions adapt based on RBAC permissions. Unauthorized actions are hidden, not just disabled.

---

## 2. Design System Foundation

### Style Direction

**Primary Style: Data-Dense Dashboard + Swiss Minimalism**

The system adopts a data-dense, information-first approach with Swiss modernism principles for structure and hierarchy. This balances the need for high information density (ERP workflows involve many fields) with the clarity required for regulated environments.

| Property | Value |
|---|---|
| **Visual Style** | Clean, functional, high-contrast, grid-based |
| **Performance** | Excellent -- minimal decorative elements |
| **Accessibility** | WCAG AA minimum, AAA for critical compliance screens |
| **Framework Target** | React + Tailwind CSS (per architecture decision) |
| **Complexity** | Medium -- data-dense but organized |

### Design Tokens

All values are expressed as design tokens for systematic theming.

```
// Spacing scale (base unit: 4px)
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px

// Border radius
--radius-sm:  4px
--radius-md:  6px
--radius-lg:  8px
--radius-xl: 12px

// Shadows
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1)

// Transitions
--duration-fast:   150ms
--duration-normal: 200ms
--duration-slow:   300ms
--easing-default:  cubic-bezier(0.4, 0, 0.2, 1)

// Z-index scale
--z-dropdown:  10
--z-sticky:    20
--z-overlay:   30
--z-modal:     40
--z-toast:     50
```

---

## 3. Typography System

### Font Stack

The system uses **Inter** as the primary Latin font and **Noto Sans SC** (Simplified Chinese) for CJK characters. Both are sans-serif families with excellent readability at small sizes, wide weight ranges, and strong cross-platform rendering.

| Role | Latin Font | CJK Font | Fallback |
|---|---|---|---|
| **Headings** | Inter (600-700) | Noto Sans SC (600-700) | system-ui, sans-serif |
| **Body** | Inter (400-500) | Noto Sans SC (400-500) | system-ui, sans-serif |
| **Monospace** | JetBrains Mono | -- | ui-monospace, monospace |

**Rationale:** Inter is the standard for dashboard/admin UIs -- it has tabular number support (critical for data tables), clear letter spacing at 12-14px, and a neutral personality. Noto Sans SC provides complete CJK coverage with matching weight granularity.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display-lg` | 30px | 36px | 700 | Page titles (rare) |
| `display-sm` | 24px | 32px | 600 | Section headers |
| `heading-lg` | 20px | 28px | 600 | Card titles, modal headers |
| `heading-sm` | 16px | 24px | 600 | Subsection headers |
| `body-lg` | 16px | 24px | 400 | Primary body text |
| `body-md` | 14px | 20px | 400 | Default body, form labels |
| `body-sm` | 13px | 18px | 400 | Table cells, secondary text |
| `caption` | 12px | 16px | 400 | Timestamps, help text, badges |
| `mono-sm` | 13px | 18px | 400 | Document numbers, IDs, hashes |

### CJK-Specific Rules

- Minimum CJK body text: **14px** (CJK characters require more pixels than Latin at equivalent readability)
- Line height for CJK-heavy content: **1.75** (vs 1.5 for Latin)
- Maximum line length for CJK: **35-40 characters** (vs 65-75 for Latin)
- Mixed content (CN labels + EN values): Use `body-md` (14px) minimum

---

## 4. Color System

### Primary Palette

The palette uses trust-blue as the primary brand color, with semantic colors derived from functional meaning rather than decoration.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-50` | `#EFF6FF` | Primary tint backgrounds |
| `--color-primary-100` | `#DBEAFE` | Selected row, active filter |
| `--color-primary-200` | `#BFDBFE` | Focus ring, input border active |
| `--color-primary-500` | `#3B82F6` | Interactive elements, links |
| `--color-primary-600` | `#2563EB` | Primary buttons, active nav |
| `--color-primary-700` | `#1D4ED8` | Button hover state |
| `--color-primary-900` | `#1E3A8A` | Dark emphasis text |

### Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-neutral-0` | `#FFFFFF` | Cards, modals, input backgrounds |
| `--color-neutral-50` | `#F8FAFC` | Page background |
| `--color-neutral-100` | `#F1F5F9` | Table row hover, sidebar bg |
| `--color-neutral-200` | `#E2E8F0` | Borders, dividers |
| `--color-neutral-300` | `#CBD5E1` | Disabled input borders |
| `--color-neutral-400` | `#94A3B8` | Placeholder text |
| `--color-neutral-500` | `#64748B` | Muted text, icons |
| `--color-neutral-600` | `#475569` | Secondary text |
| `--color-neutral-700` | `#334155` | Primary body text |
| `--color-neutral-900` | `#0F172A` | Headings, emphasis text |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success-500` | `#22C55E` | Approved, passed, in stock |
| `--color-success-50` | `#F0FDF4` | Success background |
| `--color-warning-500` | `#F59E0B` | Pending, low stock, in approval |
| `--color-warning-50` | `#FFFBEB` | Warning background |
| `--color-danger-500` | `#EF4444` | Rejected, failed, critical |
| `--color-danger-50` | `#FEF2F2` | Error background |
| `--color-info-500` | `#0891B2` | Informational, draft status |
| `--color-info-50` | `#ECFEFF` | Info background |

### Document Status Colors

These map directly to the canonical status values defined in the system architecture.

| Status | Background | Text | Border |
|---|---|---|---|
| `draft` | `#F1F5F9` | `#475569` | `#CBD5E1` |
| `submitted` | `#DBEAFE` | `#1D4ED8` | `#93C5FD` |
| `in_approval` | `#FEF3C7` | `#B45309` | `#FCD34D` |
| `approved` | `#DCFCE7` | `#166534` | `#86EFAC` |
| `rejected` | `#FEE2E2` | `#991B1B` | `#FCA5A5` |
| `cancelled` | `#F1F5F9` | `#64748B` | `#CBD5E1` |

### BOM Sourcing Type Colors (RQ-024)

| Sourcing Type | Color | Icon |
|---|---|---|
| `purchase` | `#2563EB` (blue) | `ShoppingCart` |
| `make` | `#16A34A` (green) | `Wrench` |
| `subcontract` | `#EA580C` (orange) | `Truck` |

### Dark Mode

Dark mode is **deferred** to Phase 2. The light palette is designed with sufficient neutral range to support future dark theme inversion. All color references must use tokens (not hardcoded hex) to enable theme switching.

---

## 5. Spacing & Layout Grid

### Grid System

| Breakpoint | Width | Columns | Gutter | Margin |
|---|---|---|---|---|
| `sm` (mobile) | < 768px | 4 | 16px | 16px |
| `md` (tablet) | 768px-1023px | 8 | 24px | 24px |
| `lg` (desktop) | 1024px-1439px | 12 | 24px | 32px |
| `xl` (wide) | >= 1440px | 12 | 32px | auto (max-width: 1440px) |

### Application Shell Layout

```
+-------------------------------------------------------------------+
|  Top Bar (56px)                                          [user]   |
+----------+--------------------------------------------------------+
|          |  Breadcrumb (40px)                                     |
| Sidebar  +--------------------------------------------------------+
| (240px)  |                                                        |
|          |  Page Content Area                                     |
| collaps. |  (padding: 24px)                                       |
| to 64px  |                                                        |
|          |                                                        |
|          |                                                        |
+----------+--------------------------------------------------------+
```

- **Top bar**: Fixed, 56px height. Contains logo, global search, notification bell, language toggle, user avatar/menu.
- **Sidebar**: 240px expanded, 64px collapsed (icon-only). Persistent on desktop, overlay drawer on mobile.
- **Content area**: Scrollable. 24px padding on desktop, 16px on mobile.
- **Breadcrumb bar**: 40px, sticky below top bar. Shows module > section > page hierarchy.

### Spacing Rules

| Context | Value |
|---|---|
| Between form fields (vertical) | 16px (`--space-4`) |
| Between form sections | 24px (`--space-6`) |
| Card internal padding | 16-24px (`--space-4` to `--space-6`) |
| Between cards in a grid | 16px (`--space-4`) |
| Page section gap | 32px (`--space-8`) |
| Table cell padding | 8px vertical, 12px horizontal |

---

## 6. Iconography

### Icon Library

**Lucide Icons** -- consistent 24x24 SVG icon set. Selected for its comprehensive coverage of enterprise/data operations, stroke-based consistency, and MIT license.

### Icon Usage Rules

| Context | Size | Stroke | Color |
|---|---|---|---|
| Navigation menu | 20px | 1.5px | `--color-neutral-500` (inactive), `--color-primary-600` (active) |
| Button with text | 16px | 1.5px | Inherit button text color |
| Table row actions | 16px | 1.5px | `--color-neutral-500` |
| Status indicators | 16px | 2px | Semantic color per status |
| Empty states | 48px | 1px | `--color-neutral-300` |

### Required Icon Mapping

| Function | Icon Name |
|---|---|
| Dashboard | `LayoutDashboard` |
| Purchase Requisition | `FileText` |
| Purchase Order | `ClipboardList` |
| Inventory | `Package` |
| Work Order | `Factory` |
| Quality Inspection | `ShieldCheck` |
| Engineering Change | `GitBranch` |
| Document Management | `FileBox` |
| Approval | `CheckCircle2` |
| Rejection | `XCircle` |
| Pending | `Clock` |
| Alert | `AlertTriangle` |
| Search | `Search` |
| Filter | `Filter` |
| Export | `Download` |
| Settings | `Settings` |
| User | `User` |
| Notification | `Bell` |
| Audit Trail | `History` |
| Traceability | `GitFork` |
| E-Signature | `PenTool` |
| BOM Tree | `Network` |
| Supplier | `Building2` |
| Warehouse | `Warehouse` |
| Shipment | `Truck` |
| Finance | `DollarSign` |

---

## 7. Component Library

### 7.1 Buttons

| Variant | Usage | Style |
|---|---|---|
| **Primary** | Main CTA per page (Submit, Create, Approve) | `bg-primary-600`, white text, `rounded-md` |
| **Secondary** | Secondary actions (Cancel, Back) | White bg, `border-neutral-300`, neutral-700 text |
| **Danger** | Destructive actions (Reject, Delete) | `bg-danger-500`, white text |
| **Ghost** | Tertiary actions, table row actions | No bg, primary-600 text, hover bg-neutral-100 |
| **Icon** | Icon-only actions with `aria-label` | 32x32 or 36x36, rounded, ghost style |

**States:** Default, Hover (darken 1 step), Active (darken 2 steps), Disabled (opacity 0.5, no pointer events), Loading (spinner + disabled).

**Sizing:** `sm` (32px height, 13px text), `md` (36px height, 14px text), `lg` (40px height, 16px text).

### 7.2 Form Controls

#### Text Input

```
+------------------------------------------+
| Label *                           [help] |
| +--------------------------------------+ |
| | Placeholder text                     | |
| +--------------------------------------+ |
| Helper text or error message             |
+------------------------------------------+
```

- Label: Always visible, `body-md` weight-500, above input
- Required: Red asterisk after label
- Input height: 36px (md), 40px (lg for primary forms)
- Border: `--color-neutral-300`, focus: `--color-primary-500` 2px ring
- Error: `--color-danger-500` border + error text below
- Disabled: `bg-neutral-100`, `--color-neutral-400` text

#### Select / Dropdown

- Same styling as text input
- Chevron icon right-aligned
- Searchable select for lists > 10 items (items, suppliers, warehouses)
- Multi-select with tag chips for filters

#### Date Picker

- Calendar popup with month/year navigation
- Support date range selection (for reports, effectivity dates)
- Format: `YYYY-MM-DD` (canonical), display per locale (CN: `YYYY年MM月DD日`)

#### Number Input

- Right-aligned values
- Stepper arrows (optional)
- Decimal precision from field definition
- Currency prefix/suffix from context

#### File Upload

- Drag-and-drop zone with click fallback
- File type restrictions displayed
- Progress bar during upload
- Checksum display after upload (document integrity per RQ-020)

### 7.3 Data Tables

Data tables are the primary interaction surface for list views across all modules.

#### Structure

```
+---------------------------------------------------------------------+
| [Filter bar]  [Search]  [Column config]  [Export]  [+ Create]       |
+---------------------------------------------------------------------+
| ☐ | Doc No.    | Status  | Item       | Qty  | Date     | Actions  |
+---+------------+---------+------------+------+----------+----------+
| ☐ | PR-2024-01 | [Appr]  | Item-001   |  100 | 2024-... | ... ⋮    |
| ☐ | PR-2024-02 | [Draft] | Item-002   |   50 | 2024-... | ... ⋮    |
+---+------------+---------+------------+------+----------+----------+
| Showing 1-20 of 245                       [< 1 2 3 ... 13 >]       |
+---------------------------------------------------------------------+
```

#### Table Features

| Feature | Specification |
|---|---|
| **Row selection** | Checkbox column; supports select-all, shift-select |
| **Sorting** | Click column header; ascending/descending/none cycle |
| **Filtering** | Filter bar with field-specific controls (text, date range, status multi-select) |
| **Column configuration** | Drawer to show/hide/reorder columns per user preference |
| **Pagination** | Bottom bar with page size selector (20, 50, 100) and page navigation |
| **Bulk actions** | Sticky action bar appears when rows selected (e.g., bulk approve, export) |
| **Row density** | Compact (32px), Default (40px), Comfortable (48px) -- user preference |
| **Status badges** | Inline colored badges per document status color system |
| **Row actions** | Overflow menu (three-dot) for per-row actions; max 2 inline icon buttons for frequent actions |
| **Empty state** | Illustration + message + CTA button |
| **Loading state** | Skeleton rows (not spinner) |
| **Sticky header** | Table header sticks on scroll |
| **Responsive** | Horizontal scroll with frozen first column on mobile |

### 7.4 Status Badges

Pill-shaped badges using the document status color scheme.

```
[Draft]  [Submitted]  [In Approval]  [Approved]  [Rejected]  [Cancelled]
```

- Height: 22px
- Padding: 4px 8px
- Font: `caption` (12px), weight 500
- Border radius: `--radius-xl` (fully rounded)
- Include status dot (6px circle) before text for color-blind support

### 7.5 Cards

Used for dashboard KPIs, summary panels, and grouped content.

```
+------------------------------------+
| Card Title               [action]  |
|                                     |
| Primary metric: 1,234              |
| +12.5% vs last month    ▲          |
|                                     |
| [Sparkline chart]                   |
+------------------------------------+
```

- Background: `--color-neutral-0`
- Border: `1px solid --color-neutral-200`
- Border radius: `--radius-lg` (8px)
- Padding: `--space-4` to `--space-6`
- Shadow: `--shadow-sm` (hover: `--shadow-md`)

### 7.6 Modals & Dialogs

| Type | Max Width | Usage |
|---|---|---|
| **Alert** | 400px | Confirmation, warnings |
| **Form** | 560px | Quick create/edit forms |
| **Detail** | 720px | Document detail views |
| **Wide** | 960px | BOM tree, comparison views |

- Overlay: `rgba(0, 0, 0, 0.5)` backdrop
- Close: X button top-right + Escape key + click outside (configurable)
- Focus trap: Tab cycles within modal
- Scroll: Body locked when modal open; modal content scrolls internally

### 7.7 Toast Notifications

| Type | Icon | Color | Duration |
|---|---|---|---|
| Success | `CheckCircle2` | `--color-success-500` | 5 seconds |
| Error | `XCircle` | `--color-danger-500` | Persistent (manual dismiss) |
| Warning | `AlertTriangle` | `--color-warning-500` | 8 seconds |
| Info | `Info` | `--color-info-500` | 5 seconds |

- Position: Top-right, stacked
- Width: 360px max
- Action button: Optional inline CTA (e.g., "View document")
- Dismissible: X button on all types

### 7.8 Side Panels (Drawers)

Used for detail views, edit forms, and audit trail display without leaving the list context.

- Width: 480px (default), 640px (wide), full-width on mobile
- Opens from right edge
- Contains own scroll context
- Header with title + close button (sticky)
- Footer with action buttons (sticky)

---

## 8. Navigation & Information Architecture

### Top-Level Module Structure

The navigation hierarchy reflects the functional modules defined in the system architecture.

```
Home (Dashboard)
├── Procurement
│   ├── Purchase Requisitions
│   ├── Purchase Orders
│   ├── RFQ & Quotations
│   └── Goods Receipts
├── Inventory
│   ├── Stock Overview
│   ├── Material Issue Notices
│   ├── Material Issue Requests
│   ├── Stock Transfers
│   ├── Cycle Counts
│   └── Safety Stock Alerts
├── Manufacturing
│   ├── Work Orders
│   ├── Subcontract Orders
│   └── Production Progress
├── Engineering
│   ├── Item Master
│   ├── Item Revisions
│   ├── Bill of Materials
│   ├── ECR / ECO
│   └── Documents
├── Quality
│   ├── Inspections
│   ├── Nonconformance
│   ├── CAPA
│   └── Traceability
├── Sales
│   ├── Sales Orders
│   ├── Shipments
│   └── Genealogy Reports
├── Finance
│   ├── Costing
│   ├── AP Reconciliation
│   └── Integration Status
├── Reports
│   ├── Operational Dashboards
│   ├── Compliance Reports
│   └── Custom Reports
└── Admin
    ├── Users & Roles
    ├── Approval Policies
    ├── Custom Fields
    ├── Safety Stock Policies
    ├── System Configuration
    └── Integration Settings
```

### Sidebar Behavior

- **Expanded** (240px): Icon + label for each navigation item
- **Collapsed** (64px): Icon only with tooltip on hover
- **Mobile**: Hidden by default; hamburger menu opens as overlay
- **Active indicator**: Left border accent bar (4px, primary-600) on active item
- **Nested items**: Expand/collapse with chevron; indent child items 16px
- **Badge counts**: Show pending approval count, alert count on relevant items

### Breadcrumbs

Format: `Module > Section > Page > [Document ID]`

Example: `Procurement > Purchase Requisitions > PR-2024-0047`

- Clickable for navigation to parent levels
- Truncate long document IDs on mobile
- Maximum 4 levels displayed

### Global Search

- Accessible from top bar (keyboard shortcut: `/` or `Ctrl+K`)
- Searches across: document numbers, item names (CN + EN), supplier names, user names
- Results grouped by entity type with icon prefixes
- Recent searches displayed when empty
- Quick filter by module

---

## 9. Page Templates

### 9.1 List Page Template

Used for: PR list, PO list, Work Order list, Inspection list, etc.

```
+---------------------------------------------------------------------+
| Breadcrumb: Module > Section                                         |
| Page Title                                         [+ Create New]    |
+---------------------------------------------------------------------+
| [Status filter tabs: All | Draft | Submitted | Approved | ...]       |
+---------------------------------------------------------------------+
| [Search] [Date range] [More filters v]    [Column config] [Export]   |
+---------------------------------------------------------------------+
| Data Table (per Section 7.3)                                         |
+---------------------------------------------------------------------+
| Pagination                                                           |
+---------------------------------------------------------------------+
```

### 9.2 Detail Page Template

Used for: PR detail, PO detail, Work Order detail, Item Master detail, etc.

```
+---------------------------------------------------------------------+
| Breadcrumb: Module > Section > Document ID                           |
| Document Title (e.g., PR-2024-0047)    [Status Badge]               |
| Created by: User Name | Date: 2024-...                              |
+---------------------------------------------------------------------+
| [Tab Bar: Details | Lines | Approvals | Documents | Audit Trail]     |
+---------------------------------------------------------------------+
|                                                                      |
| Tab Content Area                                                     |
|                                                                      |
| +----------------------------------------------------------------+  |
| | Header Section (key fields in 2-3 column layout)               |  |
| +----------------------------------------------------------------+  |
| | Lines Section (sub-table or cards)                             |  |
| +----------------------------------------------------------------+  |
|                                                                      |
+---------------------------------------------------------------------+
| [Cancel]                [Save Draft]  [Submit for Approval]          |
+---------------------------------------------------------------------+
```

**Action button rules:**
- Primary action (rightmost): Contextual to document status (Submit, Approve, Release)
- Secondary action: Save Draft (always available in draft status)
- Destructive: Cancel / Reject (left-aligned with visual separation)

### 9.3 Dashboard Template

Used for: Home dashboard, module-specific operational dashboards.

```
+---------------------------------------------------------------------+
| Dashboard Title                              [Date range] [Refresh]  |
+---------------------------------------------------------------------+
| +--------+ +--------+ +--------+ +--------+                         |
| | KPI 1  | | KPI 2  | | KPI 3  | | KPI 4  |  (Card row)           |
| +--------+ +--------+ +--------+ +--------+                         |
+---------------------------------------------------------------------+
| +--------------------------+ +----------------------------------+    |
| | Chart / Graph            | | Action List / Pending Items      |    |
| |                          | |                                  |    |
| +--------------------------+ +----------------------------------+    |
+---------------------------------------------------------------------+
| +------------------------------------------------------------------+ |
| | Recent Activity Table                                            | |
| +------------------------------------------------------------------+ |
+---------------------------------------------------------------------+
```

### 9.4 Approval Inbox Template

A dedicated view for users with approval responsibilities.

```
+---------------------------------------------------------------------+
| My Approvals                                    [Mark all read]      |
+---------------------------------------------------------------------+
| [Tabs: Pending (12) | Completed | All]                               |
+---------------------------------------------------------------------+
| +----------------------------------------------------------------+  |
| | [icon] PR-2024-0047  Purchase Requisition                      |  |
| | Submitted by: Zhang Wei | 2 hours ago                         |  |
| | Items: Widget-A (100), Sensor-B (50)  | Total: ¥45,000         |  |
| | [View Details]  [Approve]  [Reject]                            |  |
| +----------------------------------------------------------------+  |
| +----------------------------------------------------------------+  |
| | [icon] ECR-2024-0012  Engineering Change Request               |  |
| | ...                                                            |  |
| +----------------------------------------------------------------+  |
+---------------------------------------------------------------------+
```

### 9.5 Form Page Template

Used for: Create/Edit Purchase Requisition, Create Work Order, etc.

```
+---------------------------------------------------------------------+
| Breadcrumb: Module > Section > New [Document Type]                   |
| Create [Document Type]                                               |
+---------------------------------------------------------------------+
|                                                                      |
| Section: Header Information                                          |
| +-------------------------------+  +-----------------------------+   |
| | Field 1 (required *)         |  | Field 2                     |   |
| +-------------------------------+  +-----------------------------+   |
| +-------------------------------+  +-----------------------------+   |
| | Field 3                      |  | Field 4                     |   |
| +-------------------------------+  +-----------------------------+   |
|                                                                      |
| Section: Line Items                                   [+ Add Line]   |
| +----------------------------------------------------------------+  |
| | Editable data table with inline editing                        |  |
| +----------------------------------------------------------------+  |
|                                                                      |
| Section: Attachments                                                 |
| +----------------------------------------------------------------+  |
| | [Drag & drop zone]                                             |  |
| +----------------------------------------------------------------+  |
|                                                                      |
+---------------------------------------------------------------------+
| [Discard]                          [Save Draft]  [Submit]            |
+---------------------------------------------------------------------+
```

---

## 10. Workflow & Interaction Patterns

### 10.1 Approval Flow Visualization

Each document with an approval workflow displays a visual approval tracker.

```
  ●──────────●──────────○──────────○
Submit    L1 Approve   L2 Approve   Complete
 (done)    (done)      (pending)    (locked)
```

- Completed steps: Filled circle (primary-600), solid line
- Current step: Pulsing circle (primary-500), solid line
- Future steps: Empty circle (neutral-300), dashed line
- Rejected: Red X icon at rejection point

### 10.2 Electronic Signature Dialog (21 CFR Part 11)

Triggered on Submit, Approve, or Reject actions.

```
+------------------------------------------+
| Electronic Signature Required             |
+------------------------------------------+
|                                           |
| Action: Approve Purchase Requisition      |
| Document: PR-2024-0047                    |
|                                           |
| Meaning of Signature:                     |
| [I approve this document for processing]  |
|                                           |
| Username:  [pre-filled, read-only]        |
| Password:  [________________]             |
|                                           |
| Comment (optional):                       |
| [________________________________]        |
|                                           |
|              [Cancel]  [Sign & Confirm]   |
+------------------------------------------+
```

**Requirements:**
- Username pre-filled from session, read-only
- Password re-entry mandatory (no biometric/SSO bypass for regulated actions)
- "Meaning of Signature" displayed and recorded
- Timestamp (UTC) captured and stored
- Hash chain links to previous audit event

### 10.3 GM Override Pattern (RQ-006)

When warehouse rejects a material issue and GM overrides:

```
+------------------------------------------+
| GM Override                               |
+------------------------------------------+
|                                           |
| This material issue was rejected by       |
| warehouse. Override requires documented   |
| justification.                            |
|                                           |
| Reason for Override: *                    |
| [________________________________]        |
| [________________________________]        |
|                                           |
| ⚠ This action will be permanently        |
|   recorded in the audit trail.            |
|                                           |
|              [Cancel]  [Override & Sign]   |
+------------------------------------------+
```

- Triggers electronic signature dialog after confirmation
- Audit record includes: original rejection, override reason, GM identity, timestamp

### 10.4 Status Transitions

All document status transitions follow a consistent interaction:

1. User clicks action button (Submit, Approve, Reject, Cancel)
2. If regulated action → e-signature dialog (Section 10.2)
3. If destructive action → confirmation dialog with explicit action name
4. Button enters loading state (spinner, disabled)
5. On success → toast notification + status badge update + page refresh
6. On error → error toast with retry option + error detail in expandable section

### 10.5 Shortage Detection & Resolution (RQ-006, RQ-007)

When material issue detects shortage:

```
+------------------------------------------+
| ⚠ Material Shortage Detected             |
+------------------------------------------+
|                                           |
| Item: Widget-A (Rev B)                    |
| Requested: 100 pcs                        |
| Available: 65 pcs                         |
| Shortage: 35 pcs                          |
|                                           |
| Resolution Options:                       |
| ○ Create Material Demand Request          |
| ○ Create Stock Transfer (from WH-02)     |
| ○ Convert to Purchase Requisition         |
| ○ Partial Issue (65 pcs now)             |
|                                           |
|              [Cancel]  [Proceed]          |
+------------------------------------------+
```

### 10.6 Batch Material Issue (RQ-014)

Summary page with multi-select and merge capability:

```
+---------------------------------------------------------------------+
| Material Issue Batch Mode                                            |
+---------------------------------------------------------------------+
| Select lines to merge into a single issue request:                   |
+---------------------------------------------------------------------+
| ☑ | WO-001 | Widget-A | Rev B | 100 pcs | WH-01 | 2024-03-15      |
| ☑ | WO-003 | Widget-A | Rev B |  50 pcs | WH-01 | 2024-03-16      |
| ☐ | WO-002 | Sensor-B | Rev A |  25 pcs | WH-01 | 2024-03-15      |
+---------------------------------------------------------------------+
| Merge Preview:                                                       |
| Widget-A (Rev B) → 150 pcs total from WH-01                        |
| ⓘ Lines merged: UOM match ✓ | Date tolerance ✓ (1 day)            |
+---------------------------------------------------------------------+
|                    [Cancel]  [Create Merged Issue Request]            |
+---------------------------------------------------------------------+
```

---

## 11. Regulatory UI Patterns

### 11.1 Audit Trail Panel

Every document has an Audit Trail tab showing the immutable event history.

```
+---------------------------------------------------------------------+
| Audit Trail                                          [Export PDF]     |
+---------------------------------------------------------------------+
| 2024-03-15 14:32:08 UTC | Zhang Wei                                 |
| Action: Approved (Level 1)                                           |
| Signature: ✓ Verified | Hash: a3f2...8c1d                           |
| Comment: "Pricing confirmed with supplier"                           |
| Changed: status [submitted → in_approval]                            |
+---------------------------------------------------------------------+
| 2024-03-15 09:15:22 UTC | Li Ming                                    |
| Action: Submitted for Approval                                       |
| Signature: ✓ Verified | Hash: 7b1e...4f2a                           |
| Changed: status [draft → submitted]                                  |
+---------------------------------------------------------------------+
| 2024-03-14 16:45:11 UTC | Li Ming                                    |
| Action: Updated                                                      |
| Changed: quantity [50 → 100], required_date [2024-04-01 → 04-15]   |
+---------------------------------------------------------------------+
```

**Display rules:**
- Reverse chronological order
- Each event shows: timestamp (UTC), user, action, e-signature verification status, hash chain reference, comment, field changes (before → after)
- Hash chain indicator: Green checkmark if chain intact, red alert if broken
- Immutable: No edit or delete controls on audit records
- Exportable as PDF for regulatory submission

### 11.2 Traceability Views (RQ-021)

#### Forward Trace

From component lot → affected devices and customers.

```
Component Lot: LOT-2024-0234 (Widget-A, Rev B)
├── WO-2024-0056 (Assembly-X)
│   ├── FG Lot: FG-2024-0089
│   │   └── Shipment: SH-2024-0012 → Customer: MedCorp Ltd
│   └── FG Lot: FG-2024-0090
│       └── Shipment: SH-2024-0015 → Customer: HealthTech Inc
└── WO-2024-0061 (Assembly-Y)
    └── FG Lot: FG-2024-0095
        └── (In warehouse, not shipped)
```

#### Backward Trace

From shipped serial → all component lots, revisions, and suppliers.

```
Shipped Device: SN-2024-X-00145
├── FG Lot: FG-2024-0089
│   ├── BOM: Assembly-X, Rev C (effective: 2024-02-01)
│   ├── Component: Widget-A (Rev B) ← LOT-2024-0234 ← PO-2024-0022 ← Supplier: Acme Parts
│   ├── Component: Sensor-B (Rev A) ← LOT-2024-0198 ← PO-2024-0019 ← Supplier: SensorCo
│   └── Subassembly: Module-Z (Rev D) ← SC-2024-0008 ← Subcontractor: PrecisionMfg
└── Inspection: INSP-2024-0345 (Pass, 2024-03-10)
```

Both views use a tree component with expandable nodes. Each node is a clickable link to the referenced document.

### 11.3 Device History Record (DHR) View

Aggregated compliance view combining all manufacturing evidence.

```
+---------------------------------------------------------------------+
| Device History Record                                                |
| Serial: SN-2024-X-00145 | Item: Assembly-X | Rev: C                |
+---------------------------------------------------------------------+
| Section                  | Status    | Records                       |
+---------------------------------------------------------------------+
| Bill of Materials        | Complete  | 12 components traced           |
| Material Consumption     | Complete  | 8 lots consumed                |
| Manufacturing Operations | Complete  | 5/5 operations recorded        |
| In-Process Inspections   | Complete  | 3 inspections passed           |
| Final Inspection         | Complete  | Passed (2024-03-10)            |
| Document Links           | Complete  | 4 controlled docs attached     |
| Approval Chain           | Complete  | 2/2 signatures verified        |
+---------------------------------------------------------------------+
| [Export PDF]  [Export Regulatory Package]                             |
+---------------------------------------------------------------------+
```

---

## 12. Bilingual & Localization

### Language Toggle

- Position: Top bar, next to user avatar
- Format: `中文` / `EN` toggle button
- Behavior: Instant switch, no page reload (client-side locale change)
- Persistence: Stored in user preferences

### Label Strategy

| Layer | Language | Example |
|---|---|---|
| UI chrome (nav, buttons) | User locale | 采购申请 / Purchase Requisition |
| Form field labels | User locale | 物料编号 / Item No. |
| Data values (names) | Bilingual display | 传感器-B / Sensor-B |
| System identifiers | English only | PR-2024-0047, WO-2024-0061 |
| Audit trail | English canonical keys | `status [draft → submitted]` |
| Error messages | User locale | Localized error strings |

### Layout Accommodation

- CJK labels are typically shorter than English equivalents. Form layouts use fixed label widths (120px CN, 160px EN) or top-aligned labels to handle variance.
- Buttons: Use `min-width` to prevent layout shift on language change.
- Tables: Column headers accommodate both languages; use `text-overflow: ellipsis` with tooltip for full text.

### Number & Date Formatting

| Format | Chinese (CN) | English (EN) |
|---|---|---|
| Date | 2024年03月15日 | 2024-03-15 |
| Currency (RMB) | ¥45,000.00 | ¥45,000.00 |
| Currency (USD) | $5,200.00 | $5,200.00 |
| Number | 1,234.56 | 1,234.56 |
| Percentage | 12.5% | 12.5% |

---

## 13. Data Visualization

### Chart Usage by Context

| Dashboard Context | Chart Type | Library |
|---|---|---|
| PR/PO aging | Horizontal stacked bar | Recharts |
| Inventory levels vs safety stock | Grouped bar + threshold line | Recharts |
| Production progress | Progress bar / Gantt | Custom + Recharts |
| Approval turnaround time | Box plot or bar chart | Recharts |
| Supplier performance scores | Radar chart (max 6 axes) | Recharts |
| Cost breakdown | Treemap or pie (max 6 segments) | Recharts |
| Trend over time (receipts, shipments) | Line chart with area fill | Recharts |
| BOM structure | Tree diagram | Custom React component |
| Genealogy trace | Tree diagram with links | Custom React component |

### Chart Styling Rules

| Property | Value |
|---|---|
| Chart background | Transparent (inherits card bg) |
| Grid lines | `--color-neutral-200`, dashed, 1px |
| Axis labels | `caption` (12px), `--color-neutral-500` |
| Data colors | Use semantic colors where applicable; otherwise cycle through: `#2563EB`, `#0891B2`, `#7C3AED`, `#059669`, `#D97706`, `#DC2626` |
| Tooltips | White bg, `--shadow-md`, `body-sm` text |
| Legend | Below chart on mobile, right side on desktop |
| Animation | `--duration-slow` (300ms), respect `prefers-reduced-motion` |

### Accessibility for Charts

- Every chart must have an accessible data table alternative (toggle or expandable below)
- Color is never the only differentiator -- use pattern fills or shape markers for line/scatter charts
- Tooltips are keyboard-accessible (arrow key navigation between data points)
- Chart titles and axis labels use semantic HTML (`<figcaption>`, `aria-label`)

---

## 14. Responsive & Accessibility

### Breakpoint Behavior

| Component | Mobile (<768px) | Tablet (768-1023px) | Desktop (>=1024px) |
|---|---|---|---|
| Sidebar | Hidden (hamburger menu) | Collapsed (64px) | Expanded (240px) |
| Data tables | Horizontal scroll, frozen col 1 | Full table | Full table |
| Form layout | Single column | Two columns | Two-three columns |
| KPI cards | Stack vertical, 1 per row | 2 per row | 4 per row |
| Modals | Full screen | Centered, max-width | Centered, max-width |
| Action buttons | Full width, stacked | Inline | Inline |

### Accessibility Requirements (WCAG 2.1 AA)

| Criterion | Implementation |
|---|---|
| **Color contrast** | 4.5:1 minimum for body text, 3:1 for large text (>=18px) |
| **Focus indicators** | 3px `--color-primary-500` outline on all focusable elements |
| **Keyboard navigation** | All interactions accessible via keyboard; tab order matches visual order |
| **Skip links** | "Skip to main content" link at page top |
| **ARIA labels** | All icon-only buttons have `aria-label`; form inputs linked to labels |
| **Screen reader** | Status changes announced via `aria-live` regions |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all animations |
| **Touch targets** | Minimum 44x44px for all interactive elements |
| **Error identification** | Errors identified by text, not color alone |
| **Language** | `lang` attribute set on `<html>` and toggled with locale |

### Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |
| Table render (100 rows) | < 200ms |
| Skeleton to data (API) | < 400ms (p95, per NFR) |

---

## 15. Screen Specifications

This section provides detailed specifications for key screens. Each screen references the relevant workflows (WF-XX) and requirements (RQ-XXX).

### 15.1 Home Dashboard

**Workflows:** All (entry point) | **Requirements:** Role-based (all RQs)

**Layout:** Dashboard template (Section 9.3)

**KPI Cards (role-dependent):**

| Role | Card 1 | Card 2 | Card 3 | Card 4 |
|---|---|---|---|---|
| Supply Chain | Pending Approvals | Open PRs | POs Due This Week | Overdue POs |
| Inventory | Low Stock Alerts | Pending Issues | Cycle Counts Due | Stock Value |
| Production | Active WOs | Module Readiness | Material Shortages | WOs Completing Today |
| Quality | Pending Inspections | Open NCs | Open CAPAs | Inspection Pass Rate |
| Engineering | ECRs In Progress | Items in R&D | BOMs Pending Release | Docs Expiring |

**Action Panel:** List of pending items requiring user action (approvals, inspections, material issues)

**Recent Activity:** Last 10 events relevant to user's role

### 15.2 Purchase Requisition - List

**Workflows:** WF-01 | **Requirements:** RQ-004, RQ-005

**Template:** List Page (Section 9.1)

**Status tabs:** All | Draft | Submitted | In Approval | Approved | Rejected

**Table columns:** PR No. | Status | Requester | Created Date | Required Date | Total Lines | Total Amount | Actions

**Actions:** View, Edit (draft only), Clone, Delete (draft only)

**Bulk actions:** Submit Selected, Export

### 15.3 Purchase Requisition - Detail / Create / Edit

**Workflows:** WF-01 | **Requirements:** RQ-001, RQ-002, RQ-004, RQ-005

**Template:** Detail Page / Form Page (Section 9.2, 9.5)

**Header fields (2-column layout):**
- PR Number (auto-generated, read-only)
- Status (badge)
- Requester (auto-filled from session)
- Created Date (auto-filled)
- Required Date (date picker, required)
- Priority (select: Normal, Urgent)
- Notes (textarea)

**Lines section (editable sub-table):**
- Item (searchable select with CN+EN display) *
- Revision (dropdown, filtered to released revisions) *
- Quantity * (number, validated against safety stock → show warning)
- UOM (auto-filled from item master)
- Warehouse (select) *
- Requested Date * (date picker)
- Estimated Unit Price (number + currency selector per RQ-002)
- Line Notes (text)
- [Delete line]

**Validation sidebar (real-time):**
- Stock available vs requested (per item+warehouse)
- Safety stock impact indicator (RQ-026)
- Item revision status check

**Tab: Approvals** — Approval flow visualization (Section 10.1) + approval history

**Tab: Documents** — Linked controlled documents (RQ-020)

**Tab: Audit Trail** — Immutable event log (Section 11.1)

**Footer actions:**
- Draft status: [Discard] [Save Draft] [Submit]
- Submitted/In Approval: [View Only] (no edit)
- Approved: [Create PO] shortcut

### 15.4 BOM Tree View

**Workflows:** WF-08, WF-09 | **Requirements:** RQ-013, RQ-018, RQ-019, RQ-024

**Template:** Custom (full-width content area)

**Layout:**

```
+---------------------------------------------------------------------+
| BOM: Assembly-X (Rev C)                    [Expand All] [Collapse]   |
| Effective: 2024-02-01                      [Edit] [Compare Versions] |
+---------------------------------------------------------------------+
| Legend: 🔵 Purchase  🟢 Make  🟠 Subcontract  ⭐ Critical  ⟳ Sub  |
+---------------------------------------------------------------------+
| ▼ Assembly-X (Rev C) — Make                          Qty: 1         |
|   ├── 🔵 Widget-A (Rev B) — Purchase                Qty: 2         |
|   │     └── ⟳ Sub: Widget-A-Alt (Rev A)                            |
|   ├── 🟢 Module-Y (Rev D) — Make  ⭐                Qty: 1         |
|   │   ├── 🔵 Part-P (Rev A) — Purchase              Qty: 4         |
|   │   └── 🔵 Part-Q (Rev B) — Purchase              Qty: 2         |
|   ├── 🟠 Module-Z (Rev D) — Subcontract  ⭐         Qty: 1         |
|   │   ├── 🔵 Sensor-B (Rev A) — Purchase            Qty: 3         |
|   │   └── 🔵 Connector-C (Rev A) — Purchase         Qty: 6         |
|   └── 🔵 Packaging (Rev A) — Purchase               Qty: 1         |
+---------------------------------------------------------------------+
```

**Note:** The legend icons above use placeholder symbols. Implementation must use Lucide SVG icons with the BOM sourcing type colors defined in Section 4.

**Features:**
- Expand/collapse individual nodes or all
- Color-coded by sourcing type (per Section 4)
- Critical component flag (star icon)
- Substitute indicator with expand to show alternatives
- Click node to open item detail in side panel
- Module readiness indicators when viewed from Work Order context

### 15.5 Work Order - Detail

**Workflows:** WF-08 | **Requirements:** RQ-011, RQ-013, RQ-015, RQ-020

**Template:** Detail Page (Section 9.2)

**Header:** WO Number, Item + Revision, Quantity, Priority, Status, Planned Start/End

**Tab: BOM & Modules**
- BOM tree (simplified, per Section 15.4)
- Module readiness matrix:

```
+---------------------------------------------------------------------+
| Module Readiness Gate                                                |
+---------------------------------------------------------------------+
| Module        | Type        | Critical | Status    | Source         |
+---------------------------------------------------------------------+
| Module-Y      | Make        | Yes      | ✓ Ready   | WO-2024-0052  |
| Module-Z      | Subcontract | Yes      | ✗ Pending | SC-2024-0008  |
| Packaging     | Purchase    | No       | ✓ Ready   | PO-2024-0022  |
+---------------------------------------------------------------------+
| Gate Status: BLOCKED — 1 critical module pending                     |
| [Release Work Order] (disabled until all critical modules ready)     |
+---------------------------------------------------------------------+
```

**Tab: Operations**
- Sequence table with operation name, work center, planned/actual start-end, status, operator
- Progress bar for each operation
- Overall WO progress bar

**Tab: Material Issues**
- List of material issue notices linked to this WO
- Button: [Create Material Issue Notice]

**Tab: Production Receipt**
- Finished lot/serial entry
- Quantity received vs planned
- Links to final inspection record

**Tab: Documents** — Work instructions, quality plans, specifications (RQ-020)

**Tab: Audit Trail**

### 15.6 Engineering Change Request

**Workflows:** WF-09 | **Requirements:** RQ-016, RQ-017, RQ-018, RQ-022

**Template:** Form Page (Section 9.5)

**Header fields:**
- ECR Number (auto-generated)
- Change Type (select: Item, BOM, Process, Document)
- Impact Level (select: Low, Medium, High, Critical)
- Severity (select: Minor, Major, Critical)
- Description (rich text)
- Justification (rich text)

**Impacted Items section:**
- Table of affected items + current revision + proposed revision
- BOM impact matrix: shows all parent BOMs affected by child revision change (RQ-018)
- Auto-propagation flag per parent

**Approval routing:**
- Auto-determined by impact level per approval policy
- Visual display of required approvers by role

**Tab: ECO Implementation** (after ECR approval)
- Checklist of changes to apply
- New revision creation links
- Effectivity date controls
- Exception list for active orders (RQ-017)

### 15.7 Traceability Query

**Workflows:** WF-11 | **Requirements:** RQ-021

**Template:** Custom query page

**Input:** Search by lot number, serial number, shipment ID, or item + revision

**Direction toggle:** Forward Trace | Backward Trace

**Output:** Interactive tree (per Section 11.2) with:
- Expandable nodes
- Click-through to linked documents
- Export as PDF for regulatory submission
- Print-friendly layout option

### 15.8 Safety Stock Alert Dashboard

**Workflows:** WF-12 | **Requirements:** RQ-026

**Template:** Dashboard template (Section 9.3)

**KPI Cards:** Total Alerts Active | Critical (Below 50%) | Items Requiring Reorder | Alerts Acknowledged

**Alert List Table:**
- Item + Revision | Warehouse | Current Qty | Safety Threshold | Shortage | Alert Since | Reminder Count | Actions

**Actions:** Acknowledge, Create PR, View Policy, Snooze

**Policy Management (Admin):**
- Table of safety stock policies per item/warehouse
- Editable fields: threshold qty, reorder qty, alert offset, repeat interval, active flag

### 15.9 Cycle Count

**Workflows:** WF-13 | **Requirements:** RQ-009, RQ-013

**Template:** Detail Page (Section 9.2)

**Header:** Count Plan ID, Period (Quarterly/Yearly), Status, Scope (items to count), Freeze Timestamp

**Count Entry:**
- Blind count mode: system quantity hidden until count submitted
- Item | Location | Counted Qty | (System Qty — revealed after) | Variance | Variance %
- Approval section with reason code for variances exceeding threshold
- E-signature for adjustment approval (21 CFR Part 11)

### 15.10 Integration Monitor

**Workflows:** WF-14 | **Requirements:** RQ-027

**Template:** Dashboard template (Section 9.3)

**KPI Cards:** Events Processed (24h) | Failed Events | Retry Queue Depth | Avg Processing Time

**Event Log Table:**
- Timestamp | Event Type | Target (Feishu / Finance / External) | Status | Retry Count | Payload Preview

**Dead Letter Queue:**
- Failed events requiring manual intervention
- Retry button, view payload, mark resolved

---

## 16. Anti-Patterns

The following patterns are explicitly prohibited in this design system.

| Anti-Pattern | Why | Correct Approach |
|---|---|---|
| Emojis as icons | Inconsistent rendering, unprofessional | Use Lucide SVG icons |
| Color-only status indication | Accessibility failure, ambiguity | Color + text label + icon |
| Auto-save without confirmation | Audit trail integrity risk | Explicit save/submit actions |
| Inline editing on approved documents | Immutability violation | Read-only with "Create Revision" action |
| Modal inside modal | Confusing navigation, focus trap issues | Side panel or page navigation |
| Placeholder-only labels | Accessibility failure, disappearing context | Visible label above input always |
| Infinite scroll on transaction lists | Loses position, pagination needed for audit | Paginated tables with page size control |
| Toast for critical errors | Can be missed, auto-dismisses | Inline error display + persistent banner |
| Delete without soft-delete | Data integrity violation | `is_deleted` flag + audit record |
| Hardcoded colors | Prevents theming, dark mode, accessibility | Design tokens only |
| Auto-approve on submit | Violates RQ-005 two-level approval mandate | Explicit submit → approval flow |
| Client-side-only validation | Security risk, data integrity | Server validation + client hints |

---

## Appendix A: Requirement-to-UI Traceability

| Requirement | UI Surfaces Affected |
|---|---|
| RQ-001 | All screens: bilingual labels, language toggle (Section 12) |
| RQ-002 | PR/PO forms: currency selector, FX display (Section 15.3) |
| RQ-003 | Item master: custom field builder; all list views: custom field filters |
| RQ-004 | PO creation blocked unless PR approved; validation message |
| RQ-005 | Submit button on PR; approval inbox; e-signature dialog (Section 10.2) |
| RQ-006 | Material issue notice: GM override dialog (Section 10.3) |
| RQ-007 | Material issue request: shortage dialog (Section 10.5) |
| RQ-008 | Subcontract order: auto-PR creation on shortage |
| RQ-009 | Cycle count scheduler dashboard (Section 15.9) |
| RQ-010 | Subcontract detail: fee statement tab; reconciliation dashboard |
| RQ-011 | Work order: operation progress tracking (Section 15.5) |
| RQ-012 | Item master: category tree picker, type selector |
| RQ-013 | Work order: module readiness gate (Section 15.5) |
| RQ-014 | Material issue batch mode (Section 10.6) |
| RQ-015 | GRN → final inspection flow trigger |
| RQ-016 | Item master: lifecycle stage, conversion wizard |
| RQ-017 | Item revision list: version history, effectivity dates |
| RQ-018 | ECO: auto-propagation flag, BOM impact matrix (Section 15.6) |
| RQ-019 | BOM line: substitute list; ATP with substitutes |
| RQ-020 | PO/WO forms: documents panel (Section 15.5) |
| RQ-021 | Traceability query: forward/backward trace (Section 15.7) |
| RQ-022 | ECR/ECO forms and approval routing (Section 15.6) |
| RQ-023 | RFQ: quotation comparison grid, selection rationale |
| RQ-024 | BOM tree: sourcing type color coding (Section 15.4) |
| RQ-025 | Project module: milestone Gantt, linked artifacts |
| RQ-026 | Safety stock alert dashboard (Section 15.8) |
| RQ-027 | Integration monitor (Section 15.10); Feishu settings in Admin |

## Appendix B: Workflow-to-Screen Mapping

| Workflow | Primary Screens |
|---|---|
| WF-01 | PR List, PR Detail, Approval Inbox, PO Create |
| WF-02 | RFQ List, Quotation Comparison, PO Detail |
| WF-03 | GRN Form, Inspection Record, Disposition Dialog |
| WF-04 | Material Issue Notice Detail |
| WF-05 | Material Issue Request Batch Mode (Section 10.6) |
| WF-06 | Shortage Resolution Dialog (Section 10.5) |
| WF-07 | Subcontract Order Detail, Fee Statement, AP Reconciliation |
| WF-08 | Work Order Detail, Module Readiness Gate (Section 15.5) |
| WF-09 | ECR Form, ECO Implementation, BOM Impact Matrix (Section 15.6) |
| WF-10 | Document Management List/Detail, Document Links Panel |
| WF-11 | Traceability Query (Section 15.7), Shipment Detail |
| WF-12 | Safety Stock Alert Dashboard (Section 15.8) |
| WF-13 | Cycle Count Plan/Entry (Section 15.9) |
| WF-14 | Integration Monitor (Section 15.10) |
