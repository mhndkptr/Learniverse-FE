'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import CalendarSchedule from '@/components/core/schedule/CalendarSchedule'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'
import ScheduleEventDialog from '@/components/core/schedule/ScheduleEventDialog'
import {
  useGetAllSchedule,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from '@/hooks/schedule.hook'
import { useGetCourseById } from '@/hooks/course.hook'
import { useAuth } from '@/contexts/auth.context'

export default function ScheduleCoursePageComponent({ courseId }) {
  const router = useRouter()
  const { user } = useAuth()

  const { course, isLoading: isLoadingCourse, refetch: refetchCourse } =
    useGetCourseById({
      courseId,
    })

  const {
    schedules: eventsByDateApi,
    isLoading: isLoadingSchedules,
    refetch,
  } = useGetAllSchedule({
    params: {
      filter: { course_id: courseId },
      include_relation: ['course'],
      order_by: [{ field: 'start_time', direction: 'asc' }],
      get_all: true,
    },
    enabled: Boolean(courseId),
  })

  // Konversi jadwal dari course detail jika ada
  const eventsFromCourse = (course?.schedules || []).reduce((acc, sch) => {
    const startDate = new Date(sch.start_time)
    const endDate = new Date(sch.end_time)
    const dateKey = startDate.toLocaleDateString('en-CA')

    const start = startDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const end = endDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push({
      id: sch.id,
      title: sch.title,
      course: course?.title ?? '-',
      courseId: course?.id,
      startTime: start,
      endTime: end,
      raw: sch,
    })
    return acc
  }, {})

  // Gabungkan jadwal dari relasi course dan API /schedule (dengan filter course_id)
  // Gabungkan dengan deduplikasi berdasarkan id
  const mergedEventsByDate = { ...(eventsFromCourse || {}) }
  Object.entries(eventsByDateApi || {}).forEach(([key, arr]) => {
    if (!mergedEventsByDate[key]) mergedEventsByDate[key] = []
    const existingIds = new Set(mergedEventsByDate[key].map((e) => e.id))
    arr.forEach((ev) => {
      if (!existingIds.has(ev.id)) {
        mergedEventsByDate[key].push(ev)
      }
    })
  })

  const { mutation: createMutation } = useCreateScheduleMutation({
    successAction: () => {
      refetchCourse()
    },
  })
  const { mutation: updateMutation } = useUpdateScheduleMutation({
    successAction: () => {
      refetchCourse()
    },
  })

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() // CalendarSchedule expects 0-based month

  const canManage =
    user?.role === 'ADMIN' ||
    course?.mentors?.some((m) => m.user?.id === user?.id)

  if (isLoadingCourse || isLoadingSchedules) return <p>Loading...</p>

  const handleDayClick = (dateKey, events) => {
    setSelectedDate(dateKey)
    setSelectedEvents(events)
    setDetailOpen(true)
  }

  const handleSaveSchedule = (payload) => {
    const { id, date, startTime, endTime, title } = payload

    const startDateObj = new Date(`${date}T${startTime}`)
    const endDateObj = new Date(`${date}T${endTime}`)

    const body = {
      title,
      description: '',
      course_id: courseId,
      start_time: startDateObj.toISOString(),
      end_time: endDateObj.toISOString(),
    }

    if (id) {
      updateMutation.mutate({ id, payload: body })
    } else {
      createMutation.mutate(body)
    }

    setAddOpen(false)
    setEditingEvent(null)
  }

  const handleEditFromDetail = (event) => {
    if (!canManage) {
      toast.error('Only mentors of this course or admins can edit schedule.')
      return
    }
    setEditingEvent({ ...event, date: selectedDate })
    setDetailOpen(false)
    setAddOpen(true)
  }

  const handleAddButtonClick = () => {
    if (!canManage) {
      toast.error('Only mentors of this course or admins can add schedule.')
      return
    }
    setEditingEvent(null)
    setSelectedDate(null)
    setAddOpen(true)
  }

  const userCourses = course
    ? [
        {
          id: course.id,
          title: course.title,
        },
      ]
    : []

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-4 pt-32 pb-20 md:px-12">
        <div className="min-h-screen w-full bg-white">
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:opacity-70"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black"
              >
                <line x1="20" y1="12" x2="4" y2="12" />
                <polyline points="10 6 4 12 10 18" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-semibold">Course Schedule</h1>
              <p className="text-sm text-gray-500">
                {course?.title} ({course?.code})
              </p>
            </div>
          </div>

          <CalendarSchedule
            year={currentYear}
            month={currentMonth}
            eventsByDate={mergedEventsByDate}
            onDayClick={handleDayClick}
          />

          <div className="mx-auto mt-4 flex max-w-6xl justify-end px-2">
            {canManage && (
              <Button
                className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
                onClick={handleAddButtonClick}
              >
                Add Schedule
              </Button>
            )}
          </div>

          {/* Dialog Event Detail */}
          <ScheduleEventDialog
            open={detailOpen}
            onOpenChange={setDetailOpen}
            date={selectedDate}
            events={selectedEvents}
            onEdit={handleEditFromDetail}
            canEdit={canManage}
          />

          {/* Dialog Add / Edit */}
          <AddScheduleDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            defaultDate={selectedDate || ''}
            initialData={editingEvent}
            onSave={handleSaveSchedule}
            userCourses={userCourses}
            lockCourse={true}
          />
        </div>
      </main>
    </div>
  )
}
