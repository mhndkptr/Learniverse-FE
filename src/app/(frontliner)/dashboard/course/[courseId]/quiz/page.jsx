'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuizHeader from '@/components/core/quiz/QuizHeader'
import QuizCard from '@/components/core/quiz/QuizCard'
import StartAttemptModal from '@/components/core/quiz/StartAttemptModal'
import { useAttemptQuizMutation, useGetAllQuiz } from '@/hooks/quiz.hook'
import { formatDate } from '@/utils/helper'

export default function QuizPage() {
  const params = useParams()
  const courseId = params.courseId
  const router = useRouter()
  const { createQuizAttemptMutation } = useAttemptQuizMutation({
    successAction: () => {
      setIsModalOpen(false)
      router.push(
        `/dashboard/course/${courseId}/quiz/${selectedQuiz.id}/attempt`
      )
    },
  })

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
      include_relation: ['quiz_attempts'],
    },
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  console.log('quizzes:', quizzes)

  // 1. Handler saat tombol "Attempt" diklik (Membuka Modal)
  const handleAttemptClick = (quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  // 2. Handler saat tombol "Review" diklik (Langsung Pindah Halaman)
  const handleReviewClick = (quiz) => {
    router.push(`/dashboard/course/${courseId}/quiz/${quiz.id}/review`)
  }

  // 3. Handler Konfirmasi di Modal (Mulai Kuis)
  const handleConfirmAttempt = () => {
    if (selectedQuiz) {
      createQuizAttemptMutation.mutate({
        payload: {
          quiz_id: selectedQuiz.id,
        },
      })
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
          quizzes.map((quiz) => {
            console.log(quiz)
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                title={quiz.title}
                date={`${formatDate(quiz.start_date)} - ${formatDate(quiz.end_date)}`}
                grade={
                  quiz.personal_highest_grade == null
                    ? '-'
                    : quiz.personal_highest_grade
                }
                description={quiz.description}
                status={
                  quiz.active_attempt_id
                    ? 'in-progress'
                    : quiz.is_attempted
                      ? 'completed'
                      : 'Not Attempted'
                }
                buttonText={
                  quiz.active_attempt_id
                    ? 'Continue'
                    : quiz.max_attempts > 0 && !quiz.is_attempted
                      ? 'Attempt'
                      : quiz.is_attempted &&
                          quiz.max_attempts < quiz.quiz_attempts.length
                        ? 'Re-attempt'
                        : quiz.show_review
                          ? 'Review'
                          : 'No Attempts Left'
                }
                // Passing handlers
                onAttemptClick={handleAttemptClick}
                onReviewClick={handleReviewClick}
              />
            )
          })
        )}
      </div>

      <StartAttemptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAttempt}
        quizTitle={selectedQuiz?.title || ''}
        isLoading={createQuizAttemptMutation.isPending}
      />
    </div>
  )
}
