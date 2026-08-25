import { EllipsisVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type FleetAsset } from '../data/schema'
import { useFleetAssets } from './fleet-assets-provider'

type FleetAssetRowActionsProps = {
  asset: FleetAsset
}

export function FleetAssetRowActions({ asset }: FleetAssetRowActionsProps) {
  const { openDelete, openEdit, openView } = useFleetAssets()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
        <Button variant='ghost' className='size-8 p-0'>
          <span className='sr-only'>Open row actions</span>
          <EllipsisVerticalIcon className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onSelect={() => openView(asset)}>
          View Asset
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openEdit(asset)}>
          Edit Asset
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openDelete(asset)}>
          Delete / Deactivate Asset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
