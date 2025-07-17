import { DEFAULT_PRECISION } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import * as userHooks from 'core-kit/hooks/user'

import { useIsInsufficientBalance } from 'core-kit/hooks/user/use-is-insufficient-balance'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    'core-kit/hooks/state',
  )

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
