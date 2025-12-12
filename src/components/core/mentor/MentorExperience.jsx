export default function MentorExperience({ mentorId }) {
  const experiences = [
    { id: 1, title: 'Calculus', description: 'Lorem ipsum dolor sit amet...' },
    { id: 2, title: 'Geometry', description: 'Lorem ipsum dolor sit amet...' },
    {
      id: 3,
      title: 'Trigonometry',
      description: 'Lorem ipsum dolor sit amet...',
    },
    { id: 4, title: 'Algebra', description: 'Lorem ipsum dolor sit amet...' },
  ]

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Experience for Mentor ID: {mentorId}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="flex gap-4 rounded-lg border border-gray-300 p-4"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src="/calculus-math-green.jpg"
                alt={experience.title}
                className="h-20 w-20 rounded bg-black object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-foreground mb-2 font-bold">
                {experience.title}
              </h3>

              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {experience.description}
              </p>

              <button className="inline-flex items-center gap-2 rounded bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800">
                See Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
