import { ChevronRight, MoreVertical } from 'lucide-react'

export default function CourseContent({ activeTab }) {
  if (activeTab !== 'All') {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-500">Content for {activeTab} tab</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Headline Section */}
      <section className="mb-12">
        <h3 className="text-foreground mb-4 text-2xl font-bold">Headline</h3>
        <p className="mb-4 text-sm text-gray-500">Published date</p>
        <p className="text-foreground mb-6 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p className="text-foreground leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </section>

      {/* References Section */}
      <section className="mb-12">
        <div className="group mb-6 flex cursor-pointer items-center gap-2">
          <h3 className="text-foreground text-xl font-bold">References</h3>
          <ChevronRight className="text-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>

        <div className="flex items-start gap-4 rounded-lg bg-gray-100 p-4">
          <img
            src="/reference-document.jpg"
            alt="Reference"
            className="h-20 w-20 flex-shrink-0 rounded bg-gray-300 object-cover"
          />
          <div className="flex-1">
            <h4 className="text-foreground mb-1 font-semibold">List item</h4>
            <p className="text-sm text-gray-600">
              Supporting line text lorem ipsum dolor sit amet, consectetur.
            </p>
          </div>
          <button className="rounded-lg p-2 transition-colors hover:bg-gray-200">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </section>

      {/* Task Section */}
      <section>
        <div className="group flex cursor-pointer items-center gap-2">
          <h3 className="text-foreground text-xl font-bold">Task</h3>
          <ChevronRight className="text-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>
      </section>
    </div>
  )
}
