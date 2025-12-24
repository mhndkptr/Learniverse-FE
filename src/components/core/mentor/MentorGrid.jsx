'use client'

import MentorCard from './MentorCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function MentorGrid({ mentors, isLoading, isFetching }) {
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!mentors || mentors.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-muted-foreground text-lg">
          Belum ada mentor yang tersedia saat ini.
        </p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mentors.map((item) => {
        const courseTitlesText =
          item.courseTitles.join(', ') || 'General Mentor'

        const mentorData = {
          id: item.id,
          name: item.user?.name || 'Mentor Learniverse',
          description: `Mentor for: ${courseTitlesText}`,
          image: item.user?.profile_uri,
          courseTitles: item.courseTitles,
        }

        return <MentorCard key={item.id} mentor={mentorData} />
      })}
    </div>
  )
}
