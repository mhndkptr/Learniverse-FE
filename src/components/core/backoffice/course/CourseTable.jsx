'use client'
import { Pencil, Trash2 } from 'lucide-react'

export default function CourseTable({
  courses,
  onEdit,
  onDelete,
  onToggleStatus, 
}) {
  // Helper render badge status
  const renderStatusBadge = (isOpen, onClick) => {
    if (isOpen) {
      return (
        <button
          onClick={onClick}
          className="inline-flex cursor-pointer items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 transition hover:bg-green-200"
        >
          Open
        </button>
      )
    }
    return (
      <button
        onClick={onClick}
        className="inline-flex cursor-pointer items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 transition hover:bg-red-200"
      >
        Closed
      </button>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3">Thumbnail</th>
            <th className="px-4 py-3">Info</th>
            <th className="px-4 py-3 text-center">Member Reg.</th>
            <th className="px-4 py-3 text-center">Mentor Reg.</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr
                key={course.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* 1. Thumbnail: Support cover_uri (JSON) & image_cover (Upload) */}
                <td className="w-[100px] px-4 py-3">
                  <div className="h-[50px] w-[80px] overflow-hidden rounded bg-gray-200">
                    <img
                      src={
                        course.cover_uri ||
                        course.image_cover ||
                        '/assets/images/img-image-placeholder.png'
                      }
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* 2. Info */}
                <td className="max-w-[250px] px-4 py-3">
                  <div className="line-clamp-1 font-semibold text-gray-900">
                    {course.title}
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-gray-500">
                    {course.code}
                  </div>
                </td>

                {/* 3. Status Member */}
                <td className="px-4 py-3 text-center">
                  {renderStatusBadge(course.is_open_registration_member, () =>
                    onToggleStatus(
                      course.id,
                      'is_open_registration_member',
                      course.is_open_registration_member
                    )
                  )}
                </td>

                {/* 4. Status Mentor */}
                <td className="px-4 py-3 text-center">
                  {renderStatusBadge(course.is_open_registration_mentor, () =>
                    onToggleStatus(
                      course.id,
                      'is_open_registration_mentor',
                      course.is_open_registration_mentor
                    )
                  )}
                </td>

                {/* 5. Price */}
                <td className="px-4 py-3 text-right font-medium text-gray-700">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(course.price)}
                </td>

                {/* 6. Action */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(course.id)}
                      className="rounded bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      className="rounded bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Tampilan jika hasil Search KOSONG
            <tr>
              <td colSpan="6" className="py-12 text-center text-gray-500">
                No courses found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
