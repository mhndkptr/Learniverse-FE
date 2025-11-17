'use client'

import MentorRegistrationForm from '@/components/core/mentor/MentorRegistrationForm'

export default function RegisterPage() {
  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
        <MentorRegistrationForm />
      </main>
    </div>
  )
}
