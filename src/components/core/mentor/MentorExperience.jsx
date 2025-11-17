export default function MentorExperience() {
  const experiences = [
    {
      id: 1,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris convallis.',
    },
    {
      id: 2,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris convallis.',
    },
    {
      id: 3,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris convallis.',
    },
    {
      id: 4,
      title: 'Calculus',
      description:
        'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris convallis.',
    },
  ]

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      {/* Section Title */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">
        Experience Mentor
      </h2>

      {/* Experience Grid */}
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

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-foreground mb-2 font-bold">
                {experience.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {experience.description}
              </p>

              {/* See Detail Button */}
              <button className="inline-flex items-center gap-2 rounded bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800">
                See Detail
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
