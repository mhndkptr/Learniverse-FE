'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce.hook'

// [REVISI] Mengatur delay lebih rendah untuk responsivitas yang lebih baik
const SEARCH_DEBOUNCE_DELAY = 300

export default function MentorSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  // Menggunakan delay 300ms
  const debouncedSearch = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY)

  useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch, onSearch])

  return (
    <div className="relative mx-auto max-w-md">
      <input
        type="text"
        // Teks placeholder disesuaikan dengan perbaikan backend sebelumnya
        placeholder="Search mentor by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-ring w-full rounded-full border px-4 py-3 pr-10 pl-4 transition-all focus:ring-2 focus:outline-none"
      />
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform" />
    </div>
  )
}
