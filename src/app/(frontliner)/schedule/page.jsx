'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import CalendarSchedule from '@/components/core/schedule/CalendarSchedule'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'
import ScheduleEventDialog from '@/components/core/schedule/ScheduleEventDialog'

// Dummy awal nanti diganti dari backend)
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
  const [eventsByDate, setEventsByDate] = useState(initialEvents)

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])

  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [editingEvent, setEditingEvent] = useState(null)

  // buat klik hari di kalender
  const handleDayClick = (dateKey, events) => {
    setSelectedDate(dateKey)
    setSelectedEvents(events)
    setDetailOpen(true)
  }

  // save dari AddScheduleDialog (add / edit)
  const handleSaveSchedule = (payload) => {
    const { id, date, startTime, endTime, title, course } = payload

    setEventsByDate((prev) => {
      const next = { ...prev }
      const list = next[date] ? [...next[date]] : []

      if (id) {
        // edit
        const idx = list.findIndex((ev) => ev.id === id)
        if (idx !== -1) {
          list[idx] = { id, startTime, endTime, title, course }
        } else {
          list.push({ id, startTime, endTime, title, course })
        }
      } else {
        // add baru
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
    setEditingEvent({
      ...event,
      date: selectedDate,
    })
    setDetailOpen(false)
    setAddOpen(true)
  }

  // klik tombol Add Schedule di bawah
  const handleAddButtonClick = () => {
    setEditingEvent(null)
    setSelectedDate(null)
    setAddOpen(true)
  }

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-16 py-32">
        <div className="min-h-screen bg-white pb-20">
          <h1 className="-mt-4 px-8 text-xl font-semibold">My Schedule</h1>

          {/* Kalender */}
          <CalendarSchedule
            year={2025}
            month={10} 
            eventsByDate={eventsByDate}
            onDayClick={handleDayClick}
          />

          {/* Tombol Add Schedule (tetap ada di bawah) */}
          <div className="mx-auto mt-4 flex max-w-6xl justify-end px-2">
            <Button
              className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
              onClick={handleAddButtonClick}
            >
              Add Schedule
            </Button>
          </div>

          {/* Dialog detail event per hari */}
          <ScheduleEventDialog
            open={detailOpen}
            onOpenChange={setDetailOpen}
            date={selectedDate}
            events={selectedEvents}
            onEdit={handleEditFromDetail}
          />

          {/* Dialog add / edit schedule */}
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
