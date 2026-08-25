import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FleetAssetsPaginationProps = {
  page: number
  limit: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function FleetAssetsPagination({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: FleetAssetsPaginationProps) {
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4'
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-25 items-center justify-center text-sm font-medium @2xl/content:hidden'>
          Page {page} of {totalPages}
        </div>
        <div className='flex items-center gap-2 @max-2xl/content:flex-row-reverse'>
          <Select
            value={`${limit}`}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-17.5'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((item) => (
                <SelectItem key={item} value={`${item}`}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
        </div>
      </div>

      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex w-25 items-center justify-center text-sm font-medium @max-3xl/content:hidden'>
          Page {page} of {totalPages}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          {pageNumbers.map((pageNumber, index) => (
            <div key={`${pageNumber}-${index}`} className='flex items-center'>
              {pageNumber === '...' ? (
                <span className='px-1 text-sm text-muted-foreground'>...</span>
              ) : (
                <Button
                  variant={page === pageNumber ? 'default' : 'outline'}
                  className='h-8 min-w-8 px-2'
                  onClick={() => onPageChange(pageNumber as number)}
                >
                  <span className='sr-only'>Go to page {pageNumber}</span>
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}

          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
