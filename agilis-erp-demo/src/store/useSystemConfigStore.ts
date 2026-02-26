import { create } from 'zustand'
import type { SafetyStockAlertConfig } from '@/types'
import { defaultSafetyStockAlertConfig } from '@/mock/system-config'

interface SystemConfigState {
  safetyStockAlert: SafetyStockAlertConfig
  setSafetyStockAlert: (config: SafetyStockAlertConfig) => void
}

export const useSystemConfigStore = create<SystemConfigState>((set) => ({
  safetyStockAlert: defaultSafetyStockAlertConfig,
  setSafetyStockAlert: (safetyStockAlert) => set({ safetyStockAlert }),
}))

