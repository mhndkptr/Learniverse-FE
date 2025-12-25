'use client'

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedOption,
  onSelectOption,
  onClearSelection, // <--- Prop baru untuk menghapus jawaban
  image,
  isReview,
  correctAnswer,
  userAnswer,
  status,
  timeLeftString,
}) {
  const progressPercentage = (questionNumber / totalQuestions) * 100

  return (
    <div className="w-full">
      {/* --- Bagian Header, Timer, Progress Bar (SAMA SEPERTI SEBELUMNYA) --- */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">📋</span>
          <span className="font-semibold text-gray-700">
            General Knowledge Quiz
          </span>
        </div>
        {!isReview && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-800">
              Time Left: {timeLeftString}
            </span>
            <span className="text-amber-800">⏱️</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-amber-800">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-amber-800 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{questionText}</h2>
      </div>

      {image && (
        <div className="mb-6">
          <img
            src={image || '/placeholder.svg'}
            alt="Question"
            className="h-auto max-w-full rounded-lg"
          />
        </div>
      )}

      {/* --- Bagian Options --- */}
      <div className="space-y-4">
        {options.map((option, index) => {
          const isSelected = selectedOption === index || userAnswer === index
          const isCorrect = correctAnswer === index
          const isWrongAnswer = userAnswer === index && status === 'false'

          return (
            <label
              key={index}
              onClick={() => !isReview && onSelectOption(index)}
              className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                isSelected
                  ? 'border-amber-800 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${isReview && isWrongAnswer ? 'border-red-500 bg-red-50' : ''}`}
            >
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-amber-800 bg-amber-800'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="flex-1 font-medium text-gray-900">{option}</span>
              {/* Icon Review Check/Cross (Sama seperti sebelumnya) */}
              {isReview && isSelected && status === 'correct' && (
                <span className="text-lg text-green-600">✓</span>
              )}
              {isReview && isWrongAnswer && (
                <span className="text-lg text-red-600">✗</span>
              )}
              {isReview &&
                isCorrect &&
                status === 'false' &&
                isSelected === false && (
                  <span className="text-lg text-green-600">✓</span>
                )}
            </label>
          )
        })}
      </div>

      {/* --- FITUR BARU: CLEAR SELECTION --- */}
      {/* Muncul hanya jika bukan review DAN user sudah memilih jawaban */}
      {!isReview && selectedOption !== undefined && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation() // Mencegah bubbling event
              onClearSelection()
            }}
            className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-red-500 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}
