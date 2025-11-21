'use client'

import EnrollmentChart from '@/components/core/backoffice/overview/EnrollmentChart'
import PendingApprovals from '@/components/core/backoffice/overview/PendingApprovals'
import RecentActivities from '@/components/core/backoffice/overview/RecentActivities'
import RevenueChart from '@/components/core/backoffice/overview/RevenueChart'
import StatisticsCard from '@/components/core/backoffice/overview/StatisticCard'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useEffect } from 'react'

export default function BackofficeOverviewPage() {
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Overview', href: '/backoffice' },
    ])
  }, [setBreadcrumb])

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Total Users"
            value="1,234"
            change="+12%"
            icon="👥"
          />
          <StatisticsCard
            title="Active Courses"
            value="28"
            change="+3%"
            icon="📚"
          />
          <StatisticsCard
            title="Total Revenue"
            value="Rp 45.2M"
            change="+8%"
            icon="💰"
          />
          <StatisticsCard
            title="Enrollments"
            value="856"
            change="+15%"
            icon="✅"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart />
          <EnrollmentChart />
        </div>

        {/* Pending & Recent Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PendingApprovals />
          <RecentActivities />
        </div>
      </div>
    </>
  )
}
