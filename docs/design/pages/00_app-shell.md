# Screen Prompt: Application Shell

## Screen ID
`APP-SHELL`

## Purpose
The persistent application shell wraps every page in the system. It provides the top navigation bar, collapsible sidebar, breadcrumb bar, and notification system. All other screens render inside this shell's content area.

## Layout Structure

```
+-------------------------------------------------------------------+
|  TOP BAR (h: 56px, fixed)                                         |
|  [Logo: "Agilis"] [Global Search ⌘K] ... [Lang 中/EN] [🔔 3] [Avatar ▼] |
+----------+--------------------------------------------------------+
|          |  BREADCRUMB BAR (h: 40px, sticky)                      |
| SIDEBAR  |  Home > Procurement > Purchase Requisitions             |
| (w: 240) +--------------------------------------------------------+
|          |                                                        |
| [icon] Dashboard    |  CONTENT AREA (scrollable, padding: 24px)  |
| [icon] Procurement ▼|                                             |
|   PR List            |  {Page content renders here}              |
|   PO List            |                                            |
|   RFQ                |                                            |
|   Receiving          |                                            |
| [icon] Inventory   ▼ |                                            |
| [icon] Manufacturing▼|                                            |
| [icon] Engineering ▼ |                                            |
| [icon] Quality     ▼ |                                            |
| [icon] Sales       ▼ |                                            |
| [icon] Finance     ▼ |                                            |
| [icon] Reports     ▼ |                                            |
| [icon] Admin       ▼ |                                            |
+----------+--------------------------------------------------------+
```

## Top Bar Components

### Logo Area (left)
- Company logo or text "Agilis" in `heading-lg` (20px, weight 600)
- Clicking logo navigates to Home Dashboard

### Global Search (center-left)
- Search input with placeholder: "Search documents, items, suppliers... (⌘K)"
- Width: 400px on desktop, collapses to icon on tablet
- Keyboard shortcut: `/` or `Ctrl+K` / `⌘K` opens focused search
- Results dropdown grouped by entity type: Documents, Items, Suppliers, Users
- Each result shows: icon + entity type label + name (bilingual) + ID
- Recent searches shown when input is empty

### Right Actions
1. **Language toggle**: Segmented button `中文 | EN`, persisted to user preferences
2. **Notification bell**: Lucide `Bell` icon, red badge with unread count
   - Click opens notification dropdown (max 5 recent, "View All" link)
   - Notification types: approval requests, alerts, system messages
3. **User avatar + dropdown**:
   - Shows user initials or avatar image
   - Dropdown: My Profile, My Approvals, Preferences, Sign Out
   - Role name displayed below user name in dropdown header

## Sidebar

### Expanded State (240px)
- Background: `--color-neutral-100` (#F1F5F9)
- Each nav item: Lucide icon (20px) + label (body-md, 14px)
- Active item: left accent border (4px, primary-600), primary-600 text, primary-50 background
- Hover: neutral-200 background
- Sections with children: click to expand/collapse (chevron icon rotates)
- Expanded children indented 16px from parent
- Badge counts on: "My Approvals" (pending count), "Safety Stock Alerts" (active alert count)
- Collapse button at sidebar bottom: `ChevronsLeft` icon

### Collapsed State (64px)
- Icons only (centered, 20px)
- Tooltip on hover shows full label
- Click on parent item opens a flyout menu showing children
- Expand button: `ChevronsRight` icon

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger icon (top-left of top bar) opens sidebar as full-height overlay drawer
- Backdrop overlay: rgba(0,0,0,0.5)
- Close on backdrop click or X button

## Breadcrumb Bar
- Height: 40px, sticky below top bar
- Format: `Home > Module > Section > [Document ID]`
- Separator: `ChevronRight` icon (12px, neutral-400)
- Each segment clickable except the last (current page)
- Maximum 4 segments displayed; earlier segments collapse to `...` dropdown
- On mobile: show only current page name with back arrow

## Navigation Items (with Lucide icons)

| Icon | Label | Children |
|---|---|---|
| `LayoutDashboard` | Dashboard | -- |
| `ClipboardList` | Procurement | Purchase Requisitions, Purchase Orders, RFQ & Quotations, Goods Receipts |
| `Package` | Inventory | Stock Overview, Material Issue Notices, Material Issue Requests, Stock Transfers, Cycle Counts, Safety Stock Alerts |
| `Factory` | Manufacturing | Work Orders, Subcontract Orders, Production Progress |
| `GitBranch` | Engineering | Item Master, Item Revisions, Bill of Materials, ECR / ECO, Documents |
| `ShieldCheck` | Quality | Inspections, Nonconformance, CAPA, Traceability |
| `Truck` | Sales | Sales Orders, Shipments, Genealogy Reports |
| `DollarSign` | Finance | Costing, AP Reconciliation, Integration Status |
| `BarChart3` | Reports | Operational Dashboards, Compliance Reports, Custom Reports |
| `Settings` | Admin | Users & Roles, Approval Policies, Custom Fields, Safety Stock Policies, System Configuration, Integration Settings |

## Notification Dropdown
- Width: 380px, anchored to bell icon
- Header: "Notifications" with "Mark all read" link
- Each notification: icon (by type) + title + timestamp (relative: "2 hours ago") + unread dot
- Types:
  - Approval Request (primary-500 icon): "PR-2024-0047 awaits your approval"
  - Alert (warning-500 icon): "Low stock: Widget-A below safety threshold"
  - System (info-500 icon): "ECO-2024-0012 has been released"
- Footer: "View All Notifications" link → full notifications page
- Maximum 5 items in dropdown

## Responsive Behavior

| Breakpoint | Top Bar | Sidebar | Breadcrumb |
|---|---|---|---|
| >= 1024px (desktop) | Full layout | Expanded (240px) or collapsed (64px) by user pref | Full path |
| 768-1023px (tablet) | Search collapses to icon | Collapsed (64px) | Truncated to 2 segments |
| < 768px (mobile) | Logo + hamburger + bell + avatar | Hidden, overlay drawer | Back arrow + current page |

## Design Tokens Applied
- Top bar bg: `--color-neutral-0` (#FFFFFF) with `--shadow-sm` bottom border
- Sidebar bg: `--color-neutral-100` (#F1F5F9)
- Content area bg: `--color-neutral-50` (#F8FAFC)
- Active nav accent: `--color-primary-600` (#2563EB)
- All transitions: `--duration-normal` (200ms), `--easing-default`
