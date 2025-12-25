'use client'

import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BaseTable from '@/components/_shared/BaseTable'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'
import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '@/hooks/schedule.hook'
import { toast } from 'sonner'
import { useCourseManage } from '../_components/course-manage.context'
import SortDropdown from '../_components/SortDropdown'
import sortData from '../_components/sortData'

const formatDateToLocalInput = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatTimeToLocalInput = (dateObj) => {
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function BackofficeCourseManageSchedulePage() {
  const { course, refetch } = useCourseManage()

  const [scheduleSort, setScheduleSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [deleteScheduleId, setDeleteScheduleId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { mutation: createScheduleMutation } = useCreateScheduleMutation({
    successAction: () => {
      setShowAddSchedule(false)
      refetch()
    },
  })

  const { mutation: updateScheduleMutation } = useUpdateScheduleMutation({
    successAction: () => {
      setShowAddSchedule(false)
      setEditingSchedule(null)
      refetch()
    },
  })

  const { mutation: deleteScheduleMutation } = useDeleteScheduleMutation()

  const processedSchedules = useMemo(
    () => sortData(course?.schedules || [], scheduleSort),
    [course?.schedules, scheduleSort]
  )

  const handleSaveSchedule = (data) => {
    const startDateObj = new Date(`${data.date}T${data.startTime}`)
    const endDateObj = new Date(`${data.date}T${data.endTime}`)

    const payload = {
      title: data.title,
      description: '',
      course_id: data.courseId,
      start_time: startDateObj.toISOString(),
      end_time: endDateObj.toISOString(),
    }

    if (data.id) {
      updateScheduleMutation.mutate({ id: data.id, payload })
    } else {
      createScheduleMutation.mutate(payload)
    }
  }

  const handleEditSchedule = (row) => {
    const startDateObj = new Date(row.start_time)
    const endDateObj = new Date(row.end_time)

    const dateStr = formatDateToLocalInput(startDateObj)
    const startTimeStr = formatTimeToLocalInput(startDateObj)
    const endTimeStr = formatTimeToLocalInput(endDateObj)

    setEditingSchedule({
      id: row.id,
      title: row.title,
      courseId: row.course_id,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
    })
    setShowAddSchedule(true)
  }

  const handleDeleteSchedule = async () => {
    if (deleteScheduleId) {
      setIsDeleting(true)
      await deleteScheduleMutation.mutateAsync({ id: deleteScheduleId })
      refetch()
      setIsDeleting(false)
      setDeleteScheduleId(null)
      toast.success('Schedule deleted')
    }
  }

  const scheduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Topic' },
      {
        key: 'date',
        header: 'Date',
        render: (row) =>
          new Date(row.start_time).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
      },
      {
        key: 'start_time',
        header: 'Start Time',
        render: (row) =>
          new Date(row.start_time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
      {
        key: 'end_time',
        header: 'End Time',
        render: (row) =>
          new Date(row.end_time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-amber-600"
              onClick={() => handleEditSchedule(row)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() => setDeleteScheduleId(row.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  if (!course) return null

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold">Live Schedules</h3>
            <p className="text-sm text-gray-500">Manage live sessions.</p>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown
              sortConfig={scheduleSort}
              onSortChange={setScheduleSort}
              options={[
                { value: 'start_time:asc', label: 'Earliest' },
                { value: 'start_time:desc', label: 'Latest' },
                { value: 'title:asc', label: 'Topic (A-Z)' },
                { value: 'created_at:desc', label: 'Newest Created' },
                { value: 'created_at:asc', label: 'Oldest Created' },
              ]}
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setEditingSchedule(null)
                setShowAddSchedule(true)
              }}
            >
              <Plus className="mr-2 size-4" /> Add Schedule
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <BaseTable
            data={processedSchedules}
            columns={scheduleColumns}
            serverSide={true}
            searchFields={['title']}
            onRowAction={() => {}}
            sortConfig={scheduleSort}
            onSortChange={setScheduleSort}
          />
        </div>
      </div>

      <AddScheduleDialog
        open={showAddSchedule}
        onOpenChange={setShowAddSchedule}
        initialData={editingSchedule}
        onSave={handleSaveSchedule}
        userCourses={[{ id: course.id, title: course.title }]}
      />

      <ConfirmDialogDelete
        isOpen={!!deleteScheduleId}
        onClose={() => setDeleteScheduleId(null)}
        onConfirm={handleDeleteSchedule}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        isLoading={isDeleting}
        confirmText="Delete Schedule"
        variant="danger"
      />
    </>
  )
}
