import type { TxArgs } from '../../types'
import { calcMinReturnAmount } from '../transaction'

describe('calcMinReturnAmount', () => {
  it('should calculate the min return amount with default decimals', () => {
    const txWithSlippageArgs = {
      receiveAssetInputValue: '100',
    } as TxArgs
    const slippage = 1
    expect(calcMinReturnAmount(txWithSlippageArgs, slippage)).toEqual(
      '99000000000000000000',
    )
  })

  it('should calculate the min return amount with custom decimals', () => {
    const txWithSlippageArgs = {
      receiveAssetInputValue: '100',
      decimalsReceiveToken: 6,
    } as TxArgs
    const slippage = 0.3

    expect(calcMinReturnAmount(txWithSlippageArgs, slippage)).toEqual(
      '99700000',
    )
  })

  it('should handle zero slippage', () => {
    const txWithSlippageArgs = {
      receiveAssetInputValue: '1',
    } as TxArgs
    const slippage = 0

    expect(calcMinReturnAmount(txWithSlippageArgs, slippage)).toEqual(
      '1000000000000000000',
    )
  })
})
