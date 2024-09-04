import { act } from '@testing-library/react'
import { expect } from 'vitest'

import { EasySwapperV2Abi } from 'core-kit/abi'
import { EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
import {
  useIsDepositTradingPanelType,
  useSendTokenInput,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'
import { useReadContract } from 'core-kit/hooks/web3'
import { renderHook } from 'tests/test-utils'

import { useDepositQuoteContractRead } from './use-deposit-quote-contract-read'
import { useVaultDepositParams } from './use-vault-deposit-params'
import { useVaultDepositTokenAmount } from './use-vault-deposit-token-amount'

vi.mock('core-kit/hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useSendTokenInput: vi.fn(),
}))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn(),
}))
vi.mock('core-kit/hooks/web3', () => ({
  useContractReadErrorLogging: vi.fn(),
  useReadContract: vi.fn(),
}))
vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))
vi.mock('./use-vault-deposit-token-amount', () => ({
  useVaultDepositTokenAmount: vi.fn(),
}))

describe('useDepositQuoteContractRead', () => {
  beforeEach(() => {
    vi.mocked(useSendTokenInput).mockImplementation(
      () =>
        [{ address: '0x123' }] as unknown as ReturnType<
          typeof useSendTokenInput
        >,
    )
    vi.mocked(useDebounce).mockImplementation((v) => v)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not make a request when is not deposit type', () => {
    vi.mocked(useIsDepositTradingPanelType).mockReturnValueOnce(false)
    vi.mocked(useVaultDepositParams).mockReturnValue({
      vaultDepositTokenAddress: '0x1',
      depositMethod: 'deposit',
    })
    vi.mocked(useVaultDepositTokenAmount).mockReturnValue('100')

    const { rerender } = renderHook(() =>
      useDepositQuoteContractRead({ address: '0x123', chainId: 1 }),
    )
    expect(useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: 1,
        query: expect.objectContaining({
          enabled: false,
          refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
        }),
      }),
    )

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(true)
    act(() => rerender())

    expect(useReadContract).toHaveBeenCalledTimes(2)
    expect(useReadContract).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: true,
        }),
      }),
    )

    vi.mocked(useVaultDepositTokenAmount).mockReturnValueOnce('')
    act(() => rerender())
    expect(useReadContract).toHaveBeenCalledTimes(3)
    expect(useReadContract).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false,
        }),
      }),
    )
  })

  it('should make a request when is deposit type', () => {
    const address = '0x123'
    const vaultDepositTokenAddress = '0x1'
    const vaultDepositTokenAmount = '100'
    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(true)
    vi.mocked(useVaultDepositParams).mockReturnValue({
      vaultDepositTokenAddress,
      depositMethod: 'deposit',
    })
    vi.mocked(useVaultDepositTokenAmount).mockReturnValue(
      vaultDepositTokenAmount,
    )

    renderHook(() => useDepositQuoteContractRead({ address, chainId: 1 }))

    expect(useReadContract).toHaveBeenCalledTimes(1)
    expect(useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        abi: EasySwapperV2Abi,
        functionName: 'depositQuote',
        args: [
          address,
          vaultDepositTokenAddress,
          BigInt(vaultDepositTokenAmount),
        ],
        chainId: 1,
        query: expect.objectContaining({ enabled: true }),
      }),
    )
  })
})
