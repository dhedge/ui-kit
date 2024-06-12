import {
  formatBalance,
  formatNumeratorToPercentage,
  formatPercentage,
  formatToUsd,
} from '../formatter'

describe('formatToUsd', () => {
  it('should return value formatted by Intl.NumberFormat USD currency', () => {
    expect(formatToUsd({ value: 100 })).toEqual('$100.00')
    expect(formatToUsd({ value: 1 })).toEqual('$1.00')
    expect(formatToUsd({ value: 1, minimumFractionDigits: 0 })).toEqual('$1')
    expect(
      formatToUsd({
        value: 1.1001,
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      }),
    ).toEqual('$1.1')
    expect(
      formatToUsd({
        value: 1.1001,
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      }),
    ).toEqual('$1.1001')
  })
})

describe('formatNumeratorToPercentage', () => {
  it('should format percents in en-GB locale', () => {
    expect(formatNumeratorToPercentage(10, 5)).toEqual('200%')
    expect(formatNumeratorToPercentage(1, 5)).toEqual('20%')
    expect(formatNumeratorToPercentage(0.001, 5, 2)).toEqual('0.02%')
  })
})

describe('formatPercentage', () => {
  it('should format number to percentage in en-US locale', () => {
    expect(formatPercentage(10)).toEqual('10%')
    expect(formatPercentage(0, 5)).toEqual('0%')
    expect(formatPercentage(25.13344, 3)).toEqual('25.133%')
    expect(formatPercentage(102.99)).toEqual('103%')
    expect(formatPercentage(109.765, 5)).toEqual('109.765%')
  })
})

describe('formatBalance', () => {
  it('should format balance with precision', () => {
    expect(formatBalance('56619.095563', 3)).toEqual('56619.095')
    expect(formatBalance('56619.001', 3)).toEqual('56619.001')
    expect(formatBalance('0', 3)).toEqual('0')
    expect(formatBalance('0.000001', 6)).toEqual('0.000001')
    expect(formatBalance('56619.09556399', 6)).toEqual('56619.095563')
    expect(formatBalance('0', 6)).toEqual('0')
  })
})
