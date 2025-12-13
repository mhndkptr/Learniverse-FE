// File: src #proyek frontend saya/components/core/mentor/MentorExperience.jsx
import { Briefcase } from 'lucide-react'

export default function MentorExperience({ experiences = [] }) {
  // Jika data kosong/undefined, tampilkan placeholder
  if (!experiences || experiences.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Professional Experience
        </h2>
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <Briefcase className="mb-2 h-10 w-10 opacity-20" />
          <p className="text-sm">No experience data provided.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Professional Experience
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {experiences.map((item, index) => (
          <div
            key={item.id || index}
            className="flex gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-300"
          >
            {/* Icon Placeholder */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-white shadow-sm">
              <Briefcase className="h-6 w-6 text-amber-700" />
            </div>

            <div className="flex-1 overflow-hidden">
              <h3 className="truncate font-bold text-gray-900">
                {item.title || 'Untitled Position'}
              </h3>

              {item.company && (
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {item.company}
                </p>
              )}

              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {item.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
