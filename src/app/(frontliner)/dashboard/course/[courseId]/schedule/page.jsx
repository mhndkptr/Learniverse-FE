'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function ScheduleCoursePage() {
  const params = useParams()
  const courseId = params?.courseId
  const { user } = useAuth()

  const {
    course,
    isLoading: isLoadingCourse,
    refetch: refetchCourse,
  } = useGetCourseById({
    courseId,
  })

  const { schedules: eventsByDateApi, isLoading: isLoadingSchedules } =
    useGetAllSchedule({
      params: {
        filter: { course_id: courseId },
        include_relation: ['course'],
        order_by: [{ field: 'start_time', direction: 'asc' }],
        get_all: true,
      },
      enabled: Boolean(courseId),
    })

  const eventsFromCourse = useMemo(() => {
    return (course?.schedules || []).reduce((acc, sch) => {
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
  }, [course?.id, course?.schedules, course?.title])

  const mergedEventsByDate = useMemo(() => {
    const merged = { ...(eventsFromCourse || {}) }
    Object.entries(eventsByDateApi || {}).forEach(([key, arr]) => {
      if (!merged[key]) merged[key] = []
      const existingIds = new Set(merged[key].map((e) => e.id))
      arr.forEach((ev) => {
        if (!existingIds.has(ev.id)) {
          merged[key].push(ev)
        }
      })
    })
    return merged
  }, [eventsByDateApi, eventsFromCourse])

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

  const canManage = useMemo(() => {
    if (!user) return false
    if (user.role === 'ADMIN') return true

    const isMentorByMentorList = course?.mentors?.some(
      (mentor) =>
        (mentor.user?.id === user.id || mentor.user_id === user.id) &&
        mentor.status === 'ACCEPTED'
    )

    return Boolean(isMentorByMentorList)
  }, [course?.mentors, user])

  if (isLoadingCourse || isLoadingSchedules) return <p>Loading...</p>

  const handleDayClick = (dateKey, events) => {
    setSelectedDate(dateKey)
    setSelectedEvents(events)
    setDetailOpen(true)
  }

  const handleSaveSchedule = (payload) => {
    if (!canManage) {
      toast.error(
        'Hanya mentor course ini atau admin yang bisa mengubah jadwal.'
      )
      return
    }

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
      toast.error(
        'Hanya mentor course ini atau admin yang bisa mengubah jadwal.'
      )
      return
    }
    setEditingEvent({ ...event, date: selectedDate })
    setDetailOpen(false)
    setAddOpen(true)
  }

  const handleAddButtonClick = () => {
    if (!canManage) {
      toast.error(
        'Hanya mentor course ini atau admin yang bisa menambah jadwal.'
      )
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
    <div className="flex w-full flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            Course Schedule
          </h2>
          <p className="text-muted-foreground text-sm">
            {course?.title} ({course?.code})
          </p>
        </div>
        {canManage && (
          <Button
            className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
            onClick={handleAddButtonClick}
          >
            Add Schedule
          </Button>
        )}
      </div>

      <CalendarSchedule
        eventsByDate={mergedEventsByDate}
        onDayClick={handleDayClick}
      />

      <ScheduleEventDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        date={selectedDate}
        events={selectedEvents}
        onEdit={handleEditFromDetail}
        canEdit={canManage}
      />

      <AddScheduleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultDate={selectedDate || ''}
        initialData={editingEvent}
        onSave={handleSaveSchedule}
        userCourses={userCourses}
        lockCourse
      />
    </div>
  )
}
