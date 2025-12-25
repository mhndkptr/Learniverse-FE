'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request, { handleAxiosError } from '@/utils/baseRequest'
import BaseTable from '@/components/_shared/BaseTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import { CircleMinus, FileSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCourseManage } from '../_components/course-manage.context'
import SortDropdown from '../_components/SortDropdown'
import sortData from '../_components/sortData'

const deleteMentorAction = async (id) => {
  try {
    const res = await request.delete(`/mentor/${id}`)
    return res.data
  } catch (err) {
    throw handleAxiosError(err)
  }
}

export default function BackofficeCourseManageMentorPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { course, courseId, refetch } = useCourseManage()

  const [deleteMentorId, setDeleteMentorId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mentorSort, setMentorSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })

  const deleteMentorMutation = useMutation({
    mutationFn: deleteMentorAction,
    onSuccess: () => {
      toast.success('Mentor removed successfully')
      queryClient.invalidateQueries(['getCourseByIdAdmin', courseId])
      refetch()
      setIsDeleteDialogOpen(false)
      setDeleteMentorId(null)
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove mentor')
    },
  })

  const handleReviewClick = (mentorId) => {
    router.push(`/backoffice/course/${courseId}/manage/mentor/${mentorId}`)
  }

  const handleTriggerDeleteMentor = (mentorId) => {
    setDeleteMentorId(mentorId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeleteMentor = () => {
    if (deleteMentorId) {
      deleteMentorMutation.mutate(deleteMentorId)
    }
  }

  const processedMentors = useMemo(
    () => sortData(course?.mentors || [], mentorSort),
    [course?.mentors, mentorSort]
  )

  const mentorColumns = useMemo(
    () => [
      { key: 'user.name', header: 'Mentor Name' },
      { key: 'user.email', header: 'Email' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => {
          let colorClass = 'bg-gray-500'
          if (row.status === 'ACCEPTED')
            colorClass = 'bg-green-600 hover:bg-green-700'
          if (row.status === 'REJECTED')
            colorClass = 'bg-red-600 hover:bg-red-700'
          if (row.status === 'ON_REVIEW')
            colorClass = 'bg-yellow-600 hover:bg-yellow-700'

          const statusLabel = (row.status || 'UNKNOWN').replace('_', ' ')

          return (
            <Badge className={`${colorClass} text-white`}>{statusLabel}</Badge>
          )
        },
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => {
          if (row.status === 'ON_REVIEW') {
            return (
              <Button
                size="sm"
                className="h-8 bg-[#0E1B50] text-white hover:bg-blue-900"
                onClick={() => handleReviewClick(row.id)}
                title="Review Application"
              >
                <FileSearch className="mr-2 size-3" /> Review
              </Button>
            )
          }
          return (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Unenroll this mentor"
              onClick={() => handleTriggerDeleteMentor(row.id)}
            >
              <CircleMinus className="size-5" />
            </Button>
          )
        },
      },
    ],
    [courseId]
  )

  if (!course) return null

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold">Assigned Mentors</h3>
            <p className="text-sm text-gray-500">
              Manage mentor applications and approvals.
            </p>
          </div>
          <SortDropdown
            sortConfig={mentorSort}
            onSortChange={setMentorSort}
            options={[
              { value: 'user.name:asc', label: 'Name (A-Z)' },
              { value: 'user.name:desc', label: 'Name (Z-A)' },
              { value: 'status:asc', label: 'Status' },
              { value: 'created_at:desc', label: 'Newest' },
              { value: 'created_at:asc', label: 'Oldest' },
            ]}
          />
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <BaseTable
            data={processedMentors}
            columns={mentorColumns}
            serverSide={true}
            searchFields={['user.name', 'user.email']}
            onRowAction={() => {}}
            sortConfig={mentorSort}
            onSortChange={setMentorSort}
          />
        </div>
      </div>

      <ConfirmDialogDelete
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteMentor}
        title="Remove Mentor"
        description="Are you sure you want to remove this mentor? This action cannot be undone."
        isLoading={deleteMentorMutation.isPending}
        confirmText="Remove"
        variant="danger"
      />
    </>
  )
}
