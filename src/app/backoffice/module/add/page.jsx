'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BackofficeModuleAddPage() {
  const router = useRouter()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    file: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Module', href: '/backoffice/module' },
      { label: 'Add', href: '/backoffice/module/add' },
    ])
  }, [setBreadcrumb])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newModule = {
        id: crypto?.randomUUID?.() ?? `mod-${Date.now()}`,
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        filename: formValues.file?.name || '',
      }

      const existing = JSON.parse(localStorage.getItem('modules') || '[]')
      localStorage.setItem('modules', JSON.stringify([...existing, newModule]))

      router.push('/backoffice/module')
    } catch (error) {
      console.error('Failed to add module', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Add New Module</h1>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="module-title">Title</Label>
            <Input
              id="module-title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter module title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module-description">Description</Label>
            <textarea
              id="module-description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter module description"
              className="min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module-file">Attachment File</Label>
            <input
              id="module-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  file: e.target.files?.[0] || null,
                }))
              }
              className="block w-full text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Upload a file (PDF, DOCX, etc.) for this module. Max size: 10MB
            </p>
            {formValues.file && (
              <p className="text-xs text-foreground">
                Selected file: {formValues.file.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 size-4" />
              {isSubmitting ? 'Saving...' : 'Add New Module'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

