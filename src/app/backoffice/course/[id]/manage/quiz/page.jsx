'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BaseTable from '@/components/_shared/BaseTable'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import { useDeleteQuizMutation } from '@/hooks/quiz.hook'
import { useCourseManage } from '../_components/course-manage.context'
import SortDropdown from '../_components/SortDropdown'
import sortData from '../_components/sortData'

export default function BackofficeCourseManageQuizPage() {
  const { course, courseId, refetch } = useCourseManage()

  const [quizSort, setQuizSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [showDelete, setShowDelete] = useState({
    status: false,
    data: null,
    mutation: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const { deleteQuizMutation } = useDeleteQuizMutation({
    successAction: () => {
      setShowDelete({ status: false, data: null, mutation: null })
      refetch()
    },
  })

  const processedQuizzes = useMemo(
    () => sortData(course?.quizzes || [], quizSort),
    [course?.quizzes, quizSort]
  )

  const quizColumns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Quiz Title',
        className: 'w-[50%] min-w-[300px]',
      },
      {
        key: 'status',
        header: 'Status',
        className: 'w-[100px]',
        render: (row) => <Badge variant="outline">{row.status}</Badge>,
      },
      {
        key: 'duration',
        header: 'Duration (m)',
        className: 'w-[150px] whitespace-nowrap',
      },
      {
        key: 'actions',
        header: 'Action',
        className: 'w-[100px]',
        render: (row) => (
          <div className="flex gap-2">
            <Link
              href={`/backoffice/course/${courseId}/manage/quiz/${row.id}/edit`}
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-amber-600"
              >
                <Pencil className="size-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() =>
                setShowDelete({
                  status: true,
                  data: row,
                  mutation: deleteQuizMutation,
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [courseId, deleteQuizMutation]
  )

  if (!course) return null

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold">Quizzes</h3>
            <p className="text-sm text-gray-500">Manage quizzes.</p>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown
              sortConfig={quizSort}
              onSortChange={setQuizSort}
              options={[
                { value: 'title:asc', label: 'Title (A-Z)' },
                { value: 'title:desc', label: 'Title (Z-A)' },
                { value: 'status:asc', label: 'Status' },
                { value: 'duration:asc', label: 'Duration' },
                { value: 'created_at:desc', label: 'Newest' },
                { value: 'created_at:asc', label: 'Oldest' },
              ]}
            />
            <Link href={`/backoffice/course/${courseId}/manage/quiz/create`}>
              <Button size="sm" variant="primary">
                <Plus className="mr-2 size-4" /> Create Quiz
              </Button>
            </Link>
          </div>
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <BaseTable
            data={processedQuizzes}
            columns={quizColumns}
            serverSide={true}
            searchFields={['title']}
            onRowAction={() => {}}
            sortConfig={quizSort}
            onSortChange={setQuizSort}
          />
        </div>
      </div>

      <ConfirmDialogDelete
        isOpen={showDelete.status}
        onClose={() =>
          setShowDelete({ status: false, data: null, mutation: null })
        }
        onConfirm={async () => {
          setIsDeleting(true)
          await showDelete.mutation.mutate({ id: showDelete?.data?.id })
          setIsDeleting(false)
          refetch()
        }}
        title="Delete Item"
        isLoading={isDeleting}
      />
    </>
  )
}
