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
  approvals: 'nav.approvals',
  procurement: 'nav.procurement',
  'purchase-requisitions': 'nav.pr_list',
  'purchase-orders': 'nav.po_list',
  rfq: 'nav.rfq',
  'goods-receipts': 'nav.goods_receipt',
  'goods-returns': 'nav.goods_return',
  inventory: 'nav.inventory',
  stock: 'nav.stock_overview',
  'material-issue-notices': 'nav.material_withdrawal_confirmation',
  'material-issue-requests': 'nav.material_withdrawal_request',
  transfers: 'nav.stock_transfers',
  'cycle-counts': 'nav.cycle_count',
  'safety-stock-alerts': 'nav.safety_stock',
  manufacturing: 'nav.manufacturing',
  'work-orders': 'nav.work_orders',
  'subcontract-orders': 'nav.subcontract',
  'production-progress': 'nav.production_progress',
  engineering: 'nav.engineering',
  items: 'nav.item_master',
  bom: 'nav.bom',
  comparison: 'nav.bom_comparison',
  'ecr-eco': 'nav.ecr_eco',
  ecr: 'nav.ecr_eco',
  documents: 'nav.documents',
  quality: 'nav.quality',
  inspections: 'nav.inspections',
  complaints: 'nav.complaints',
  nonconformance: 'nav.nc_capa',
  'internal-qc': 'nav.internal_qc',
  templates: 'nav.qc_templates',
  traceability: 'nav.traceability',
  sales: 'nav.order_management',
  orders: 'nav.sales_orders',
  planning: 'nav.sales_planning',
  forecasts: 'nav.sales_forecasts',
  finance: 'nav.finance',
  costing: 'nav.costing',
  'payment-requests': 'nav.payment_requests',
  'ap-reconciliation': 'nav.ap_reconciliation',
  'integration-status': 'nav.integration',
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
      if (
        /^[0-9a-f-]{36}$/i.test(part) ||
        /^\d+$/.test(part) ||
        /^[A-Z]{1,5}-\d{4}-[\w-]+$/i.test(part)
      ) {
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
