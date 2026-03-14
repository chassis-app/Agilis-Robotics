import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface BreadcrumbSegment {
  label: string
  path: string
}

/**
 * Map of URL path segments to i18n translation keys.
 * Dynamic segments (e.g. :id) are excluded from breadcrumbs.
 */
const segmentKeyMap: Record<string, string> = {
  '': 'common.home',
  dashboard: 'nav.dashboard',
  approvals: 'nav.approvals',
  procurement: 'nav.procurement',
  'purchase-requisitions': 'nav.pr_list',
  'purchase-orders': 'nav.po_list',
  rfq: 'nav.rfq',
  'goods-receipt': 'nav.goods_receipt',
  inventory: 'nav.inventory',
  'stock-overview': 'nav.stock_overview',
  'material-issues': 'nav.material_issues',
  'material-issue-requests': 'nav.mir_batch',
  'stock-transfers': 'nav.stock_transfers',
  'cycle-count': 'nav.cycle_count',
  'safety-stock': 'nav.safety_stock',
  manufacturing: 'nav.manufacturing',
  'work-orders': 'nav.work_orders',
  subcontract: 'nav.subcontract',
  'production-progress': 'nav.production_progress',
  engineering: 'nav.engineering',
  'item-master': 'nav.item_master',
  bom: 'nav.bom',
  'ecr-eco': 'nav.ecr_eco',
  documents: 'nav.documents',
  projects: 'nav.projects',
  quality: 'nav.quality',
  inspections: 'nav.inspections',
  'nc-capa': 'nav.nc_capa',
  traceability: 'nav.traceability',
  sales: 'nav.sales',
  'sales-orders': 'nav.sales_orders',
  finance: 'nav.finance',
  costing: 'nav.costing',
  'payment-requests': 'nav.payment_requests',
  'ap-reconciliation': 'nav.ap_reconciliation',
  integration: 'nav.integration',
  reports: 'nav.reports',
  operational: 'nav.operational',
  compliance: 'nav.compliance',
  admin: 'nav.admin',
  'users-roles': 'nav.users_roles',
  'approval-policies': 'nav.approval_policies',
  'custom-fields': 'nav.custom_fields',
  'system-config': 'nav.system_config',
}

/**
 * Returns breadcrumb segments derived from the current URL path.
 * Dynamic segments (UUIDs, numeric IDs) are filtered out.
 */
export function useBreadcrumb(): BreadcrumbSegment[] {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return useMemo(() => {
    const parts = pathname.split('/').filter(Boolean)
    const segments: BreadcrumbSegment[] = []

    let accumulated = ''
    for (const part of parts) {
      accumulated += `/${part}`

      // Skip dynamic segments (UUIDs or purely numeric IDs)
      if (/^[0-9a-f-]{36}$/i.test(part) || /^\d+$/.test(part)) {
        continue
      }

      const key = segmentKeyMap[part]
      if (key) {
        segments.push({ label: t(key), path: accumulated })
      } else {
        // Fallback: capitalize and replace hyphens
        const fallback = part
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
        segments.push({ label: fallback, path: accumulated })
      }
    }

    return segments
  }, [pathname, t])
}
