import { create } from 'zustand'
import { items } from '@/mock/items'
import { parseRevisionIndex, toRevisionNumber } from '@/lib/item-version'
import type { PartVersion } from '@/types'

interface EngineeringState {
  versionsByPart: Record<string, PartVersion[]>
  createDraftVersion: (partId: string, changeNote: string, createdBy?: string) => PartVersion
  releaseVersion: (partId: string, version: string) => void
  markVersionObsolete: (partId: string, version: string) => void
  getVersions: (partId: string) => PartVersion[]
  getReleasedVersion: (partId: string) => PartVersion | null
  resetVersions: () => void
}

const seedRevisionHistory: Record<string, Array<{ version: string; date: string; note: string; by: string }>> = {
  itm01: [{ version: '01', date: '2024-06-15', note: 'Initial release', by: 'Zhang Wei' }],
  itm02: [
    { version: '01', date: '2024-03-01', note: 'Initial release', by: 'Zhang Wei' },
    { version: '02', date: '2024-08-20', note: 'Material spec update', by: 'Wang Fang' },
  ],
  itm04: [
    { version: '01', date: '2024-01-10', note: 'Initial release', by: 'Zhang Wei' },
    { version: '02', date: '2024-05-15', note: 'Communication module added', by: 'Wang Fang' },
    { version: '03', date: '2024-09-20', note: 'ARM processor upgrade', by: 'Zhang Wei' },
  ],
  itm10: [
    { version: '01', date: '2024-02-01', note: 'Initial release', by: 'Zhang Wei' },
    { version: '02', date: '2024-07-10', note: 'Reference block precision improved', by: 'Wang Fang' },
  ],
  itm12: [
    { version: '01', date: '2023-12-01', note: 'Initial release', by: 'Zhang Wei' },
    { version: '02', date: '2024-02-15', note: 'Firmware optimized', by: 'Wang Fang' },
    { version: '03', date: '2024-06-01', note: 'Motion control algorithm update', by: 'Zhang Wei' },
    { version: '04', date: '2024-10-01', note: 'Safety protocol upgrade', by: 'Wang Fang' },
  ],
}

function getNextVersionLabel(existingVersions: string[]): string {
  const maxVersion = existingVersions.reduce((max, current) => Math.max(max, parseRevisionIndex(current)), 0)
  return String(maxVersion + 1).padStart(2, '0')
}

function buildInitialVersions(): Record<string, PartVersion[]> {
  const output: Record<string, PartVersion[]> = {}

  items.forEach((item) => {
    const history = seedRevisionHistory[item.id] ?? [
      { version: toRevisionNumber(item.revision) || '01', date: '2024-01-01', note: 'Initial release', by: 'System' },
    ]

    output[item.id] = history.map((entry, index) => ({
      id: `${item.id}-${entry.version}`,
      partId: item.id,
      version: toRevisionNumber(entry.version) || entry.version,
      status: index === history.length - 1 ? 'released' : 'obsolete',
      effectiveFrom: entry.date,
      changeNote: entry.note,
      createdAt: `${entry.date}T00:00:00Z`,
      createdBy: entry.by || 'System',
    }))
  })

  return output
}

const initialVersions = buildInitialVersions()

export const useEngineeringStore = create<EngineeringState>((set, get) => ({
  versionsByPart: initialVersions,

  createDraftVersion: (partId, changeNote, createdBy = 'Demo Engineer') => {
    const existing = get().versionsByPart[partId] ?? []
    const nextVersion = getNextVersionLabel(existing.map((entry) => entry.version))
    const now = new Date().toISOString()
    const nextEntry: PartVersion = {
      id: `${partId}-${nextVersion}-${now}`,
      partId,
      version: nextVersion,
      status: 'draft',
      effectiveFrom: '',
      changeNote: changeNote || 'Draft update',
      createdAt: now,
      createdBy,
    }

    set((state) => ({
      versionsByPart: {
        ...state.versionsByPart,
        [partId]: [...(state.versionsByPart[partId] ?? []), nextEntry],
      },
    }))

    return nextEntry
  },

  releaseVersion: (partId, version) => {
    const today = new Date().toISOString().slice(0, 10)
    set((state) => ({
      versionsByPart: {
        ...state.versionsByPart,
        [partId]: (state.versionsByPart[partId] ?? []).map((entry) => {
          if (entry.version === version) {
            return {
              ...entry,
              status: 'released',
              effectiveFrom: entry.effectiveFrom || today,
            }
          }
          if (entry.status === 'released') {
            return { ...entry, status: 'obsolete' }
          }
          return entry
        }),
      },
    }))
  },

  markVersionObsolete: (partId, version) => {
    set((state) => ({
      versionsByPart: {
        ...state.versionsByPart,
        [partId]: (state.versionsByPart[partId] ?? []).map((entry) =>
          entry.version === version ? { ...entry, status: 'obsolete' } : entry,
        ),
      },
    }))
  },

  getVersions: (partId) => {
    const versions = get().versionsByPart[partId] ?? []
    return [...versions].sort((a, b) => parseRevisionIndex(b.version) - parseRevisionIndex(a.version))
  },

  getReleasedVersion: (partId) => {
    const versions = get().versionsByPart[partId] ?? []
    const released = versions.filter((entry) => entry.status === 'released')
    if (released.length === 0) return null
    return [...released].sort((a, b) => parseRevisionIndex(b.version) - parseRevisionIndex(a.version))[0]
  },

  resetVersions: () => {
    set({ versionsByPart: buildInitialVersions() })
  },
}))
