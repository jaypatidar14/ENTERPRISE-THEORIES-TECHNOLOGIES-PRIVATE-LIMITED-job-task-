import { z } from 'zod'

export const fleetAssetBodySchema = z.object({
  assetCode: z.string().min(1, 'Asset Code is required.'),
  assetName: z.string().min(1, 'Asset Name is required.'),
  assetType: z.literal('Tyre'),
  brand: z.string().min(1, 'Brand is required.'),
  model: z.string().min(1, 'Model is required.'),
  status: z.enum(['Active', 'Inactive']),
  description: z.string().optional().catch(''),
  tyreSpecifications: z.object({
    tyreSize: z.string().min(1, 'Tyre Size is required.'),
    construction: z.enum(['Radial', 'Bias', 'Diagonal']),
    pattern: z.string().optional().catch(''),
    loadIndex: z.string().optional().catch(''),
    speedRating: z.string().optional().catch(''),
    plyRating: z.string().optional().catch(''),
    tubeType: z.enum(['Tubeless', 'Tube Type']),
  }),
})

export const fleetAssetParamsSchema = z.object({
  id: z.string().min(1, 'Asset id is required.'),
})

export const fleetAssetListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional().default(''),
  status: z.enum(['All', 'Active', 'Inactive']).optional().default('All'),
  brand: z
    .enum(['All', 'MRF', 'Apollo', 'CEAT', 'Bridgestone', 'Other'])
    .optional()
    .default('All'),
  assetType: z.enum(['All', 'Tyre']).optional().default('All'),
  sort: z.enum(['assetName', 'createdAt', 'assetCode']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})
