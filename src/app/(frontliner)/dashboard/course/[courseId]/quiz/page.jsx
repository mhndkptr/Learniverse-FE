"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import QuizHeader from "@/components/core/quiz/QuizHeader"
import QuizCard from "@/components/core/quiz/QuizCard"
import StartAttemptModal from "@/components/core/quiz/StartAttemptModal"

const quizData = [
  {
    id: 1,
    title: "Calculus",
    date: "20 November 2025",
    grades: "-",
    description:
      "Lorem ipsum dolor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris consulte.",
    status: "not-yet",
    buttonText: "Attempt",
  },
  {
    id: 2,
    title: "Calculus",
    date: "10 November 2025",
    grades: "90",
    description:
      "Lorem ipsum dolor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris consulte.",
    status: "completed",
    buttonText: "Review",
  },
  {
    id: 3,
    title: "Calculus",
    date: "10 November 2025",
    grades: "90",
    description:
      "Lorem ipsum dolor amet, consectetur adipiscing elit. Tempus bibendum nisl duis mauris mauris consulte.",
    status: "completed",
    buttonText: "Review",
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  // 1. Handler saat tombol "Attempt" diklik (Membuka Modal)
  const handleAttemptClick = (quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
  }

  // 2. Handler saat tombol "Review" diklik (Langsung Pindah Halaman)
  const handleReviewClick = (quiz) => {
    router.push(`/dashboard/course/quiz/${quiz.id}/review`)
  }

  // 3. Handler Konfirmasi di Modal (Mulai Kuis)
  const handleConfirmAttempt = () => {
    if (selectedQuiz) {
      console.log("[Route] Starting attempt for ID:", selectedQuiz.id)
      setIsModalOpen(false)
      
      // Navigasi ke: /dashboard/course/quiz/[id]/attempt
      router.push(`/dashboard/course/quiz/${selectedQuiz.id}/attempt`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQuiz(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <QuizHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((quiz) => (
            <QuizCard
              key={quiz.id}
              // Penting: Passing object quiz agar bisa dikirim balik oleh child component
              quiz={quiz} 
              title={quiz.title}
              date={quiz.date}
              grades={quiz.grades}
              description={quiz.description}
              status={quiz.status}
              buttonText={quiz.buttonText}
              // Passing handlers
              onAttemptClick={handleAttemptClick}
              onReviewClick={handleReviewClick}
            />
          ))}
        </div>
      </div>

      <StartAttemptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAttempt}
        // Mengambil title dari state object selectedQuiz
        quizTitle={selectedQuiz?.title || ""}
      />
    </div>
  )
}