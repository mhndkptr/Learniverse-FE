"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import QuestionCard from "@/components/core/quiz/QuestionCard"
import FinishAttemptModal from "@/components/core/quiz/FinishAttemptModal"
import QuizNavigation from "@/components/core/quiz/QuizNavigation"

// MOCK DATA SOAL (Tetap sama)
const mockQuestions = [
  { id: 1, text: "What is the derivative of f(x) = x²?", options: ["2x", "x", "2", "x²"] },
  { id: 2, text: "Evaluate the integral ∫ 2x dx.", options: ["x² + C", "2x² + C", "x + C", "x³ + C"] },
  { id: 3, text: "Limit of (1/x) as x -> infinity?", options: ["0", "1", "Infinity", "Undefined"] },
  { id: 4, text: "d/dx (sin x) = ?", options: ["cos x", "-cos x", "sin x", "-sin x"] },
  { id: 5, text: "Integral of 1/x dx?", options: ["ln|x| + C", "x + C", "1/x^2", "e^x"] },
  { id: 6, text: "Value of pi approx?", options: ["3.14", "3.15", "3.16", "3.13"] },
  { id: 7, text: "Sqrt(144)?", options: ["12", "14", "10", "11"] },
  { id: 8, text: "2 + 2 x 2?", options: ["6", "8", "4", "10"] },
  { id: 9, text: "Log(1) base 10?", options: ["0", "1", "10", "undefined"] },
  { id: 10, text: "E = mc^?", options: ["2", "3", "4", "1"] },
]

export default function QuizAttemptPage() {
  const router = useRouter()
  const params = useParams()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(40 * 60)
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }))
  }

  // --- LOGIC BARU: MENGHAPUS JAWABAN ---
  const handleClearSelection = () => {
    setAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[currentQuestionIndex] // Hapus key jawaban untuk soal ini
      return newAnswers
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
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

  const handleSubmitQuiz = () => {
    console.log("Submitting answers:", answers)
    setIsFinishModalOpen(false)
    router.push(`/dashboard/course/quiz/${params.quizId}/review`)
  }

  const currentQuestion = mockQuestions[currentQuestionIndex]

  return (
    <div 
      className="min-h-screen bg-gray-50 p-6"
      style={{ paddingTop: '120px' }} 
    >
      {/* PERBAIKAN LAYOUT:
        1. max-w-7xl (diperlebar sedikit agar muat gap besar)
        2. gap-12 (membuat jarak antara soal dan navigasi jauh lebih lega)
      */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* KOLOM KIRI (SOAL) */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={mockQuestions.length}
              questionText={currentQuestion.text}
              options={currentQuestion.options}
              selectedOption={answers[currentQuestionIndex]}
              onSelectOption={handleSelectOption}
              onClearSelection={handleClearSelection} // Pass function hapus jawaban
              timeLeftString={formatTime(timeLeft)}
              isReview={false}
            />

            <div className="flex justify-between mt-16 pt-6 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex === mockQuestions.length - 1 ? (
                <button
                  onClick={handleFinishClick}
                  className="px-6 py-2.5 rounded-lg font-medium bg-amber-700 text-white hover:bg-amber-800 transition-all shadow-sm hover:shadow-md"
                >
                  Finish Attempt
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg font-medium bg-amber-700 text-white hover:bg-amber-800 transition-all shadow-sm hover:shadow-md"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (NAVIGASI) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-fit">
            <QuizNavigation 
              totalQuestions={mockQuestions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onNavigate={handleNavigateToQuestion}
            />
          </div>
        </div>

      </div>

      <FinishAttemptModal 
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)} 
        onConfirm={handleSubmitQuiz} 
      />
    </div>
  )
}