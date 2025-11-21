'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, AlertCircle, History } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helper'
import { useGetAllCourseTransaction } from '@/hooks/course-transaction.hook'

export default function MyHistoryOrderPage() {
  const { courseTransactions, isLoading } = useGetAllCourseTransaction({
    params: {
      include_relation: ['course'],
      order_by: [
        {
          field: 'created_at',
          direction: 'desc',
        },
      ],
    },
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'settlement':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Payment
          </Badge>
        )
      case 'waiting_payment':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Payment
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        )
      case 'expire':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Expired
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleCompletePayment = (transaction) => {
    window.open(transaction.redirect_url, '_blank')
  }

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>

  return (
    <div className="flex h-full">
      <main className="flex h-full w-full flex-col items-center justify-start px-5 py-32 md:px-16">
        <div className="w-full">
          {/* Page Header */}
          <div className="mb-4 flex items-center gap-3 md:mb-8">
            <History className="text-yellowSecondary-600 h-8 w-8" />
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">
              Purchase History
            </h1>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 md:mb-8 md:text-lg">
            View all your course purchases and manage your payment status
          </p>

          {/* Purchase History Table */}
          <div className="space-y-4">
            {courseTransactions.length === 0 ? (
              <div className="border-border rounded-lg border bg-white py-12 text-center">
                <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  No purchase history found
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {courseTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border-border overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
                      <div className="shrink-0">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg md:h-40 md:w-40">
                          <Image
                            src={
                              transaction?.course?.cover_uri ||
                              '/assets/images/img-image-placeholder.png'
                            }
                            alt={transaction?.course?.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 128px, 160px"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-foreground text-lg font-bold md:text-xl">
                                {transaction?.course?.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {transaction?.course?.code}
                              </p>
                            </div>
                            <div className="flex items-start justify-between gap-2 md:flex-col md:items-end">
                              <span className="text-yellowSecondary-600 text-lg font-bold md:text-xl">
                                {formatCurrency(transaction?.amount)}
                              </span>
                              {getStatusBadge(transaction?.status)}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                            {transaction?.course?.description}
                          </p>

                          {/* Transaction Details */}
                          <div className="border-border my-3 grid grid-cols-2 gap-4 border-t border-b py-3 text-xs md:grid-cols-4">
                            <div>
                              <p className="text-muted-foreground">
                                Transaction ID
                              </p>
                              <p className="text-foreground font-semibold">
                                {transaction?.id.slice(0, 8)}...
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Payment Method
                              </p>
                              <p className="text-foreground font-semibold capitalize">
                                {transaction?.payment_method}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Purchase Date
                              </p>
                              <p className="text-foreground font-semibold">
                                {formatDate(transaction?.created_at)}
                              </p>
                            </div>
                            {transaction?.settlement_time && (
                              <div>
                                <p className="text-muted-foreground">
                                  Completed Date
                                </p>
                                <p className="text-foreground font-semibold">
                                  {formatDate(transaction?.settlement_time)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                          {(transaction?.status === 'pending' ||
                            transaction?.status === 'waiting_payment') && (
                            <Button
                              onClick={() => handleCompletePayment(transaction)}
                              variant="secondary"
                              className="flex-1"
                            >
                              Complete Payment
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}

                          {transaction?.status === 'settlement' && (
                            <Button variant={'primary'} className="flex-1">
                              Go to Course
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
