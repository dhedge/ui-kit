import { DEFAULT_PRECISION } from 'const'
import * as stateHooks from 'hooks/state'
import * as userHooks from 'hooks/user'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { TradingToken } from 'types'

import { useIsTradingEnabled } from './use-is-trading-enabled'

vi.mock('hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
}))

vi.mock('hooks/user', () => ({
  useUserTokenBalance: vi.fn(),
}))

describe('useIsTradingEnabled', () => {
  it('should return true for positive send or receive input value with valid send asset balance', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const balance = '1'

    expect(+sendToken.value).toBeGreaterThan(0)
    expect(+receiveToken.value).toBeGreaterThan(0)
    expect(+sendToken.value <= +balance).toBe(true)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(userHooks.useUserTokenBalance).mockReturnValue(balance)

    const { result } = renderHook(() => useIsTradingEnabled())

    expect(result.current).toBe(true)
  })

  it('should return false for positive send or receive input value but invalid send asset balance', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const balance = '0.99'

    expect(+sendToken.value).toBeGreaterThan(0)
    expect(+receiveToken.value).toBeGreaterThan(0)
    expect(+sendToken.value <= +balance).toBe(false)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(userHooks.useUserTokenBalance).mockReturnValue(balance)

    const { result } = renderHook(() => useIsTradingEnabled())

    expect(result.current).toBe(false)
  })

  it('should return false for negative send or receive input', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '-0.1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '0',
      decimals: DEFAULT_PRECISION,
    }
    const balance = '1'

    expect(+sendToken.value).toBeLessThanOrEqual(0)
    expect(+receiveToken.value).toBeLessThanOrEqual(0)
    expect(+sendToken.value <= +balance).toBe(true)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(userHooks.useUserTokenBalance).mockReturnValue(balance)

    const { result } = renderHook(() => useIsTradingEnabled())

    expect(result.current).toBe(false)
  })
})
