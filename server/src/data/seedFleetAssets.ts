import { FleetAsset } from '../models/FleetAsset.js'

const seedFleetAssets = [
  {
    assetCode: 'TYR-001',
    assetName: '295/80 R22.5',
    assetType: 'Tyre',
    brand: 'MRF',
    model: 'Steel Muscle',
    status: 'Active',
    description: 'Primary heavy-duty tyre asset.',
    tyreSpecifications: {
      tyreSize: '295/80 R22.5',
      construction: 'Radial',
      pattern: 'Steel Muscle',
      loadIndex: '152',
      speedRating: 'M',
      plyRating: '18 PR',
      tubeType: 'Tubeless',
    },
  },
  {
    assetCode: 'TYR-002',
    assetName: '315/80 R22.5',
    assetType: 'Tyre',
    brand: 'Apollo',
    model: 'EnduRace',
    status: 'Active',
    description: 'Long haul tyre asset.',
    tyreSpecifications: {
      tyreSize: '315/80 R22.5',
      construction: 'Radial',
      pattern: 'EnduRace',
      loadIndex: '154',
      speedRating: 'M',
      plyRating: '18 PR',
      tubeType: 'Tubeless',
    },
  },
]

export async function seedFleetAssetsIfNeeded() {
  const count = await FleetAsset.countDocuments()
  if (count === 0) {
    await FleetAsset.insertMany(seedFleetAssets)
  }
}
