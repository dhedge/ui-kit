import { expect } from 'vitest'

import { formatNumber } from './price-input'

describe('limit-orders/component/common/price-input/formatNumber', () => {
  it('should format decimals precisely', () => {
    expect(formatNumber('12.12556')).toEqual('12.1255')
    expect(formatNumber('12')).toEqual('12')
    expect(formatNumber('0')).toEqual('0')
    expect(formatNumber('0.001')).toEqual('0.001')
    expect(formatNumber('0.00112')).toEqual('0.0011')
  })
})
