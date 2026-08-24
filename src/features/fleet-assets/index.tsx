import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getFleetAssets } from './api/fleet-assets'
import { FleetAssetsDialogs } from './components/fleet-assets-dialogs'
import { FleetAssetsPagination } from './components/fleet-assets-pagination'
import { FleetAssetsProvider, useFleetAssets } from './components/fleet-assets-provider'
import { FleetAssetsTable } from './components/fleet-assets-table'
import { FleetAssetsToolbar } from './components/fleet-assets-toolbar'
import { type FleetAssetSearchParams } from './data/schema'

const route = getRouteApi('/_authenticated/fleet-assets/')

export function getFleetAssetMeta(payload: { meta?: { page?: number; limit?: number; totalPages?: number } } | undefined) {
  const meta = payload?.meta ?? {}

  return {
    page: meta.page ?? 1,
    limit: meta.limit ?? 10,
    totalPages: meta.totalPages ?? 1,
  }
}

function FleetAssetsPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openAdd } = useFleetAssets()
  const page = search.page ?? 1
  const limit = search.limit ?? 10
  const status = search.status ?? 'All'
  const brand = search.brand ?? 'All'
  const assetType = search.assetType ?? 'All'
  const sort = search.sort ?? 'createdAt'
  const order = search.order ?? 'desc'

  const searchParams: FleetAssetSearchParams = {
    page,
    limit,
    search: search.search ?? '',
    status,
    brand,
    assetType,
    sort,
    order,
  }

  const query = useQuery({
    queryKey: ['fleet-assets', searchParams],
    queryFn: () => getFleetAssets(searchParams),
    placeholderData: keepPreviousData,
  })

  const meta = getFleetAssetMeta(query.data)

  useEffect(() => {
    if (meta.totalPages > 0 && page > meta.totalPages) {
      navigate({
        search: (current) => ({ ...current, page: meta.totalPages } as FleetAssetSearchParams),
      })
    }
  }, [navigate, page, meta.totalPages])

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Fleet Asset Master</h2>
            <p className='text-muted-foreground'>Manage tyre assets, filters, and maintenance records.</p>
          </div>
          <Button onClick={openAdd}>+ Add Asset</Button>
        </div>

        <FleetAssetsToolbar
          search={search.search ?? ''}
          status={status}
          brand={brand}
          assetType={assetType}
          sort={sort}
          order={order}
          onSearchChange={(value) => {
            navigate({
              search: (current) =>
                ({
                  ...current,
                  page: 1,
                  search: value,
                } as FleetAssetSearchParams),
            })
          }}
          onFiltersChange={({ status, brand, assetType }) => {
            navigate({
              search: (current) =>
                ({
                  ...current,
                  page: 1,
                  status,
                  brand,
                  assetType,
                } as FleetAssetSearchParams),
            })
          }}
          onSortChange={(sort, order) => {
            navigate({
              search: (current) =>
                ({
                  ...current,
                  page: 1,
                  sort,
                  order,
                } as FleetAssetSearchParams),
            })
          }}
        />

        {query.isLoading ? (
          <Card>
            <CardContent className='space-y-3 p-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        ) : (
          <>
            <FleetAssetsTable data={query.data?.data ?? []} />
            <FleetAssetsPagination
              page={page}
              limit={limit}
              totalPages={meta.totalPages}
              onPageChange={(page) => {
                navigate({
                  search: (current) => ({ ...current, page } as FleetAssetSearchParams),
                })
              }}
              onLimitChange={(limit) => {
                navigate({
                  search: (current) => ({ ...current, page: 1, limit } as FleetAssetSearchParams),
                })
              }}
            />
          </>
        )}
      </Main>

      <FleetAssetsDialogs />
    </>
  )
}

export function FleetAssets() {
  return (
    <FleetAssetsProvider>
      <FleetAssetsPage />
    </FleetAssetsProvider>
  )
}
