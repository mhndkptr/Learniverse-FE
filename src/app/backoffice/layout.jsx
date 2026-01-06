'use client'

import { BackofficeDashboardHeader } from '@/components/layout/header/BackofficeDashboardHeader'
import { BackofficeDashboardSidebar } from '@/components/layout/sidebar/BackofficeDashboardSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { BackofficeBreadcrumbProvider } from '@/contexts/backoffice-breadcrumb.context'
import { useAuth } from '@/contexts/auth.context'
import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function BackofficeLayout({ children }) {
  const router = useRouter()
  const { user, isAuthLoading } = useAuth()
  const pathname = usePathname()
  const isManageRoute =
    pathname?.includes('/backoffice/course/') && pathname?.includes('/manage')

  // if (isAuthLoading) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }

  if (user && user?.role !== 'ADMIN' && !isManageRoute) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Akses ditolak</h2>
          <p className="mt-2 text-sm text-gray-600">
            Anda tidak memiliki akses ke halaman backoffice.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button
              className="bg-[#0E1B50] text-white hover:bg-blue-900"
              onClick={() => router.push('/')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
