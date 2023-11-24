import { DEFAULT_PRECISION } from 'const'
import * as stateHooks from 'hooks/state'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'
import type { TradingToken } from 'types'

import { useIsMultiAssetWithdraw } from './use-is-multi-asset-withdraw'

vi.mock('hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useTradingPanelSettings: vi.fn(),
}))

describe('useIsMultiAssetWithdraw', () => {
  it('should resolve enabled multi asset withdraw all receive symbol', () => {
    const isDeposit = false
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'all',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = {
      isMultiAssetWithdrawalEnabled: true,
    }

    expect(isDeposit).toBe(false)
    expect(receiveToken.symbol).toEqual('all')
    expect(settings.isMultiAssetWithdrawalEnabled).toBe(true)

    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useIsMultiAssetWithdraw())

    expect(result.current).toBe(true)
  })

  it('should resolve disabled multi asset withdraw all receive symbol', () => {
    const isDeposit = false
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'all',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = {
      isMultiAssetWithdrawalEnabled: false,
    }

    expect(isDeposit).toBe(false)
    expect(receiveToken.symbol).toEqual('all')
    expect(settings.isMultiAssetWithdrawalEnabled).toBe(false)

    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useIsMultiAssetWithdraw())

    expect(result.current).toBe(false)
  })

  it('should resolve enabled multi asset withdraw single receive symbol', () => {
    const isDeposit = false
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = {
      isMultiAssetWithdrawalEnabled: true,
    }

    expect(isDeposit).toBe(false)
    expect(receiveToken.symbol).not.toEqual('all')
    expect(settings.isMultiAssetWithdrawalEnabled).toBe(true)

    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useIsMultiAssetWithdraw())

    expect(result.current).toBe(false)
  })

  it('should resolve enabled multi asset deposit single receive symbol', () => {
    const isDeposit = true
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = {
      isMultiAssetWithdrawalEnabled: true,
    }

    expect(isDeposit).toBe(true)
    expect(receiveToken.symbol).not.toEqual('all')
    expect(settings.isMultiAssetWithdrawalEnabled).toBe(true)

    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useIsMultiAssetWithdraw())

    expect(result.current).toBe(false)
  })
})
