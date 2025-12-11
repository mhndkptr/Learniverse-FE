export default function FinishAttemptModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Finish Attempt</h2>

        <div className="mb-8">
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            You still have time left, are you sure you want to submit this exam now?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          {/* Tombol Finish (Primary) */}
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Finish
          </button>
          
          {/* Tombol Cancel (Secondary) */}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}