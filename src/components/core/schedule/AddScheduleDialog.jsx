'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AddScheduleDialog({
  open,
  onOpenChange,
  defaultDate,
  initialData,
  onSave,
  userCourses = [],
}) {
  const [date, setDate] = useState(defaultDate || '')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Mode Edit
        setDate(initialData.date || defaultDate || '')
        setStartTime(initialData.startTime || '')
        setEndTime(initialData.endTime || '')
        setTitle(initialData.title || '')
        setCourseId(initialData.courseId || '')
      } else {
        // Mode Add
        setDate(defaultDate || '')
        setStartTime('')
        setEndTime('')
        setTitle('')
        if (userCourses.length === 1) {
          setCourseId(userCourses[0].id)
        } else {
          setCourseId('')
        }
      }
    }
  }, [open, initialData, defaultDate, userCourses])

  const handleSave = () => {
    // 1. Validasi Field Kosong
    if (!date || !startTime || !endTime || !title || !courseId) {
      toast.warning('Mohon lengkapi semua data jadwal.')
      return
    }

    // 2. Validasi Waktu
    if (endTime <= startTime) {
      toast.error(
        'Waktu selesai tidak boleh sebelum atau sama dengan waktu mulai.'
      )
      return
    }

    // 3. Validasi Tanggal

    const [yearStr, monthStr, dayStr] = date.split('-')
    const selectedDate = new Date(yearStr, monthStr - 1, dayStr) // Waktu lokal 00:00:00

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast.error('Tanggal tidak valid.')
      return
    }

    // 4. Validasi Tahun Maksimal
    if (selectedDate.getFullYear() > 2100) {
      toast.error('Tahun tidak valid (maksimal 2100).')
      return
    }

    onSave?.({
      id: initialData?.id,
      date,
      startTime,
      endTime,
      title,
      courseId,
    })
  }

  const isEdit = Boolean(initialData)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              max="2100-12-31"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Time</label>
              <input
                type="time"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Event title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Event Name</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. Live Session 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Course Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Course</label>
            <select
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={userCourses.length === 1}
            >
              <option value="">Select Course</option>
              {userCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title || course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#0E1B50] text-white hover:bg-blue-900"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
