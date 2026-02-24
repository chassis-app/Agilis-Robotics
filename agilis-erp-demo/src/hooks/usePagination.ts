import { useMemo, useState } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

interface UsePaginationResult<T> {
  page: number
  pageSize: number
  total: number
  totalPages: number
  paginatedData: T[]
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> {
  const { initialPage = 1, initialPageSize = 10 } = options
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Clamp page to valid range when data or pageSize changes
  const clampedPage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const start = (clampedPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, clampedPage, pageSize])

  const setPageSize = (size: number) => {
    setPageSizeState(size)
    setPage(1)
  }

  const safeSetPage = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages))
    setPage(clamped)
  }

  return {
    page: clampedPage,
    pageSize,
    total,
    totalPages,
    paginatedData,
    setPage: safeSetPage,
    setPageSize,
  }
}
