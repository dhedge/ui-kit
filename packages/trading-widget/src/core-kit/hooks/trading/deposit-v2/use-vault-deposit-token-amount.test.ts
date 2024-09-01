import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'
import { renderHook } from 'tests/test-utils'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'
import { useVaultDepositTokenAmount } from './use-vault-deposit-token-amount'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
}))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn(),
}))
vi.mock('./use-is-deposit-with-swap-transaction', () => ({
  useIsDepositWithSwapTransaction: vi.fn(),
}))
vi.mock('./use-swap-data-based-on-send-token', () => ({
  useSwapDataBasedOnSendToken: vi.fn(),
}))

describe('useVaultDepositTokenAmount', () => {
  const sendToken = { value: '100', decimals: 3 }
  const swapDataBasedOnSendTokenDestinationAmount = '100001'

  beforeEach(() => {
    vi.mocked(useSendTokenInput).mockReturnValue([
      sendToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useSwapDataBasedOnSendToken).mockReturnValue({
      data: { destinationAmount: swapDataBasedOnSendTokenDestinationAmount },
    } as unknown as ReturnType<typeof useSwapDataBasedOnSendToken>)
    vi.mocked(useDebounce).mockImplementation((value) => value)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return destination amount for deposit with swap transaction', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValueOnce(true)

    const { result } = renderHook(() => useVaultDepositTokenAmount())
    expect(result.current).toBe(swapDataBasedOnSendTokenDestinationAmount)
  })

  it('should return debounced send token value for deposit without swap transaction', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValueOnce(false)

    const { result } = renderHook(() => useVaultDepositTokenAmount())
    expect(result.current).toBe(
      new BigNumber(sendToken.value).shiftedBy(sendToken.decimals).toFixed(0),
    )
  })
})
