"use client"

export default function QuizHeader() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Quiz</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Quizzes</h2>
        <p className="text-gray-600 text-base">Complete quizzes to test your knowledge and improve your learning</p>
      </div>
    </div>
  )
}
