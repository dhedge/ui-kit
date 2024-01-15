import { expect } from 'vitest'

import { PoolManagerLogicAbi, erc20ABI } from 'abi'
import {
  DEFAULT_PRECISION,
  DHEDGE_SYNTHETIX_V3_ASSETS_MAP,
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES,
  optimism,
} from 'const'
import * as poolHooks from 'hooks/pool'
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
  useContractReads: vi.fn(),
  useContractRead: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))
vi.mock('hooks/pool', () => ({
  useSynthetixV3AssetBalance: vi.fn(),
  useManagerLogicAddress: vi.fn(),
}))

describe('useContractPoolComposition', () => {
  it('should call getFundComposition method on PoolManagerLogicAbi', () => {
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
    vi.mocked(poolHooks.useManagerLogicAddress).mockImplementation(
      () => managerLogicAddress,
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementationOnce(
      () =>
        ({
          data: contractFundComposition,
          isFetched: true,
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )
    vi.mocked(web3Hooks.useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )

    renderHook(() => useContractPoolComposition({ address, chainId }))

    expect(poolHooks.useManagerLogicAddress).toHaveBeenCalledWith({
      address,
      chainId,
    })
    expect(poolHooks.useSynthetixV3AssetBalance).toHaveBeenCalledWith({
      vaultAddress: address,
      chainId,
      disabled: true,
    })
    expect(web3Hooks.useContractRead).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useContractRead).toHaveBeenCalledWith(
      expect.objectContaining({
        address: managerLogicAddress,
        abi: PoolManagerLogicAbi,
        functionName: 'getFundComposition',
        chainId,
      }),
    )
  })

  it('should call symbol and decimals methods on erc20ABI for all composition assets', () => {
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
    vi.mocked(poolHooks.useManagerLogicAddress).mockImplementation(
      () => managerLogicAddress,
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementationOnce(
      () =>
        ({
          data: contractFundComposition,
          isFetched: true,
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )
    vi.mocked(web3Hooks.useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )

    renderHook(() => useContractPoolComposition({ address, chainId }))

    expect(web3Hooks.useContractReads).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useContractReads).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            address: TEST_ADDRESS,
            abi: erc20ABI,
            functionName: 'symbol',
            chainId,
          }),
          expect.objectContaining({
            address: TEST_ADDRESS,
            abi: erc20ABI,
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
    const managerLogicAddress = TEST_ADDRESS

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolHooks.useManagerLogicAddress).mockImplementation(
      () => managerLogicAddress,
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({
          data: contractFundComposition,
          isFetched: true,
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )
    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
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
    const managerLogicAddress = TEST_ADDRESS

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackPoolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolHooks.useManagerLogicAddress).mockImplementation(
      () => managerLogicAddress,
    )
    vi.mocked(poolHooks.useSynthetixV3AssetBalance).mockImplementation(
      () => '3',
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({
          data: contractFundComposition,
          isFetched: true,
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
    )
    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: symbol }, { result: decimals }],
        }) as unknown as ReturnType<typeof web3Hooks.useContractReads>,
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
