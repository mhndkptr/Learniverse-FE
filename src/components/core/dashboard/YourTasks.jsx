'use client'

import { Button } from '@/components/ui/button'
import { useGetAllActiveQuiz } from '@/hooks/quiz.hook'
import { ArrowUpRight, CalendarClock } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Helper format tanggal: "29 December 2025"
const formatDateKey = (dateString) => {
  if (!dateString) return 'No Deadline'
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-GB', options)
}

export default function YourTasks() {
  const router = useRouter()
  const { activeQuizzes, isLoading, isPending } = useGetAllActiveQuiz()

  if (isLoading || isPending) {
    return <div className="p-6 text-center text-gray-500">Loading tasks...</div>
  }

  // Pastikan activeQuizzes adalah array sebelum di-cek length-nya
  const quizzesData = Array.isArray(activeQuizzes) ? activeQuizzes : []

  if (quizzesData.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        No pending tasks available.
      </div>
    )
  }

  // Grouping Logic berdasarkan end_date
  const groupedTasks = quizzesData.reduce((acc, task) => {
    const dateKey = formatDateKey(task.end_date)

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(task)
    return acc
  }, {})

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold">
        <span>📋</span> Your Tasks
      </h2>

      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <div key={date}>
            {/* Date Header (Deadline) */}
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CalendarClock size={16} />
              {date}
            </h3>

            {/* Tasks for this date */}
            <div className="space-y-3">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex gap-3 border-b border-gray-200 pb-3 last:border-b-0"
                >
                  {/* Thumbnail Image */}
                  <div className="flex-shrink-0">
                    <img
                      // PERBAIKAN: Menggunakan 'task' bukan 'quiz'
                      // Mengambil gambar dari nested object 'course'
                      src={task.course?.cover_uri || '/placeholder.svg'}
                      alt={task.course?.title || 'Course Image'}
                      className="h-14 w-14 rounded border border-gray-100 object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground mb-1 truncate text-sm font-semibold">
                      {task.title}
                    </h4>

                    {/* Menampilkan Nama Course (cth: SISOP) agar lebih jelas */}
                    <p className="mb-1 truncate text-xs font-medium text-amber-700">
                      {task.course?.title}
                    </p>

                    <p className="mb-2 line-clamp-1 text-xs text-gray-600">
                      {task.description}
                    </p>

                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/course/${task.course?.id}/quiz/${task.id}/attempt`
                        )
                      }
                      variant="secondary"
                      size="sm"
                    >
                      Attempt Now <ArrowUpRight size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
