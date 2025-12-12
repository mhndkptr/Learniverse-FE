'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Trash2 } from 'lucide-react'

// Components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'

// Hooks & Context
import {
  useGetAllMentorAdmin,
  useDeleteMentorMutation,
} from '@/hooks/mentor.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { getTwoInitials } from '@/utils/helper'

export default function BackofficeMentorPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- STATE ---
  const initialSearch = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc',
  })

  // Delete State
  const [deleteIds, setDeleteIds] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // --- BREADCRUMB ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Mentors', href: '/backoffice/mentor' },
    ])
  }, [setBreadcrumb])

  // --- DATA FETCHING ---
  const { mentors, meta, isLoading, refetch } = useGetAllMentorAdmin({
    params: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
      search: debouncedSearchTerm,
      include_relation: ['user', 'course'],
      filter: {
        status: 'ACCEPTED',
      },
      order_by:
        sortConfig.key && sortConfig.direction !== 'none'
          ? [{ field: sortConfig.key, direction: sortConfig.direction }]
          : undefined,
    },
  })

  const { mutateAsync: deleteMentor, isPending: isDeleting } =
    useDeleteMentorMutation()

  // --- DATA GROUPING ---
  const groupedMentors = useMemo(() => {
    if (!mentors) return []

    const map = new Map()

    mentors.forEach((record) => {
      if (!record.user) return
      const userId = record.user.id

      if (!map.has(userId)) {
        map.set(userId, {
          ...record,
          enrolledCourses: record.course ? [record.course] : [],
          allIds: [record.id],
        })
      } else {
        const existing = map.get(userId)
        if (record.course) {
          const courseExists = existing.enrolledCourses.find(
            (c) => c.id === record.course.id
          )
          if (!courseExists) {
            existing.enrolledCourses.push(record.course)
          }
        }
        existing.allIds.push(record.id)
      }
    })

    return Array.from(map.values())
  }, [mentors])

  // --- URL SYNC ---
  const buildQueryString = useCallback(
    (search) => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (search !== initialSearch) params.set('page', 1)
      else params.set('page', currentPage)
      return params.toString()
    },
    [currentPage, initialSearch]
  )

  useEffect(() => {
    const nextQuery = buildQueryString(debouncedSearchTerm)
    if (nextQuery === searchParams.toString()) return
    router.replace(`${pathname}?${nextQuery}`, { scroll: false })
  }, [debouncedSearchTerm, pathname, router, searchParams, buildQueryString])

  // --- HANDLERS ---
  const handleRowAction = (action, row) => {
    if (action === 'delete') {
      setDeleteIds(row.allIds)
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteIds && deleteIds.length > 0) {
      try {
        await Promise.all(deleteIds.map((id) => deleteMentor({ id })))
        setIsDeleteDialogOpen(false)
        setDeleteIds(null)
        refetch()
      } catch (error) {
        console.error('Failed to delete all mentor records', error)
      }
    }
  }

  // --- TABEL CONFIG ---
  const columns = useMemo(
    () => [
      {
        key: 'profile_picture',
        header: 'Profile Picture',
        sortable: false,
        render: (row) => (
          <div className="py-2">
            <Avatar className="h-14 w-14 rounded-md border border-gray-200">
              <AvatarImage
                src={row.user?.profile_uri || row.cv_uri}
                alt={row.user?.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-md bg-blue-50 text-lg font-bold text-blue-600">
                {getTwoInitials(row.user?.name || 'Mentor')}
              </AvatarFallback>
            </Avatar>
          </div>
        ),
      },
      {
        key: 'user.name',
        header: 'Fullname',
        sortable: false,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {row.user?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500">
              {row.user?.email || '-'}
            </span>
          </div>
        ),
      },
      {
        key: 'enrolledCourses',
        header: 'Enrolled In',
        sortable: false,
        render: (row) => (
          <div className="flex max-w-[250px] flex-wrap gap-2">
            {row.enrolledCourses && row.enrolledCourses.length > 0 ? (
              row.enrolledCourses.map((course, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="border-gray-300 bg-gray-100 font-mono text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  {course.code}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">-</span>
            )}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        sortable: true,
        render: (row) => (
          <Badge
            variant="outline"
            className="border-none bg-green-100 px-3 py-1 font-semibold text-green-700 hover:bg-green-100"
          >
            ACCEPTED
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'ACTION',
        sortable: false,
        render: (row) => (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRowAction('delete', row)}
              className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Delete Mentor"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold text-gray-900">Active Mentors</h1>
        <div className="relative w-full max-w-xs">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Mentor..."
            className="border-gray-300 bg-white pl-10"
          />
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <BaseTable
          data={groupedMentors}
          columns={columns}
          serverSide={true}
          isLoading={isLoading}
          onRowAction={handleRowAction}
          searchFields={['user.name', 'user.email']}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />

        {meta && (
          <div className="border-t border-gray-100 p-4">
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

      <ConfirmDialogDelete
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Mentor"
        description="Are you sure you want to delete this mentor? This will remove them from ALL assigned courses."
        isLoading={isDeleting}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  )
}
