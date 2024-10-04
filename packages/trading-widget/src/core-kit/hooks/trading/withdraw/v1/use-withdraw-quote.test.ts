import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'

import * as stateHooks from 'core-kit/hooks/state'
import * as tradingHooks from 'core-kit/hooks/trading/index'
import { useWithdrawQuote } from 'core-kit/hooks/trading/withdraw/v1/use-withdraw-quote'
import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
  usePoolFees: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
}))

vi.mock('../use-asset-price', () => ({
  useAssetPrice: vi.fn(),
}))

describe('useWithdrawQuote', () => {
  it('should handle empty send token value', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '',
      decimals: DEFAULT_PRECISION,
    }
    const sendTokenPrice = '1'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const receiveTokenPrice = '2'
    const updateReceiveTokenMock = vi.fn()
    const exitFeeNumber = 0.1

    expect(sendToken.value).toEqual('')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(poolHooks.usePoolFees).mockReturnValue({
      exitFeeNumber,
    } as ReturnType<typeof poolHooks.usePoolFees>)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(receiveTokenPrice)

    renderHook(() =>
      useWithdrawQuote({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ value: '0' })
  })

  it('should handle zero send token value', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '0',
      decimals: DEFAULT_PRECISION,
    }
    const sendTokenPrice = '1'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const receiveTokenPrice = '2'
    const updateReceiveTokenMock = vi.fn()
    const exitFeeNumber = 0.2

    expect(sendToken.value).toEqual('0')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(poolHooks.usePoolFees).mockReturnValue({
      exitFeeNumber,
    } as ReturnType<typeof poolHooks.usePoolFees>)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(receiveTokenPrice)

    renderHook(() =>
      useWithdrawQuote({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ value: '0' })
  })

  it('should handle send/receive quote', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const sendTokenPrice = '1'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const receiveTokenPrice = '2'
    const updateReceiveTokenMock = vi.fn()
    const exitFeeNumber = 0.1

    expect(sendToken.value).not.toEqual('0')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(poolHooks.usePoolFees).mockReturnValue({
      exitFeeNumber,
    } as ReturnType<typeof poolHooks.usePoolFees>)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(receiveTokenPrice)

    renderHook(() =>
      useWithdrawQuote({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({
      value: (
        (+sendToken.value * (1 - exitFeeNumber / 100) * +sendTokenPrice) /
        +receiveTokenPrice
      ).toString(),
    })
  })
})
