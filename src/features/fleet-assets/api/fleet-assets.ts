import { api } from '@/lib/api'
import {
  type FleetAsset,
  type FleetAssetListResponse,
  type FleetAssetFormValues,
  type FleetAssetSearchParams,
} from '../data/schema'

export async function getFleetAssets(params: FleetAssetSearchParams) {
  const { data } = await api.get<FleetAssetListResponse>('/api/fleet-assets', {
    params,
  })

  return data
}

export async function createFleetAsset(values: FleetAssetFormValues) {
  const { data } = await api.post<FleetAsset>('/api/fleet-assets', values)
  return data
}

export async function updateFleetAsset(
  id: string,
  values: FleetAssetFormValues
) {
  const { data } = await api.put<FleetAsset>(`/api/fleet-assets/${id}`, values)
  return data
}

export async function deleteFleetAsset(id: string) {
  const { data } = await api.delete<{ message: string }>(
    `/api/fleet-assets/${id}`
  )
  return data
}
