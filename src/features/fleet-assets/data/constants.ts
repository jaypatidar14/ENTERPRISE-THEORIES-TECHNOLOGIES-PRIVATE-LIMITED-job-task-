export const fleetAssetTypes = [{ label: 'Tyre', value: 'Tyre' }] as const

export const fleetAssetStatuses = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
] as const

export const fleetAssetBrands = [
  { label: 'MRF', value: 'MRF' },
  { label: 'Apollo', value: 'Apollo' },
  { label: 'CEAT', value: 'CEAT' },
  { label: 'Bridgestone', value: 'Bridgestone' },
  { label: 'Other', value: 'Other' },
] as const

export const tyreConstructionOptions = [
  { label: 'Radial', value: 'Radial' },
  { label: 'Bias', value: 'Bias' },
  { label: 'Diagonal', value: 'Diagonal' },
] as const

export const tyreTubeTypeOptions = [
  { label: 'Tubeless', value: 'Tubeless' },
  { label: 'Tube Type', value: 'Tube Type' },
] as const

export const fleetAssetSortOptions = [
  { label: 'Asset Name: A → Z', value: 'assetName:asc' },
  { label: 'Asset Name: Z → A', value: 'assetName:desc' },
  { label: 'Created Date: Newest', value: 'createdAt:desc' },
  { label: 'Created Date: Oldest', value: 'createdAt:asc' },
  { label: 'Asset Code: A → Z', value: 'assetCode:asc' },
  { label: 'Asset Code: Z → A', value: 'assetCode:desc' },
] as const
