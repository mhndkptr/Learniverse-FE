'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

export default function MentorSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative mx-auto max-w-md">
      <input
        type="text"
        placeholder="Search mentor"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-ring w-full rounded-full border px-4 py-3 pr-10 pl-4 transition-all focus:ring-2 focus:outline-none"
      />
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform" />
    </div>
  )
}
