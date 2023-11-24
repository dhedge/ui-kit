import { DEFAULT_PRECISION } from 'const'
import * as stateHooks from 'hooks/state'
import * as userHooks from 'hooks/user'

import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useIsInsufficientBalance } from './use-is-insufficient-balance'

vi.mock('hooks/state', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('hooks/state')

  return {
    ...actual,
    useSendTokenInput: vi.fn(),
  }
})

vi.mock('./use-user-token-balance', async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    './use-user-token-balance',
  )

  return {
    ...actual,
    useUserTokenBalance: vi.fn(),
  }
})

describe('useIsInsufficientBalance', () => {
  it('should verify token balance > send input value', () => {
    const inputValue = '1'
    const balanceValue = '2'
    const sendTokenInput: ReturnType<typeof stateHooks.useSendTokenInput> = [
      {
        value: inputValue,
        symbol: 'symbol',
        address: TEST_ADDRESS,
        decimals: DEFAULT_PRECISION,
      },
      vi.fn(),
    ]

    expect(+balanceValue).toBeGreaterThanOrEqual(+inputValue)

    vi.mocked(stateHooks.useSendTokenInput).mockImplementationOnce(
      () => sendTokenInput,
    )
    vi.mocked(userHooks.useUserTokenBalance).mockImplementationOnce(
      () => balanceValue,
    )
    const { result } = renderHook(() => useIsInsufficientBalance())

    expect(result.current).toBe(false)
  })

  it('should resolve balance as insufficient', () => {
    const inputValue = '100'
    const balanceValue = '99.99'
    const sendTokenInput: ReturnType<typeof stateHooks.useSendTokenInput> = [
      {
        value: inputValue,
        symbol: 'symbol',
        address: TEST_ADDRESS,
        decimals: DEFAULT_PRECISION,
      },
      vi.fn(),
    ]

    expect(+inputValue).toBeGreaterThan(+balanceValue)

    vi.mocked(stateHooks.useSendTokenInput).mockImplementationOnce(
      () => sendTokenInput,
    )
    vi.mocked(userHooks.useUserTokenBalance).mockImplementationOnce(
      () => balanceValue,
    )
    const { result } = renderHook(() => useIsInsufficientBalance())

    expect(result.current).toBe(true)
  })
})
