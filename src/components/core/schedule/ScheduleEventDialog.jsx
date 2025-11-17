'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ScheduleEventDialog({
  open,
  onOpenChange,
  date, // string "YYYY-MM-DD"
  events = [], // array of { id, startTime, endTime, title, course }
  onEdit, // (event) => void
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Schedule Detail</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">{formattedDate}</p>

          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No schedule for this day.</p>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {ev.startTime}–{ev.endTime} — {ev.title}
                    </p>
                    {ev.course && (
                      <p className="text-xs text-gray-600">
                        Course: {ev.course}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#0E1B50] text-white hover:bg-blue-900"
                    onClick={() => onEdit?.(ev)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
