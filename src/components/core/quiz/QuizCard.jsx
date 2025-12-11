"use client"

export default function QuizCard(props) {
  const {
    title = "Calculus",
    date = "20 November 2025",
    grades = "-",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris consuleo.",
    status = "not-yet",
    buttonText = "Attempt",
    quiz = null,
    onAttemptClick = () => {},
    onReviewClick = () => {},
  } = props

  const getStatusBadge = () => {
    if (status === "completed") {
      return (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">Completed</span>
        </div>
      )
    } else if (status === "in-progress") {
      return (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">In Progress</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
        <span className="text-sm text-gray-600">Not yet</span>
      </div>
    )
  }

  const handleButtonClick = () => {
    if (buttonText === "Attempt") {
      onAttemptClick(quiz)
    } else if (buttonText === "Review") {
      onReviewClick(quiz)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      </div>

      <div className="mb-4">{getStatusBadge()}</div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs font-medium mb-1">Date</p>
          <p className="text-gray-900 font-medium">{date}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium mb-1">Grades</p>
          <p className="text-gray-900 font-medium">{grades}</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 mb-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Button */}
      <button
        onClick={handleButtonClick}
        className="w-full py-3 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors"
      >
        {buttonText}
      </button>
    </div>
  )
}
