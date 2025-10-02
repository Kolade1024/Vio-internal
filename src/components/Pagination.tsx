import { Button } from './ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages)
    if (clamped !== page) onPageChange(clamped)
  }

  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {start}-{end} of {total}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Rows per page</p>
        <select
          className="h-8 w-[70px] rounded border px-2 text-sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
          disabled={isLoading}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page <= 1 || isLoading}
            onClick={() => goToPage(1)}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page <= 1 || isLoading}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page >= totalPages || isLoading}
            onClick={() => goToPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page >= totalPages || isLoading}
            onClick={() => goToPage(totalPages)}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}


