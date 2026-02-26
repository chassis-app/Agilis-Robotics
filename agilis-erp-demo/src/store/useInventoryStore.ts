import { create } from 'zustand'
import { stockSummaries as seedStockSummaries } from '@/mock/inventory'
import type { Lot, LotAllocation, StockSummary } from '@/types'

type QualityStatus = 'available' | 'quarantine'

export interface InventoryLotState extends Omit<Lot, 'quantity' | 'status'> {
  onHandQty: number
  reservedQty: number
  qualityStatus: QualityStatus
}

export interface InventoryItemState {
  itemId: string
  itemNo: string
  itemName: string
  itemNameEn: string
  uom: string
  safetyStock: number
  reorderPoint: number
  lots: InventoryLotState[]
}

export interface FifoAllocationResult {
  itemId: string
  requestedQty: number
  allocations: LotAllocation[]
  allocatedQty: number
  shortageQty: number
  canAllocateFull: boolean
}

interface InventoryState {
  stockItems: InventoryItemState[]
  stockSummaries: StockSummary[]
  lastPreview: FifoAllocationResult | null
  lastIssue: FifoAllocationResult | null
  previewFifoAllocation: (itemId: string, requestedQty: number) => FifoAllocationResult
  issueByFifo: (itemId: string, requestedQty: number) => FifoAllocationResult
  resetInventory: () => void
}

function normalizeQty(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.floor(value)
}

function getLotAvailableQty(lot: InventoryLotState): number {
  return Math.max(0, lot.onHandQty - lot.reservedQty)
}

function sortLotsForFifo(lots: InventoryLotState[]): InventoryLotState[] {
  return [...lots].sort((a, b) => {
    const dateCompare = a.receivedDate.localeCompare(b.receivedDate)
    if (dateCompare !== 0) return dateCompare
    return a.lotNo.localeCompare(b.lotNo)
  })
}

function allocateByFifo(lots: InventoryLotState[], requestedQty: number): FifoAllocationResult {
  const targetQty = normalizeQty(requestedQty)
  let remaining = targetQty
  const allocations: LotAllocation[] = []

  for (const lot of sortLotsForFifo(lots)) {
    if (lot.qualityStatus === 'quarantine') continue
    if (remaining <= 0) break

    const availableQty = getLotAvailableQty(lot)
    if (availableQty <= 0) continue

    const qty = Math.min(availableQty, remaining)
    allocations.push({
      lotId: lot.id,
      lotNo: lot.lotNo,
      receivedDate: lot.receivedDate,
      quantity: qty,
    })
    remaining -= qty
  }

  const allocatedQty = targetQty - remaining
  return {
    itemId: lots[0]?.itemId ?? '',
    requestedQty: targetQty,
    allocations,
    allocatedQty,
    shortageQty: remaining,
    canAllocateFull: remaining === 0,
  }
}

function mapToStockSummary(item: InventoryItemState): StockSummary {
  const totalQty = item.lots.reduce((sum, lot) => sum + lot.onHandQty, 0)
  const reservedQty = item.lots.reduce((sum, lot) => sum + Math.min(lot.reservedQty, lot.onHandQty), 0)
  const availableQty = Math.max(0, totalQty - reservedQty)

  return {
    itemId: item.itemId,
    itemNo: item.itemNo,
    itemName: item.itemName,
    itemNameEn: item.itemNameEn,
    totalQty,
    availableQty,
    reservedQty,
    uom: item.uom,
    lots: sortLotsForFifo(item.lots).map((lot): Lot => ({
      id: lot.id,
      lotNo: lot.lotNo,
      itemId: lot.itemId,
      itemName: lot.itemName,
      itemNo: lot.itemNo,
      quantity: lot.onHandQty,
      warehouseId: lot.warehouseId,
      warehouseName: lot.warehouseName,
      location: lot.location,
      status: lot.qualityStatus === 'quarantine'
        ? 'quarantine'
        : lot.onHandQty <= 0
          ? 'consumed'
          : lot.reservedQty >= lot.onHandQty
            ? 'reserved'
            : 'available',
      receivedDate: lot.receivedDate,
      expiryDate: lot.expiryDate,
      grnId: lot.grnId,
      supplierId: lot.supplierId,
    })),
    safetyStock: item.safetyStock,
    reorderPoint: item.reorderPoint,
  }
}

function buildInitialStockItems(): InventoryItemState[] {
  return seedStockSummaries.map((item) => ({
    itemId: item.itemId,
    itemNo: item.itemNo,
    itemName: item.itemName,
    itemNameEn: item.itemNameEn,
    uom: item.uom,
    safetyStock: item.safetyStock,
    reorderPoint: item.reorderPoint,
    lots: item.lots.map((lot) => ({
      ...lot,
      onHandQty: lot.quantity,
      reservedQty: lot.status === 'reserved' ? lot.quantity : 0,
      qualityStatus: lot.status === 'quarantine' ? 'quarantine' : 'available',
    })),
  }))
}

const initialStockItems = buildInitialStockItems()
const buildStockSummaries = (items: InventoryItemState[]) => items.map(mapToStockSummary)

export const useInventoryStore = create<InventoryState>((set, get) => ({
  stockItems: initialStockItems,
  stockSummaries: buildStockSummaries(initialStockItems),
  lastPreview: null,
  lastIssue: null,

  previewFifoAllocation: (itemId, requestedQty) => {
    const item = get().stockItems.find((entry) => entry.itemId === itemId)
    const result: FifoAllocationResult = item
      ? allocateByFifo(item.lots, requestedQty)
      : {
          itemId,
          requestedQty: normalizeQty(requestedQty),
          allocations: [],
          allocatedQty: 0,
          shortageQty: normalizeQty(requestedQty),
          canAllocateFull: false,
        }

    set({ lastPreview: result })
    return result
  },

  issueByFifo: (itemId, requestedQty) => {
    const targetQty = normalizeQty(requestedQty)
    const item = get().stockItems.find((entry) => entry.itemId === itemId)
    const result: FifoAllocationResult = item
      ? allocateByFifo(item.lots, targetQty)
      : {
          itemId,
          requestedQty: targetQty,
          allocations: [],
          allocatedQty: 0,
          shortageQty: targetQty,
          canAllocateFull: false,
        }

    if (item && result.allocations.length > 0) {
      set((state) => {
        const nextStockItems = state.stockItems.map((entry) => {
          if (entry.itemId !== itemId) return entry
          return {
            ...entry,
            lots: entry.lots.map((lot) => {
              const allocation = result.allocations.find((alloc) => alloc.lotId === lot.id)
              if (!allocation) return lot
              return {
                ...lot,
                onHandQty: Math.max(0, lot.onHandQty - allocation.quantity),
              }
            }),
          }
        })

        return {
          stockItems: nextStockItems,
          stockSummaries: buildStockSummaries(nextStockItems),
          lastIssue: result,
        }
      })
    } else {
      set({ lastIssue: result })
    }

    return result
  },

  resetInventory: () => {
    const nextStockItems = buildInitialStockItems()
    set({
      stockItems: nextStockItems,
      stockSummaries: buildStockSummaries(nextStockItems),
      lastPreview: null,
      lastIssue: null,
    })
  },
}))
