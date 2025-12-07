'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useGetAllCourseAdmin,
  useDeleteCourseAdminMutation,
  useUpdateCourseAdminMutation,
} from '@/hooks/course.hook'
import CourseTable from '@/components/core/backoffice/course/CourseTable'

import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'

export default function BackofficeCoursePage() {
  const router = useRouter()

  // --- STATE ---
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortConfig, setSortConfig] = useState({
    field: 'created_at',
    direction: 'desc',
  })

  // State untuk Dialog Delete
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // --- DEBOUNCE SEARCH ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  // --- FETCH DATA ---
  const { courses, isLoading, refetch } = useGetAllCourseAdmin({
    params: {
      pagination: {
        page: 1,
        limit: 100,
      },
      search: debouncedSearch,
      order_by: [{ field: sortConfig.field, direction: sortConfig.direction }],
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
  const handleEdit = (id) => router.push(`/backoffice/course/${id}/edit`)

  // Handler 1: Saat tombol tong sampah diklik
  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  // Handler 2: Saat tombol "Delete" di dalam Pop-up diklik
  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteCourse(deleteId)
    }
  }

  const handleToggleStatus = (id, field, currentValue) => {
    updateCourse({
      id,
      body: { [field]: !currentValue },
    })
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    const [field, direction] = value.split(':')
    setSortConfig({ field, direction })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* --- HEADER ACTIONS --- */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex w-full max-w-md items-center">
            <div className="absolute left-3 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search course..."
              className="h-10 w-full rounded-l-md border border-r-0 border-gray-300 bg-white pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="flex h-10 items-center justify-center rounded-r-md bg-[#0E1B50] px-4 text-white hover:bg-blue-900">
              <Search size={18} />
            </button>
          </div>

          {/* Dropdown Sort */}
          <div className="relative">
            <select
              className="h-10 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white pr-8 pl-3 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
              onChange={handleSortChange}
              value={`${sortConfig.field}:${sortConfig.direction}`}
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

        {/* Add Button */}
        <Button
          className="bg-[#0E1B50] text-white shadow-sm hover:bg-blue-900"
          onClick={() => router.push('/backoffice/course/create')}
        >
          <Plus size={16} className="mr-2" /> Add Course
        </Button>
      </div>

      {/* --- TABLE CONTENT --- */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <p className="animate-pulse text-gray-500">Loading courses...</p>
        </div>
      ) : (
        <CourseTable
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* ---  DELETE DIALOG --- */}
      <ConfirmDialogDelete
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone and will remove all related data."
        isLoading={isDeleting}
        confirmText="Delete Course"
        variant="danger"
      />
    </div>
  )
}
