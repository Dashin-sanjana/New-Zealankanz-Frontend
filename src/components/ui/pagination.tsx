const PAGE_SIZE = 12

interface PaginationProps {
  total: number
  page: number
  pageSize?: number
  onPage: (page: number) => void
}

export function Pagination({ total, page, pageSize = PAGE_SIZE, onPage }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Page navigation">
      <button
        type="button"
        className="ghost-button"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        ← Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="ghost-button"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next →
      </button>
    </nav>
  )
}

export { PAGE_SIZE }
