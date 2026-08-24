import { Router } from 'express'
import {
  createFleetAsset,
  deleteFleetAsset,
  getFleetAssetById,
  listFleetAssets,
  updateFleetAsset,
} from '../controllers/fleetAssetController.js'

export const fleetAssetRoutes = Router()

fleetAssetRoutes.get('/', listFleetAssets)
fleetAssetRoutes.get('/:id', getFleetAssetById)
fleetAssetRoutes.post('/', createFleetAsset)
fleetAssetRoutes.put('/:id', updateFleetAsset)
fleetAssetRoutes.delete('/:id', deleteFleetAsset)
