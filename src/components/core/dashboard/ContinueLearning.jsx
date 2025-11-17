import { ArrowUpRight } from 'lucide-react'

export default function ContinueLearning() {
  const courses = [
    {
      id: 1,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris conubia.',
      thumbnail: '/green-calculus-math.jpg',
    },
    {
      id: 2,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris conubia.',
      thumbnail: '/green-calculus-math.jpg',
    },
    {
      id: 3,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris conubia.',
      thumbnail: '/green-calculus-math.jpg',
    },
  ]

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold">
        <span>📚</span> Continue Learning
      </h2>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex gap-4 border-b border-gray-200 pb-4 last:border-b-0"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={course.thumbnail || '/placeholder.svg'}
                alt={course.title}
                className="h-20 w-20 rounded object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-foreground mb-1 font-bold">{course.title}</h3>
              <p className="mb-3 text-sm text-gray-600">{course.description}</p>
              <button className="inline-flex items-center gap-1 rounded bg-amber-700 px-4 py-1 text-sm text-white transition-colors hover:bg-amber-800">
                See Detail <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
