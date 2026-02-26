import type { SafetyStockAlertConfig } from '@/types'

export const defaultSafetyStockAlertConfig: SafetyStockAlertConfig = {
  enabled: true,
  notifyOnLow: true,
  notifyOnCritical: true,
  criticalThresholdPctBelowSafety: 20,
  sendMode: 'digest_daily',
  digestTime: '09:00',
  cooldownHours: 8,
  recipients: {
    roles: ['supply_chain_manager', 'warehouse_staff'],
    departments: ['供应链', '仓储部'],
    userIds: [],
    extraEmails: [],
  },
  template: {
    subject: '[Agilis ERP] 安全库存预警 - {{level}} ({{count}}项)',
    body: '触发时间: {{triggeredAt}}\n告警级别: {{level}}\n条目数: {{count}}\n\n明细:\n{{items}}',
  },
}

