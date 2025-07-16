import { expect } from 'vitest'

import { optimism } from 'core-kit/const'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useDepositLockTime } from 'core-kit/hooks/trading/deposit-v2/use-deposit-lock-time'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))

describe('useDepositLockTime', () => {
  const chainId = optimism.id

  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () => ({ chainId }) as ReturnType<typeof useTradingPanelPoolConfig>,
    )

    vi.mocked(usePoolStatic).mockImplementation(
      () =>
        ({ data: { customCooldown: 3600n } }) as ReturnType<
          typeof usePoolStatic
        >,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return lock time for deposit', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'deposit',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('24 hours')
  })

  it('should return lock time for depositWithCustomCooldown ', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'depositWithCustomCooldown',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('60 minutes')
  })

  it('should return lock time for nativeDeposit', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'nativeDeposit',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('24 hours')
  })

  it('should return lock time for nativeDepositWithCustomCooldown', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'nativeDepositWithCustomCooldown',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('60 minutes')
  })

  it('should return lock time for zapDepositWithCustomCooldown', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'zapDepositWithCustomCooldown',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('60 minutes')
  })

  it('should return lock time for zapDeposit', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'zapDeposit',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('24 hours')
  })

  it('should return lock time for zapNativeDeposit', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'zapNativeDeposit',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('24 hours')
  })

  it('should return lock time for zapNativeDepositWithCustomCooldown', () => {
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod: 'zapNativeDepositWithCustomCooldown',
    } as ReturnType<typeof useVaultDepositParams>)

    const { result } = renderHook(() => useDepositLockTime())
    expect(result.current).toBe('60 minutes')
  })
})
