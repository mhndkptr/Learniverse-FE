'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth.context'
import Link from 'next/link'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="bg-yellowSecondary-600 rounded-b-lg px-5 pt-26 pb-8 text-white sm:px-10 lg:px-12">
      <div className="mx-auto w-full">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          Welcome Back, {user?.name}!
        </h1>
        <p className="mb-6 text-amber-100">Your Learning Journey Awaits</p>
        <Link href="/mentor/registration">
          <Button variant="primary" size="lg">
            Enroll New Course
          </Button>
        </Link>
      </div>
    </div>
  )
}
