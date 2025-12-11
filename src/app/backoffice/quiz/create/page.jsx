'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CreateQuizPage() {
  const router = useRouter()
  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // State untuk menangampung inputan
  const [formData, setFormData] = useState({
    title: '',
    course_name: '',
    exam_date: '',
    due_date: '',
    time_exam: '',
    status: 'DRAFT'
  })

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Quiz', href: '/backoffice/quiz' },
      { label: 'Create', href: '/backoffice/quiz/create' },
    ])
  }, [setBreadcrumb])

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    // 1. Validasi sederhana
    if(!formData.title) return alert("Title is required")

    // 2. Buat Object Quiz Baru
    const newQuiz = {
        id: `quiz-${Date.now()}`, // Generate ID unik berdasarkan waktu
        title: formData.title,
        course_name: formData.course_name || 'General',
        exam_date: formData.exam_date.replace('T', ', '), // Format tanggal sederhana
        due_date: formData.due_date.replace('T', ', '),
        status: formData.status.toUpperCase() || 'DRAFT'
    }

    // 3. Simpan ke LocalStorage
    // Ambil data lama dulu (jika ada)
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
    // Gabung dengan data baru
    localStorage.setItem('quizzes', JSON.stringify([newQuiz, ...existingQuizzes]))

    // 4. Redirect
    router.push('/backoffice/quiz')
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Quiz Data</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" onChange={handleChange} placeholder="Enter quiz title" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <select name="course_name" onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Course</option>
                <option value="Calculus">Calculus</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Exam Date</Label>
              <Input name="exam_date" onChange={handleChange} type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input name="due_date" onChange={handleChange} type="datetime-local" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Time Exam</Label>
              <Input name="time_exam" onChange={handleChange} type="text" placeholder="e.g 01:00" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select name="status" onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="published">Publish</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" className="bg-[#0F172A] hover:bg-[#1e293b]" onClick={handleSave}>
                Save
            </Button>
            <Button type="button" variant="destructive" onClick={() => router.push('/backoffice/quiz')}>
                Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}