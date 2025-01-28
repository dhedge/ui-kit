import { optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'
import { usePoolTokenPrice } from './use-pool-token-price'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
  useTradingPanelPoolConfigs: vi.fn(),
}))

vi.mock('./use-pool-dynamic-contract-data', () => ({
  usePoolDynamicContractData: vi.fn(),
}))
vi.mock('./synthetixV3/use-pool-token-price-mutable', () => ({
  usePoolTokenPriceMutable: vi.fn(),
}))

describe('usePoolTokenPrice', () => {
  it('should call usePoolDynamic with proper address and chainId for non synthetix vault', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = BigInt(1)
    const poolData = { tokenPrice: '1' }

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof usePoolDynamicContractData
        >,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
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

    expect(usePoolDynamicContractData).toHaveBeenCalledTimes(1)
    expect(usePoolDynamicContractData).toHaveBeenCalledWith({
      address,
      chainId,
    })
  })

  // temporary disabled
  // it('should call usePoolTokenPriceMutable hook for synthetix v3 vault', () => {
  //   const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
  //   const chainId = optimism.id
  //   const tokenPrice = '123'
  //   const poolData = { tokenPrice: '1' }
  //   const formatter = (price: bigint) => price.toString()
  //
  //   vi.mocked(usePoolTokenPriceMutable).mockImplementationOnce(() => tokenPrice)
  //   vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
  //     () =>
  //       ({ data: { tokenPrice: undefined } }) as unknown as ReturnType<
  //         typeof usePoolDynamicContractData
  //       >,
  //   )
  //   vi.mocked(
  //     stateHooks.useTradingPanelPoolFallbackData,
  //   ).mockImplementationOnce(
  //     () =>
  //       [poolData, vi.fn()] as unknown as ReturnType<
  //         typeof stateHooks.useTradingPanelPoolFallbackData
  //       >,
  //   )
  //
  //   const { result } = renderHook(() =>
  //     usePoolTokenPrice({
  //       address,
  //       chainId,
  //       formatter,
  //       disabled: false,
  //     }),
  //   )
  //
  //   expect(usePoolDynamicContractData).toHaveBeenCalledTimes(1)
  //   expect(usePoolDynamicContractData).toHaveBeenCalledWith({
  //     address,
  //     chainId,
  //   })
  //   expect(usePoolTokenPriceMutable).toHaveBeenCalledWith({
  //     address,
  //     chainId,
  //     disabled: false,
  //   })
  //   expect(result.current).toEqual(formatter(BigInt(tokenPrice)))
  // })

  it('should format contract token price', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = '1'
    const poolData = { tokenPrice: '2' }
    const formatterMock = vi.fn()

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({
          tokenPrice,
        }) as unknown as ReturnType<typeof usePoolDynamicContractData>,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
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

    expect(formatterMock).toHaveBeenCalledWith(BigInt(tokenPrice))
  })

  it('should format fallback poolData.tokenPrice', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const tokenPrice = undefined
    const poolData = { tokenPrice: BigInt(1) }
    const formatterMock = vi.fn()

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof usePoolDynamicContractData
        >,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
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
