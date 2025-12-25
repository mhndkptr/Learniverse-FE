'use client'

export default function ResultSummaryCard({ grade, time }) {
  // Konfigurasi Lingkaran Progress
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (grade / 100) * circumference

  // Warna Status
  const colorClass = grade >= 60 ? 'text-green-500' : 'text-amber-500'

  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
      {/* BAGIAN KIRI: Grade dengan Lingkaran */}
      <div className="flex items-center gap-6">
        {/* SVG Circular Progress */}
        <div className="relative h-24 w-24">
          <svg className="h-full w-full -rotate-90 transform">
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
            <span className={`text-xl font-bold ${colorClass}`}>
              {Math.round(grade)}%
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900">Quiz Result</h3>
          <p className="text-sm text-gray-500">
            {grade >= 60 ? 'Great job! You passed.' : 'Keep practicing!'}
          </p>
        </div>
      </div>

      {/* GARIS PEMBATAS (Hanya muncul di layar besar) */}
      <div className="hidden h-16 w-px bg-gray-200 md:block"></div>

      {/* BAGIAN KANAN: Waktu */}
      <div className="flex items-center gap-4 pr-8">
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Time Spent
          </p>
          <p className="text-xl font-bold text-gray-900">{time}</p>
        </div>
      </div>
    </div>
  )
}
