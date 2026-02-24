import type { DocumentStatus, SourcingType } from '@/types';

export interface StatusColor {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const statusColors: Record<DocumentStatus, StatusColor> = {
  draft: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', dot: '#94A3B8' },
  submitted: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', dot: '#3B82F6' },
  in_approval: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', dot: '#F59E0B' },
  approved: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
  rejected: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', dot: '#EF4444' },
  cancelled: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1', dot: '#94A3B8' },
};

export const sourcingColors: Record<SourcingType, string> = {
  purchase: '#2563EB',
  make: '#16A34A',
  subcontract: '#EA580C',
};
