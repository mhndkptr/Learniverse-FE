'use client'

export default function StartAttemptModal({
  isOpen,
  onClose,
  onConfirm,
  quizTitle,
}) {
  if (!isOpen) return null

  return (
    // WRAPPER UTAMA: Posisi Fixed memenuhi layar
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* LAYER BACKGROUND (OVERLAY):
         Kita pisahkan layer ini dan gunakan 'style' manual.
         ini PASTI akan transparan hitam (0.6 = 60% opacity).
      */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose} // Fitur tambahan: Klik background gelap untuk menutup modal
      />

      {/* MODAL CONTENT:
         Posisi relative agar muncul di atas layer background 
      */}
      <div className="animate-in fade-in zoom-in relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl duration-200">
        {/* Header */}
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Start Attempt</h2>

        {/* Time Limit Section */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Time Limit
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Your attempt will have a time limit of 40 mins. When you start, the
            timer will begin to count down and cannot be paused. You must finish
            your attempt before it expires. Are you sure you wish to start now?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-amber-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Attempt
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
