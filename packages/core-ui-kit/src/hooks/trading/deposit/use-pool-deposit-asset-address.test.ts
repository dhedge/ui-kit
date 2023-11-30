import {
  BRIDGED_USDC_OPTIMISM,
  BRIDGED_USDC_POLYGON,
  PAXG_POLYGON,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WMATIC_POLYGON,
  optimism,
  polygon,
} from 'const'
import * as poolHooks from 'hooks/pool'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { PoolComposition } from 'types'

import { usePoolDepositAssetAddress } from './use-pool-deposit-asset-address'

vi.mock('hooks/pool', () => ({ usePoolComposition: vi.fn() }))

describe('usePoolDepositAssetAddress', () => {
  it('should return investAssetAddress when initialInvestToken does not exist', () => {
    const investAssetAddress = '0xInvest'
    const symbol = 'WETH'
    const productPoolAddress = TEST_ADDRESS
    const chainId = optimism.id

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [])

    const { result } = renderHook(() =>
      usePoolDepositAssetAddress({
        investAssetAddress,
        chainId,
        productPoolAddress,
        symbol,
      }),
    )
    expect(poolHooks.usePoolComposition).toHaveBeenCalledTimes(1)
    expect(poolHooks.usePoolComposition).toHaveBeenCalledWith({
      address: productPoolAddress,
      chainId,
    })
    expect(result.current).toEqual(investAssetAddress)
  })

  it('should return investAssetAddress if initialInvestToken exists and isCustomTokenDeposit is false', () => {
    const investAssetAddress = '0xInvest'
    const symbol = 'USDC'
    const productPoolAddress = TEST_ADDRESS
    const chainId = optimism.id

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      {
        tokenAddress: investAssetAddress,
        tokenName: symbol,
        isDeposit: true,
      } as unknown as PoolComposition,
    ])

    const { result } = renderHook(() =>
      usePoolDepositAssetAddress({
        investAssetAddress,
        chainId,
        productPoolAddress,
        symbol,
      }),
    )
    expect(poolHooks.usePoolComposition).toHaveBeenCalledTimes(1)
    expect(poolHooks.usePoolComposition).toHaveBeenCalledWith({
      address: productPoolAddress,
      chainId,
    })
    expect(result.current).toEqual(investAssetAddress)
  })

  it('should return the fallback asset address if initialInvestToken exists, isCustomTokenDeposit is true, and fallback asset symbol is found', () => {
    const investAssetAddress = '0xInvest'
    const symbol = 'CUSTOM'
    const productPoolAddress = TEST_ADDRESS
    const chainId = optimism.id

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      {
        tokenAddress: BRIDGED_USDC_OPTIMISM.address,
        tokenName: BRIDGED_USDC_OPTIMISM.symbol,
        isDeposit: true,
      } as unknown as PoolComposition,
      {
        tokenAddress: WBTC_OPTIMISM.address,
        tokenName: WBTC_OPTIMISM.symbol,
        isDeposit: true,
      } as unknown as PoolComposition,
    ])

    const { result } = renderHook(() =>
      usePoolDepositAssetAddress({
        investAssetAddress,
        chainId,
        productPoolAddress,
        symbol,
      }),
    )
    expect(result.current).toEqual(BRIDGED_USDC_OPTIMISM.address)
  })

  it('should return the fallback asset address if initialInvestToken exists, isCustomTokenDeposit is true, and fallback asset symbol is found (should prefer wrapped native token) #2', () => {
    const investAssetAddress = '0xInvest'
    const symbol = 'CUSTOM'
    const productPoolAddress = TEST_ADDRESS
    const chainId = polygon.id

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      {
        tokenAddress: BRIDGED_USDC_POLYGON.address,
        tokenName: BRIDGED_USDC_POLYGON.symbol,
        isDeposit: false,
      } as unknown as PoolComposition,
      {
        tokenAddress: WBTC_POLYGON.address,
        tokenName: WBTC_POLYGON.symbol,
        isDeposit: false,
      } as unknown as PoolComposition,
      {
        tokenAddress: WMATIC_POLYGON.address,
        tokenName: WMATIC_POLYGON.symbol,
        isDeposit: true,
      } as unknown as PoolComposition,
    ])

    const { result } = renderHook(() =>
      usePoolDepositAssetAddress({
        investAssetAddress,
        chainId,
        productPoolAddress,
        symbol,
      }),
    )
    expect(result.current).toEqual(WMATIC_POLYGON.address)
  })

  it('should return the initialInvestToken address if initialInvestToken exists, isCustomTokenDeposit is true, and fallback asset symbol is not found', () => {
    const investAssetAddress = BRIDGED_USDC_POLYGON.address
    const symbol = BRIDGED_USDC_POLYGON.symbol
    const productPoolAddress = TEST_ADDRESS
    const chainId = polygon.id

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      {
        tokenAddress: PAXG_POLYGON.address,
        tokenName: PAXG_POLYGON.symbol,
        isDeposit: true,
      } as unknown as PoolComposition,
    ])

    const { result } = renderHook(() =>
      usePoolDepositAssetAddress({
        investAssetAddress,
        chainId,
        productPoolAddress,
        symbol,
      }),
    )
    expect(result.current).toEqual(PAXG_POLYGON.address)
  })
})
