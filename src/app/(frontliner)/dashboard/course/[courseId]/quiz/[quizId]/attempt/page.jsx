'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import QuestionCard from '@/components/core/quiz/QuestionCard'
import FinishAttemptModal from '@/components/core/quiz/FinishAttemptModal'
import QuizNavigation from '@/components/core/quiz/QuizNavigation'
import { useAuth } from '@/contexts/auth.context'
import {
  useAttemptQuizMutation,
  useGetQuizAttemptById,
  useGetQuizAttempts,
  useUpdateQuizAttemptMutation,
} from '@/hooks/quiz.hook'

export default function QuizAttemptPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const courseId = params.courseId
  const quizId = params.quizId
  const attemptIdParam = searchParams.get('attemptId')
  const shouldStart = searchParams.get('start') === 'true'

  const [attemptId, setAttemptId] = useState(attemptIdParam)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const hasSubmittedRef = useRef(false)
  const hasInitializedTimerRef = useRef(false)

  const { attempts } = useGetQuizAttempts({
    params:
      user && quizId && !attemptId
        ? {
            get_all: true,
            filter: {
              quiz_id: quizId,
              user_id: user.id,
              status: 'ON_PROGRESS',
            },
          }
        : undefined,
    enabled: !!user && !!quizId && !attemptId,
  })

  const { createQuizAttemptMutation } = useAttemptQuizMutation({
    successAction: (data) => {
      const newAttemptId = data?.data?.id
      if (newAttemptId) {
        setAttemptId(newAttemptId)
      }
    },
  })

  const { attempt, isLoading: isAttemptLoading } = useGetQuizAttemptById({
    attemptId,
  })

  const { updateQuizAttemptMutation } = useUpdateQuizAttemptMutation({
    successAction: () => {
      router.replace(
        `/dashboard/course/${courseId}/quiz/${quizId}/review?attemptId=${attemptId}`
      )
    },
  })

  useEffect(() => {
    if (attemptIdParam && attemptIdParam !== attemptId) {
      setAttemptId(attemptIdParam)
    }
  }, [attemptIdParam, attemptId])

  useEffect(() => {
    if (attemptId || !user || !quizId) return
    if (attempts.length > 0) {
      setAttemptId(attempts[0].id)
      return
    }

    if (shouldStart && !createQuizAttemptMutation.isPending) {
      createQuizAttemptMutation.mutate({
        payload: {
          quiz_id: quizId,
        },
      })
    }
  }, [
    attempts,
    attemptId,
    createQuizAttemptMutation,
    quizId,
    shouldStart,
    user,
  ])

  const questions = useMemo(() => {
    return attempt?.quiz?.quiz_questions || []
  }, [attempt])

  const calculateTimeLeft = () => {
    const durationMinutes = attempt?.quiz?.duration
    if (!attempt?.start_at || !durationMinutes || durationMinutes <= 0) {
      return null
    }
    const durationSeconds = durationMinutes * 60
    const startAt = new Date(attempt.start_at).getTime()
    if (!Number.isFinite(startAt)) {
      return null
    }
    const elapsedSeconds = Math.floor((Date.now() - startAt) / 1000)
    const remaining = durationSeconds - elapsedSeconds
    if (!Number.isFinite(remaining)) {
      return null
    }
    return Math.max(remaining, 0)
  }

  useEffect(() => {
    if (!attempt) return

    const existingAnswers = {}
    ;(attempt.quiz_attempt_question_answers || []).forEach((answer) => {
      if (answer.quiz_question_id && answer.quiz_option_answer_id) {
        // Jika belum ada key question_id, buat array baru
        if (!existingAnswers[answer.quiz_question_id]) {
          existingAnswers[answer.quiz_question_id] = []
        }
        // Push option_id ke array
        existingAnswers[answer.quiz_question_id].push(
          answer.quiz_option_answer_id
        )
      }
    })

    setAnswers(existingAnswers)
    setCurrentQuestionIndex(0)
    const initialTimeLeft = calculateTimeLeft()
    setTimeLeft(initialTimeLeft)
    hasSubmittedRef.current = false
    hasInitializedTimerRef.current = true
  }, [attempt])

  useEffect(() => {
    if (!attempt) return undefined
    if (!attempt.quiz?.duration || attempt.quiz.duration <= 0) return undefined

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [attempt])

  useEffect(() => {
    if (!attempt) return
    if (!attempt.quiz?.duration || attempt.quiz.duration <= 0) return
    if (!hasInitializedTimerRef.current) return
    if (!Number.isFinite(timeLeft)) return
    if (timeLeft > 0) return
    if (hasSubmittedRef.current) return

    hasSubmittedRef.current = true
    handleSubmitQuiz(true)
  }, [attempt, timeLeft])

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleSelectOption = (selectedIndices) => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    // Convert array index menjadi array Option IDs
    const currentOptions = currentQuestion.quiz_option_answers || []
    const selectedOptionIds = selectedIndices
      .map((index) => currentOptions[index]?.id)
      .filter((id) => id !== undefined)

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOptionIds, // Simpan sebagai array
    }))
  }

  const handleClearSelection = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    setAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[currentQuestion.id]
      return newAnswers
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleNavigateToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleFinishClick = () => {
    setIsFinishModalOpen(true)
  }

  const buildAnswerPayload = () => {
    // Kita gunakan flatMap karena 1 pertanyaan bisa punya banyak row jawaban (Multiple Choice)
    return Object.entries(answers).flatMap(([questionId, optionIds]) => {
      // Pastikan optionIds adalah array (guard clause)
      const ids = Array.isArray(optionIds) ? optionIds : [optionIds]

      return ids.map((optionId) => ({
        quiz_question_id: questionId,
        quiz_option_answer_id: optionId,
      }))
    })
  }

  const handleSubmitQuiz = (isAutoSubmit = false) => {
    if (!attemptId) return

    updateQuizAttemptMutation.mutate({
      id: attemptId,
      payload: {
        status: 'FINISHED',
        finish_at: new Date().toISOString(),
        quiz_attempt_question_answers: buildAnswerPayload(),
      },
    })

    if (isAutoSubmit) {
      toast.success('Attempt auto-submitted')
    }

    setIsFinishModalOpen(false)
  }

  if (isAttemptLoading || createQuizAttemptMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading quiz attempt...
      </div>
    )
  }

  if (!attemptId || !attempt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-gray-500">
        <p>Quiz attempt not available.</p>
        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          onClick={() => router.replace(`/dashboard/course/${courseId}/quiz`)}
        >
          Back to quiz list
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentOptions = currentQuestion?.quiz_option_answers || []

  // Ambil jawaban user untuk soal ini (Array of IDs)
  const currentUserAnswers = answers[currentQuestion?.id] || []

  // Cari index dari setiap ID jawaban di dalam list opsi
  const selectedOptionsIndex = currentOptions
    .map((opt, index) => (currentUserAnswers.includes(opt.id) ? index : -1))
    .filter((index) => index !== -1)

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            {currentQuestion ? (
              <QuestionCard
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                type={currentQuestion.type}
                questionText={currentQuestion.question}
                options={currentOptions}
                selectedOptionsIndex={selectedOptionsIndex}
                onSelectOption={handleSelectOption}
                onClearSelection={handleClearSelection}
                timeLeftString={formatTime(timeLeft)}
                isReview={false}
                image={currentQuestion?.image_uri}
              />
            ) : (
              <p>No questions available.</p>
            )}

            <div className="mt-16 flex justify-between border-t border-gray-100 pt-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleFinishClick}
                  className="rounded-lg bg-amber-700 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-amber-800 hover:shadow-md"
                >
                  Finish Attempt
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-amber-700 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-amber-800 hover:shadow-md"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 h-fit">
            <QuizNavigation
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={Object.keys(answers).reduce((acc, questionId) => {
                const questionIndex = questions.findIndex(
                  (q) => q.id === questionId
                )
                if (questionIndex >= 0) {
                  acc[questionIndex] = 0
                }
                return acc
              }, {})}
              onNavigate={handleNavigateToQuestion}
            />
          </div>
        </div>
      </div>

      <FinishAttemptModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={() => handleSubmitQuiz(false)}
      />
    </div>
  )
}
