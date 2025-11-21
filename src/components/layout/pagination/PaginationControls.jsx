'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function PaginationControls({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  onPageChange,
}) {
  const generatePageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxPagesToShow) {
      if (currentPage <= 3) {
        endPage = maxPagesToShow
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1
      } else {
        startPage = currentPage - 2
        endPage = currentPage + 2
      }
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('ellipsis')
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-muted-foreground flex gap-1 text-sm">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> results
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
