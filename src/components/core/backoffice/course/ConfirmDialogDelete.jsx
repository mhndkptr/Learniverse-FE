'use client'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ConfirmDialogDelete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#0E1B50] hover:bg-blue-900'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
