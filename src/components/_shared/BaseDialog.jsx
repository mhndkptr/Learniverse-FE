import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

export default function BaseDialog({
  open,
  onOpenChange,
  dialogTitle,
  dialogTitleIcon,
  dialogSubtitle,
  showDefaultCloseButton = false,
  containerClassName = '',
  contentWrapperClassName = '',
  children,
  maxHeight = '85vh',
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!showDefaultCloseButton && !newOpen) {
          return
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent
        className={`gap-0 overflow-hidden p-0 sm:max-w-lg ${containerClassName}`}
        showCloseButton={showDefaultCloseButton}
        style={{ maxHeight }}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-4 md:p-5">
          <div>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
              {dialogTitleIcon && dialogTitleIcon}
              {dialogTitle && dialogTitle}
            </DialogTitle>
            {dialogSubtitle && (
              <p className="mt-2 text-sm font-medium text-[#808080]">
                {dialogSubtitle}
              </p>
            )}
          </div>

          {!showDefaultCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 self-start rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </DialogHeader>

        <div
          className={`-mt-1 flex w-full flex-col overflow-y-auto px-4 pb-3.5 transition-all md:px-5 md:pb-4 ${contentWrapperClassName}`}
          style={{ maxHeight: `calc(${maxHeight} - 80px)` }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
