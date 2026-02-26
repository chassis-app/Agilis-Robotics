function alphaToNumber(value: string): number {
  const normalized = value.trim().toUpperCase()
  if (!/^[A-Z]+$/.test(normalized)) return 0

  let output = 0
  for (const char of normalized) {
    output = output * 26 + (char.charCodeAt(0) - 64)
  }
  return output
}

export function parseRevisionIndex(revision: string): number {
  const raw = revision.trim()
  if (!raw) return 0

  if (/^\d+$/.test(raw)) {
    return Number.parseInt(raw, 10)
  }

  return alphaToNumber(raw)
}

export function toRevisionNumber(revision: string, width = 2): string {
  const index = parseRevisionIndex(revision)
  if (index <= 0) return ''
  return String(index).padStart(width, '0')
}

export function formatItemNoWithRevision(itemNo: string, revision: string): string {
  const suffix = toRevisionNumber(revision)
  if (!suffix) return itemNo
  const expectedSuffix = `-${suffix}`
  if (itemNo.endsWith(expectedSuffix)) return itemNo
  return `${itemNo}${expectedSuffix}`
}
