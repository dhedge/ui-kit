import BigNumber from 'bignumber.js'

import { useReadContract } from 'wagmi'

import {
  useSendTokenInput,
  useTradingPanelDefaultChainId,
  useTradingPanelPoolConfig,
  useTradingPanelPoolFallbackData,
} from 'core-kit/hooks/state'

import {
  useAssetPrice,
  useSendTokenDebouncedValue,
} from 'core-kit/hooks/trading'
import { useIsDepositWithSwapTransaction } from 'core-kit/hooks/trading/deposit-v2/use-is-deposit-with-swap-transaction'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2/use-swap-data-based-on-send-token'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useVaultDepositTokenAmount } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-token-amount'
import { useDebounce } from 'core-kit/hooks/utils'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelDefaultChainId: vi.fn(),
  useTradingPanelPoolFallbackData: vi.fn(),
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
vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))
vi.mock('core-kit/hooks/trading', () => ({
  useAssetPrice: vi.fn(),
  useSendTokenDebouncedValue: vi.fn(),
}))
vi.mock('wagmi', () => ({
  useReadContract: vi.fn(),
  createConfig: vi.fn(),
  WagmiProvider: vi.fn(({ children }) => children),
  Provider: vi.fn(({ children }) => children),
}))

describe('useVaultDepositTokenAmount', () => {
  const sendToken = {
    value: '100',
    decimals: 3,
    address: '0x123' as const,
  }
  const debouncedSendTokenValue = '100'
  const chainId = 1
  const vaultDepositTokenAddress = '0x456' as const
  const sendTokenPrice = 2.5
  const vaultDepositTokenPrice = 1.0
  const decimals = 18

  beforeEach(() => {
    vi.mocked(useSendTokenInput).mockReturnValue([
      sendToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)

    vi.mocked(useTradingPanelPoolConfig).mockReturnValue({
      chainId,
    } as unknown as ReturnType<typeof useTradingPanelPoolConfig>)

    vi.mocked(useTradingPanelDefaultChainId).mockReturnValue(chainId)

    vi.mocked(useTradingPanelPoolFallbackData).mockReturnValue([
      { address: vaultDepositTokenAddress },
    ] as unknown as ReturnType<typeof useTradingPanelPoolFallbackData>)

    vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
      debouncedSendTokenValue,
    } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

    vi.mocked(useAssetPrice).mockImplementation(({ address }) => {
      if (address === sendToken.address) return sendTokenPrice.toString()
      if (address === vaultDepositTokenAddress)
        return vaultDepositTokenPrice.toString()
      return '0'
    })

    vi.mocked(useVaultDepositParams).mockReturnValue({
      vaultDepositTokenAddress,
    } as unknown as ReturnType<typeof useVaultDepositParams>)

    vi.mocked(useReadContract).mockReturnValue({
      data: decimals,
    } as unknown as ReturnType<typeof useReadContract>)

    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(false)
    vi.mocked(useSwapDataBasedOnSendToken).mockReturnValue({
      data: { destinationAmount: '100001' },
    } as unknown as ReturnType<typeof useSwapDataBasedOnSendToken>)
    vi.mocked(useDebounce).mockImplementation((value) => value)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when deposit is NOT with swap transaction', () => {
    beforeEach(() => {
      vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(false)
    })

    it('should return debounced send token value converted to wei', () => {
      const { result } = renderHook(() => useVaultDepositTokenAmount())

      const expected = new BigNumber(debouncedSendTokenValue)
        .shiftedBy(sendToken.decimals)
        .toFixed(0)

      expect(result.current).toBe(expected)
    })

    it('should handle zero debounced value', () => {
      vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
        debouncedSendTokenValue: '0',
      } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('0')
    })

    it('should handle empty debounced value', () => {
      vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
        debouncedSendTokenValue: '',
      } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('0')
    })
  })

  describe('when deposit IS with swap transaction', () => {
    beforeEach(() => {
      vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
    })

    it('should return calculated vault deposit token amount based on USD values', () => {
      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('249950000000000000000')
    })

    it('should handle zero send token value', () => {
      vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
        debouncedSendTokenValue: '0',
      } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('0')
    })

    it('should handle zero vault deposit token price', () => {
      vi.mocked(useAssetPrice).mockImplementation(({ address }) => {
        if (address === sendToken.address) return sendTokenPrice.toString()
        if (address === vaultDepositTokenAddress) return '0'
        return '0'
      })

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('0')
    })

    it('should handle missing decimals', () => {
      vi.mocked(useReadContract).mockReturnValue({
        data: undefined,
      } as unknown as ReturnType<typeof useReadContract>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('0')
    })

    it('should handle different decimal values', () => {
      const customDecimals = 2
      vi.mocked(useReadContract).mockReturnValue({
        data: customDecimals,
      } as unknown as ReturnType<typeof useReadContract>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('24995')
    })

    it('should handle different price ratios', () => {
      const highVaultPrice = 10.0
      vi.mocked(useAssetPrice).mockImplementation(({ address }) => {
        if (address === sendToken.address) return sendTokenPrice.toString()
        if (address === vaultDepositTokenAddress)
          return highVaultPrice.toString()
        return '0'
      })

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      const sendValueInUsd = Number(debouncedSendTokenValue) * sendTokenPrice
      const expected = new BigNumber(sendValueInUsd / highVaultPrice)
        .shiftedBy(decimals)
        .times(1 - 0.02 / 100)
        .toFixed(0)

      expect(result.current).toBe(expected)
    })
  })

  describe('edge cases', () => {
    it('should handle very small values', () => {
      vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
      vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
        debouncedSendTokenValue: '0.000001',
      } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('2499500000000')
    })

    it('should handle very large values', () => {
      vi.mocked(useIsDepositWithSwapTransaction).mockReturnValue(true)
      vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
        debouncedSendTokenValue: '1000000',
      } as unknown as ReturnType<typeof useSendTokenDebouncedValue>)

      const { result } = renderHook(() => useVaultDepositTokenAmount())

      expect(result.current).toBe('2499500000000000000000000')
    })
  })
})
