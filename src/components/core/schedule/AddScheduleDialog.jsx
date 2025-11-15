'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
        setDate(initialData.date || defaultDate || '')
        setStartTime(initialData.startTime || '')
        setEndTime(initialData.endTime || '')
        setTitle(initialData.title || '')
        setCourseId(initialData.courseId || '')
      } else {
        setDate(defaultDate || '')
        setStartTime('')
        setEndTime('')
        setTitle('')
        setCourseId('')
      }
    }
  }, [open, initialData, defaultDate])

  const handleSave = () => {
    if (!date || !startTime || !endTime || !title) return

    onSave?.({
      id: initialData?.id,
      date,
      startTime,
      endTime,
      title,
      courseId,
      courseName:
        userCourses.find((c) => c.id === courseId)?.name ||
        initialData?.courseName,
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
              className="w-full rounded border border-[#3E3F88] px-3 py-2 text-sm outline-none"
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
                className="w-full rounded border border-[#3E3F88] px-3 py-2 text-sm outline-none"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                className="w-full rounded border border-[#3E3F88] px-3 py-2 text-sm outline-none"
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
              className="w-full rounded border border-[#3E3F88] px-3 py-2 text-sm outline-none"
              placeholder="e.g. Backend Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Course Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Course</label>
            <select
              className="w-full rounded border border-[#3E3F88] bg-white px-3 py-2 text-sm outline-none"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Select Course</option>
              {userCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* footer */}
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button
              className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
