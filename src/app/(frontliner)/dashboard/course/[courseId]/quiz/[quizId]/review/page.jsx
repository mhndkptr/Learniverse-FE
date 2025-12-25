'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import QuestionCard from '@/components/core/quiz/QuestionCard'
import ResultSummaryCard from '@/components/core/quiz/ResultSummaryCard'
import QuizNavigation from '@/components/core/quiz/QuizNavigation'
import { useAuth } from '@/contexts/auth.context'
import { useGetQuizAttemptById, useGetQuizAttempts } from '@/hooks/quiz.hook'

export default function QuizReviewPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const courseId = params.courseId
  const quizId = params.quizId
  const attemptIdParam = searchParams.get('attemptId')

  const { attempts, isLoading: isAttemptsLoading } = useGetQuizAttempts({
    params: user
      ? {
          get_all: true,
          order_by: [{ field: 'start_at', direction: 'desc' }],
          filter: {
            quiz_id: quizId,
            user_id: user.id,
          },
          include_relation: ['quiz'],
        }
      : undefined,
    enabled: !!user && !!quizId,
  })

  const [selectedAttemptId, setSelectedAttemptId] = useState(attemptIdParam)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (attemptIdParam && attemptIdParam !== selectedAttemptId) {
      setSelectedAttemptId(attemptIdParam)
    }
  }, [attemptIdParam, selectedAttemptId])

  useEffect(() => {
    if (attemptIdParam) return
    setSelectedAttemptId(null)
  }, [attemptIdParam])

  const { attempt, isLoading: isAttemptLoading } = useGetQuizAttemptById({
    attemptId: selectedAttemptId,
  })

  const questions = useMemo(() => {
    return attempt?.quiz?.quiz_questions || []
  }, [attempt])

  const answerMap = useMemo(() => {
    const map = {}
    ;(attempt?.quiz_attempt_question_answers || []).forEach((answer) => {
      map[answer.quiz_question_id] = answer.quiz_option_answer_id
    })
    return map
  }, [attempt])

  const summaryAttempt = useMemo(() => {
    return attempts.find((item) => item.id === selectedAttemptId)
  }, [attempts, selectedAttemptId])

  const score = summaryAttempt?.grade ?? 0

  const timeSpent = useMemo(() => {
    if (!summaryAttempt?.start_at || !summaryAttempt?.finish_at) return '-'
    const start = new Date(summaryAttempt.start_at).getTime()
    const finish = new Date(summaryAttempt.finish_at).getTime()
    if (finish <= start) return '-'
    const diffSeconds = Math.floor((finish - start) / 1000)
    const mins = Math.floor(diffSeconds / 60)
    const secs = diffSeconds % 60
    return `${mins}m ${secs}s`
  }, [summaryAttempt])

  const handleNavigateToQuestion = (index) => {
    setCurrentQuestionIndex(index)
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

  const handleBackToQuizList = () => {
    router.push(`/dashboard/course/${courseId}/quiz`)
  }

  const handleSelectAttempt = (attemptId) => {
    setSelectedAttemptId(attemptId)
    setCurrentQuestionIndex(0)
    router.replace(
      `/dashboard/course/${courseId}/quiz/${quizId}/review?attemptId=${attemptId}`
    )
  }

  if (isAttemptsLoading || isAttemptLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading quiz review...
      </div>
    )
  }

  if (!selectedAttemptId || !attempt) {
    return (
      <div
        className="min-h-screen bg-gray-50 p-6"
        style={{ paddingTop: '120px' }}
      >
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Ringkasan pengerjaan kuis sebelumnya
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Pilih attempt yang ingin kamu review.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-4 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700">
              <div>Attempt</div>
              <div>Status</div>
              <div className="text-center">Nilai</div>
              <div className="text-right">Aksi</div>
            </div>
            <div className="divide-y divide-gray-100">
              {attempts.length === 0 ? (
                <div className="px-6 py-6 text-sm text-gray-500">
                  Belum ada attempt yang selesai.
                </div>
              ) : (
                attempts.map((item, index) => {
                  const submittedAt = item.finish_at
                    ? new Date(item.finish_at).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 gap-4 px-6 py-4 text-sm text-gray-700"
                    >
                      <div className="font-semibold">
                        Attempt {attempts.length - index}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {item.status === 'FINISHED'
                            ? 'Selesai mengerjakan'
                            : 'Belum selesai'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Diserahkan {submittedAt}
                        </p>
                      </div>
                      <div className="text-center font-semibold text-gray-900">
                        {Math.round(item.grade || 0)}
                      </div>
                      <div className="text-right">
                        <button
                          className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          onClick={() => handleSelectAttempt(item.id)}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-lg font-semibold text-gray-900 shadow-sm">
            Nilai akhir Anda untuk kuis ini adalah{' '}
            {Math.round(
              Math.max(0, ...attempts.map((item) => item.grade || 0))
            )}
            /100
          </div>

          <div className="flex justify-end">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              onClick={handleBackToQuizList}
            >
              Back to quiz list
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const userAnswerId = currentQuestion ? answerMap[currentQuestion.id] : null
  const optionList = currentQuestion?.quiz_option_answers || []
  const userAnswerIndex = optionList.findIndex((opt) => opt.id === userAnswerId)
  const correctAnswerIndex = optionList.findIndex((opt) => opt.is_correct)

  let status = 'unanswered'
  if (userAnswerIndex !== -1 && userAnswerIndex !== null) {
    status = userAnswerIndex === correctAnswerIndex ? 'correct' : 'false'
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ paddingTop: '120px' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <ResultSummaryCard grade={score} time={timeSpent} />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            {currentQuestion ? (
              <QuestionCard
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                questionText={currentQuestion.question}
                options={optionList.map((opt) => opt.answer)}
                isReview={true}
                userAnswer={userAnswerIndex}
                correctAnswer={correctAnswerIndex}
                status={status}
                selectedOption={userAnswerIndex}
                onSelectOption={() => {}}
                onClearSelection={() => {}}
                timeLeftString="00:00"
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

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  currentQuestionIndex === questions.length - 1
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-amber-700 text-white hover:bg-amber-800'
                }`}
              >
                Next Question
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 h-fit space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800">
                Attempt History
              </h3>
              <div className="space-y-3">
                {attempts.map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-3 ${
                      item.id === selectedAttemptId
                        ? 'border-amber-600 bg-amber-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          Attempt #{attempts.length - index}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {Math.round(item.grade || 0)}%
                        </p>
                      </div>
                      <button
                        className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => handleSelectAttempt(item.id)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <QuizNavigation
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={Object.keys(answerMap).reduce((acc, questionId) => {
                const questionIndex = questions.findIndex(
                  (q) => q.id === questionId
                )
                if (questionIndex >= 0) {
                  acc[questionIndex] = 0
                }
                return acc
              }, {})}
              onNavigate={handleNavigateToQuestion}
              isReview={true}
              correctAnswers={questions.reduce((acc, question, index) => {
                const correctIndex = (
                  question.quiz_option_answers || []
                ).findIndex((opt) => opt.is_correct)
                if (correctIndex >= 0) {
                  acc[index] = correctIndex
                }
                return acc
              }, {})}
            />

            <button
              onClick={handleBackToQuizList}
              className="w-full transform rounded-xl bg-gray-900 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
