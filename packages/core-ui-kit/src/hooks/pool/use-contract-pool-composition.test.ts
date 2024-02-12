import { expect } from 'vitest'

import { erc20Abi } from 'abi'
import {
  DEFAULT_PRECISION,
  DHEDGE_SYNTHETIX_V3_ASSETS_MAP,
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES,
  optimism,
} from 'const'
import * as poolHooks from 'hooks/pool'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { Address, PoolComposition } from 'types'

import { useContractPoolComposition } from './use-contract-pool-composition'

vi.mock('hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useReadContract: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))
vi.mock('hooks/pool', () => ({
  useSynthetixV3AssetBalance: vi.fn(),
  useManagerLogicAddress: vi.fn(),
}))

vi.mock('hooks/pool/multicall', () => ({
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

    expect(poolHooks.useSynthetixV3AssetBalance).toHaveBeenCalledWith({
      vaultAddress: address,
      chainId,
      disabled: true,
    })
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

  it('should return extended fund composition data with synthetix v3 asset balance', () => {
    const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
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
      [
        { asset: TEST_ADDRESS, isDeposit: true },
        { asset: DHEDGE_SYNTHETIX_V3_ASSETS_MAP[chainId], isDeposit: false },
      ],
      [BigInt(1), BigInt(2)],
      [BigInt(1), BigInt(2)],
    ]
    const symbol = 'symbol'
    const decimals = DEFAULT_PRECISION

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolHooks.useSynthetixV3AssetBalance).mockImplementation(
      () => '3',
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

    expect(poolHooks.useSynthetixV3AssetBalance).toHaveBeenCalledWith({
      vaultAddress: address,
      chainId,
      disabled: false,
    })
    expect(result.current).toMatchSnapshot()
  })
})
