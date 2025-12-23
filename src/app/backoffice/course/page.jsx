'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Search, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useGetAllCourseAdmin,
  useDeleteCourseAdminMutation,
} from '@/hooks/course.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { formatCurrency } from '@/utils/helper'

import PaginationControls from '@/components/layout/pagination/PaginationControls'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

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
  const itemsPerPage = 8

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

  const handleManageCourse = (id) => {
    router.push(`/backoffice/course/${id}/manage`)
  }

  const handleSortDropdown = (e) => {
    const value = e.target.value
    const [key, direction] = value.split(':')
    setSortConfig({ key, direction })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 bg-white pl-10 text-sm"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              className="border-input focus:ring-ring h-9 cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-xs focus:ring-1 focus:outline-none"
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
              size={12}
              className="pointer-events-none absolute top-2.5 right-2 text-gray-400"
            />
          </div>
        </div>

        <Link href="/backoffice/course/create">
          <Button
            size="sm"
            className="h-9 bg-[#0E1B50] text-white shadow-sm hover:bg-blue-900"
          >
            <Plus className="mr-2 size-4" /> Add Course
          </Button>
        </Link>
      </div>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-gray-50 text-sm text-gray-400">
          No courses found.
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group flex flex-col overflow-hidden border-gray-200 transition-all hover:shadow-md"
            >
              {/* Image Section - Tinggi dikurangi jadi h-32 */}
              <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                <img
                  src={
                    course.cover_uri ||
                    course.image_cover ||
                    '/assets/images/img-image-placeholder.png'
                  }
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-gray-800 shadow-sm backdrop-blur-sm">
                    {formatCurrency(course.price)}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <h3
                    className="mb-1 line-clamp-1 text-sm leading-tight font-bold text-gray-900"
                    title={course.title}
                  >
                    {course.title}
                  </h3>
                  <p className="mb-3 font-mono text-[10px] font-medium text-gray-500">
                    {course.code}
                  </p>

                  {/* Status Badges - Extra Compact */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <InfoBadge
                      isOpen={course.is_open_registration_member}
                      label="Member"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <InfoBadge
                      isOpen={course.is_open_registration_mentor}
                      label="Mentor"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1 bg-[#0E1B50] text-[11px] font-medium text-white hover:bg-blue-900"
                    onClick={() => handleManageCourse(course.id)}
                  >
                    <Pencil className="mr-1.5 size-3" /> Manage Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {meta && (
        <div className="mt-2 border-t pt-4">
          <PaginationControls
            totalItems={meta.totalItems}
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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

// Komponen Info Badge (Extra Compact)
function InfoBadge({ isOpen, label }) {
  return (
    <div
      className={`inline-flex flex-1 items-center justify-center rounded border py-0.5 text-center text-[9px] leading-none font-bold tracking-wide uppercase ${
        isOpen
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <span className="mr-1">{isOpen ? 'Open' : 'Closed'}</span>
      <span className="font-normal normal-case opacity-60">{label}</span>
    </div>
  )
}
