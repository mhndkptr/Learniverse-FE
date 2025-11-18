'use client'

import { Button } from '@/components/ui/button'
import BaseDialog from '@/components/_shared/BaseDialog'
import { useCreateCourseTransactionMutation } from '@/hooks/course.hook'
import { useAuth } from '@/contexts/auth.context'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

export default function EnrollCourseDialog({ course, onOpenChange, open }) {
  const { user } = useAuth()
  const { createCourseTransactionMutation } =
    useCreateCourseTransactionMutation({
      successAction: () => {},
    })
  const [snapToken, setSnapToken] = useState(null)

  useEffect(() => {
    const scriptId = 'midtrans-script'
    const existingScript = document.getElementById(scriptId)

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL
      script.id = scriptId
      script.setAttribute(
        'data-client-key',
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
      )
      document.body.appendChild(script)
    }

    return () => {
      if (existingScript && !open) {
        existingScript.remove()
      }
    }
  }, [open])

  useEffect(() => {
    if (snapToken && window.snap) {
      window.snap.embed(snapToken, {
        embedId: 'snap-container',
        onSuccess: function (result) {
          toast.success('Payment success!')
          onOpenChange(false)
        },
        onPending: function (result) {
          toast.info('Waiting for payment!')
          onOpenChange(false)
        },
        onError: function (result) {
          toast.error('Payment failed!')
        },
        onClose: function () {
          toast.warning('You closed the payment without finishing.')
        },
      })
    }
  }, [snapToken, onOpenChange])

  const handleEnroll = async () => {
    if (!user) {
      toast.error('You must be logged in to enroll in a course.')
      return
    }
    if (!course) {
      toast.error('Course data is missing.')
      return
    }
    const res = await createCourseTransactionMutation.mutateAsync({
      payload: { course_id: course.id, user_id: user.id },
    })

    if (res?.code === 201 || res?.code === 200) {
      const token = res.data?.transaction_token

      if (token) {
        setSnapToken(token)
      } else {
        toast.error('Failed to get payment token.')
      }
    }
  }

  useEffect(() => {
    if (!open) {
      setSnapToken(null)
    }
  }, [open])

  return (
    <BaseDialog
      dialogTitle="Enroll Course"
      onOpenChange={onOpenChange}
      open={open}
      showDefaultCloseButton={false}
    >
      {!snapToken && (
        <>
          <div className="rounded-md border bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">1x</span> {course.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {course.description}
            </p>

            <div className="mt-3 flex justify-between text-sm font-medium">
              <span>Sub total</span>
              <span>Rp{course.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-3">
            <Button
              variant="primary"
              className="bg-green-700 text-white hover:bg-green-800"
              onClick={handleEnroll}
              disabled={createCourseTransactionMutation.isPending}
            >
              {createCourseTransactionMutation.isPending
                ? 'Processing...'
                : 'Continue to Payment'}
            </Button>

            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Cancel
            </Button>
          </div>
        </>
      )}

      {snapToken && (
        <div className="w-full">
          <div id="snap-container" className="min-h-[400px] w-full"></div>
        </div>
      )}
    </BaseDialog>
  )
}
