import { ArrowUpRight } from 'lucide-react'

export default function YourTasks() {
  const tasks = [
    {
      id: 1,
      title: 'First week assignment',
      description: 'Calculus - Today is the due date',
      date: 'Wednesday, 11 December 2024',
      dueDate: '1:15',
      thumbnail: '/green-calculus.jpg',
    },
    {
      id: 2,
      title: 'First week assignment',
      description: 'Calculus - Today is the due date',
      date: 'Wednesday, 11 December 2024',
      dueDate: '11:00',
      thumbnail: '/green-calculus.jpg',
    },
    {
      id: 3,
      title: 'First week assignment',
      description: 'Calculus - Today is the due date',
      date: 'Friday, 14 December 2024',
      dueDate: '11:30',
      thumbnail: '/green-calculus.jpg',
    },
    {
      id: 4,
      title: 'First week assignment',
      description: 'Calculus - Today is the due date',
      date: 'Friday, 14 December 2024',
      dueDate: '11:30',
      thumbnail: '/green-calculus.jpg',
    },
  ]

  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = []
    }
    acc[task.date].push(task)
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
            {/* Date Header */}
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{date}</h3>

            {/* Tasks for this date */}
            <div className="space-y-3">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex gap-3 border-b border-gray-200 pb-3 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={task.thumbnail || '/placeholder.svg'}
                      alt={task.title}
                      className="h-14 w-14 rounded object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground mb-1 text-sm font-semibold">
                      {task.title}
                    </h4>
                    <p className="mb-2 text-xs text-gray-600">
                      {task.description}
                    </p>
                    <button className="inline-flex items-center gap-1 rounded bg-amber-700 px-3 py-1 text-xs text-white transition-colors hover:bg-amber-800">
                      Attempt Now <ArrowUpRight size={12} />
                    </button>
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
