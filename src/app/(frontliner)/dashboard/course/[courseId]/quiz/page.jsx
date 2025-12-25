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
    successAction: (data) => {
      setIsModalOpen(false)
      const attemptId = data?.data?.id
      router.push(
        `/dashboard/course/${courseId}/quiz/${selectedQuiz.id}/attempt${
          attemptId ? `?attemptId=${attemptId}` : ''
        }`
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

  // 1. Handler saat tombol "Attempt" diklik (Membuka Modal)
  const handleAttemptClick = (quiz) => {
    if (quiz?.active_attempt_id) {
      router.push(
        `/dashboard/course/${courseId}/quiz/${quiz.id}/attempt?attemptId=${quiz.active_attempt_id}`
      )
      return
    }

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
            const attempts = quiz.quiz_attempts || []
            const hasFinishedAttempt = attempts.some(
              (attempt) => attempt.status === 'FINISHED'
            )
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
                    ? 'Continue Attempt Quiz'
                    : attempts.length === 0
                      ? 'Attempt Quiz'
                      : attempts.length < quiz.max_attempt
                        ? 'Re-attempt Quiz'
                        : 'No Attempts Left'
                }
                secondaryButtonText={
                  hasFinishedAttempt ? 'Review Quiz' : undefined
                }
                // Passing handlers
                onAttemptClick={handleAttemptClick}
                onReviewClick={handleReviewClick}
                onSecondaryClick={handleReviewClick}
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
