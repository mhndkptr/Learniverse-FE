'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarSchedule({
  year: initialYear = 2025,
  month: initialMonth = 10, 
  eventsByDate = {},
  onDayClick, 
}) {
  const [currentDate, setCurrentDate] = useState(
    new Date(initialYear, initialMonth, 1)
  )

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const today = new Date()

  const handlePrev = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  const handleNext = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  let calendarCells = []

  // Filler hari bulan sebelumnya
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dateNum = prevMonthDays - i
    calendarCells.push({ date: dateNum, type: 'other' })
  }

  // Hari di bulan sekarang
  for (let i = 1; i <= daysInMonth; i++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      i
    ).padStart(2, '0')}`

    calendarCells.push({
      date: i,
      type: 'current',
      key,
      events: eventsByDate[key] || [],
    })
  }

  // Filler bulan berikutnya sampai kelipatan 7
  let nextDay = 1
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ date: nextDay++, type: 'other' })
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  return (
    <div className="mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
      {/* Header bulan + nav */}
      <div className="relative flex items-center justify-center bg-[#0E1B50] py-3 text-lg font-semibold text-white">
        <button
          onClick={handlePrev}
          className="absolute left-4 rounded-md p-2 hover:bg-white/20"
        >
          <ChevronLeft size={20} />
        </button>
        {monthName} {year}
        <button
          onClick={handleNext}
          className="absolute right-4 rounded-md p-2 hover:bg-white/20"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Nama hari */}
      <div className="grid grid-cols-7 bg-[#0E1B50] py-2 text-center text-sm font-medium text-white">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid kalender */}
      <div className="grid grid-cols-7">
        {calendarCells.map((cell, idx) => {
          const isToday =
            cell.type === 'current' &&
            year === today.getFullYear() &&
            month === today.getMonth() &&
            cell.date === today.getDate()

          const isCurrent = cell.type === 'current'
          const events = cell.events || []

          return (
            <div
              key={idx}
              onClick={() =>
                isCurrent &&
                onDayClick &&
                cell.key &&
                onDayClick(cell.key, events)
              }
              className={`relative h-24 border p-1 select-none ${
                isCurrent
                  ? 'cursor-pointer'
                  : 'cursor-default bg-gray-50 text-gray-400'
              } ${
                isToday
                  ? 'border-2 border-yellow-500 bg-yellow-100'
                  : 'border-gray-200'
              }`}
            >
              {/* Tanggal */}
              <div className="text-xs font-semibold">{cell.date}</div>

              {/* Event */}
              {isCurrent && events.length > 0 && (
                <div className="mt-1 space-y-1">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="truncate rounded bg-blue-100 px-1 py-[2px] text-[10px] text-blue-700"
                    >
                      {ev.startTime}–{ev.endTime} {ev.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
