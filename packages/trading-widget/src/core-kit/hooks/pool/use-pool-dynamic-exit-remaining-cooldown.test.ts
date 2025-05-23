import { expect } from 'vitest'

import { EXTENDED_POLLING_INTERVAL } from 'core-kit/const'

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

  it('should return false for zero cooldown', () => {
    expect(getRefetchInterval(0)).toEqual(false)
  })

  it('should return EXTENDED_POLLING_INTERVAL for values greater than 5 minutes', () => {
    expect(getRefetchInterval(6 * 60 * 1000)).toEqual(EXTENDED_POLLING_INTERVAL)
  })
})
