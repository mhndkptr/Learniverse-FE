import MentorExperience from '@/components/core/mentor/MentorExperience'
import MentorProfile from '@/components/core/mentor/MentorProfile'

export default function MentorPage() {
  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
        {/* Header */}
        <h1 className="text-foreground mb-12 text-4xl font-bold">
          Detail Mentor
        </h1>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile */}
          <div>
            <MentorProfile />
          </div>

          {/* Right Column - Experience */}
          <div className="lg:col-span-2">
            <MentorExperience />
          </div>
        </div>
      </main>
    </div>
  )
}
