import DashboardHeader from '@/components/core/dashboard/DashboardHeader'
import ContinueLearning from '@/components/core/dashboard/ContinueLearning'
import YourTasks from '@/components/core/dashboard/YourTasks'

export default function Dashboard() {
  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
        {/* Welcome Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Continue Learning */}
            <div className="lg:col-span-2">
              <ContinueLearning />
            </div>

            {/* Right Column - Your Tasks */}
            <div className="lg:col-span-1">
              <YourTasks />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
