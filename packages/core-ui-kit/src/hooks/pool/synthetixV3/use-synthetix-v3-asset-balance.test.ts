import { SYNTHETIX_V3_ASSET_ADDRESS, optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { useSynthetixV3AssetBalance } from './use-synthetix-v3-asset-balance'

vi.mock('hooks/web3', () => ({
  useStaticCall: vi.fn(),
}))

describe('useSynthetixV3AssetBalance', () => {
  it('should call useStaticCall with the correct parameters', () => {
    const vaultAddress = '0x01'
    const expectedResult = BigInt(10)
    vi.mocked(web3Hooks.useStaticCall).mockImplementationOnce(
      () => expectedResult,
    )

    const { result } = renderHook(() =>
      useSynthetixV3AssetBalance({
        vaultAddress,
        chainId: optimism.id,
        disabled: false,
      }),
    )
    expect(web3Hooks.useStaticCall).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useStaticCall).toHaveBeenCalledWith({
      chainId: optimism.id,
      contractId: 'synthetixV3AssetGuard',
      disabled: false,
      functionName: 'getBalanceMutable',
      args: [vaultAddress, SYNTHETIX_V3_ASSET_ADDRESS],
    })

    expect(result.current).toBe('10')
  })
})
