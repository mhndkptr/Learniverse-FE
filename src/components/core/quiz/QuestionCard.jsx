"use client"

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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">📋</span>
          <span className="text-gray-700 font-semibold">General Knowledge Quiz</span>
        </div>
        {!isReview && (
          <div className="flex items-center gap-2">
            <span className="text-amber-800 font-semibold">Time Left: {timeLeftString}</span>
            <span className="text-amber-800">⏱️</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-amber-800">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
          <img src={image || "/placeholder.svg"} alt="Question" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      {/* --- Bagian Options --- */}
      <div className="space-y-4">
        {options.map((option, index) => {
          const isSelected = selectedOption === index || userAnswer === index
          const isCorrect = correctAnswer === index
          const isWrongAnswer = userAnswer === index && status === "false"

          return (
            <label
              key={index}
              onClick={() => !isReview && onSelectOption(index)} 
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected ? "border-amber-800 bg-amber-50" : "border-gray-200 bg-white hover:border-gray-300"
              } ${isReview && isWrongAnswer ? "border-red-500 bg-red-50" : ""}`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                  isSelected ? "border-amber-800 bg-amber-800" : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className="text-gray-900 flex-1 font-medium">{option}</span>
              {/* Icon Review Check/Cross (Sama seperti sebelumnya) */}
              {isReview && isSelected && status === "correct" && <span className="text-green-600 text-lg">✓</span>}
              {isReview && isWrongAnswer && <span className="text-red-600 text-lg">✗</span>}
              {isReview && isCorrect && status === "false" && isSelected === false && (
                <span className="text-green-600 text-lg">✓</span>
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
              e.stopPropagation(); // Mencegah bubbling event
              onClearSelection();
            }}
            className="text-sm text-gray-400 hover:text-red-500 hover:underline transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}