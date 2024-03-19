import * as stateHooks from 'core-kit/hooks/state'
import type {
  DynamicTradingToken,
  PoolConfig,
  TradingToken,
} from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useHandlePoolDepositData } from './use-handle-pool-deposit-data'
import { usePoolDepositTokens } from './use-pool-deposit-tokens'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelType: vi.fn(),
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('./use-pool-deposit-tokens', () => ({
  usePoolDepositTokens: vi.fn(),
}))

const updateSendTokenMock = vi.fn()

describe('useHandlePoolDepositData', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
        }) as unknown as PoolConfig,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      {} as unknown as DynamicTradingToken,
      updateSendTokenMock,
    ])
  })

  it('should update send token input if type is "deposit" and initialDepositToken is defined', () => {
    const initialDepositToken: TradingToken = {
      symbol: 'usdc',
      address: '0x23',
      decimals: 6,
      value: 'test',
    }

    vi.mocked(usePoolDepositTokens).mockImplementation(() => [
      initialDepositToken,
    ])
    vi.mocked(stateHooks.useTradingPanelType).mockImplementation(() => [
      'deposit',
      vi.fn(),
    ])

    renderHook(() => useHandlePoolDepositData())

    expect(stateHooks.useTradingPanelPoolConfig).toHaveBeenCalledTimes(1)
    expect(stateHooks.useTradingPanelType).toHaveBeenCalledTimes(1)
    expect(usePoolDepositTokens).toHaveBeenCalledTimes(1)
    expect(updateSendTokenMock).toHaveBeenCalledTimes(1)
    expect(updateSendTokenMock).toHaveBeenCalledWith({
      ...initialDepositToken,
      value: '',
      isLoading: false,
    })
  })

  it('should not update send token input if type is not "deposit"', () => {
    const initialDepositToken: TradingToken = {
      symbol: 'weth',
      address: '0x21',
      decimals: 6,
      value: 'value',
    }
    vi.mocked(usePoolDepositTokens).mockImplementation(() => [
      initialDepositToken,
    ])
    vi.mocked(stateHooks.useTradingPanelType).mockImplementation(() => [
      'withdraw',
      vi.fn(),
    ])

    renderHook(() => useHandlePoolDepositData())

    expect(updateSendTokenMock).not.toHaveBeenCalled()
  })
})
