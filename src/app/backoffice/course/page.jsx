'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Search, Pencil, Trash2, ArrowUpDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useGetAllCourseAdmin,
  useDeleteCourseAdminMutation,
  useUpdateCourseAdminMutation,
} from '@/hooks/course.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { formatCurrency } from '@/utils/helper'

// REUSABLE COMPONENTS
import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'

export default function BackofficeCoursePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- STATE ---
  const initialSearch = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get('sortKey') || 'created_at',
    direction: searchParams.get('sortDir') || 'desc',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [deleteId, setDeleteId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // --- BREADCRUMB ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Courses', href: '/backoffice/course' },
    ])
  }, [setBreadcrumb])

  // --- FETCH DATA ---
  const { courses, meta, isLoading, refetch } = useGetAllCourseAdmin({
    params: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
      search: debouncedSearchTerm,
      order_by: [{ field: sortConfig.key, direction: sortConfig.direction }],
    },
  })

  // --- MUTATIONS ---
  const { mutate: deleteCourse, isPending: isDeleting } =
    useDeleteCourseAdminMutation({
      onSuccess: () => {
        refetch()
        setIsDeleteDialogOpen(false)
        setDeleteId(null)
      },
    })

  const { mutate: updateCourse } = useUpdateCourseAdminMutation({
    onSuccess: () => refetch(),
  })

  // --- HANDLERS ---
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

  const handleRowAction = (action, row) => {
    if (action === 'view') {
      router.push(`/backoffice/course/${row.id}`)
    } else if (action === 'edit') {
      router.push(`/backoffice/course/${row.id}/edit`)
    } else if (action === 'delete') {
      setDeleteId(row.id)
      setIsDeleteDialogOpen(true)
    }
  }

  const handleToggleStatus = (id, field, currentValue) => {
    updateCourse({
      id,
      body: { [field]: !currentValue },
    })
  }

  const handleSortDropdown = (e) => {
    const value = e.target.value
    const [key, direction] = value.split(':')
    setSortConfig({ key, direction })
  }

  // --- COLUMN CONFIG ---
  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Course Info',
        render: (row) => (
          <div className="flex items-center gap-3 py-2">
            <div className="h-12 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
              <img
                src={
                  row.cover_uri ||
                  row.image_cover ||
                  '/assets/images/img-image-placeholder.png'
                }
                alt={row.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-1 font-semibold text-gray-900">
                {row.title}
              </p>
              <p className="font-mono text-xs text-gray-500">{row.code}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'is_open_registration_member',
        header: 'Member Reg.',
        render: (row) => (
          <StatusBadge
            isOpen={row.is_open_registration_member}
            onClick={() =>
              handleToggleStatus(
                row.id,
                'is_open_registration_member',
                row.is_open_registration_member
              )
            }
          />
        ),
      },
      {
        key: 'is_open_registration_mentor',
        header: 'Mentor Reg.',
        render: (row) => (
          <StatusBadge
            isOpen={row.is_open_registration_mentor}
            onClick={() =>
              handleToggleStatus(
                row.id,
                'is_open_registration_mentor',
                row.is_open_registration_mentor
              )
            }
          />
        ),
      },
      {
        key: 'price',
        header: 'Price',
        render: (row) => (
          <span className="font-medium text-gray-700">
            {formatCurrency(row.price)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="View Detail"
              onClick={() => handleRowAction('view', row)}
              className="text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              title="Edit Course"
              onClick={() => handleRowAction('edit', row)}
              className="text-gray-500 hover:bg-amber-50 hover:text-amber-600"
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              title="Delete Course"
              onClick={() => handleRowAction('delete', row)}
              className="text-gray-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white pl-10"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
          </div>

          <div className="relative">
            <select
              className="border-input focus:ring-ring h-10 cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-sm focus:ring-1 focus:outline-none"
              onChange={handleSortDropdown}
              value={`${sortConfig.key}:${sortConfig.direction}`}
            >
              <option value="created_at:desc">Newest Created</option>
              <option value="created_at:asc">Oldest Created</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="title:asc">Name: A-Z</option>
            </select>
            <ArrowUpDown
              size={14}
              className="pointer-events-none absolute top-3 right-2 text-gray-400"
            />
          </div>
        </div>

        <Button
          className="bg-[#0E1B50] text-white shadow-sm hover:bg-blue-900"
          onClick={() => router.push('/backoffice/course/create')}
        >
          <Plus className="mr-2 size-4" /> Add Course
        </Button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="flex min-h-[65vh] flex-col justify-between rounded-md bg-white">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 &&
            courses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="flex w-full items-center gap-3 rounded-md border p-4 shadow-md"
                >
                  <div className="h-full w-[30%] shrink-0 overflow-hidden rounded bg-gray-100">
                    <img
                      src={
                        course.cover_uri ||
                        course.image_cover ||
                        '/assets/images/img-image-placeholder.png'
                      }
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-full min-w-0 space-y-4">
                    <div className="flex w-full justify-between">
                      <div>
                        <p className="line-clamp-1 text-xl font-semibold text-gray-900">
                          {course.title}
                        </p>
                        <p className="font-mono text-xs text-gray-500">
                          {course.code}
                        </p>
                      </div>

                      <div>{formatCurrency(course.price)}</div>
                    </div>
                    <div className="flex gap-3">
                      <StatusBadge
                        isOpen={course.is_open_registration_member}
                        openText="Open Member"
                        closeText="Closed Member"
                        onClick={() => {}}
                      />

                      <StatusBadge
                        isOpen={course.is_open_registration_mentor}
                        openText="Open Mentor"
                        closeText="Closed Mentor"
                        onClick={() => {}}
                      />
                    </div>
                    <Button
                      className="bg-amber-600 text-white hover:bg-amber-700"
                      onClick={() =>
                        router.push(`/backoffice/course/${course.id}/manage`)
                      }
                    >
                      <Pencil className="mr-2 size-4" /> Manage Course
                    </Button>
                  </div>
                </div>
              )
            })}
        </div>

        {meta && (
          <div className="border-t p-4">
            <PaginationControls
              totalItems={meta.totalItems}
              totalPages={meta.totalPages}
              currentPage={meta.currentPage}
              itemsPerPage={meta.itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}
      <ConfirmDialogDelete
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteId && deleteCourse(deleteId)}
        title="Delete Course"
        isLoading={isDeleting}
      />
    </div>
  )
}

function StatusBadge({
  isOpen,
  onClick,
  openText = 'Open',
  closeText = 'Closed',
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
        isOpen
          ? 'border-green-200 bg-green-100 text-green-800 hover:bg-green-200'
          : 'border-red-200 bg-red-100 text-red-800 hover:bg-red-200'
      }`}
    >
      {isOpen ? openText : closeText}
    </button>
  )
}
