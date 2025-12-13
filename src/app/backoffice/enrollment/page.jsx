'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Filter, RefreshCcw } from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Hooks & Utils
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useEnrollmentList } from '@/hooks/enrollment.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { formatCurrency, formatDate } from '@/utils/helper'

export default function BackofficeEnrollmentPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- STATE ---
  const initialSearch = searchParams.get('search') || ''
  const initialStatus = searchParams.get('status') || 'all'

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState(initialStatus)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sortOption, setSortOption] = useState('created_desc')

  // --- BREADCRUMB ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Enrollments', href: '/backoffice/enrollment' },
    ])
  }, [setBreadcrumb])

  // --- FETCH DATA ---
  const { enrollments, meta, isLoading, refetch } = useEnrollmentList({
    params: {
      pagination: { page: currentPage, limit: itemsPerPage },
      search: debouncedSearchTerm,
      // Kirim filter status jika user memilih selain 'all'
      filter: filterStatus !== 'all' ? { status: filterStatus } : undefined,
      // PENTING: Minta backend untuk menyertakan data User dan Course
      include_relation: ['user', 'course'],
      order_by: [{ field: 'created_at', direction: 'desc' }],
    },
  })

  // --- DEBUGGING: CEK DATA DARI BACKEND ---
  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      console.log('🔥 DATA ENROLLMENT DARI BACKEND:', enrollments)
      console.log('Contoh Row 1 - User:', enrollments[0]?.user)
      console.log('Contoh Row 1 - Course:', enrollments[0]?.course)
    }
  }, [enrollments])

  // --- URL SYNC ---
  const buildQueryString = useCallback((search, page, status) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page)
    if (status && status !== 'all') params.set('status', status)
    return params.toString()
  }, [])

  useEffect(() => {
    const nextQuery = buildQueryString(
      debouncedSearchTerm,
      currentPage,
      filterStatus
    )
    if (nextQuery === searchParams.toString()) return
    router.replace(`${pathname}?${nextQuery}`, { scroll: false })
  }, [
    debouncedSearchTerm,
    currentPage,
    filterStatus,
    pathname,
    router,
    searchParams,
    buildQueryString,
  ])

  // --- HELPER ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'settlement':
      case 'success':
        return (
          <Badge className="border-none bg-green-100 text-green-700 hover:bg-green-100">
            Success
          </Badge>
        )
      case 'pending':
      case 'waiting_payment':
        return (
          <Badge className="border-none bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case 'failed':
      case 'deny':
      case 'cancel':
        return (
          <Badge className="border-none bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        )
      case 'expire':
        return (
          <Badge className="border-none bg-gray-100 text-gray-600 hover:bg-gray-100">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // --- TABLE COLUMNS ---
  const columns = useMemo(
    () => [
      {
        key: 'user.name',
        header: 'Student Name',
        sortable: false, // Sorting by nested relation requires backend support
        render: (row) => (
          <div className="flex flex-col">
            {/* Cek apakah data user ada */}
            <span className="font-semibold text-gray-900">
              {row.user?.name || (
                <span className="text-red-400 italic">User Not Found</span>
              )}
            </span>
            <span className="text-xs text-gray-500">
              {row.user?.role || '-'}
            </span>
          </div>
        ),
      },
      {
        key: 'user.email',
        header: 'Email',
        sortable: false,
        render: (row) => (
          <span className="text-sm text-gray-600">
            {row.user?.email || '-'}
          </span>
        ),
      },
      {
        key: 'course.title',
        header: 'Course',
        sortable: false,
        render: (row) => (
          <div className="flex max-w-[200px] flex-col">
            <span
              className="truncate text-sm font-medium text-gray-900"
              title={row.course?.title}
            >
              {row.course?.title || (
                <span className="text-red-400 italic">Deleted Course</span>
              )}
            </span>
            <span className="font-mono text-xs text-gray-400">
              {row.course?.code}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: false,
        render: (row) =>
          getStatusBadge(
            row.course_transaction?.status || row.status || 'unverified'
          ),
      },
      {
        key: 'amount',
        header: 'Price',
        sortable: false,
        render: (row) => (
          <span className="font-medium text-gray-900">
            {formatCurrency(
              Number(
                row.course_transaction?.amount ??
                  row.amount ??
                  row.course?.price ??
                  0
              ) || 0
            )}
          </span>
        ),
      },
    ],
    []
  )

  const sortedEnrollments = useMemo(() => {
    const data = [...(enrollments || [])]
    const getStatusValue = (row) =>
      (row.course_transaction?.status || row.status || 'unverified')?.toString()
    const getNameValue = (row) => row.user?.name || ''
    const getCreatedValue = (row) => row.created_at || row.joined_at || ''

    switch (sortOption) {
      case 'name_asc':
        return data.sort((a, b) => getNameValue(a).localeCompare(getNameValue(b)))
      case 'name_desc':
        return data.sort((a, b) => getNameValue(b).localeCompare(getNameValue(a)))
      case 'status_asc':
        return data.sort((a, b) =>
          getStatusValue(a).localeCompare(getStatusValue(b))
        )
      case 'status_desc':
        return data.sort((a, b) =>
          getStatusValue(b).localeCompare(getStatusValue(a))
        )
      case 'created_asc':
        return data.sort(
          (a, b) =>
            new Date(getCreatedValue(a)).getTime() -
            new Date(getCreatedValue(b)).getTime()
        )
      case 'created_desc':
      default:
        return data.sort(
          (a, b) =>
            new Date(getCreatedValue(b)).getTime() -
            new Date(getCreatedValue(a)).getTime()
        )
    }
  }, [enrollments, sortOption])

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Enrollment History</h1>
          <p className="text-muted-foreground text-sm">
            Monitor all student enrollments.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          title="Refresh Data"
        >
          <RefreshCcw className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-1 md:flex-row">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white pl-10"
          />
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={filterStatus}
            onValueChange={(val) => {
              setFilterStatus(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full bg-white md:w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="settlement">Success (Paid)</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expire">Expired</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <Select
            value={sortOption}
            onValueChange={(val) => {
              setSortOption(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full bg-white md:w-[220px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Added Time (Newest)</SelectItem>
              <SelectItem value="created_asc">Added Time (Oldest)</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="status_asc">Status (A-Z)</SelectItem>
              <SelectItem value="status_desc">Status (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <BaseTable
          data={sortedEnrollments || []}
          columns={columns}
          isLoading={isLoading}
          serverSide={false}
          onRowAction={() => {}}
        />
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
  )
}
