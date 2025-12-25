'use client'

import EnrollmentChart from '@/components/core/backoffice/overview/EnrollmentChart'
import PendingApprovals from '@/components/core/backoffice/overview/PendingApprovals'
import RecentActivities from '@/components/core/backoffice/overview/RecentActivities'
import RevenueChart from '@/components/core/backoffice/overview/RevenueChart'
import StatisticsCard from '@/components/core/backoffice/overview/StatisticCard'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useBackofficeOverview } from '@/hooks/overview.hook'
import { formatCurrency } from '@/utils/helper'
import { useEffect } from 'react'

export default function BackofficeOverviewPage() {
  const { setBreadcrumb } = useBackofficeBreadcrumb()
  const { overview } = useBackofficeOverview()

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Overview', href: '/backoffice' },
    ])
  }, [setBreadcrumb])

  const stats = overview?.stats ?? {}
  const changes = stats?.changes ?? {}

  const formatChange = (value) => {
    const safeValue = Number(value || 0)
    return `${safeValue >= 0 ? '+' : ''}${safeValue}%`
  }

  const formatCount = (value) => {
    return new Intl.NumberFormat('id-ID').format(Number(value || 0))
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Total Users"
            value={formatCount(stats.totalUsers)}
            change={formatChange(changes.users)}
            icon="👥"
          />
          <StatisticsCard
            title="Active Courses"
            value={formatCount(stats.activeCourses)}
            change={formatChange(changes.courses)}
            icon="📚"
          />
          <StatisticsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue || 0)}
            change={formatChange(changes.revenue)}
            icon="💰"
          />
          <StatisticsCard
            title="Enrollments"
            value={formatCount(stats.enrollments)}
            change={formatChange(changes.enrollments)}
            icon="✅"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart data={overview?.revenueTrend ?? []} />
          <EnrollmentChart data={overview?.enrollmentTrend ?? []} />
        </div>

        {/* Pending & Recent Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PendingApprovals approvals={overview?.pendingApprovals ?? []} />
          <RecentActivities activities={overview?.recentActivities ?? []} />
        </div>
      </div>
    </>
  )
}
