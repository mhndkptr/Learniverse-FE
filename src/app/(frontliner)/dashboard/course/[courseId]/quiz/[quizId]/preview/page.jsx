'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuestionCard from '@/components/core/quiz/QuestionCard'
import QuizNavigation from '@/components/core/quiz/QuizNavigation'
import { useGetQuizById } from '@/hooks/quiz.hook' // Assumed hook to fetch Quiz Detail

export default function QuizPreviewPage() {
  const router = useRouter()
  const params = useParams()

  const courseId = params.courseId
  const quizId = params.quizId

  // Fetch the Quiz Data directly (Not an attempt)
  const { quiz, isLoading } = useGetQuizById({ quizId })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const questions = useMemo(() => {
    return quiz?.quiz_questions || []
  }, [quiz])

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

  const handleBackToQuizList = () => {
    router.push(`/dashboard/course/${courseId}/quiz`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading quiz preview...
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-gray-500">
        <p>Quiz data not found.</p>
        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          onClick={handleBackToQuizList}
        >
          Back to quiz list
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const optionList = currentQuestion?.quiz_option_answers || []

  // Calculate the indices of the correct options to highlight them
  const correctOptionIndices = optionList.filter((opt, index) => opt.is_correct)

  return (
    <div className="min-h-max p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Admin Header / Breadcrumb placeholder */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Preview</h1>
            <p className="text-sm text-gray-500">
              Viewing <span className="font-semibold">{quiz.title}</span>
            </p>
          </div>
          <div className="rounded-full bg-amber-100 px-4 py-1 text-xs font-bold text-amber-800">
            PREVIEW MODE
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              {currentQuestion ? (
                <QuestionCard
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  questionText={currentQuestion.question}
                  options={optionList}
                  // Enabled Review mode to show colors
                  isReview={true}
                  // No user answer in preview
                  userAnswer={null}
                  userAnswers={[]}
                  // Pass correct indices to highlight green
                  correctAnswers={correctOptionIndices}
                  correctAnswer={correctOptionIndices[0]} // Fallback for single choice support
                  status="preview" // Custom status if needed, or rely on isReview logic
                  onSelectOption={() => {}} // No-op
                  onClearSelection={() => {}} // No-op
                  timeLeftString="--:--"
                  image={currentQuestion?.image_uri}
                />
              ) : (
                <p>No questions available in this quiz.</p>
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
            <div className="sticky top-6 h-fit space-y-6">
              <QuizNavigation
                totalQuestions={questions.length}
                currentQuestionIndex={currentQuestionIndex}
                // In preview, we treat all questions as "unanswered" or just purely navigational
                answers={{}}
                onNavigate={handleNavigateToQuestion}
                isReview={false} // Keep navigation simple (no red/green dots)
                isPreview={true}
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
    </div>
  )
}
