'use client'

import { Check, X } from 'lucide-react' // Optional: Gunakan icon dari library atau SVG bawaan

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  type = 'SINGLE_CHOICE', // Default ke single choice jika tidak ada props
  options,
  selectedOptionsIndex = [], // Default array kosong
  onSelectOption,
  onClearSelection,
  image,
  isReview,
  correctAnswers = [],
  userAnswers = [], // Asumsikan ini juga array saat mode review
  status,
  timeLeftString,
}) {
  const progressPercentage = (questionNumber / totalQuestions) * 100

  // --- LOGIKA KLIK OPSI ---
  const handleOptionClick = (index) => {
    if (isReview) return

    let newSelection = []

    if (type === 'MULTIPLE_CHOICE') {
      // Logic Toggle: Cek apakah index sudah ada di array
      if (selectedOptionsIndex.includes(index)) {
        // Hapus jika sudah ada
        newSelection = selectedOptionsIndex.filter((i) => i !== index)
      } else {
        // Tambah jika belum ada
        newSelection = [...selectedOptionsIndex, index]
      }
    } else {
      // Logic Single: Replace array dengan index baru
      newSelection = [index]
    }

    // Kirim array baru ke parent
    onSelectOption(newSelection)
  }

  return (
    <div className="w-full">
      {/* --- Bagian Header, Timer, Progress Bar --- */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">📋</span>
          <span className="font-semibold text-gray-700">
            {type === 'MULTIPLE_CHOICE'
              ? 'Multiple Choice Quiz'
              : 'General Knowledge Quiz'}
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
        <h2 className="text-xl font-bold text-gray-900">
          {questionText}
          {type === 'MULTIPLE_CHOICE' && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Select all that apply)
            </span>
          )}
        </h2>
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
          // Cek apakah opsi ini dipilih (baik saat pengerjaan atau saat review history)
          const isSelected =
            selectedOptionsIndex?.includes(index) ||
            (isReview && userAnswers?.includes(index))

          // Cek apakah opsi ini adalah jawaban benar (berdasarkan ID atau teks)
          const isCorrectAnswer = correctAnswers.some(
            (ans) => ans.id === option.id
          )

          // Style Logic untuk Review
          let reviewBorderClass = ''
          let reviewBgClass = ''

          if (isReview) {
            if (isSelected && isCorrectAnswer) {
              // User memilih BENAR
              reviewBorderClass = 'border-green-500'
              reviewBgClass = 'bg-green-50'
            } else if (isSelected && !isCorrectAnswer) {
              // User memilih SALAH
              reviewBorderClass = 'border-red-500'
              reviewBgClass = 'bg-red-50'
            } else if (!isSelected && isCorrectAnswer) {
              // User TIDAK memilih jawaban yang SEHARUSNYA BENAR (Missed)
              reviewBorderClass = 'border-green-500 border-dashed'
            }
          }

          const baseBorderClass = isSelected
            ? 'border-amber-800 bg-amber-50'
            : 'border-gray-200 bg-white hover:border-gray-300'

          return (
            <div
              key={`${option.id}-${index}`}
              onClick={() => handleOptionClick(index)}
              className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                isReview && (reviewBorderClass || reviewBgClass)
                  ? `${reviewBorderClass} ${reviewBgClass}`
                  : baseBorderClass
              }`}
            >
              {/* INDICATOR ICON (Circle vs Square) */}
              <div
                className={`mr-4 flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all ${
                  type === 'MULTIPLE_CHOICE' ? 'rounded-md' : 'rounded-full' // KOTAK vs BULAT
                } ${
                  isSelected
                    ? 'border-amber-800 bg-amber-800'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected &&
                  (type === 'MULTIPLE_CHOICE' ? (
                    // Icon Check untuk Multiple Choice
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    // Dot putih untuk Single Choice
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  ))}
              </div>

              <span className="flex-1 font-medium text-gray-900">
                {option?.answer}
              </span>

              {/* REVIEW ICONS */}
              {isReview && (
                <div className="ml-2">
                  {isCorrectAnswer && (
                    <span className="flex items-center text-sm font-bold text-green-600">
                      <Check className="mr-1 h-5 w-5" /> Correct
                    </span>
                  )}
                  {isSelected && !isCorrectAnswer && (
                    <span className="flex items-center text-sm font-bold text-red-600">
                      <X className="mr-1 h-5 w-5" /> Wrong
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        {/* List Jawaban Benar (Review Mode) */}
        {isReview && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-800">
              Correct Answer(s):
            </h3>
            <ul className="list-disc pl-5 text-green-900">
              {correctAnswers.map((item) => (
                <li key={item.id}>{item.answer}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- BUTTON CLEAR SELECTION --- */}
      {/* Muncul jika bukan review DAN array tidak kosong */}
      {!isReview && selectedOptionsIndex && selectedOptionsIndex.length > 0 && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation()
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
