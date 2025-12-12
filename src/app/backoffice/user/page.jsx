'use client'

import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Search, RefreshCcw, ArrowUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetAllUser } from '@/hooks/user.hook'

// Dropdown Sort
const SortDropdown = ({ sortConfig, onSortChange, options }) => {
  return (
    <div className="relative">
      <select
        className="border-input focus:ring-ring h-10 cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-sm focus:ring-1 focus:outline-none"
        onChange={(e) => {
          const [key, direction] = e.target.value.split(':')
          onSortChange({ key, direction })
        }}
        value={`${sortConfig.key}:${sortConfig.direction}`}
      >
        <option value=":none" disabled>
          Sort By
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ArrowUpDown
        size={14}
        className="pointer-events-none absolute top-3 right-2 text-gray-400"
      />
    </div>
  )
}

export default function BackofficeUserPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- STATE ---
  const initialSearchTerm = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get('sortKey') || 'created_at',
    direction: searchParams.get('sortDir') || 'desc',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // --- BREADCRUMB ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'User', href: '/backoffice/user' },
    ])
  }, [setBreadcrumb])

  // --- FETCH DATA REAL ---
  const { users, meta, isLoading, refetch } = useGetAllUser({
    params: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
      search: debouncedSearchTerm,
      order_by: [{ field: sortConfig.key, direction: sortConfig.direction }],
    },
  })

  // --- URL SYNC ---
  const buildQueryString = useCallback((search, sortKey, sortDir) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sortKey && sortDir !== 'none') {
      params.set('sortKey', sortKey)
      params.set('sortDir', sortDir)
    }
    return params.toString()
  }, [])

  useEffect(() => {
    const nextQuery = buildQueryString(
      debouncedSearchTerm,
      sortConfig.key,
      sortConfig.direction
    )
    if (nextQuery === searchParams.toString()) return
    router.replace(`${pathname}?${nextQuery}`, { scroll: false })
  }, [
    debouncedSearchTerm,
    sortConfig,
    pathname,
    router,
    searchParams,
    buildQueryString,
  ])

  // --- COLUMNS ---
  const columns = useMemo(
    () => [
      { key: 'name', header: 'Name' },
      { key: 'username', header: 'Username' },
      { key: 'email', header: 'Email' },
      { key: 'phone_number', header: 'Phone' },
      {
        key: 'role',
        header: 'Role',
        render: (row) => {
          const roleClass =
            {
              ADMIN: 'bg-red-600 text-white',
              STUDENT: 'bg-gray-700 text-white',
              MENTOR: 'bg-blue-600 text-white',
            }[row.role] || 'bg-gray-200 text-gray-800'

          return (
            <Badge className={`rounded-sm uppercase ${roleClass}`}>
              {row.role}
            </Badge>
          )
        },
      },
    ],
    []
  )

  const searchFields = useMemo(() => ['name', 'username', 'email', 'role'], [])

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Registered User</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4 text-gray-500" />
          </Button>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user..."
              className="bg-white py-2 pl-10"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
          </div>

          {/* Sort Dropdown */}
          <SortDropdown
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            options={[
              { value: 'created_at:desc', label: 'Newest' },
              { value: 'created_at:asc', label: 'Oldest' },
              { value: 'name:asc', label: 'Name (A-Z)' },
              { value: 'name:desc', label: 'Name (Z-A)' },
              { value: 'role:asc', label: 'Role (A-Z)' },
              { value: 'role:desc', label: 'Role (Z-A)' },
            ]}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-md border bg-white shadow-sm">
          <BaseTable
            data={users}
            columns={columns}
            isLoading={isLoading}
            serverSide={true}
            searchFields={searchFields}
            searchTerm={searchTerm}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            onRowAction={() => {}}
          />

          {/* PAGINATION */}
          <div className="border-t p-4">
            <PaginationControls
              totalItems={meta?.totalItems || 0}
              totalPages={meta?.totalPages || 1}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}
