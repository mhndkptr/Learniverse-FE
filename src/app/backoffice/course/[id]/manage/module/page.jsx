'use client'

import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, SquareArrowOutUpRight } from 'lucide-react'
import BaseTable from '@/components/_shared/BaseTable'
import { Button } from '@/components/ui/button'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import BackofficeCourseModuleAddDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleAddDialog'
import BackofficeCourseModuleEditDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleEditDialog'
import { useDeleteModuleMutation } from '@/hooks/module.hook'
import { useCourseManage } from '../_components/course-manage.context'
import SortDropdown from '../_components/SortDropdown'
import sortData from '../_components/sortData'

export default function BackofficeCourseManageModulePage() {
  const { course, refetch } = useCourseManage()

  const [moduleSort, setModuleSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [showAddModule, setShowAddModule] = useState({ status: false })
  const [showEditModule, setShowEditModule] = useState({
    status: false,
    data: null,
  })
  const [showDelete, setShowDelete] = useState({
    status: false,
    data: null,
    mutation: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const { deleteModuleMutation } = useDeleteModuleMutation({
    successAction: () => {
      setShowDelete({ status: false, data: null, mutation: null })
      refetch()
    },
  })

  const processedModules = useMemo(
    () => sortData(course?.moduls || [], moduleSort),
    [course?.moduls, moduleSort]
  )

  const moduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Module Title' },
      { key: 'file_name', header: 'File Name' },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.open(row.modul_uri, '_blank')}
              className="h-8 w-8 text-blue-600"
            >
              <SquareArrowOutUpRight className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-amber-600"
              onClick={() =>
                setShowEditModule({
                  data: !showEditModule.status && row ? row : null,
                  status: !showEditModule.status,
                })
              }
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() =>
                setShowDelete({
                  status: true,
                  data: row,
                  mutation: deleteModuleMutation,
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteModuleMutation, showEditModule.status]
  )

  if (!course) return null

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold">Course Modules</h3>
            <p className="text-sm text-gray-500">Manage learning materials.</p>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown
              sortConfig={moduleSort}
              onSortChange={setModuleSort}
              options={[
                { value: 'title:asc', label: 'Title (A-Z)' },
                { value: 'title:desc', label: 'Title (Z-A)' },
                { value: 'created_at:desc', label: 'Newest' },
                { value: 'created_at:asc', label: 'Oldest' },
              ]}
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowAddModule({ status: true })}
            >
              <Plus className="mr-2 size-4" /> Add Module
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <BaseTable
            data={processedModules}
            columns={moduleColumns}
            serverSide={true}
            searchFields={['title']}
            onRowAction={() => {}}
            sortConfig={moduleSort}
            onSortChange={setModuleSort}
          />
        </div>
      </div>

      <BackofficeCourseModuleAddDialog
        course={course}
        data={showAddModule}
        onOpenChange={() => setShowAddModule({ status: false })}
        onSuccess={() => refetch()}
      />

      <BackofficeCourseModuleEditDialog
        course={course}
        data={showEditModule}
        onOpenChange={() => {
          setShowEditModule({
            data:
              !showEditModule.status && showEditModule.data
                ? showEditModule.data
                : null,
            status: !showEditModule.status,
          })
        }}
        onSuccess={() => {}}
      />

      <ConfirmDialogDelete
        isOpen={showDelete.status}
        onClose={() =>
          setShowDelete({ status: false, data: null, mutation: null })
        }
        onConfirm={async () => {
          setIsDeleting(true)
          await showDelete.mutation.mutate({ id: showDelete?.data?.id })
          setIsDeleting(false)
          refetch()
        }}
        title="Delete Item"
        isLoading={isDeleting}
      />
    </>
  )
}
