import BaseDialog from '@/components/_shared/BaseDialog'
import BaseForm from '@/components/_shared/BaseForm'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEditModuleMutation } from '@/hooks/module.hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export default function BackofficeCourseModuleEditDialog({
  data,
  course,
  onOpenChange,
  onSuccess,
}) {
  const [module, setModule] = useState(data?.data || null)
  const { editModuleMutation } = useEditModuleMutation({
    successAction: () => {
      onSuccess()
      editFormConfig.reset()
      onOpenChange(false)
      removeFile()
    },
  })
  const [file, setFile] = useState(null)

  const editFormSchema = z.object({
    title: z
      .string()
      .min(1, { message: 'Title is required' })
      .min(5, { message: 'Title must be at least 5 characters long' })
      .max(100, { message: 'Title cannot exceed 100 characters' }),

    description: z
      .string()
      .min(1, { message: 'Description is required' })
      .min(10, {
        message:
          'Description must provide more detail (at least 10 characters)',
      }),

    file_name: z.string(),
  })

  const editFormConfig = useForm({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: '',
      description: '',
      file_name: '',
    },
  })

  const handleEditSubmit = (data) => {
    const dataKey = Object.keys(data)
    const payload = new FormData()
    dataKey.map((key) => {
      payload.append(key, data[key])
    })
    payload.append('course_id', course.id)
    if (file) {
      payload.append('file_module', file)
    }
    editModuleMutation.mutate({
      id: module?.id,
      payload: payload,
    })
  }

  const handleClose = (value) => {
    if (!editModuleMutation.isPending) {
      editFormConfig.reset()
      removeFile()
      onOpenChange(value || false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        e.target.value = ''
        return
      }

      setFile(selectedFile)

      editFormConfig.setValue('file_name', selectedFile.name, {
        shouldValidate: true,
      })
    }
  }

  useEffect(() => {
    if (data?.data) {
      setModule(data.data)
      editFormConfig.setValue('title', data.data.title)
      editFormConfig.setValue('description', data.data.description)
      editFormConfig.setValue('file_name', data.data.file_name)
    }
  }, [data])

  return (
    <>
      <BaseDialog
        open={data.status}
        onOpenChange={handleClose}
        contentWrapperClassName="space-y-3"
        dialogTitle="Edit Module"
        showDefaultCloseButton={false}
        containerClassName="sm:max-w-md"
      >
        <BaseForm
          formConfig={editFormConfig}
          onSubmit={handleEditSubmit}
          className="flex flex-col gap-3"
        >
          <FormField
            control={editFormConfig.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter module title"
                    {...field}
                    disabled={editModuleMutation.isPending}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editFormConfig.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter module description"
                    {...field}
                    disabled={editModuleMutation.isPending}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-sm font-medium text-black">
              Upload Document (PDF)
            </FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={editModuleMutation.isPending}
                className="h-max w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-0 file:text-sm file:font-semibold file:text-black hover:file:bg-slate-200 focus:border-slate-400 focus:outline-none"
              />
            </FormControl>
            <p className="text-[0.8rem] text-slate-500">*Max file size 5 MB.</p>
            <p className="text-[0.8rem] text-slate-500">
              Current File:{' '}
              <a
                href={module?.modul_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline"
              >
                {module?.file_name}
              </a>
            </p>
          </FormItem>

          <FormField
            control={editFormConfig.control}
            name="file_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  File Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter module file name"
                    {...field}
                    disabled={true}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end gap-3 md:mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              disabled={editModuleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={editModuleMutation.isPending}
            >
              {editModuleMutation.isPending ? 'Loading...' : 'Save'}
            </Button>
          </div>
        </BaseForm>
      </BaseDialog>
    </>
  )
}
