'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BaseDialog from '@/components/_shared/BaseDialog'

export default function ConfirmDialogDelete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure? This action cannot be undone.',
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  return (
    <BaseDialog
      open={isOpen}
      onOpenChange={(val) => !val && onClose()}
      dialogTitle={title}
      dialogTitleIcon={<AlertTriangle className="size-5 text-red-600" />}
      showDefaultCloseButton={false}
      containerClassName="sm:max-w-md"
    >
      <div className="">
        <p className="text-muted-foreground text-base leading-relaxed">
          {description}
        </p>

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
            className={
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#0E1B50] text-white hover:bg-blue-900'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </BaseDialog>
  )
}
