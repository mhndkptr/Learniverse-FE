export default function FinishAttemptModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />

      <div className="animate-in fade-in zoom-in relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl duration-200">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Finish Attempt
        </h2>

        <div className="mb-8">
          <p className="text-lg leading-relaxed font-medium text-gray-600">
            You still have time left, are you sure you want to submit this exam
            now?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {/* Tombol Finish (Primary) */}
          <button
            onClick={onConfirm}
            className="rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-amber-800"
          >
            Finish
          </button>

          {/* Tombol Cancel (Secondary) */}
          <button
            onClick={onClose}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
