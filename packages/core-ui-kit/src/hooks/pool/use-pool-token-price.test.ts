import { PoolLogicAbi } from 'abi'
import { DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES, optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { Address } from 'types'

import { usePoolTokenPriceMutable } from './synthetixV3/use-pool-token-price-mutable'
import { usePoolTokenPrice } from './use-pool-token-price'
import { expect } from 'vitest'

vi.mock('hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useReadContract: vi.fn(),
  useContractReadErrorLogging: vi.fn(),
}))
vi.mock('./synthetixV3/use-pool-token-price-mutable', () => ({
  usePoolTokenPriceMutable: vi.fn(),
}))

describe('usePoolTokenPrice', () => {
  it('should call tokenPrice method on PoolLogicAbi with proper address and chainId for non synthetix vault', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = BigInt(1)
    const poolData = { tokenPrice: '1' }

    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useReadContract>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
        chainId,
      }),
    )

    expect(web3Hooks.useReadContract).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address,
        abi: PoolLogicAbi,
        functionName: 'tokenPrice',
        chainId,
        query: expect.objectContaining({
          enabled: true,
        }),
      }),
    )
  })

  it('should call usePoolTokenPriceMutable hook for synthetix v3 vault', () => {
    const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
    const chainId = optimism.id
    const tokenPrice = BigInt(123)
    const poolData = { tokenPrice: '1' }

    vi.mocked(usePoolTokenPriceMutable).mockImplementation(() => tokenPrice)
    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({ data: undefined }) as ReturnType<typeof web3Hooks.useReadContract>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    const { result } = renderHook(() =>
      usePoolTokenPrice({
        address,
        chainId,
        formatter: (price) => price.toString(),
        disabled: false,
      }),
    )

    expect(web3Hooks.useReadContract).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false,
        }),
      }),
    )
    expect(usePoolTokenPriceMutable).toHaveBeenCalledWith({
      address,
      chainId,
      disabled: false,
    })
    expect(result.current).toEqual('123')
  })

  it('should format contract token price', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = BigInt(1)
    const poolData = { tokenPrice: '2' }
    const formatterMock = vi.fn()

    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useReadContract>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
        chainId,
        formatter: formatterMock,
      }),
    )

    expect(formatterMock).toHaveBeenCalledWith(tokenPrice)
  })

  it('should format fallback poolData.tokenPrice', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = undefined
    const poolData = { tokenPrice: BigInt(1) }
    const formatterMock = vi.fn()

    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useReadContract>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
        chainId,
        formatter: formatterMock,
      }),
    )

    expect(formatterMock).toHaveBeenCalledWith(poolData.tokenPrice)
  })
})
