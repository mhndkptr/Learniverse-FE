'use client'

import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Pencil, Plus, Search, Trash2, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function BackofficeModulePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialSearchTerm = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const initialSortKey = searchParams.get('sortKey') || null
  const initialSortDirection = searchParams.get('sortDir') || 'none'
  const [sortConfig, setSortConfig] = useState({
    key: initialSortKey,
    direction: initialSortDirection,
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Dummy data default, akan diganti oleh localStorage jika ada
  const [modules, setModules] = useState([
    {
      id: 'mod-001',
      title: 'Intro to React',
      description: 'Frontend 101',
      filename: 'react-101.pdf',
    },
  ])
  const [hasLoaded, setHasLoaded] = useState(false)
  const isLoading = false
  const isPending = false
  const pagination = {
    totalItems: 12,
    totalPages: 2,
    currentPage: 1,
    itemsPerPage: 10,
  }

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    file: null,
  })

  // Load modules dari localStorage (sekali di mount)
  useEffect(() => {
    const stored = localStorage.getItem('modules')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setModules(parsed.length ? parsed : modules)
      } catch (e) {
        console.error('Failed to parse modules from localStorage', e)
      }
    } else {
      // seed default
      localStorage.setItem('modules', JSON.stringify(modules))
    }
    setHasLoaded(true)
  }, [])

  // Sinkronkan perubahan modules ke localStorage
  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem('modules', JSON.stringify(modules))
  }, [modules, hasLoaded])

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
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [
    pathname,
    buildQueryString,
    router,
    searchParams,
    debouncedSearchTerm,
    sortConfig.key,
    sortConfig.direction,
  ])

  const [showEditModal, setShowEditModal] = useState({
    data: null,
    status: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState({
    data: null,
    status: false,
  })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { setBreadcrumb } = useBackofficeBreadcrumb()
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Module', href: '/backoffice/module' },
    ])
  }, [setBreadcrumb])

  const columns = useMemo(
    () => [
      { key: 'title', header: 'Module Title', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
      { key: 'filename', header: 'Filename', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        sortable: false,
        actions: [
          { label: 'Edit', action: 'edit', icon: Pencil },
          { label: 'Delete', action: 'delete', icon: Trash2 },
        ],
      },
    ],
    []
  )

  const searchFields = useMemo(() => ['title', 'course'], [])

  const handleRowAction = (action, row) => {
    const rowData = row?.original || row
    switch (action) {
      case 'edit':
        if (rowData?.id) {
          router.push(`/backoffice/module/edit/${rowData.id}`)
        }
        break
      case 'delete':
        setShowDeleteModal({ data: rowData, status: true })
        break
      default:
        break
    }
  }

  const handleDelete = () => {
    if (!showDeleteModal.data?.id) {
      setShowDeleteModal({ data: null, status: false })
      return
    }

    setDeleteLoading(true)
    try {
      const currentId = showDeleteModal.data.id
      const next = modules.filter((m) => m.id !== currentId)
      setModules(next)
      localStorage.setItem('modules', JSON.stringify(next))
    } catch (e) {
      console.error('Failed to delete module', e)
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal({ data: null, status: false })
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="text-2xl font-bold">Module</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative w-full max-w-sm">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search module..."
              className="py-2 pl-10"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50 select-none" />
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="primary" asChild>
            <Link href="/backoffice/module/add">
              <Plus className="size-4" /> Add
            </Link>
          </Button>
        </div>
      </div>

      <BaseTable
        data={modules}
        searchFields={searchFields}
        searchTerm={searchTerm}
        onRowAction={handleRowAction}
        columns={columns}
        isLoading={isLoading || isPending}
        serverSide={true}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      {pagination && (
        <PaginationControls
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={(page) => {
            if (page !== currentPage && !isLoading && !isPending) {
              setCurrentPage(page)
            }
          }}
        />
      )}

      {showDeleteModal.status && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setShowDeleteModal({ data: null, status: false })}
          />
          <div className="animate-in fade-in zoom-in relative z-10 mx-4 w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl duration-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-yellow-100 shadow-sm">
              <TriangleAlert className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Are You Sure?!
            </h3>
            <p className="mb-8 text-sm font-medium text-gray-500">
              This will be permanently deleted!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="rounded-lg bg-[#9F1239] px-6 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-[#881337]"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() =>
                  setShowDeleteModal({ data: null, status: false })
                }
                className="rounded-lg bg-[#0F172A] px-6 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-[#1e293b]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
