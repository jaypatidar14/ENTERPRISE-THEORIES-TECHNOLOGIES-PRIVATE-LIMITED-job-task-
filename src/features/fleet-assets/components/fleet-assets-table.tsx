import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type FleetAsset } from '../data/schema'
import { FleetAssetRowActions } from './fleet-asset-row-actions'
import { useFleetAssets } from './fleet-assets-provider'

type FleetAssetsTableProps = {
  data: FleetAsset[]
}

export function FleetAssetsTable({ data }: FleetAssetsTableProps) {
  const { openView } = useFleetAssets()

  return (
    <div className='overflow-hidden rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Code</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className='w-16 text-end'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((asset) => (
              <TableRow
                key={asset.id}
                className='cursor-pointer'
                onClick={() => openView(asset)}
              >
                <TableCell className='font-medium'>{asset.assetCode}</TableCell>
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>{asset.brand}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className={cn(
                      'capitalize',
                      asset.status === 'Active'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-400'
                    )}
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(asset.createdAt), 'dd-MMM-yyyy')}</TableCell>
                <TableCell className='text-end'>
                  <div onClick={(event) => event.stopPropagation()}>
                    <FleetAssetRowActions asset={asset} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center'>
                No fleet assets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
