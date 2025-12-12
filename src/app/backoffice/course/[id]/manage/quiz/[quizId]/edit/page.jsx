'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Plus, Pencil, Trash2, CheckCircle2, GripVertical, 
  X, ImageIcon, Save, CheckSquare 
} from 'lucide-react'

export default function EditQuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.quizId 

  const { setBreadcrumb } = useBackofficeBreadcrumb()

  // --- STATE FORM (METADATA) ---
  const [formData, setFormData] = useState({
    title: '',
    course_name: 'Calculus',
    exam_date: '',
    due_date: '',
    time_exam: '60',
    status: 'PUBLISHED'
  })

  // --- STATE QUESTIONS ---
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  // --- 1. LOAD DATA DARI LOCALSTORAGE ---
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Quiz', href: '/backoffice/quiz' },
      { label: 'Edit', href: `/backoffice/quiz/${quizId}/edit` },
    ])

    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
    const foundQuiz = storedQuizzes.find(q => q.id === quizId)

    if (foundQuiz) {
        setFormData({
            title: foundQuiz.title || '',
            course_name: foundQuiz.course_name || 'Calculus',
            // Pastikan format tanggal sesuai untuk input datetime-local (YYYY-MM-DDTHH:MM)
            exam_date: foundQuiz.exam_date || '', 
            due_date: foundQuiz.due_date || '',
            time_exam: foundQuiz.time_exam || '60',
            status: foundQuiz.status || 'PUBLISHED'
        })
        setQuestions(foundQuiz.questions || [])
    } else {
        alert("Quiz not found!")
        router.push('/backoffice/quiz')
    }
    setIsLoading(false)
  }, [quizId, setBreadcrumb, router])


  // --- HANDLERS UTAMA ---
  const handleFormChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveQuiz = () => {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
      
      const updatedQuizzes = storedQuizzes.map(q => {
          if (q.id === quizId) {
              return {
                  ...q,
                  ...formData,
                  questions: questions
              }
          }
          return q
      })

      localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes))
      router.push('/backoffice/quiz')
  }


  // --- QUESTION HANDLERS ---
  const handleOpenAddModal = () => {
    setEditingQuestion({
      id: null,
      type: 'SINGLE',
      text: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    })
    setShowQuestionModal(true)
  }

  const handleOpenEditModal = (question) => {
    const qData = { type: 'SINGLE', ...question }
    setEditingQuestion(JSON.parse(JSON.stringify(qData)))
    setShowQuestionModal(true)
  }

  const handleDeleteQuestion = (id) => {
    if(confirm("Delete this question?")) {
        setQuestions(prev => prev.filter(q => q.id !== id))
    }
  }

  const handleSaveQuestion = () => {
    if (!editingQuestion.text) return alert("Question text is required")
    const hasCorrect = editingQuestion.options.some(o => o.isCorrect)
    if (!hasCorrect) return alert("Please select at least one correct answer")

    setQuestions(prev => {
        if (editingQuestion.id) {
            return prev.map(q => q.id === editingQuestion.id ? editingQuestion : q)
        } else {
            const newQ = { ...editingQuestion, id: Date.now() }
            return [...prev, newQ]
        }
    })
    setShowQuestionModal(false)
  }

  // --- MODAL FORM HANDLERS ---
  const handleChangeType = (newType) => {
    const resetOptions = editingQuestion.options.map(o => ({ ...o, isCorrect: false }))
    setEditingQuestion({ ...editingQuestion, type: newType, options: resetOptions })
  }

  const handleOptionChange = (idx, val) => {
      const newOpts = [...editingQuestion.options]
      newOpts[idx].text = val
      setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  const handleSetCorrect = (idx) => {
      let newOpts = [...editingQuestion.options]
      if (editingQuestion.type === 'MULTIPLE') {
          newOpts[idx].isCorrect = !newOpts[idx].isCorrect
      } else {
          newOpts = newOpts.map((o, i) => ({ ...o, isCorrect: i === idx }))
      }
      setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  const handleAddOption = () => {
      setEditingQuestion({
          ...editingQuestion,
          options: [...editingQuestion.options, { text: '', isCorrect: false }]
      })
  }
  
  const handleRemoveOption = (idx) => {
    const newOpts = editingQuestion.options.filter((_, i) => i !== idx)
    setEditingQuestion({ ...editingQuestion, options: newOpts })
  }

  if (isLoading) return <div className="p-10 text-center">Loading quiz data...</div>

  return (
    <div className="max-w-5xl pb-20">
      
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/backoffice/quiz')}>Cancel</Button>
            <Button className="bg-[#0F172A]" onClick={handleSaveQuiz}>
                <Save className="w-4 h-4 mr-2"/> Save Changes
            </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
          
        {/* KOLOM KIRI: FORM METADATA */}
        <div className="w-full">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-6 border-b pb-2">Quiz Settings</h2>
                <form className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>Title</Label>
                        <Input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleFormChange} 
                        />
                    </div>
                    
                    {/* Course */}
                    <div className="space-y-2">
                        <Label>Course</Label>
                        <select 
                            name="course_name" 
                            value={formData.course_name} 
                            onChange={handleFormChange}
                            className="w-full h-10 px-3 rounded-md border border-input text-sm"
                        >
                            <option value="Calculus">Calculus</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>

                    {/* PERBAIKAN: MENAMBAHKAN BAGIAN TANGGAL (Exam Date & Due Date) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Exam Date</Label>
                            <Input 
                                type="datetime-local"
                                name="exam_date"
                                value={formData.exam_date}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input 
                                type="datetime-local"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label>Duration (Mins)</Label>
                        <Input 
                            name="time_exam"
                            type="number" 
                            value={formData.time_exam} 
                            onChange={handleFormChange} 
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <select 
                            name="status"
                            value={formData.status} 
                            onChange={handleFormChange}
                            className="w-full h-10 px-3 rounded-md border border-input text-sm"
                        >
                            <option value="PUBLISHED">Publish</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>

        {/*QUESTION MANAGER */}
        <div className="w-full">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Questions List</h2>
                        <p className="text-sm text-gray-500">Manage questions for this quiz</p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="bg-amber-700 hover:bg-amber-800 text-white">
                        <Plus className="w-4 h-4 mr-2"/> Add Question
                    </Button>
                </div>

                <div className="space-y-4">
                    {questions.length === 0 && (
                        <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-lg">
                            No questions added yet.
                        </div>
                    )}

                    {questions.map((q, index) => (
                        <div key={q.id} className="group p-4 border rounded-lg hover:border-amber-500 hover:shadow-sm transition-all bg-gray-50/50 hover:bg-white">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full font-bold text-gray-600 text-sm">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${q.type === 'MULTIPLE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {q.type === 'MULTIPLE' ? 'Multiple Choice' : 'Single Choice'}
                                            </span>
                                            <p className="font-medium text-gray-900">{q.text}</p>
                                        </div>
                                        <div className="space-y-1">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className={`text-sm flex items-center gap-2 ${opt.isCorrect ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                                    {opt.isCorrect ? <CheckCircle2 className="w-3 h-3"/> : <span className="w-3 h-3 block border rounded-full border-gray-300"/>}
                                                    {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(q)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDeleteQuestion(q.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>

      {/* --- MODAL ADD/EDIT QUESTION --- */}
      {showQuestionModal && editingQuestion && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">
                        {editingQuestion.id ? 'Edit Question' : 'Add New Question'}
                    </h3>
                    <Button size="sm" variant="ghost" onClick={() => setShowQuestionModal(false)}>
                        <X className="w-5 h-5"/>
                    </Button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Question Type</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => handleChangeType('SINGLE')} className={`p-3 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${editingQuestion.type === 'SINGLE' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                                    <CheckCircle2 className="w-4 h-4"/> Single Choice
                                </button>
                                <button type="button" onClick={() => handleChangeType('MULTIPLE')} className={`p-3 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${editingQuestion.type === 'MULTIPLE' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                                    <CheckSquare className="w-4 h-4"/> Multiple Choice
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Question Text</Label>
                            <textarea className="w-full min-h-[100px] p-3 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={editingQuestion.text} onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})} placeholder="Enter your question here..." />
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2"/>
                            <p className="text-xs text-gray-500">Click to upload image (Optional)</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>Answers</Label>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{editingQuestion.type === 'MULTIPLE' ? 'Select ALL correct answers' : 'Select ONE correct answer'}</span>
                            </div>
                            {editingQuestion.options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-gray-300 cursor-move"/>
                                    <button onClick={() => handleSetCorrect(idx)} className={`w-6 h-6 flex items-center justify-center transition-colors border ${editingQuestion.type === 'MULTIPLE' ? 'rounded-md' : 'rounded-full'} ${opt.isCorrect ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
                                        {opt.isCorrect && (editingQuestion.type === 'MULTIPLE' ? <CheckSquare className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>)}
                                    </button>
                                    <Input value={opt.text} onChange={(e) => handleOptionChange(idx, e.target.value)} className={opt.isCorrect ? 'border-green-500 ring-1 ring-green-500' : ''} placeholder={`Option ${idx+1}`} />
                                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => handleRemoveOption(idx)} disabled={editingQuestion.options.length <= 2}>
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full border-dashed mt-2" onClick={handleAddOption}>
                                <Plus className="w-4 h-4 mr-2"/> Add Option
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowQuestionModal(false)}>Cancel</Button>
                    <Button className="bg-amber-700 hover:bg-amber-800 text-white" onClick={handleSaveQuestion}>Save Question</Button>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}