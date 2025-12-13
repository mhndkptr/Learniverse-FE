// File: src/components/core/mentor/MentorGrid.jsx

'use client'

import MentorCard from './MentorCard'
import { Skeleton } from '@/components/ui/skeleton'

// [REVISI] Tambahkan prop isFetching
export default function MentorGrid({ mentors, isLoading, isFetching }) {
  // Tampilkan Skeleton jika sedang loading pertama kali ATAU sedang fetching data baru dari search
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map(
          (
            _,
            i // Tampilkan 8 skeleton
          ) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          )
        )}
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
  // ... [Logika mapping ke MentorCard tetap sama]
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mentors.map((item) => {
        const courseTitlesText =
          item.courseTitles.join(', ') || 'General Mentor'

        const mentorData = {
          id: item.id,
          name: item.user?.name || 'Mentor Learniverse',
          description: `Mentor for: ${courseTitlesText}`,
          image: item.user?.photo_profile_url,
          courseTitles: item.courseTitles,
        }

        return <MentorCard key={item.id} mentor={mentorData} />
      })}
    </div>
  )
}
