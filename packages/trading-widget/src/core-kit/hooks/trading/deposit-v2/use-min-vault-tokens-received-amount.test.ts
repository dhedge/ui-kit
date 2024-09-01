import {
  usePoolDynamicContractData,
  usePoolTokenPrice,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

import { useAppliedDepositSlippage } from './use-applied-deposit-slippage'
import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useMinVaultTokensReceivedAmount } from './use-min-vault-tokens-received-amount'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolDynamicContractData: vi.fn(),
  usePoolTokenPrice: vi.fn(),
}))
vi.mock('core-kit/hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelSettings: vi.fn(),
}))
vi.mock('core-kit/hooks/trading', () => ({
  useAssetPrice: vi.fn(),
}))
vi.mock('./use-applied-deposit-slippage', () => ({
  useAppliedDepositSlippage: vi.fn(),
}))
vi.mock('./use-is-deposit-with-swap-transaction', () => ({
  useIsDepositWithSwapTransaction: vi.fn(),
}))

const sendToken = {
  address: '0x123',
  value: '1',
  symbol: 'USDC',
  decimals: 3,
}
const sendTokenPrice = '2'
const receiveToken = {
  address: '0x456',
  value: '2',
  symbol: 'DHTP',
  decimals: 3,
}
const receiveTokenPrice = '1'

describe('useMinVaultTokensReceivedAmount', () => {
  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue([
      { address: TEST_ADDRESS, chainId: 1 },
    ] as unknown as ReturnType<typeof useTradingPanelPoolConfig>)
    vi.mocked(useSendTokenInput).mockReturnValue([
      sendToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      receiveToken,
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(usePoolTokenPrice).mockReturnValue(receiveTokenPrice)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return the minimum vault tokens received amount for deposit without swap transaction', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(false)
    vi.mocked(usePoolDynamicContractData).mockReturnValue({
      entryFee: '1000',
    } as ReturnType<typeof usePoolDynamicContractData>)
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(0)

    const { result, rerender } = renderHook(() =>
      useMinVaultTokensReceivedAmount(),
    )
    expect(result.current).toBe('1998')

    vi.mocked(useTradingPanelSettings).mockReturnValueOnce([
      { slippage: 0 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)

    act(() => rerender())
    expect(result.current).toBe('2000')
  })

  it('should return the minimum vault tokens received amount for deposit with swap transaction and auto slippage', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
    vi.mocked(usePoolDynamicContractData).mockReturnValue({
      entryFee: '1000',
    } as ReturnType<typeof usePoolDynamicContractData>)
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(0.1)

    const { result } = renderHook(() => useMinVaultTokensReceivedAmount())
    expect(result.current).toBe('1998')
  })

  it('should return the minimum vault tokens received amount for deposit with swap transaction and manual slippage', () => {
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
    vi.mocked(usePoolDynamicContractData).mockReturnValue({
      entryFee: '0',
    } as ReturnType<typeof usePoolDynamicContractData>)
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 0.1 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(0.1)

    const { result, rerender } = renderHook(() =>
      useMinVaultTokensReceivedAmount(),
    )
    expect(result.current).toBe('1998')

    vi.mocked(usePoolDynamicContractData).mockReturnValueOnce({
      entryFee: '1000',
    } as ReturnType<typeof usePoolDynamicContractData>)

    act(() => rerender())
    expect(result.current).toBe('1798')
  })
})
