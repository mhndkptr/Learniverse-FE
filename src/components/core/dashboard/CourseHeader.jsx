export default function CourseHeader({ course }) {
  return (
    <div className="relative mt-6 h-80 min-h-min overflow-hidden rounded-2xl bg-linear-to-br from-green-700 to-black">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/${course?.cover_uri ? course.cover_uri : 'placeholder.svg'}?height=256&width=1200&query=green-field-mathematics)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6,
        }}
      ></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-r from-black/60 to-transparent p-8">
        <h2 className="mb-2 text-4xl font-bold text-white">{course?.title}</h2>
        <p className="text-gray-200">{course?.description}</p>
      </div>
    </div>
  )
}
