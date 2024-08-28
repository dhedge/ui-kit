import { optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsVaultDepositLocked } from './use-is-vault-deposit-locked'

vi.mock('core-kit/hooks/pool', () => ({
  useCheckWhitelist: vi.fn(),
  usePoolDynamicContractData: vi.fn(),
}))
vi.mock('core-kit/hooks/state', () => ({ useTradingPanelPoolConfig: vi.fn() }))

describe('useIsVaultDepositLocked', () => {
  it('should not check whitelisting if vault is not private or deprecated', () => {
    const isPrivateVault = false
    const deprecated = false
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivateVault }) as ReturnType<
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

    const { result } = renderHook(() => useIsVaultDepositLocked())

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
      isVaultDepositLocked: false,
      isAccountWhitelisted: false,
    })
  })

  it('should check whitelisting if vault is private', () => {
    const isPrivateVault = true
    const deprecated = false
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivateVault }) as ReturnType<
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

    const { result } = renderHook(() => useIsVaultDepositLocked())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledTimes(1)
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      isVaultDepositLocked: true,
      isAccountWhitelisted: true,
    })
  })

  it('should check whitelisting if vault is deprecated', () => {
    const isPrivateVault = false
    const deprecated = true
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivateVault }) as ReturnType<
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

    const { result } = renderHook(() => useIsVaultDepositLocked())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledTimes(1)
    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      isVaultDepositLocked: true,
      isAccountWhitelisted: false,
    })
  })

  it('should check whitelisting if vault is deprecated and private', () => {
    const isPrivateVault = true
    const deprecated = true
    const chainId = optimism.id
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ isPrivateVault }) as ReturnType<
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

    const { result } = renderHook(() => useIsVaultDepositLocked())

    expect(poolHooks.useCheckWhitelist).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(result.current).toEqual({
      isVaultDepositLocked: true,
      isAccountWhitelisted: true,
    })
  })
})