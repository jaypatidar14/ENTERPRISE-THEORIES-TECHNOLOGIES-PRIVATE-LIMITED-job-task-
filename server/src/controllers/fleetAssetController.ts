import type { Request, Response, NextFunction } from 'express'
import { FleetAsset } from '../models/FleetAsset.js'
import {
  fleetAssetBodySchema,
  fleetAssetListQuerySchema,
  fleetAssetParamsSchema,
} from '../validators/fleetAsset.js'

type FleetAssetRecord = Record<string, unknown> & {
  _id: {
    toString: () => string
  }
}

function toFleetAssetResponse(asset: FleetAssetRecord) {
  const { _id, ...rest } = asset
  return {
    ...rest,
    id: _id.toString(),
  }
}

function buildFilter(query: ReturnType<typeof fleetAssetListQuerySchema.parse>) {
  const filter: Record<string, unknown> = {}

  if (query.assetType !== 'All') {
    filter.assetType = query.assetType
  }

  if (query.status !== 'All') {
    filter.status = query.status
  }

  if (query.brand !== 'All') {
    filter.brand = query.brand
  }

  if (query.search) {
    filter.$or = [
      { assetCode: { $regex: query.search, $options: 'i' } },
      { assetName: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { model: { $regex: query.search, $options: 'i' } },
      { 'tyreSpecifications.tyreSize': { $regex: query.search, $options: 'i' } },
    ]
  }

  return filter
}

export async function listFleetAssets(req: Request, res: Response, next: NextFunction) {
  try {
    const query = fleetAssetListQuerySchema.parse(req.query)
    const filter = buildFilter(query)
    const sort = { [query.sort]: query.order === 'asc' ? 1 : -1 } as Record<
      string,
      1 | -1
    >

    const total = await FleetAsset.countDocuments(filter)
    const data = (await FleetAsset.find(filter)
      .sort(sort)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean()) as FleetAssetRecord[]

    res.json({
      data: data.map(toFleetAssetResponse),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getFleetAssetById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = fleetAssetParamsSchema.parse(req.params)
    const asset = await FleetAsset.findById(id).lean<FleetAssetRecord>()

    if (!asset) {
      res.status(404).json({ message: 'Fleet asset not found.' })
      return
    }

    res.json(toFleetAssetResponse(asset))
  } catch (error) {
    next(error)
  }
}

export async function createFleetAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const body = fleetAssetBodySchema.parse(req.body)
    const existingAsset = await FleetAsset.findOne({ assetCode: body.assetCode }).lean()

    if (existingAsset) {
      res.status(409).json({
        field: 'assetCode',
        message: 'Asset Code must be unique.',
      })
      return
    }

    const asset = await FleetAsset.create(body)

    res.status(201).json(toFleetAssetResponse(asset.toObject() as FleetAssetRecord))
  } catch (error) {
    next(error)
  }
}

export async function updateFleetAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = fleetAssetParamsSchema.parse(req.params)
    const body = fleetAssetBodySchema.parse(req.body)
    const existingAsset = await FleetAsset.findOne({
      assetCode: body.assetCode,
      _id: { $ne: id },
    }).lean()

    if (existingAsset) {
      res.status(409).json({
        field: 'assetCode',
        message: 'Asset Code must be unique.',
      })
      return
    }

    const asset = await FleetAsset.findByIdAndUpdate(id, body, { new: true }).lean<FleetAssetRecord>()

    if (!asset) {
      res.status(404).json({ message: 'Fleet asset not found.' })
      return
    }

    res.json(toFleetAssetResponse(asset))
  } catch (error) {
    next(error)
  }
}

export async function deleteFleetAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = fleetAssetParamsSchema.parse(req.params)
    const asset = await FleetAsset.findByIdAndUpdate(
      id,
      { status: 'Inactive' },
      { new: true }
    ).lean<FleetAssetRecord>()

    if (!asset) {
      res.status(404).json({ message: 'Fleet asset not found.' })
      return
    }

    res.json({
      message: 'Fleet asset deactivated successfully.',
      data: toFleetAssetResponse(asset),
    })
  } catch (error) {
    next(error)
  }
}
