import { base } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import {
  useSendTokenDebouncedValue,
  useSwapDataQuery,
} from 'core-kit/hooks/trading'
import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useIsDepositWithSwapTransaction } from 'core-kit/hooks/trading/deposit-v2/use-is-deposit-with-swap-transaction'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2/use-swap-data-based-on-send-token'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useDebounce } from 'core-kit/hooks/utils'
import { useAccount } from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))
vi.mock('core-kit/hooks/trading', () => ({
  useSwapDataQuery: vi.fn(),
  useSendTokenDebouncedValue: vi.fn(),
}))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn(),
}))
vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
}))
vi.mock('./use-applied-deposit-slippage', () => ({
  useAppliedDepositSlippage: vi.fn(),
}))
vi.mock('./use-is-deposit-with-swap-transaction', () => ({
  useIsDepositWithSwapTransaction: vi.fn(),
}))
vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))

describe('useSwapDataBasedOnSendToken', () => {
  const account = '0x1'
  const sendToken = {
    address: '0x123',
    value: '1',
    symbol: 'USDC',
    decimals: 3,
  }
  const vaultDepositTokenAddress = '0x2'
  const slippage = 1
  const chainId = base.id

  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId, address: TEST_ADDRESS }) as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
    vi.mocked(useAccount).mockImplementation(
      () => ({ account }) as unknown as ReturnType<typeof useAccount>,
    )
    vi.mocked(useSendTokenInput).mockReturnValue([
      sendToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
      debouncedSendTokenValue: sendToken.value,
    } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)
    vi.mocked(useDebounce).mockImplementation((value) => value)
    vi.mocked(useVaultDepositParams).mockReturnValue({
      vaultDepositTokenAddress: vaultDepositTokenAddress,
    } as unknown as ReturnType<typeof useVaultDepositParams>)
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(slippage)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return swap data when deposit with swap transaction is true', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
    renderHook(() => useSwapDataBasedOnSendToken())

    expect(useSwapDataQuery).toHaveBeenCalledWith(
      {
        amount: '1000',
        chainId,
        destinationAddress: vaultDepositTokenAddress,
        slippage: '1',
        sourceAddress: '0x123',
        walletAddress: account,
      },
      expect.objectContaining({ enabled: true }),
    )
  })

  it('should not return swap data when deposit with swap transaction is false', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(false)

    renderHook(() => useSwapDataBasedOnSendToken())
    expect(useSwapDataQuery).toHaveBeenCalledWith(
      expect.objectContaining({}),
      expect.objectContaining({ enabled: false }),
    )
  })
})
