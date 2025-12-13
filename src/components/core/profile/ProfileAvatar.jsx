'use client'

import Image from 'next/image'

export default function ProfileAvatar({ name = 'User', src }) {
  const initials = (name || 'User')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 shadow bg-gray-100 text-3xl font-bold text-gray-600">
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
