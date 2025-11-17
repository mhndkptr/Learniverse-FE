'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import CalendarSchedule from '@/components/core/schedule/CalendarSchedule'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'
import ScheduleEventDialog from '@/components/core/schedule/ScheduleEventDialog'

// Dummy awal (nanti diganti fetch dari backend)
const initialEvents = {
  '2025-11-02': [
    {
      id: '1',
      startTime: '08:00',
      endTime: '09:00',
      title: 'Backend Meeting',
      course: 'Programming Algorithm',
    },
  ],
  '2025-11-05': [
    {
      id: '2',
      startTime: '10:00',
      endTime: '11:00',
      title: 'Standup',
      course: 'Learniverse',
    },
    {
      id: '3',
      startTime: '19:00',
      endTime: '20:00',
      title: 'Learn Next.js',
      course: 'Web Frontend',
    },
  ],
}

export default function SchedulePage() {
  const router = useRouter()

  const [eventsByDate, setEventsByDate] = useState(initialEvents)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])

  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [editingEvent, setEditingEvent] = useState(null)

  // klik hari di kalender
  const handleDayClick = (dateKey, events) => {
    setSelectedDate(dateKey)
    setSelectedEvents(events)
    setDetailOpen(true)
  }

  // save dari AddScheduleDialog
  const handleSaveSchedule = (payload) => {
    const { id, date, startTime, endTime, title, course } = payload

    setEventsByDate((prev) => {
      const next = { ...prev }
      const list = next[date] ? [...next[date]] : []

      if (id) {
        // edit event
        const idx = list.findIndex((ev) => ev.id === id)
        if (idx !== -1) {
          list[idx] = { id, startTime, endTime, title, course }
        } else {
          list.push({ id, startTime, endTime, title, course })
        }
      } else {
        // create new
        const newId = crypto.randomUUID()
        list.push({ id: newId, startTime, endTime, title, course })
      }

      next[date] = list
      return next
    })

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
          {/* 🔥 HEADER DENGAN BACK ARROW CUSTOM (sama persis seperti contoh) */}
          <div className="mt-[-16px] mb-4 flex items-center gap-2 px-8">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:opacity-70"
            >
              {/* CUSTOM SVG ARROW – bentuk persis contoh kamu */}
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

          {/* Kalender */}
          <CalendarSchedule
            year={2025}
            month={10}
            eventsByDate={eventsByDate}
            onDayClick={handleDayClick}
          />

          {/* Tombol Add Schedule */}
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
