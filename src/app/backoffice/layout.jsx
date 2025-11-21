import { BackofficeDashboardHeader } from '@/components/layout/header/BackofficeDashboardHeader'
import { BackofficeDashboardSidebar } from '@/components/layout/sidebar/BackofficeDashboardSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { BackofficeBreadcrumbProvider } from '@/contexts/backoffice-breadcrumb.context'
import React, { Suspense } from 'react'

export default function BackofficeLayout({ children }) {
  return (
    <BackofficeBreadcrumbProvider>
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        }}
      >
        <BackofficeDashboardSidebar />
        <SidebarInset>
          <BackofficeDashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
                <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BackofficeBreadcrumbProvider>
  )
}
