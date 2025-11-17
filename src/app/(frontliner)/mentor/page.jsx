import MentorGrid from '@/components/core/mentor/MentorGrid'
import MentorSearch from '@/components/core/mentor/MentorSearch'

export default function MentorPage() {
  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
        {/* Header */}
        <h1 className="text-foreground mb-12 text-center text-4xl font-bold">
          Our Mentor
        </h1>

        {/* Search Bar */}
        <div className="mb-12">
          <MentorSearch />
        </div>

        {/* Mentor Grid */}
        <MentorGrid />
      </main>
    </div>
  )
}
