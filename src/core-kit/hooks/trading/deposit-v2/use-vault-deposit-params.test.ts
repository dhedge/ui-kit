import {
  EASY_SWAPPER_V2_DEPOSIT_METHODS,
  USDC_BASE,
  WETH_BASE,
  base,
} from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useIsCustomCooldownDeposit } from 'core-kit/hooks/trading/deposit-v2/use-is-custom-cooldown-deposit'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolComposition: vi.fn(),
}))
vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))
vi.mock('./use-is-custom-cooldown-deposit', () => ({
  useIsCustomCooldownDeposit: vi.fn(),
}))

const nativeDepositToken = {
  symbol: 'ETH',
  address: '0x4200000000000000000000000000000000000006',
}

describe('useVaultDepositParams', () => {
  const chainId = base.id

  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId, address: TEST_ADDRESS }) as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return deposit params for native token deposit with wrapped native token as deposit option in vault composition', () => {
    const poolComposition = [
      { tokenName: 'WETH', tokenAddress: '0x123', isDeposit: true },
    ]
    vi.mocked(useSendTokenInput).mockReturnValue([
      nativeDepositToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(false)
    vi.mocked(usePoolComposition).mockReturnValue(
      poolComposition as unknown as ReturnType<typeof usePoolComposition>,
    )

    const { result, rerender } = renderHook(() => useVaultDepositParams())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE,
    )

    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(true)
    act(() => rerender())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE_CUSTOM,
    )
  })

  it('should return deposit params for native token deposit without wrapped native token as deposit option in vault composition', () => {
    const poolComposition = [
      { tokenName: 'USDC', tokenAddress: '0x123', isDeposit: true },
    ]
    vi.mocked(useSendTokenInput).mockReturnValue([
      nativeDepositToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(false)
    vi.mocked(usePoolComposition).mockReturnValue(
      poolComposition as unknown as ReturnType<typeof usePoolComposition>,
    )

    const { result, rerender } = renderHook(() => useVaultDepositParams())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT,
    )

    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(true)
    act(() => rerender())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT_CUSTOM,
    )
  })

  it('should return deposit params for custom token deposit when deposit token is presented in vault composition', () => {
    const poolComposition = [
      {
        tokenName: USDC_BASE.symbol,
        isDeposit: true,
        tokenAddress: USDC_BASE.address,
      },
    ]
    vi.mocked(useSendTokenInput).mockReturnValue([
      USDC_BASE,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(false)
    vi.mocked(usePoolComposition).mockReturnValue(
      poolComposition as unknown as ReturnType<typeof usePoolComposition>,
    )

    const { result, rerender } = renderHook(() => useVaultDepositParams())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT,
    )

    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(true)
    act(() => rerender())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT_CUSTOM,
    )
  })

  it('should return deposit params for custom token deposit when deposit token is not presented in vault composition', () => {
    const poolComposition = [
      {
        tokenName: WETH_BASE.symbol,
        isDeposit: true,
        tokenAddress: WETH_BASE.address,
      },
    ]
    vi.mocked(useSendTokenInput).mockReturnValue([
      USDC_BASE,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(false)
    vi.mocked(usePoolComposition).mockReturnValue(
      poolComposition as unknown as ReturnType<typeof usePoolComposition>,
    )

    const { result, rerender } = renderHook(() => useVaultDepositParams())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT,
    )

    vi.mocked(useIsCustomCooldownDeposit).mockReturnValueOnce(true)
    act(() => rerender())
    expect(result.current.depositMethod).toBe(
      EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT_CUSTOM,
    )
  })
})
