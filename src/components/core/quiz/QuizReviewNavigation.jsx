'use client'

export default function QuizReviewNavigation({
  questions,
  currentQuestionIndex,
  answers,
  onNavigate,
  quizAttemptId,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Question Review</h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((item, index) => {
          const questionNumber = index + 1
          const userAnswers = answers.filter(
            (ans) => ans.quiz_question_id === item.id
          )
          const isCurrent = currentQuestionIndex === index

          let buttonClass =
            'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
          let icon = null

          const hasAnswered = userAnswers.length > 0
          const isCorrect =
            hasAnswered &&
            userAnswers.some((ans) => ans.quiz_option_answer.is_correct)

          if (!hasAnswered) {
            // Skipped / Tidak dijawab
            buttonClass = 'bg-gray-100 text-gray-400 border-gray-200'
          } else if (isCorrect) {
            // Benar
            buttonClass =
              'bg-green-600 text-white border-green-600 hover:bg-green-700'
            icon = (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
            )
          } else {
            // Salah
            buttonClass =
              'bg-red-500 text-white border-red-500 hover:bg-red-600'
            icon = (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )
          }

          return (
            <button
              key={`${quizAttemptId}${item.id}${index}`}
              onClick={() => onNavigate(index)}
              className={`relative h-10 rounded-md border text-sm font-semibold transition-all ${
                isCurrent ? 'z-10 border-amber-700 ring-2 ring-amber-700' : ''
              } ${buttonClass} `}
            >
              {icon ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <span className="mb-0.5 text-xs">{questionNumber}</span>
                  {icon}
                </div>
              ) : (
                questionNumber
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-600"></div>
          <span className="text-xs text-gray-500">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500"></div>
          <span className="text-xs text-gray-500">Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-gray-200 bg-gray-100"></div>
          <span className="text-xs text-gray-500">Skipped</span>
        </div>
      </div>
    </div>
  )
}
