import { PoolLogicAbi } from 'abi'
import { DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES, optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { Address } from 'types'

import { usePoolTokenPriceMutable } from './synthetixV3/use-pool-token-price-mutable'
import { usePoolTokenPrice } from './use-pool-token-price'

vi.mock('hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useContractRead: vi.fn(),
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

    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useContractRead>,
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

    expect(web3Hooks.useContractRead).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useContractRead).toHaveBeenCalledWith(
      expect.objectContaining({
        address,
        abi: PoolLogicAbi,
        functionName: 'tokenPrice',
        chainId,
        enabled: true,
      }),
    )
  })

  it('should call usePoolTokenPriceMutable hook for synthetix v3 vault', () => {
    const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
    const chainId = optimism.id
    const tokenPrice = BigInt(123)
    const poolData = { tokenPrice: '1' }

    vi.mocked(usePoolTokenPriceMutable).mockImplementation(() => tokenPrice)
    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({ data: undefined }) as ReturnType<typeof web3Hooks.useContractRead>,
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
      }),
    )

    expect(web3Hooks.useContractRead).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useContractRead).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
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

    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useContractRead>,
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

    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({ data: tokenPrice }) as ReturnType<typeof web3Hooks.useContractRead>,
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
