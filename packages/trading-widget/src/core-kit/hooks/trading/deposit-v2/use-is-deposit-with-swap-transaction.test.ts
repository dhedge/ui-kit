import { useSendTokenInput } from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useVaultDepositParams } from './use-vault-deposit-params'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
}))
vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))

describe('useIsDepositWithSwapTransaction', () => {
  beforeEach(() => {
    vi.mocked(useSendTokenInput).mockImplementation(
      () =>
        [{ address: TEST_ADDRESS }] as unknown as ReturnType<
          typeof useSendTokenInput
        >,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return true when sendToken address and vaultDepositTokenAddress are not equal', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      vaultDepositTokenAddress: '0x123',
    } as unknown as ReturnType<typeof useVaultDepositParams>)
    const { result } = renderHook(() => useIsDepositWithSwapTransaction())
    expect(result.current).toBe(true)
  })

  it('should return false when sendToken address and vaultDepositTokenAddress are equal', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      vaultDepositTokenAddress: TEST_ADDRESS,
    } as unknown as ReturnType<typeof useVaultDepositParams>)
    const { result } = renderHook(() => useIsDepositWithSwapTransaction())
    expect(result.current).toBe(false)
  })
})
