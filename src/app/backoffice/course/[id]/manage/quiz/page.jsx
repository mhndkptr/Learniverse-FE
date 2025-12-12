'use client'

import BaseTable from '@/components/_shared/BaseTable'
import PaginationControls from '@/components/layout/pagination/PaginationControls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Pencil, Plus, Search, Trash2, Eye, TriangleAlert } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

// --- DATA DEFAULT (Untuk pengguna baru) ---
const DEFAULT_QUIZZES = [
  {
    id: 'quiz-1',
    title: 'Simulasi Ujian Kalkulus CLO1',
    course_name: 'Calculus',
    exam_date: '30/02/2025, 08:00',
    due_date: '30/02/2025, 10:00',
    status: 'PUBLISHED',
  },
  {
    id: 'quiz-2',
    title: 'Simulasi Ujian Kalkulus CLO2',
    course_name: 'Calculus',
    exam_date: '30/02/2025, 08:00',
    due_date: '30/02/2025, 10:00',
    status: 'DRAFT',
  },
]

export default function BackofficeQuizPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // --- STATE ---
  // 1. Init Search kosong dulu untuk hindari Hydration Error
  const [searchTerm, setSearchTerm] = useState('')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' })
  const [currentPage, setCurrentPage] = useState(1)
  
  // 2. State Data & Modal
  const [allQuizzes, setAllQuizzes] = useState([]) 
  const [showDeleteModal, setShowDeleteModal] = useState({ data: null, status: false })

  // --- USE EFFECTS ---

  // A. Sync Search Params (Client Side Only)
  useEffect(() => {
    const currentSearch = searchParams.get('search')
    if (currentSearch) {
      setSearchTerm(currentSearch)
    }
  }, [searchParams])

  // B. Load Data LocalStorage
  useEffect(() => {
    const storedData = localStorage.getItem('quizzes')
    if (storedData) {
        setAllQuizzes(JSON.parse(storedData))
    } else {
        localStorage.setItem('quizzes', JSON.stringify(DEFAULT_QUIZZES))
        setAllQuizzes(DEFAULT_QUIZZES)
    }
  }, [])

  // C. Set Breadcrumb
  const { setBreadcrumb } = useBackofficeBreadcrumb()
  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Quiz', href: '/backoffice/quiz' },
    ])
  }, [setBreadcrumb])

  // --- LOGIC ---

  const filteredQuizzes = useMemo(() => {
    return allQuizzes.filter(q => 
      q.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [debouncedSearchTerm, allQuizzes])

  // --- HANDLERS ---

  const handleAddQuiz = () => {
    router.push('/backoffice/quiz/create')
  }

  const handleDeleteConfirm = () => {
    const idToDelete = showDeleteModal.data?.id
    if (!idToDelete) return

    // Hapus dari State & LocalStorage
    const newQuizList = allQuizzes.filter(q => q.id !== idToDelete)
    setAllQuizzes(newQuizList)
    localStorage.setItem('quizzes', JSON.stringify(newQuizList))

    setShowDeleteModal({ data: null, status: false })
  }

  const handleRowAction = (action, row) => {
    // Ambil ID dari row asli
    const rowData = row.original || row
    const quizId = rowData.id

    switch (action) {
      case 'edit':
        if (quizId) {
            router.push(`/backoffice/quiz/${quizId}/edit`)
        } else {
            alert("Error: Quiz ID not found")
        }
        break
      case 'delete':
        setShowDeleteModal({ data: rowData, status: true })
        break
      default:
        break
    }
  }

  const columns = useMemo(() => [
      { key: 'title', header: 'TITLE', sortable: true },
      { key: 'course_name', header: 'COURSE NAME', sortable: true },
      { key: 'exam_date', header: 'EXAM DATE', sortable: true },
      { key: 'due_date', header: 'DUE DATE', sortable: true },
      { 
        key: 'status', header: 'STATUS', sortable: true,
        render: (row) => (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            row.status === 'PUBLISHED' ? 'bg-green-600' : 'bg-amber-600'
          }`}>
            {row.status}
          </span>
        )
      },
      {
        key: 'actions', header: 'ACTION', sortable: false,
        actions: [
          { label: 'Publish', action: 'toggle_status', icon: Eye },
          { label: 'Edit', action: 'edit', icon: Pencil },
          { label: 'Delete', action: 'delete', icon: Trash2 },
        ],
      },
    ], [])

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <h1 className="text-2xl font-bold">Quiz Management</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
             <Label htmlFor="search" className="sr-only">Search</Label>
             {/* Tambahkan suppressHydrationWarning untuk mengatasi error ekstensi browser */}
             <Input 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
               placeholder="Search Quiz..." 
               className="py-2 pl-10" 
               suppressHydrationWarning
              />
             <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
          </div>
          
          <div className="flex gap-2">
            <Button variant="default" onClick={handleAddQuiz}>
                <Plus className="size-4 mr-2" /> Add Quiz
            </Button>
          </div>
        </div>

        <BaseTable
          data={filteredQuizzes}
          columns={columns}
          onRowAction={handleRowAction}
          searchFields={['title']}
          searchTerm={searchTerm}
          serverSide={true}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />
        
        <PaginationControls
          totalItems={filteredQuizzes.length}
          totalPages={1}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal.status && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div 
            className="absolute inset-0 backdrop-blur-sm transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setShowDeleteModal({ data: null, status: false })}
          />
          <div className="relative z-10 bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6 border-4 border-white shadow-sm">
              <TriangleAlert className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Are You Sure?!</h3>
            <p className="text-gray-500 text-sm font-medium mb-8">This will be permanently deleted!</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleDeleteConfirm} className="px-6 py-2.5 bg-[#9F1239] hover:bg-[#881337] text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105">Delete</button>
              <button onClick={() => setShowDeleteModal({ data: null, status: false })} className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1e293b] text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}