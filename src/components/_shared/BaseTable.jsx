import { Table } from '@/components/ui/table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getObjValueByPath } from '@/utils/helper'
import BaseTableHeader from './BaseTableHeader'
import BaseTableBody from './BaseTableBody'

export default function BaseTable({
  columns,
  data,
  onRowAction,

  // PROPS CLIENT-SIDE (CS)
  searchBaseUrl = '',
  searchTerm = '',
  searchFields = [],

  // PROPS SERVER-SIDE (SS)
  serverSide = false,
  sortConfig: ssSortConfig, // sortConfig dari induk (Server-Side)
  onSortChange: ssOnSortChange, // setter sortConfig dari induk (Server-Side)

  // PROPS UMUM
  isLoading = false,
  renderExpandedContent = null,
  allowMultipleExpand = false,
  canRowExpand = () => true,
  renderRowActionsBelow = null,
}) {
  // Hanya gunakan hooks Next.js jika tidak dalam mode Server-Side
  const router = serverSide ? null : useRouter()
  const pathname = serverSide ? null : usePathname()
  const searchParams = serverSide ? null : useSearchParams()

  // State Sorting Internal (Hanya digunakan untuk Client-Side)
  const initialSortKey = searchParams?.get('sortKey') || null
  const initialSortDirection = searchParams?.get('sortDir') || 'none'
  const [csSortConfig, setCsSortConfig] = useState({
    key: initialSortKey,
    direction: initialSortDirection,
  })

  // Pilih konfigurasi sorting yang digunakan
  const sortConfig = serverSide ? ssSortConfig : csSortConfig
  const setSortConfig = serverSide ? ssOnSortChange : setCsSortConfig

  // Handler untuk Sorting
  const handleSort = useCallback(
    (key) => {
      // Gunakan setSortConfig yang sesuai (CS atau SS)
      setSortConfig((prev) => {
        if (prev.key === key) {
          const next =
            prev.direction === 'asc'
              ? 'desc'
              : prev.direction === 'desc'
                ? 'none'
                : 'asc'
          return { key, direction: next }
        }
        return { key, direction: 'asc' }
      })
    },
    [setSortConfig]
  ) // setSortConfig adalah dependency yang akan berubah antara CS/SS

  // Logic URL Sync (Hanya untuk Client-Side)
  const buildQueryString = useCallback((search, sortKey, sortDir) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sortKey && sortDir !== 'none') {
      params.set('sortKey', sortKey)
      params.set('sortDir', sortDir)
    }
    return params.toString()
  }, [])

  // Effect untuk URL Sync (Hanya berjalan di mode Client-Side)
  useEffect(() => {
    if (serverSide || !router || !searchParams || !pathname) return

    const basePath = searchBaseUrl || pathname
    const nextQuery = buildQueryString(
      searchTerm,
      sortConfig.key,
      sortConfig.direction
    )
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return

    const nextUrl = nextQuery ? `${basePath}?${nextQuery}` : basePath
    router.replace(nextUrl, { scroll: false })
  }, [
    serverSide,
    searchBaseUrl,
    pathname,
    buildQueryString,
    router,
    searchParams,
    searchTerm,
    sortConfig.key,
    sortConfig.direction,
  ])

  // Filtering dan Sorting Data (Hanya berjalan di mode Client-Side)
  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : []

    // Jika mode Server-Side, kembalikan data mentah dari prop
    if (serverSide) return data

    // --- LOGIC CLIENT-SIDE FILTERING ---
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = getObjValueByPath(item, field)
          return value && value.toString().toLowerCase().includes(term)
        })
      )
    }

    // --- LOGIC CLIENT-SIDE SORTING ---
    if (sortConfig.key && sortConfig.direction !== 'none') {
      const { key, direction } = sortConfig
      result.sort((a, b) => {
        const aValue = getObjValueByPath(a, key)
        const bValue = getObjValueByPath(b, key)
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return direction === 'asc' ? -1 : 1
        if (bValue == null) return direction === 'asc' ? 1 : -1
        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, serverSide, searchFields, searchTerm, sortConfig])

  return (
    <div className="rounded-md border">
      <Table>
        <BaseTableHeader
          columns={columns}
          handleSort={handleSort}
          sortConfig={sortConfig}
        />
        <BaseTableBody
          columns={columns}
          data={filteredData}
          onRowAction={onRowAction}
          isLoading={isLoading}
          renderExpandedContent={renderExpandedContent}
          allowMultipleExpand={allowMultipleExpand}
          canRowExpand={canRowExpand}
          renderRowActionsBelow={renderRowActionsBelow || (() => null)}
        />
      </Table>
    </div>
  )
}
