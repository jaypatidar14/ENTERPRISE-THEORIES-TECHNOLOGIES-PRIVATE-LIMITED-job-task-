import { z } from 'zod'
import {
  fleetAssetStatuses,
  fleetAssetTypes,
  tyreConstructionOptions,
  tyreTubeTypeOptions,
} from './constants'

const fleetAssetTypeValues = fleetAssetTypes.map((item) => item.value) as [
  'Tyre',
]
const fleetAssetStatusValues = fleetAssetStatuses.map((item) => item.value) as [
  'Active',
  'Inactive',
]
const tyreConstructionValues = tyreConstructionOptions.map(
  (item) => item.value
) as ['Radial', 'Bias', 'Diagonal']
const tyreTubeTypeValues = tyreTubeTypeOptions.map((item) => item.value) as [
  'Tubeless',
  'Tube Type',
]

export const fleetAssetFormSchema = z.object({
  assetCode: z.string().min(1, 'Asset Code is required.'),
  assetName: z.string().min(1, 'Asset Name is required.'),
  assetType: z.enum(fleetAssetTypeValues),
  brand: z.string().min(1, 'Brand is required.'),
  model: z.string().min(1, 'Model is required.'),
  status: z.enum(fleetAssetStatusValues),
  description: z.string().optional().catch(''),
  tyreSpecifications: z.object({
    tyreSize: z.string().min(1, 'Tyre Size is required.'),
    construction: z.enum(tyreConstructionValues),
    pattern: z.string().optional().catch(''),
    loadIndex: z.string().optional().catch(''),
    speedRating: z.string().optional().catch(''),
    plyRating: z.string().optional().catch(''),
    tubeType: z.enum(tyreTubeTypeValues),
  }),
})

export type FleetAssetFormValues = z.infer<typeof fleetAssetFormSchema>

export const fleetAssetSearchSchema = z.object({
  page: z.number().optional().catch(1),
  limit: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  status: z
    .union([z.literal('All'), z.literal('Active'), z.literal('Inactive')])
    .optional()
    .catch('All'),
  brand: z
    .union([
      z.literal('All'),
      z.literal('MRF'),
      z.literal('Apollo'),
      z.literal('CEAT'),
      z.literal('Bridgestone'),
      z.literal('Other'),
    ])
    .optional()
    .catch('All'),
  assetType: z
    .union([z.literal('All'), z.literal('Tyre')])
    .optional()
    .catch('All'),
  sort: z
    .union([
      z.literal('assetName'),
      z.literal('createdAt'),
      z.literal('assetCode'),
    ])
    .optional()
    .catch('createdAt'),
  order: z
    .union([z.literal('asc'), z.literal('desc')])
    .optional()
    .catch('desc'),
})

export type FleetAssetSearchParams = z.infer<typeof fleetAssetSearchSchema>

export type FleetAssetStatus = (typeof fleetAssetStatuses)[number]['value']
export type FleetAssetType = (typeof fleetAssetTypes)[number]['value']
export type FleetAssetConstruction =
  (typeof tyreConstructionOptions)[number]['value']
export type FleetAssetTubeType = (typeof tyreTubeTypeOptions)[number]['value']

export type FleetAsset = {
  id: string
  assetCode: string
  assetName: string
  assetType: FleetAssetType
  brand: string
  model: string
  status: FleetAssetStatus
  description?: string
  tyreSpecifications: {
    tyreSize: string
    construction: FleetAssetConstruction
    pattern?: string
    loadIndex?: string
    speedRating?: string
    plyRating?: string
    tubeType: FleetAssetTubeType
  }
  createdAt: string
  updatedAt: string
}

export type FleetAssetListResponse = {
  data: FleetAsset[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
