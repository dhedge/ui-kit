import { expect } from 'vitest'

import { erc20Abi } from 'core-kit/abi'
import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import { useContractPoolComposition } from 'core-kit/hooks/pool/use-contract-pool-composition'
import * as stateHooks from 'core-kit/hooks/state'
import * as web3Hooks from 'core-kit/hooks/web3'
import type { PoolComposition } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useReadContract: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerDynamic: vi.fn(),
}))

describe('useContractPoolComposition', () => {
  it('should call usePoolManagerDynamic', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const fallbackPoolComposition: PoolComposition = {
      tokenName: 'fallback_tokenName',
      rate: 'fallback_rate',
      amount: 'fallback_amount',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['fallback_iconSymbol'],
      },
    }
    const fallbackPoolData = { poolCompositions: [fallbackPoolComposition] }
    const contractFundComposition = [
      [{ asset: TEST_ADDRESS, isDeposit: true }],
      [BigInt(1)],
      [BigInt(1)],
    ]
    const symbol = 'symbol'
    const decimals = DEFAULT_PRECISION
    const managerLogicAddress = TEST_ADDRESS

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerDynamic).mockImplementationOnce(
      () =>
        ({
          data: { getFundComposition: contractFundComposition },
          isFetched: true,
        }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolManagerDynamic
        >,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementationOnce(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    renderHook(() => useContractPoolComposition({ address, chainId }))

    expect(poolMulticallHooks.usePoolManagerDynamic).toHaveBeenCalledTimes(1)
    expect(poolMulticallHooks.usePoolManagerDynamic).toHaveBeenCalledWith(
      expect.objectContaining({
        address: managerLogicAddress,
        chainId,
      }),
    )
  })

  it('should call symbol and decimals methods on erc20Abi for all composition assets', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const fallbackPoolComposition: PoolComposition = {
      tokenName: 'fallback_tokenName',
      rate: 'fallback_rate',
      amount: 'fallback_amount',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['fallback_iconSymbol'],
      },
    }
    const fallbackPoolData = { poolCompositions: [fallbackPoolComposition] }
    const contractFundComposition = [
      [{ asset: TEST_ADDRESS, isDeposit: true }],
      [BigInt(1)],
      [BigInt(1)],
    ]
    const symbol = 'symbol'
    const decimals = DEFAULT_PRECISION

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerDynamic).mockImplementationOnce(
      () =>
        ({
          data: { getFundComposition: contractFundComposition },
          isFetched: true,
        }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolManagerDynamic
        >,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementationOnce(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    renderHook(() => useContractPoolComposition({ address, chainId }))

    expect(web3Hooks.useReadContracts).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            address: TEST_ADDRESS,
            abi: erc20Abi,
            functionName: 'symbol',
            chainId,
          }),
          expect.objectContaining({
            address: TEST_ADDRESS,
            abi: erc20Abi,
            functionName: 'decimals',
            chainId,
          }),
        ]),
      }),
    )
  })

  it('should return extended fund composition data', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const fallbackPoolComposition: PoolComposition = {
      tokenName: 'fallback_tokenName',
      rate: 'fallback_rate',
      amount: 'fallback_amount',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['fallback_iconSymbol'],
      },
    }
    const fallbackPoolData = { poolCompositions: [fallbackPoolComposition] }
    const contractFundComposition = [
      [{ asset: TEST_ADDRESS, isDeposit: true }],
      [BigInt(1)],
      [BigInt(1)],
    ]
    const symbol = 'symbol'
    const decimals = DEFAULT_PRECISION

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerDynamic).mockImplementationOnce(
      () =>
        ({
          data: { getFundComposition: contractFundComposition },
          isFetched: true,
        }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolManagerDynamic
        >,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() =>
      useContractPoolComposition({ address, chainId }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
