export default function CourseContent({ activeTab, course }) {
  if (activeTab !== 'Overview') {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-500">Content for {activeTab} tab</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 py-8">
      {/* Headline Section */}
      <section className="pb-6">
        <div
          className="richtext leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: course?.content || '' }}
        />
      </section>
    </div>
  )
}
