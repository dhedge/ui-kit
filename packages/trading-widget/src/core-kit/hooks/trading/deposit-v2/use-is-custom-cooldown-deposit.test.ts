import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsCustomCooldownDeposit } from './use-is-custom-cooldown-deposit'
import { usePoolStatic } from '../../pool/multicall'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))
vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

describe('useIsCustomCooldownDeposit', () => {
  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId: 1, address: TEST_ADDRESS }) as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false when custom cooldown deposit is not allowed', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: false },
    } as ReturnType<typeof usePoolStatic>)

    const { result } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(false)
  })

  it('should return true when custom cooldown deposit is allowed', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: true },
    } as ReturnType<typeof usePoolStatic>)

    const { result } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(true)
  })
})
