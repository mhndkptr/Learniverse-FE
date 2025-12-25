'use client'

export default function QuizCard(props) {
  const {
    title = 'Calculus',
    date = '20 November 2025',
    grade = '-',
    description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris consuleo.',
    status = 'not-yet',
    buttonText = 'Attempt',
    secondaryButtonText,
    quiz = null,

    onAttemptClick = () => {},
    onReviewClick = () => {},
    onSecondaryClick = () => {},
    onPreviewClick = () => {},
    isMentor = false,
  } = props

  const getStatusBadge = () => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">Completed</span>
        </div>
      )
    } else if (status === 'in-progress') {
      return (
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">In Progress</span>
        </div>
      )
    } else if (isMentor) {
      return <></>
    } else {
      return (
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
          </svg>
          <span className="text-sm text-gray-600">Not yet</span>
        </div>
      )
    }
  }

  const handleButtonClick = () => {
    const normalized = buttonText.toLowerCase()
    if (normalized.includes('preview')) {
      onPreviewClick(quiz)
      return
    }

    if (normalized.includes('review')) {
      onReviewClick(quiz)
      return
    }

    if (buttonText === 'No Attempts Left') {
      return
    }

    onAttemptClick(quiz)
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>

      <div className="mb-4">{getStatusBadge()}</div>

      <div className="mb-4">
        <p className="mb-1 text-xs font-medium text-gray-500">Date</p>
        <p className="text-sm font-medium text-gray-900">{date}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Grades</p>
          <p className="text-sm font-medium text-gray-900">{grade}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Max Attempt</p>
          <p className="text-sm font-medium text-gray-900">
            {quiz?.max_attempt}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 flex-1 rounded-lg bg-gray-50 p-4">
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>

      {/* Button */}
      <button
        onClick={handleButtonClick}
        disabled={buttonText === 'No Attempts Left'}
        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
          buttonText === 'No Attempts Left'
            ? 'cursor-not-allowed bg-gray-200 text-gray-500'
            : 'bg-amber-700 text-white hover:bg-amber-800'
        }`}
      >
        {buttonText}
      </button>

      {secondaryButtonText ? (
        <button
          onClick={() => onSecondaryClick(quiz)}
          className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {secondaryButtonText}
        </button>
      ) : null}
    </div>
  )
}
