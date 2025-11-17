export default function CourseHeader() {
  return (
    <div className="relative mx-4 mt-6 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-black sm:mx-6 lg:mx-8">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(/placeholder.svg?height=256&width=1200&query=green-field-mathematics)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6,
        }}
      ></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-black/60 to-transparent p-8">
        <h2 className="mb-2 text-4xl font-bold text-white">Title</h2>
        <p className="text-gray-200">Subtitle</p>
      </div>
    </div>
  )
}
