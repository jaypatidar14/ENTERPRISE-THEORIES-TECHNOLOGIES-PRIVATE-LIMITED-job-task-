import { useState } from 'react'
import { FilterIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  fleetAssetBrands,
  fleetAssetSortOptions,
  fleetAssetStatuses,
  fleetAssetTypes,
} from '../data/constants'
import { type FleetAssetSearchParams } from '../data/schema'
import { useFleetAssets } from './fleet-assets-provider'

type FleetAssetsToolbarProps = {
  search: string
  status: FleetAssetSearchParams['status']
  brand: FleetAssetSearchParams['brand']
  assetType: FleetAssetSearchParams['assetType']
  sort: FleetAssetSearchParams['sort']
  order: FleetAssetSearchParams['order']
  onSearchChange: (value: string) => void
  onFiltersChange: (filters: {
    status: FleetAssetSearchParams['status']
    brand: FleetAssetSearchParams['brand']
    assetType: FleetAssetSearchParams['assetType']
  }) => void
  onSortChange: (
    sort: FleetAssetSearchParams['sort'],
    order: FleetAssetSearchParams['order']
  ) => void
}

export function FleetAssetsToolbar({
  search,
  status,
  brand,
  assetType,
  sort,
  order,
  onSearchChange,
  onFiltersChange,
  onSortChange,
}: FleetAssetsToolbarProps) {
  const { openAdd } = useFleetAssets()
  const [open, setOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState(status)
  const [draftBrand, setDraftBrand] = useState(brand)
  const [draftAssetType, setDraftAssetType] = useState(assetType)

  const activeSortValue = `${sort}:${order}`

  return (
    <div className='flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative w-full sm:max-w-sm'>
          <SearchIcon className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search by code, name, brand, or model'
            className='ps-9'
          />
        </div>

        <Popover
          open={open}
          onOpenChange={(state) => {
            setOpen(state)
            if (state) {
              setDraftStatus(status)
              setDraftBrand(brand)
              setDraftAssetType(assetType)
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant='outline' className={cn('justify-start')}>
              <FilterIcon className='me-2 size-4' />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-80 space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Asset Type</p>
              <Select
                value={draftAssetType}
                onValueChange={(value) =>
                  setDraftAssetType(
                    value as FleetAssetSearchParams['assetType']
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select asset type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>All</SelectItem>
                  {fleetAssetTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium'>Status</p>
              <Select
                value={draftStatus}
                onValueChange={(value) =>
                  setDraftStatus(value as FleetAssetSearchParams['status'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>All</SelectItem>
                  {fleetAssetStatuses.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium'>Brand</p>
              <Select
                value={draftBrand}
                onValueChange={(value) =>
                  setDraftBrand(value as FleetAssetSearchParams['brand'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select brand' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>All</SelectItem>
                  {fleetAssetBrands.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => {
                  setDraftStatus('All')
                  setDraftBrand('All')
                  setDraftAssetType('All')
                  onFiltersChange({
                    status: 'All',
                    brand: 'All',
                    assetType: 'All',
                  })
                }}
              >
                Clear
              </Button>
              <Button
                type='button'
                onClick={() => {
                  onFiltersChange({
                    status: draftStatus,
                    brand: draftBrand,
                    assetType: draftAssetType,
                  })
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={activeSortValue}
          onValueChange={(value) => {
            const [nextSort, nextOrder] = value.split(':') as [
              FleetAssetSearchParams['sort'],
              FleetAssetSearchParams['order'],
            ]
            onSortChange(nextSort, nextOrder)
          }}
        >
          <SelectTrigger className='w-full sm:w-72'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {fleetAssetSortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={openAdd} className='shrink-0'>
        <PlusIcon className='me-2 size-4' />
        Add Asset
      </Button>
    </div>
  )
}
