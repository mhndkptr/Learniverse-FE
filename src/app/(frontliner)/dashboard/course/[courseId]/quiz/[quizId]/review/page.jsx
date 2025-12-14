"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import QuestionCard from "@/components/core/quiz/QuestionCard"
import ResultSummaryCard from "@/components/core/quiz/ResultSummaryCard"
import QuizNavigation from "@/components/core/quiz/QuizNavigation"

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

// MOCK KUNCI JAWABAN (Index jawaban yang benar)
const mockCorrectAnswers = {
  0: 0, // Soal 1: 2x
  1: 0, // Soal 2: x^2 + C
  2: 0, // Soal 3: 0
  3: 0, // Soal 4: cos x
  4: 0, // Soal 5: ln|x|
  5: 0, // Soal 6: 3.14
  6: 0, // Soal 7: 12
  7: 0, // Soal 8: 6
  8: 0, // Soal 9: 0
  9: 0, // Soal 10: 2 (Error intentionally for E=mc^2 usually implies options might vary, but assuming index 0)
}

// MOCK JAWABAN USER (Skenario: Ada yg benar, salah, dan kosong)
const mockUserAnswers = {
  0: 0, // Benar
  1: 1, // Salah
  2: 0, // Benar
  3: 0, // Benar
  4: 0, // Benar
  5: 1, // Salah
  6: 0, // Benar
  // 7: Skipped (Tidak dijawab)
  8: 0, // Benar
  9: 0, // Benar
}

export default function QuizReviewPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Hitung Nilai
  let correctCount = 0
  Object.keys(mockUserAnswers).forEach((key) => {
    if (mockUserAnswers[key] === mockCorrectAnswers[key]) {
      correctCount++
    }
  })
  const score = (correctCount / mockQuestions.length) * 100

  // Navigasi
  const handleNavigateToQuestion = (index) => {
    setCurrentQuestionIndex(index)
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

  const handleBackToQuizList = () => {
    router.push("/dashboard/course/quiz")
  }

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const userAnswer = mockUserAnswers[currentQuestionIndex]
  const correctAnswer = mockCorrectAnswers[currentQuestionIndex]

  // Status Jawaban untuk QuestionCard
  let status = "unanswered"
  if (userAnswer !== undefined) {
    status = userAnswer === correctAnswer ? "correct" : "false"
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 p-6"
      style={{ paddingTop: '120px' }} 
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* KOLOM KIRI (RESULT & SOAL) */}
        <div className="lg:col-span-3">
          
          {/* Result Summary Card */}
          <div className="mb-6">
            <ResultSummaryCard 
              grade={score} 
              time="35 mins" 
            />
          </div>

          {/* Question Review Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={mockQuestions.length}
              questionText={currentQuestion.text}
              options={currentQuestion.options}
              isReview={true}
              userAnswer={userAnswer}
              correctAnswer={correctAnswer}
              status={status}
              selectedOption={userAnswer} 
              onSelectOption={() => {}}
              onClearSelection={() => {}}
              timeLeftString="00:00"
            />

            {/* Navigasi Prev/Next */}
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

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === mockQuestions.length - 1}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === mockQuestions.length - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-amber-700 text-white hover:bg-amber-800"
                }`}
              >
                Next Question
              </button>
            </div>
          </div>
          
          {/* TOMBOL BACK DIHAPUS DARI SINI */}

        </div>

        {/* KOLOM KANAN (NAVIGASI REVIEW & TOMBOL EXIT) */}
        <div className="lg:col-span-1">
          {/* WRAPPER STICKY: 
             Kita pasang sticky disini agar Navigasi DAN Tombol Back
             tetap melayang bersama saat user scroll ke bawah.
          */}
          <div className="sticky top-24 h-fit space-y-6">
            
            <QuizNavigation 
              totalQuestions={mockQuestions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={mockUserAnswers}
              onNavigate={handleNavigateToQuestion}
              isReview={true}
              correctAnswers={mockCorrectAnswers}
            />

            {/* Tombol Back Pindah Kesini */}
            <button
              onClick={handleBackToQuizList}
              className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back to Quiz List
            </button>
            
          </div>
        </div>

      </div>
    </div>
  )
}