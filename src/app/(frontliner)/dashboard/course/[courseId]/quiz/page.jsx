'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuizHeader from '@/components/core/quiz/QuizHeader'
import QuizCard from '@/components/core/quiz/QuizCard'
import StartAttemptModal from '@/components/core/quiz/StartAttemptModal'
import { useGetAllQuiz } from '@/hooks/quiz.hook'
import { formatDate } from '@/utils/helper'

export default function QuizPage() {
  const params = useParams()
  const courseId = params.courseId
  const router = useRouter()

  const { quizzes, isLoading, isPending } = useGetAllQuiz({
    params: {
      get_all: true,
      order_by: [
        {
          field: 'start_date',
          direction: 'asc',
        },
      ],
      filter: {
        status: 'PUBLISH',
        course_id: courseId,
      },
    },
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  // 1. Handler saat tombol "Attempt" diklik (Membuka Modal)
  const handleAttemptClick = (quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  // 2. Handler saat tombol "Review" diklik (Langsung Pindah Halaman)
  const handleReviewClick = (quiz) => {
    router.push(`/dashboard/course/quiz/${quiz.id}/review`)
  }

  // 3. Handler Konfirmasi di Modal (Mulai Kuis)
  const handleConfirmAttempt = () => {
    if (selectedQuiz) {
      console.log('[Route] Starting attempt for ID:', selectedQuiz.id)
      setIsModalOpen(false)

      // Navigasi ke: /dashboard/course/quiz/[id]/attempt
      router.push(`/dashboard/course/quiz/${selectedQuiz.id}/attempt`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQuiz(null)
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <QuizHeader />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || isPending ? (
          <p>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes available.</p>
        ) : (
          quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              title={quiz.title}
              date={`${formatDate(quiz.start_date)} - ${formatDate(quiz.end_date)}`}
              grades={quiz.grades || '-'}
              description={quiz.description}
              status={quiz.status || 'not-yet'}
              buttonText={quiz.buttonText || 'Attempt'}
              // Passing handlers
              onAttemptClick={handleAttemptClick}
              onReviewClick={handleReviewClick}
            />
          ))
        )}
      </div>

      <StartAttemptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAttempt}
        quizTitle={selectedQuiz?.title || ''}
      />
    </div>
  )
}
