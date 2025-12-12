'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const DEFAULT_MODULES = [
  {
    id: 'mod-001',
    title: 'Intro to React',
    description: 'Frontend 101',
    filename: 'react-101.pdf',
  },
]

export default function BackofficeModuleEditPage() {
  const router = useRouter()
  const params = useParams()
  const { setBreadcrumb } = useBackofficeBreadcrumb()
  const moduleId = params?.id
  const normalizeId = (value) =>
    decodeURIComponent(String(value ?? ''))
      .trim()
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    file: null,
    filename: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Load module data (localStorage placeholder, replace with API)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const rawId = Array.isArray(moduleId) ? moduleId[0] : moduleId
    if (!rawId) {
      setNotFound(true)
      setHasLoaded(true)
      return
    }

    const currentId = normalizeId(rawId)

    const stored = localStorage.getItem('modules')
    let parsed = []
    try {
      parsed = stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to parse modules from localStorage', e)
    }

    if (!parsed.length) {
      parsed = DEFAULT_MODULES
      localStorage.setItem('modules', JSON.stringify(parsed))
    }

    const found = parsed.find((m) => normalizeId(m.id) === currentId)
    if (found) {
      setFormValues({
        title: found.title || '',
        description: found.description || '',
        file: null,
        filename: found.filename || '',
      })
      setNotFound(false)
    } else {
      setNotFound(true)
    }
    setHasLoaded(true)
  }, [moduleId])

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Module', href: '/backoffice/module' },
      { label: 'Edit', href: `/backoffice/module/edit/${moduleId}` },
    ])
  }, [moduleId, setBreadcrumb])

  const pageTitle = useMemo(
    () => `Edit Module${formValues.title ? `: ${formValues.title}` : ''}`,
    [formValues.title]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const rawId = Array.isArray(moduleId) ? moduleId[0] : moduleId
      const currentId = normalizeId(rawId)
      const stored = JSON.parse(localStorage.getItem('modules') || '[]')
      const next = stored.map((m) =>
        normalizeId(m.id) === currentId
          ? {
              ...m,
              title: formValues.title.trim(),
              description: formValues.description.trim(),
              filename: formValues.file?.name || formValues.filename || '',
            }
          : m
      )
      localStorage.setItem('modules', JSON.stringify(next))
      router.push('/backoffice/module')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasLoaded) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>
  }

  if (notFound) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <Button variant="outline" onClick={() => router.push('/backoffice/module')}>
          Back to Module
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">Edit Module Form</p>
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
            {(formValues.file || formValues.filename) && (
              <p className="text-xs text-foreground">
                Selected file: {formValues.file?.name || formValues.filename}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/backoffice/module')}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

