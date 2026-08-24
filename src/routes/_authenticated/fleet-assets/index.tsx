import { createFileRoute } from '@tanstack/react-router'
import { FleetAssets } from '@/features/fleet-assets'
import { fleetAssetSearchSchema } from '@/features/fleet-assets/data/schema'

export const Route = createFileRoute('/_authenticated/fleet-assets/')({
  validateSearch: fleetAssetSearchSchema,
  component: FleetAssets,
})
