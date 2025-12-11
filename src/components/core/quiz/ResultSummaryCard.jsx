"use client"

export default function ResultSummaryCard({ grade, time }) {
  // Konfigurasi Lingkaran Progress
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (grade / 100) * circumference
  
  // Warna Status
  const colorClass = grade >= 60 ? "text-green-500" : "text-amber-500"

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* BAGIAN KIRI: Grade dengan Lingkaran */}
      <div className="flex items-center gap-6">
        {/* SVG Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            {/* Progress Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          {/* Angka di Tengah */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${colorClass}`}>{Math.round(grade)}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900">Quiz Result</h3>
          <p className="text-gray-500 text-sm">
            {grade >= 60 ? "Great job! You passed." : "Keep practicing!"}
          </p>
        </div>
      </div>

      {/* GARIS PEMBATAS (Hanya muncul di layar besar) */}
      <div className="hidden md:block w-px h-16 bg-gray-200"></div>

      {/* BAGIAN KANAN: Waktu */}
      <div className="flex items-center gap-4 pr-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Time Spent</p>
          <p className="text-xl font-bold text-gray-900">{time}</p>
        </div>
      </div>
      
    </div>
  )
}