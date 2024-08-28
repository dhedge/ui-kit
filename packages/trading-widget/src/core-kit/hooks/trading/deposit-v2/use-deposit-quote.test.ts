import { act } from '@testing-library/react'

import { expect } from 'vitest'

import { optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import type { DynamicTradingToken } from 'core-kit/types'
import { renderHook } from 'tests/test-utils'

import { useDepositQuote } from './use-deposit-quote'
import { useDepositQuoteContractRead } from './use-deposit-quote-contract-read'

vi.mock('core-kit/hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn().mockImplementation((v) => v),
}))

vi.mock('./use-deposit-quote-contract-read', () => ({
  useDepositQuoteContractRead: vi.fn(),
}))

describe('useDepositQuote', () => {
  const address = '0x123'
  const chainId = optimism.id
  const updateSettingsMock = vi.fn()

  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId, address }) as unknown as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      {},
      updateSettingsMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
  })

  it('should not update receive token when is not deposit', () => {
    const isDeposit = false
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(useDepositQuoteContractRead).mockReturnValueOnce({
      isFetching: false,
    } as ReturnType<typeof useDepositQuoteContractRead>)

    expect(isDeposit).toBe(false)

    renderHook(() => useDepositQuote())

    expect(updateReceiveTokenMock).not.toHaveBeenCalled()
  })

  it('should update receive token input based on deposit quote', () => {
    const isDeposit = true
    const updateReceiveTokenMock = vi.fn()

    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }

    expect(isDeposit).toBe(true)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(useDepositQuoteContractRead).mockReturnValue({
      isFetching: true,
    } as ReturnType<typeof useDepositQuoteContractRead>)

    const { rerender } = renderHook(() => useDepositQuote())

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({
      isLoading: true,
    })

    vi.mocked(useDepositQuoteContractRead).mockReturnValue({
      isFetching: false,
      data: 30000n,
    } as ReturnType<typeof useDepositQuoteContractRead>)

    act(() => rerender())

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(3)
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(2, {
      value: '30.000',
    })
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(3, {
      isLoading: false,
    })
  })

  it('should reset receive token value and slippage when send token value is 0', () => {
    const isDeposit = true
    const updateReceiveTokenMock = vi.fn()

    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(useDepositQuoteContractRead).mockReturnValueOnce({
      isFetching: false,
    } as ReturnType<typeof useDepositQuoteContractRead>)

    renderHook(() => useDepositQuote())

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(2)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ isLoading: false })
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ value: '0' })
    expect(updateSettingsMock).toHaveBeenCalledTimes(1)
    expect(updateSettingsMock).toHaveBeenCalledWith({ minSlippage: 0 })
  })
})
