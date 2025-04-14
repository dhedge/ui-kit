import { expect } from 'vitest'

import {
  REFETCH_INTERVALS,
  getRefetchInterval,
} from './use-pool-dynamic-exit-remaining-cooldown'

describe('getRefetchInterval', () => {
  it('should return first interval', () => {
    expect(getRefetchInterval(30000)).toEqual(REFETCH_INTERVALS[0][1])
    expect(getRefetchInterval(20000)).toEqual(REFETCH_INTERVALS[0][1])
    expect(getRefetchInterval(10000)).toEqual(REFETCH_INTERVALS[0][1])
  })

  it('should return second interval', () => {
    expect(getRefetchInterval(60000)).toEqual(REFETCH_INTERVALS[1][1])
    expect(getRefetchInterval(50000)).toEqual(REFETCH_INTERVALS[1][1])
    expect(getRefetchInterval(40000)).toEqual(REFETCH_INTERVALS[1][1])
  })

  it('should return third interval', () => {
    expect(getRefetchInterval(300000)).toEqual(REFETCH_INTERVALS[2][1])
    expect(getRefetchInterval(200000)).toEqual(REFETCH_INTERVALS[2][1])
    expect(getRefetchInterval(61000)).toEqual(REFETCH_INTERVALS[2][1])
  })

  it('should return false interval', () => {
    expect(getRefetchInterval(301000)).toEqual(false)
    expect(getRefetchInterval(0)).toEqual(false)
  })
})
