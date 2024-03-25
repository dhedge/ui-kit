import { useBrowserStorage } from 'core-kit/hooks/utils'
import { renderHook } from 'tests/test-utils'

import { useReferralProgram } from './use-referral-program'

vi.mock('core-kit/hooks/utils', () => ({
  useBrowserStorage: vi.fn(),
}))

describe('useReferralProgram', () => {
  it('should set referrer and ref vault to local storage', () => {
    const vaultAddress = '0x123'
    const userAddress = '0x111'
    const query = { ref: '0xref' }
    const logEvent = vi.fn()
    const tagInvestorByReferrer = vi.fn()
    const setReferredBy = vi.fn()
    const setRefPool = vi.fn()

    vi.mocked(useBrowserStorage)
      .mockImplementationOnce(
        () => [null, setReferredBy] as ReturnType<typeof useBrowserStorage>,
      )
      .mockImplementationOnce(
        () => [null, setRefPool] as ReturnType<typeof useBrowserStorage>,
      )

    renderHook(() =>
      useReferralProgram({
        vaultAddress,
        userAddress,
        query,
        logEvent,
        tagInvestorByReferrer,
      }),
    )

    expect(useBrowserStorage).toHaveBeenCalledTimes(2)
    expect(useBrowserStorage).toHaveBeenNthCalledWith(
      1,
      'localStorage',
      'referrer',
      '',
    )
    expect(useBrowserStorage).toHaveBeenNthCalledWith(
      2,
      'localStorage',
      'ref_pool',
      '',
    )
    expect(logEvent).toHaveBeenCalledTimes(1)
    expect(setReferredBy).toHaveBeenCalledTimes(1)
    expect(setReferredBy).toHaveBeenCalledWith('0xref')
    expect(setRefPool).toHaveBeenCalledTimes(1)
    expect(setRefPool).toHaveBeenCalledWith(vaultAddress)
  })

  it('should tag investor by referrer', async () => {
    const vaultAddress = '0x123'
    const userAddress = '0x111'
    const query = { ref: '0xref' }
    const tagInvestorByReferrer = vi.fn()

    vi.mocked(useBrowserStorage)
      .mockImplementationOnce(
        () => ['0xref', vi.fn()] as ReturnType<typeof useBrowserStorage>,
      )
      .mockImplementationOnce(
        () => [vaultAddress, vi.fn()] as ReturnType<typeof useBrowserStorage>,
      )

    renderHook(() =>
      useReferralProgram({
        vaultAddress,
        userAddress,
        query,
        tagInvestorByReferrer,
      }),
    )

    expect(tagInvestorByReferrer).toHaveBeenCalledTimes(1)
    expect(tagInvestorByReferrer).toHaveBeenCalledWith({
      investorAddress: userAddress,
      poolAddress: vaultAddress,
      referrerAddress: '0xref',
    })
  })
})
