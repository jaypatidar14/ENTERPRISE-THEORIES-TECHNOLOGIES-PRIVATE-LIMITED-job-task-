import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type FleetAsset } from '../data/schema'

type FleetAssetDetailSheetProps = {
  asset: FleetAsset | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className='flex items-start justify-between gap-4 rounded-md border p-3'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className='text-right text-sm font-medium'>{value || '-'}</span>
    </div>
  )
}

export function FleetAssetDetailSheet({
  asset,
  open,
  onOpenChange,
}: FleetAssetDetailSheetProps) {
  if (!asset) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-3xl'>
        <SheetHeader className='space-y-2'>
          <SheetTitle>Fleet Asset</SheetTitle>
          <SheetDescription>
            {asset.assetCode} - {asset.assetName}
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-4 px-4 pb-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline'>{asset.assetType}</Badge>
            <Badge
              variant='outline'
              className={
                asset.status === 'Active' ? 'text-emerald-700' : 'text-zinc-700'
              }
            >
              {asset.status}
            </Badge>
          </div>

          <div className='rounded-lg border bg-background p-1'>
            <Tabs defaultValue='basic'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='basic'>Basic Information</TabsTrigger>
                <TabsTrigger value='specs'>Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value='basic' className='space-y-3 p-3'>
                <DetailRow label='Asset Code' value={asset.assetCode} />
                <DetailRow label='Asset Type' value={asset.assetType} />
                <DetailRow label='Brand' value={asset.brand} />
                <DetailRow label='Model' value={asset.model} />
                <DetailRow label='Status' value={asset.status} />
                <DetailRow label='Description' value={asset.description} />
                <Separator className='my-4' />
                <DetailRow
                  label='Created Date'
                  value={format(new Date(asset.createdAt), 'dd-MMM-yyyy')}
                />
                <DetailRow
                  label='Updated Date'
                  value={format(new Date(asset.updatedAt), 'dd-MMM-yyyy')}
                />
              </TabsContent>
              <TabsContent value='specs' className='space-y-3 p-3'>
                <DetailRow
                  label='Tyre Size'
                  value={asset.tyreSpecifications.tyreSize}
                />
                <DetailRow
                  label='Construction'
                  value={asset.tyreSpecifications.construction}
                />
                <DetailRow
                  label='Pattern'
                  value={asset.tyreSpecifications.pattern}
                />
                <DetailRow
                  label='Load Index'
                  value={asset.tyreSpecifications.loadIndex}
                />
                <DetailRow
                  label='Speed Rating'
                  value={asset.tyreSpecifications.speedRating}
                />
                <DetailRow
                  label='Ply Rating'
                  value={asset.tyreSpecifications.plyRating}
                />
                <DetailRow
                  label='Tube Type'
                  value={asset.tyreSpecifications.tubeType}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
