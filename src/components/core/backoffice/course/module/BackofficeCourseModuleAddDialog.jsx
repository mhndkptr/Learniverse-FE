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
import { useAddModuleMutation } from '@/hooks/module.hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export default function BackofficeCourseModuleAddDialog({
  data,
  course,
  onOpenChange,
  onSuccess,
}) {
  const { addModuleMutation } = useAddModuleMutation({
    successAction: () => {
      onSuccess()
      addFormConfig.reset()
      onOpenChange(false)
      removeFile()
    },
  })
  const [file, setFile] = useState(null)

  const addFormSchema = z.object({
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

  const addFormConfig = useForm({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      title: '',
      description: '',
      file_name: '',
    },
  })

  const handleAddSubmit = (data) => {
    const dataKey = Object.keys(data)
    const payload = new FormData()
    dataKey.map((key) => {
      payload.append(key, data[key])
    })
    payload.append('course_id', course.id)
    if (file) {
      payload.append('file_module', file)
    } else {
      toast.warning('File module is required')
      return
    }
    addModuleMutation.mutate({
      payload: payload,
    })
  }

  const handleClose = (value) => {
    if (!addModuleMutation.isPending) {
      addFormConfig.reset()
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

      addFormConfig.setValue('file_name', selectedFile.name, {
        shouldValidate: true,
      })
    }
  }

  return (
    <>
      <BaseDialog
        open={data.status}
        onOpenChange={handleClose}
        contentWrapperClassName="space-y-3"
        dialogTitle="Add Module to Course"
        showDefaultCloseButton={false}
        containerClassName="sm:max-w-md"
      >
        <BaseForm
          formConfig={addFormConfig}
          onSubmit={handleAddSubmit}
          className="flex flex-col gap-3"
        >
          <FormField
            control={addFormConfig.control}
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
                    disabled={addModuleMutation.isPending}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addFormConfig.control}
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
                    disabled={addModuleMutation.isPending}
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
                disabled={addModuleMutation.isPending}
                className="h-max w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-0 file:text-sm file:font-semibold file:text-black hover:file:bg-slate-200 focus:border-slate-400 focus:outline-none"
              />
            </FormControl>
            <p className="text-[0.8rem] text-slate-500">*Max file size 5 MB.</p>
          </FormItem>

          <FormField
            control={addFormConfig.control}
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
              disabled={addModuleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={addModuleMutation.isPending}
            >
              {addModuleMutation.isPending ? 'Loading...' : 'Add'}
            </Button>
          </div>
        </BaseForm>
      </BaseDialog>
    </>
  )
}
