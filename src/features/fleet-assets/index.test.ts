import { describe, expect, it } from 'vitest'
import { getFleetAssetMeta } from './index'

describe('getFleetAssetMeta', () => {
  it('returns safe defaults when the API payload is missing meta', () => {
    expect(getFleetAssetMeta(undefined)).toEqual({
      page: 1,
      limit: 10,
      totalPages: 1,
    })

    expect(getFleetAssetMeta({ data: [] } as any)).toEqual({
      page: 1,
      limit: 10,
      totalPages: 1,
    })
  })

  it('reads pagination metadata when it is present', () => {
    expect(
      getFleetAssetMeta({
        data: [],
        meta: { page: 2, limit: 20, total: 42, totalPages: 3 },
      })
    ).toEqual({
      page: 2,
      limit: 20,
      totalPages: 3,
    })
  })
})
