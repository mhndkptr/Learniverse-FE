'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth.context'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="bg-yellowSecondary-600 rounded-b-lg px-4 pt-26 pb-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          Welcome Back, {user?.name}!
        </h1>
        <p className="mb-6 text-amber-100">Your Learning Journey Awaits</p>
        <Button variant="primary" size="lg">
          Enroll New Course
        </Button>
      </div>
    </div>
  )
}
