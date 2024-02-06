import { optimism } from 'const'
import * as poolHooks from 'hooks/pool'
import * as stateHooks from 'hooks/state'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useShouldBeWhitelisted } from './use-should-be-whitelisted'

vi.mock('hooks/pool', () => ({
  useCheckWhitelist: vi.fn(),
  usePoolDynamicContractData: vi.fn(),
}))
vi.mock('hooks/state', () => ({ useTradingPanelPoolConfig: vi.fn() }))

describe('useShouldBeWhitelisted', () => {
  it('should not check whitelisting if vault is not private or deprecated', () => {
    const isPrivate = false
    const deprecated = false
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivate }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementationOnce(
      () =>
        ({
          chainId: optimism.id,
          address: TEST_ADDRESS,
          deprecated,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.useCheckWhitelist).mockImplementationOnce(() => false)

    const { result } = renderHook(() => useShouldBeWhitelisted())

    expect(poolHooks.usePoolDynamicContractData).toHaveBeenCalledTimes(1)
    expect(poolHooks.usePoolDynamicContractData).toHaveBeenCalledWith({
      chainId: optimism.id,
      address: TEST_ADDRESS,
    })
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledTimes(1)
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })

    expect(result.current).toEqual({
      shouldBeWhitelisted: false,
      isAccountWhitelisted: false,
    })
  })

  it('should check whitelisting if vault is private', () => {
    const isPrivate = true
    const deprecated = false
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivate }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementationOnce(
      () =>
        ({
          chainId,
          address: TEST_ADDRESS,
          deprecated,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.useCheckWhitelist).mockImplementationOnce(() => true)

    const { result } = renderHook(() => useShouldBeWhitelisted())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledTimes(1)
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      shouldBeWhitelisted: true,
      isAccountWhitelisted: true,
    })
  })

  it('should check whitelisting if vault is deprecated', () => {
    const isPrivate = false
    const deprecated = true
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivate }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementationOnce(
      () =>
        ({
          chainId,
          address: TEST_ADDRESS,
          deprecated,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.useCheckWhitelist).mockImplementationOnce(() => false)

    const { result } = renderHook(() => useShouldBeWhitelisted())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledTimes(1)
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      shouldBeWhitelisted: true,
      isAccountWhitelisted: false,
    })
  })

  it('should check whitelisting if vault is deprecated and private', () => {
    const isPrivate = true
    const deprecated = true
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivate }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementationOnce(
      () =>
        ({
          chainId,
          address: TEST_ADDRESS,
          deprecated,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.useCheckWhitelist).mockImplementationOnce(() => true)

    const { result } = renderHook(() => useShouldBeWhitelisted())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      shouldBeWhitelisted: true,
      isAccountWhitelisted: true,
    })
  })
})
