import { optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

vi.mock('hooks/web3', () => ({
  useStaticCall: vi.fn(),
}))

describe('useTotalFundValueMutable', () => {
  it('should call useTotalFundValueMutable with the correct parameters', () => {
    const managerLogicAddress = '0x012'
    const expectedResult = BigInt(100)
    vi.mocked(web3Hooks.useStaticCall).mockImplementationOnce(
      () => expectedResult,
    )

    const { result } = renderHook(() =>
      useTotalFundValueMutable({
        vaultManagerLogicAddress: managerLogicAddress,
        chainId: optimism.id,
      }),
    )

    expect(web3Hooks.useStaticCall).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useStaticCall).toHaveBeenCalledWith({
      dynamicContractAddress: managerLogicAddress,
      contractId: 'poolManagerLogic',
      chainId: optimism.id,
      functionName: 'totalFundValueMutable',
      args: [],
    })

    expect(result.current).toBe('100')
  })
})
