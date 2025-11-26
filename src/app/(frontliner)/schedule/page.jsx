'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import CalendarSchedule from '@/components/core/schedule/CalendarSchedule'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'
import ScheduleEventDialog from '@/components/core/schedule/ScheduleEventDialog'

import {
  useGetAllSchedule,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from '@/hooks/schedule.hook'

export default function SchedulePage() {
  const router = useRouter()

  //  ambil data dari backend
  const { schedules: eventsByDate, isLoading } = useGetAllSchedule({})

  const { mutation: createMutation } = useCreateScheduleMutation({})
  const { mutation: updateMutation } = useUpdateScheduleMutation({})

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])

  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [editingEvent, setEditingEvent] = useState(null)

  if (isLoading) return <p>Loading...</p>

  // klik hari di kalender
  const handleDayClick = (dateKey, events) => {
    setSelectedDate(dateKey)
    setSelectedEvents(events)
    setDetailOpen(true)
  }

  // ✅ simpan ke backend (create / update)
  const handleSaveSchedule = (payload) => {
    const { id, date, startTime, endTime, title, course } = payload

    const body = {
      title,
      description: '',
      course_id: course, // nanti diganti dropdown real course
      start_time: `${date}T${startTime}:00.000Z`,
      end_time: `${date}T${endTime}:00.000Z`,
    }

    if (id) {
      updateMutation.mutate({ id, payload: body })
    } else {
      createMutation.mutate(body)
    }

    setAddOpen(false)
    setEditingEvent(null)
  }

  // klik Edit di dialog detail
  const handleEditFromDetail = (event) => {
    setEditingEvent({ ...event, date: selectedDate })
    setDetailOpen(false)
    setAddOpen(true)
  }

  // klik tombol Add Schedule
  const handleAddButtonClick = () => {
    setEditingEvent(null)
    setSelectedDate(null)
    setAddOpen(true)
  }

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-16 py-32">
        <div className="min-h-screen bg-white pb-20">
          <div className="mt-[-16px] mb-4 flex items-center gap-2 px-8">
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

            <h1 className="text-xl font-semibold">My Schedule</h1>
          </div>

          <CalendarSchedule
            year={2025}
            month={10}
            eventsByDate={eventsByDate}
            onDayClick={handleDayClick}
          />

          <div className="mx-auto mt-4 flex max-w-6xl justify-end px-2">
            <Button
              className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
              onClick={handleAddButtonClick}
            >
              Add Schedule
            </Button>
          </div>

          {/* Dialog Event Detail */}
          <ScheduleEventDialog
            open={detailOpen}
            onOpenChange={setDetailOpen}
            date={selectedDate}
            events={selectedEvents}
            onEdit={handleEditFromDetail}
          />

          {/* Dialog Add / Edit */}
          <AddScheduleDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            defaultDate={selectedDate || ''}
            initialData={editingEvent}
            onSave={handleSaveSchedule}
          />
        </div>
      </main>
    </div>
  )
}
