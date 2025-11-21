'use client'

import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function BackofficeUserPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const initialSortKey = searchParams.get('sortKey') || null
  const initialSortDirection = searchParams.get('sortDir') || 'none'
  const [sortConfig, setSortConfig] = useState({
    key: initialSortKey,
    direction: initialSortDirection,
  })
  const [currentPage, setCurrentPage] = useState(1)

  //   const { users, isLoading, isPending, refetch } = useGetAllUser({
  //     params: {
  //       ...(debouncedSearchTerm
  //         ? {
  //             search: debouncedSearchTerm,
  //           }
  //         : {}),
  //       get_all: false,
  //       pagination: {
  //         page: currentPage,
  //         limit: 10,
  //       },
  //       ...(sortConfig.direction !== 'none' && sortConfig.key
  //         ? {
  //             order_by: [
  //               {
  //                 field: sortConfig.key,
  //                 direction: sortConfig.direction,
  //               },
  //             ],
  //           }
  //         : {}),
  //     },
  //   })

  const users = [
    {
      id: 'ccadd4c0-f74a-4bcb-8c3f-9dab282b8571',
      name: 'Administrator',
      username: 'administrator',
      email: 'admin@dev.com',
      phone_number: '+62123123123',
      profile_uri: null,
      role: 'ADMIN',
      verified_at: null,
      created_at: '2025-11-20T21:55:07.721Z',
      updated_at: '2025-11-20T21:55:07.721Z',
      deleted_at: null,
    },
  ]
  const isLoading = false
  const isPending = false
  const pagination = {
    totalItems: 46,
    totalPages: 5,
    currentPage: 1,
    itemsPerPage: 10,
  }

  const buildQueryString = useCallback((search, sortKey, sortDir) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sortKey && sortDir !== 'none') {
      params.set('sortKey', sortKey)
      params.set('sortDir', sortDir)
    }
    return params.toString()
  }, [])

  useEffect(() => {
    const nextQuery = buildQueryString(
      debouncedSearchTerm,
      sortConfig.key,
      sortConfig.direction
    )
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [
    pathname,
    buildQueryString,
    router,
    searchParams,
    debouncedSearchTerm,
    sortConfig.key,
    sortConfig.direction,
  ])

  const [showEditModal, setShowEditModal] = useState({
    data: null,
    status: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState({
    data: null,
    status: false,
  })
  const [showAddModal, setShowAddModal] = useState({
    data: null,
    status: false,
  })

  const { setBreadcrumb } = useBackofficeBreadcrumb()

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice/overview' },
      {
        label: 'User',
        href: '/backoffice/user',
      },
    ])
  }, [setBreadcrumb])

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      {
        key: 'username',
        header: 'Username',
        sortable: true,
      },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'phone_number', header: 'Phone Number', sortable: true },
      { key: 'role', header: 'Role', sortable: true },
      {
        key: 'actions',
        header: '',
        sortable: false,
        actions: [
          {
            label: 'Edit',
            action: 'edit',
            icon: Pencil,
          },
          { label: 'Delete', action: 'delete', icon: Trash2 },
        ],
      },
    ],
    []
  )

  const searchFields = useMemo(
    () => ['name', 'username', 'email', 'phone_number', 'role'],
    []
  )

  const handleRowAction = (action, row) => {
    switch (action) {
      case 'edit':
        handleShowEditModal(row)
        break
      case 'delete':
        handleShowDeleteModal(row)
        break
      default:
        break
    }
  }

  const handleShowEditModal = (data) => {
    setShowEditModal({
      data: !showEditModal.status && data ? data : null,
      status: !showEditModal.status,
    })
  }

  const handleShowDeleteModal = (data) => {
    setShowDeleteModal({
      data: !showDeleteModal.status && data ? data : null,
      status: !showDeleteModal.status,
    })
  }

  const handleShowAddModal = () => {
    setShowAddModal({ status: !showAddModal.status })
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <h1 className="text-2xl font-bold">User</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative w-full max-w-sm">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user..."
                className="py-2 pl-10"
              />
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => handleShowAddModal()}>
              <Plus className="size-4" /> Add
            </Button>
          </div>
        </div>

        <BaseTable
          data={users}
          searchFields={searchFields}
          searchTerm={searchTerm}
          onRowAction={handleRowAction}
          columns={columns}
          isLoading={isLoading || isPending}
          serverSide={true}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />

        {/* Pagination */}
        {pagination && (
          <PaginationControls
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={(page) => {
              if (page !== currentPage && !isLoading && !isPending) {
                setCurrentPage(page)
              }
            }}
          />
        )}

        {/* Modals */}
      </div>
    </>
  )
}
