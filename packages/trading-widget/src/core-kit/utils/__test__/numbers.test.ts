import BigNumber from 'bignumber.js'

import {
  getConventionalTokenPriceDecimals,
  getPercent,
  getPoolFraction,
  normalizeNumber,
  shiftBy,
} from '../number'

describe('normalizeNumber', () => {
  it('should divide value by factor and convert to number', () => {
    expect(normalizeNumber(10000, 1)).toEqual(1000)
    expect(normalizeNumber(100000.0001, 3)).toEqual(100.0000001)
    expect(normalizeNumber('10000.0001', 10)).toEqual(0.00000100000001)
    expect(normalizeNumber('0.1', 4)).toEqual(0.00001)
  })
})

describe('shiftBy', () => {
  it('should shift decimal point by n and convert to fixed string with no decimals', () => {
    expect(shiftBy(new BigNumber(0.0001), 3)).toEqual('0')
    expect(shiftBy(new BigNumber(0.0001), 4)).toEqual('1')
    expect(shiftBy(new BigNumber(0.0001), 5)).toEqual('10')
    expect(shiftBy(new BigNumber(0.0001), 6)).toEqual('100')
  })
})

describe('getPercent', () => {
  it('should count percents', () => {
    expect(getPercent(50, 100)).toBe(50)
    expect(getPercent(75, 50)).toBe(150)
    expect(getPercent(0, 100)).toBe(0)
    expect(getPercent(100, 0)).toBe(Infinity)
    expect(getPercent(1, 3)).toBeCloseTo(33.333)
  })
})

describe('getConventionalTokenPriceDecimals', () => {
  it('should return 4 when the token price is less than 1', () => {
    expect(getConventionalTokenPriceDecimals(0.5)).toBe(4)
  })

  it('should return 3 when the token price is between 1 and 10 (exclusive)', () => {
    expect(getConventionalTokenPriceDecimals(5.75)).toBe(3)
  })

  it('should return 2 when the token price is 10 or greater', () => {
    expect(getConventionalTokenPriceDecimals(10)).toBe(2)
  })
})

describe('getPoolFraction', () => {
  it('should return the correct pool fraction when precision is not specified', () => {
    const poolTotalValue = '100000000000000000000'
    const amountToSell = '1000000000000000000'
    const poolTotalSupply = '20000000000000000000'
    expect(getPoolFraction(poolTotalValue, amountToSell, poolTotalSupply)).toBe(
      5,
    )
  })

  it('should return the correct pool fraction with custom precision', () => {
    const poolTotalValue = '1000000'
    const amountToSell = '250000'
    const poolTotalSupply = '5000000'
    const precision = 5
    expect(
      getPoolFraction(poolTotalValue, amountToSell, poolTotalSupply, precision),
    ).toBe(0.5)
  })

  it('should return 0 when amountToSell is 0', () => {
    const poolTotalValue = '100'
    const amountToSell = '0'
    const poolTotalSupply = '200'
    expect(getPoolFraction(poolTotalValue, amountToSell, poolTotalSupply)).toBe(
      0,
    )
  })
})
