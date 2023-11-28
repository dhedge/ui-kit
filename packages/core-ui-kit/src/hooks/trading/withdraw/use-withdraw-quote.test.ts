import { DEFAULT_PRECISION, optimism } from 'const'
import * as poolHooks from 'hooks/pool'

import * as stateHooks from 'hooks/state'
import * as tradingHooks from 'hooks/trading'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { TradingToken } from 'types'

import { useWithdrawQuote } from './use-withdraw-quote'

vi.mock('hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))

vi.mock('hooks/state', () => ({
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

    expect(sendToken.value).toEqual('')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
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

    expect(sendToken.value).toEqual('0')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
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

    expect(sendToken.value).not.toEqual('0')

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
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
        (+sendToken.value * +sendTokenPrice) /
        +receiveTokenPrice
      ).toString(),
    })
  })
})
