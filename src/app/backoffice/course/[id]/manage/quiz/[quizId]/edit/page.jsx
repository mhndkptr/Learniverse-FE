'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import {
  useGetQuizById,
  useEditQuizMutation,
  useAddQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
  useEditQuizQuestionMutation,
} from '@/hooks/quiz.hook'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  GripVertical,
  ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

// --- SCHEMA METADATA QUIZ ---
const quizFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  status: z.enum(['PUBLISH', 'DRAFT']),
  show_review: z.boolean(),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().min(1, { message: 'End date is required' }),
  max_attempt: z.coerce.number().min(1, { message: 'Minimal 1 attempt' }),
  duration: z.coerce.number().min(1, { message: 'Duration is required' }),
})

export default function EditQuizPage() {
  const router = useRouter()
  const params = useParams()

  const fileInputRef = useRef(null)

  // FIX 1: Gunakan optional chaining pada params untuk mencegah error jika params null
  const quizId = params?.quizId
  const courseId = params?.id

  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- DATA FETCHING ---
  const {
    quiz,
    isLoading: isQuizLoading,
    refetch: refetchQuiz,
  } = useGetQuizById({ quizId })

  // FIX 2: Filter array untuk membuang item yang null/undefined agar aman saat di-map
  const questionsList = (quiz?.quiz_questions || []).filter((q) => q !== null)

  // --- MUTATIONS ---
  const { editQuizMutation } = useEditQuizMutation({
    successAction: () => {
      refetchQuiz()
    },
  })

  const { addQuizQuestionMutation } = useAddQuizQuestionMutation({
    successAction: () => {
      refetchQuiz()
      setShowQuestionModal(false)
    },
  })

  const { editQuizQuestionMutation } = useEditQuizQuestionMutation({
    successAction: () => {
      refetchQuiz()
      setShowQuestionModal(false)
    },
  })

  const { deleteQuizQuestionMutation } = useDeleteQuizQuestionMutation({
    successAction: () => {
      refetchQuiz()
    },
  })

  // --- FORM METADATA SETUP ---
  const form = useForm({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'DRAFT',
      show_review: true,
      start_date: '',
      end_date: '',
      max_attempt: 1,
      duration: 30,
    },
  })

  // --- LOCAL STATE FOR MODAL ---
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  // --- EFFECT: BREADCRUMB & LOAD METADATA ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Quiz', href: '#' },
      { label: 'Edit', href: '#' },
    ])

    if (quiz) {
      // --- PERBAIKAN DI SINI ---
      const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)

        // Dapatkan selisih waktu lokal user dengan UTC (dalam menit)
        // Untuk WIB (UTC+7), offset biasanya -420
        const offset = date.getTimezoneOffset()

        // Kita "geser" waktu date object ini seolah-olah UTC adalah waktu lokal
        // agar saat dipanggil toISOString() angkanya sesuai jam lokal
        const localDate = new Date(date.getTime() - offset * 60 * 1000)

        // Ambil string ISO dan potong bagian detik & Z
        return localDate.toISOString().slice(0, 16)
      }
      // -------------------------

      form.reset({
        title: quiz.title || '',
        description: quiz.description || '',
        status: quiz.status || 'DRAFT',
        show_review: quiz.show_review,
        start_date: formatDate(quiz.start_date || quiz.exam_date),
        end_date: formatDate(quiz.end_date || quiz.due_date),
        max_attempt: quiz.max_attempt || 1,
        duration: quiz.duration || quiz.time_exam || 60,
      })
    }
  }, [quiz, setBreadcrumb, form])

  // --- HANDLER: SAVE METADATA QUIZ ---
  const onSubmitMetadata = (data) => {
    const formattedStartDate = new Date(data.start_date).toISOString()
    const formattedEndDate = new Date(data.end_date).toISOString()

    const payload = {
      ...data,
      show_review: data.show_review,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      course_id: courseId,
    }

    editQuizMutation.mutate({ id: quizId, payload })
  }

  // --- HANDLER: DELETE QUESTION ---
  const handleDeleteQuestion = (questionId) => {
    // FIX 3: Pastikan ID ada sebelum memanggil mutasi
    if (!questionId) return toast.error('Invalid question ID')

    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuizQuestionMutation.mutate({ id: questionId })
    }
  }

  // --- HANDLER: SAVE QUESTION (CREATE / UPDATE) ---
  const handleSaveQuestion = () => {
    if (!editingQuestion) return

    // 1. Validasi Input UI
    if (!editingQuestion.text) return toast.error('Question text is required')
    const hasCorrect = editingQuestion.options.some((o) => o.isCorrect)
    if (!hasCorrect)
      return toast.error('Please select at least one correct answer')

    // 2. Mapping Payload
    // NOTE: Karena ada File upload, pastikan hook API Anda bisa menerima
    // object ini dan mengonversinya ke FormData jika backend meminta Multipart.
    const payload = {
      question: editingQuestion.text,
      type: editingQuestion.type,
      // Masukkan image ke payload (bisa berupa File object atau null/string url lama)
      image: editingQuestion.image,
      quiz_option_answers: editingQuestion.options.map((opt) => ({
        answer: opt.text,
        is_correct: opt.isCorrect,
      })),
    }

    const form = new FormData()

    form.append('question', payload.question)
    form.append('type', payload.type)
    if (payload.image instanceof File) {
      form.append('image', payload.image)
    }
    payload.quiz_option_answers.forEach((opt, index) => {
      form.append(`quiz_option_answers[${index}][answer]`, opt.answer)
      form.append(`quiz_option_answers[${index}][is_correct]`, opt.is_correct)
    })

    // 3. Eksekusi Mutasi
    if (editingQuestion?.id) {
      // UPDATE
      editQuizQuestionMutation.mutate({
        id: editingQuestion.id,
        payload: form,
      })
    } else {
      // CREATE
      form.append('quiz_id', quizId)
      addQuizQuestionMutation.mutate({
        payload: form,
      })
    }
  }

  // --- MODAL UTILS (OPEN/EDIT) ---
  const handleOpenAddModal = () => {
    setEditingQuestion({
      id: null,
      type: 'SINGLE_CHOICE',
      text: '',
      image: null, // Reset image file
      imagePreview: null, // Reset image preview
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    })
    setShowQuestionModal(true)
  }

  const handleOpenEditModal = (questionFromServer) => {
    if (!questionFromServer) return

    const uiOptions = questionFromServer.quiz_option_answers
      ? questionFromServer.quiz_option_answers.map((opt) => ({
          text: opt.answer,
          isCorrect: opt.is_correct,
        }))
      : questionFromServer.options || []

    const qData = {
      id: questionFromServer.id,
      type: questionFromServer.type || 'SINGLE_CHOICE',
      text: questionFromServer.question || questionFromServer.text,
      // Load image dari server jika ada
      image: null, // Kita set null untuk file baru, biarkan backend handle image lama jika tidak diubah
      imagePreview:
        questionFromServer.image || questionFromServer.image_uri || null,
      options: uiOptions,
    }

    setEditingQuestion(JSON.parse(JSON.stringify(qData)))
    setShowQuestionModal(true)
  }

  // --- IMAGE HANDLERS ---
  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran/tipe jika perlu
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit contoh
        return toast.error('Image size must be less than 2MB')
      }

      const previewUrl = URL.createObjectURL(file)
      setEditingQuestion({
        ...editingQuestion,
        image: file, // Simpan File object untuk payload
        imagePreview: previewUrl, // Simpan URL untuk display UI
      })
    }
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation() // Mencegah trigger klik upload
    setEditingQuestion({
      ...editingQuestion,
      image: null, // Hapus file dari payload (atau kirim flag delete jika backend support)
      imagePreview: null,
    })
    // Reset value input agar bisa pilih file yang sama lagi jika berubah pikiran
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- MODAL FORM LOGIC ---
  const handleChangeType = (newType) => {
    if (!editingQuestion) return // Safety check
    const resetOptions = editingQuestion.options.map((o) => ({
      ...o,
      isCorrect: false,
    }))
    setEditingQuestion({
      ...editingQuestion,
      type: newType,
      options: resetOptions,
    })
  }

  const handleOptionChange = (idx, val) => {
    if (!editingQuestion) return
    const newOpts = [...editingQuestion.options]
    newOpts[idx].text = val
    setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  const handleSetCorrect = (idx) => {
    if (!editingQuestion) return
    let newOpts = [...editingQuestion.options]
    if (editingQuestion.type === 'MULTIPLE_CHOICE') {
      newOpts[idx].isCorrect = !newOpts[idx].isCorrect
    } else {
      newOpts = newOpts.map((o, i) => ({
        ...o,
        isCorrect: i === idx,
      }))
    }
    setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  const handleAddOption = () => {
    if (!editingQuestion) return
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, { text: '', isCorrect: false }],
    })
  }

  const handleRemoveOption = (idx) => {
    if (!editingQuestion) return
    const newOpts = editingQuestion.options.filter((_, i) => i !== idx)
    setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  if (isQuizLoading) {
    return <div className="p-10 text-center">Loading quiz data...</div>
  }

  return (
    <div className="w-full pb-20">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/backoffice/course/${courseId}/manage`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
        </div>

        <Button
          onClick={form.handleSubmit(onSubmitMetadata)}
          disabled={editQuizMutation?.isPending}
          className="bg-[#0F172A] hover:bg-[#1e293b]"
        >
          <Save className="mr-2 h-4 w-4" />
          {editQuizMutation?.isPending ? 'Saving Settings...' : 'Save Settings'}
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* SECTION 1: METADATA FORM */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 border-b pb-2 text-lg font-semibold">
            Quiz Settings
          </h2>

          <Form {...form}>
            <form className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_attempt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Attempt</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISH">Publish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="show_review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Show Review</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === 'true' ? true : false)
                        }
                        value={field.value ? 'true' : 'false'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes, Show Review</SelectItem>
                          <SelectItem value="false">No, Hide Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* SECTION 2: QUESTION MANAGER */}
        <div className="w-full">
          <div className="min-h-[300px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold">Questions List</h2>
                <p className="text-sm text-gray-500">
                  Manage questions for this quiz
                </p>
              </div>
              <Button
                onClick={handleOpenAddModal}
                className="bg-amber-700 text-white hover:bg-amber-800"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questionsList.length === 0 && (
                <div className="rounded-lg border-2 border-dashed py-20 text-center text-gray-400">
                  No questions added yet.
                </div>
              )}

              {questionsList.map((q, index) => {
                // FIX 6: Double check q is not null inside mapping
                if (!q) return null
                return (
                  <div
                    key={q.id || index}
                    className="group rounded-lg border bg-gray-50/50 p-4 transition-all hover:border-amber-500 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                          {index + 1}
                        </span>
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${q.type === 'MULTIPLE_CHOICE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                            >
                              {q.type === 'MULTIPLE_CHOICE'
                                ? 'Multiple Choice'
                                : 'Single Choice'}
                            </span>
                            <p className="font-medium text-gray-900">
                              {q.question || q.text}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {(q.quiz_option_answers || q.options || []).map(
                              (opt, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-2 text-sm ${opt.is_correct || opt.isCorrect ? 'font-medium text-green-700' : 'text-gray-500'}`}
                                >
                                  {opt.is_correct || opt.isCorrect ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <span className="block h-3 w-3 rounded-full border border-gray-300" />
                                  )}
                                  {opt.answer || opt.text}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenEditModal(q)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          disabled={deleteQuizQuestionMutation.isPending}
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL ADD/EDIT QUESTION --- */}
      {showQuestionModal && editingQuestion && (
        <div className="animate-in fade-in fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <h3 className="text-lg font-bold">
                {editingQuestion.id ? 'Edit Question' : 'Add New Question'}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQuestionModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleChangeType('SINGLE_CHOICE')}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${editingQuestion.type === 'SINGLE_CHOICE' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Single Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeType('MULTIPLE_CHOICE')}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${editingQuestion.type === 'MULTIPLE_CHOICE' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}
                    >
                      <CheckSquare className="h-4 w-4" /> Multiple Choice
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <textarea
                    className="border-input min-h-[100px] w-full rounded-md border p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={editingQuestion.text}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        text: e.target.value,
                      })
                    }
                    placeholder="Enter your question here..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Image (Optional)</Label>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {!editingQuestion.imagePreview ? (
                    // UPLOAD PLACEHOLDER
                    <div
                      onClick={handleTriggerFileSelect}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-colors hover:border-amber-300 hover:bg-gray-100"
                    >
                      <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                        <UploadCloud className="h-6 w-6 text-amber-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (max. 2MB)
                      </p>
                    </div>
                  ) : (
                    // IMAGE PREVIEW
                    <div className="relative overflow-hidden rounded-lg border border-gray-200">
                      {/* Tombol Hapus Gambar */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="relative h-48 w-full bg-gray-100">
                        <img
                          src={editingQuestion.imagePreview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-xs text-gray-500">
                        <span>Image attached</span>
                        <span
                          onClick={handleTriggerFileSelect}
                          className="cursor-pointer font-medium text-blue-600 hover:underline"
                        >
                          Change Image
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Answers</Label>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {editingQuestion.type === 'MULTIPLE_CHOICE'
                        ? 'Select ALL correct answers'
                        : 'Select ONE correct answer'}
                    </span>
                  </div>
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 cursor-move text-gray-300" />
                      <button
                        onClick={() => handleSetCorrect(idx)}
                        className={`flex h-6 w-6 items-center justify-center border transition-colors ${editingQuestion.type === 'MULTIPLE_CHOICE' ? 'rounded-md' : 'rounded-full'} ${opt.isCorrect ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                      >
                        {opt.isCorrect &&
                          (editingQuestion.type === 'MULTIPLE_CHOICE' ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          ))}
                      </button>
                      <Input
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        className={
                          opt.isCorrect
                            ? 'border-green-500 ring-1 ring-green-500'
                            : ''
                        }
                        placeholder={`Option ${idx + 1}`}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveOption(idx)}
                        disabled={editingQuestion.options.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full border-dashed"
                    onClick={handleAddOption}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
              <Button
                variant="outline"
                disabled={
                  addQuizQuestionMutation.isPending ||
                  editQuizQuestionMutation.isPending
                }
                onClick={() => setShowQuestionModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-amber-700 text-white hover:bg-amber-800"
                onClick={handleSaveQuestion}
                disabled={
                  addQuizQuestionMutation.isPending ||
                  editQuizQuestionMutation.isPending
                }
              >
                {addQuizQuestionMutation.isPending ||
                editQuizQuestionMutation.isPending
                  ? 'Saving...'
                  : 'Save Question'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
