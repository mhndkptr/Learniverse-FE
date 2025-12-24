'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Strikethrough,
  Underline as UnderlineIcon,
  Unlink,
  UploadCloud,
} from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import BaseForm from '@/components/_shared/BaseForm'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import '@/richtext.css'

// Schema Validasi
const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  code: z
    .string()
    .min(3)
    .max(10)
    .regex(/^[a-zA-Z0-9]+$/, 'Code must be alphanumeric (no spaces)'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content/Syllabus is required'),
  is_open_registration_member: z.boolean().default(false),
  is_open_registration_mentor: z.boolean().default(false),
  cover: z.any().optional(),
})

export default function CourseForm({
  defaultValues,
  onSubmit,
  isLoading,
  onDelete,
}) {
  const [preview, setPreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      code: '',
      price: '',
      description: '',
      content: '',
      is_open_registration_member: false,
      is_open_registration_mentor: false,
      cover: null,
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: form.getValues('content') || '',
    onUpdate: ({ editor }) => {
      form.setValue('content', editor.getHTML(), { shouldValidate: true })
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[220px] px-3 py-2 focus:outline-none',
      },
    },
  })

  // Load data edit
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title || '',
        code: defaultValues.code || '',
        price: defaultValues.price || 0,
        description: defaultValues.description || '',
        content: defaultValues.content || '',
        is_open_registration_member:
          defaultValues.is_open_registration_member || false,
        is_open_registration_mentor:
          defaultValues.is_open_registration_mentor || false,
      })
      if (defaultValues.cover_uri) {
        setPreview(defaultValues.cover_uri)
      }
    }
  }, [defaultValues, form])

  useEffect(() => {
    if (editor && defaultValues?.content !== undefined) {
      editor.commands.setContent(defaultValues.content || '', false)
    }
  }, [editor, defaultValues])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.setValue('cover', file, { shouldValidate: true })
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <BaseForm
      formConfig={form}
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-6 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-12"
    >
      {/* KIRI */}
      <div className="space-y-4 md:col-span-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fullstack Javascript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. FSJS2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (IDR) *</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Checkboxes */}
        <div>
          <FormLabel className="mb-2 block">Registration Status</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_open_registration_member"
              render={({ field }) => (
                <FormItem
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') {
                      field.onChange(!field.value)
                    }
                  }}
                  className={`flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border p-3 transition-colors ${
                    field.value
                      ? 'border-blue-200 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                    />
                  </FormControl>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 select-none">
                      Open for Member
                    </span>
                    <span className="block text-xs text-gray-500 select-none">
                      Allow students to enroll
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_open_registration_mentor"
              render={({ field }) => (
                <FormItem
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') {
                      field.onChange(!field.value)
                    }
                  }}
                  className={`flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border p-3 transition-colors ${
                    field.value
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 cursor-pointer rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 select-none">
                      Open for Mentor
                    </span>
                    <span className="block text-xs text-gray-500 select-none">
                      Allow mentors to apply
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Content / Syllabus *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <input type="hidden" {...field} value={field.value || ''} />
                  <div className="border-input rounded-md border text-sm shadow-sm">
                    <EditorToolbar editor={editor} />
                    {editor ? (
                      <EditorContent
                        editor={editor}
                        className="richtext px-3 py-2"
                      />
                    ) : (
                      <div className="flex min-h-[220px] items-center justify-center text-gray-400">
                        Loading editor...
                      </div>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* KANAN */}
      <div className="space-y-4 md:col-span-4">
        <div>
          <FormLabel className="mb-2 block">Thumbnail Image</FormLabel>

          {preview ? (
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <div className="relative mb-2 h-40 w-full">
                  <img
                    src={preview}
                    className="mx-auto h-full rounded object-cover"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue('cover', null)
                      setPreview(null)
                    }}
                    className="mt-1 text-xs text-red-500 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:bg-gray-50"
            >
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2 flex text-sm text-gray-600">
                    <span className="font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                      Click to Upload
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </label>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="border-input placeholder:text-muted-foreground focus-visible:ring-ring h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Brief summary for card view..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-2 flex justify-between border-t pt-6 md:col-span-12">
        {onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            variant="destructive"
            className="h-max"
          >
            Remove Course
          </Button>
        )}

        <div className="ml-auto flex gap-3">
          <Button
            type="button"
            onClick={() => window.history.back()}
            variant="secondary"
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[140px] bg-[#0E1B50] text-white hover:bg-blue-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Course'
            )}
          </Button>
        </div>
      </div>
    </BaseForm>
  )
}

function EditorToolbar({ editor }) {
  if (!editor) {
    return (
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
        Menyiapkan editor...
      </div>
    )
  }

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Masukkan URL', previousUrl || 'https://')
    if (url === null) return
    const trimmed = url.trim()
    if (trimmed === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: trimmed, target: '_blank', rel: 'noopener noreferrer' })
      .run()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
      <ToolbarButton
        ariaLabel="Heading 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-gray-200" />
      <ToolbarButton
        ariaLabel="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-gray-200" />
      <ToolbarButton
        ariaLabel="Ordered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-gray-200" />
      <ToolbarButton ariaLabel="Add link" onClick={handleSetLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Remove link"
        disabled={!editor.isActive('link')}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Unlink className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-gray-200" />
      <ToolbarButton
        ariaLabel="Clear formatting"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <Eraser className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({ active, onClick, children, ariaLabel, disabled }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded border text-xs transition ${
        active
          ? 'border-[#0E1B50] bg-[#0E1B50] text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {children}
    </button>
  )
}
