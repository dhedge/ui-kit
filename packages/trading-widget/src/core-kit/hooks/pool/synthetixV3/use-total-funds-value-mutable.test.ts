import { optimism } from 'core-kit/const'
import * as web3Hooks from 'core-kit/hooks/web3'
import { renderHook } from 'tests/test-utils'

import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

vi.mock('core-kit/hooks/web3', () => ({
  useStaticCallQuery: vi.fn(),
}))

describe('useTotalFundValueMutable', () => {
  it('should call useTotalFundValueMutable with the correct parameters', () => {
    const managerLogicAddress = '0x012'
    const expectedResult = BigInt(100)
    vi.mocked(web3Hooks.useStaticCallQuery).mockImplementationOnce(
      () =>
        ({
          data: expectedResult,
          error: null,
        }) as ReturnType<typeof web3Hooks.useStaticCallQuery>,
    )

    const { result } = renderHook(() =>
      useTotalFundValueMutable({
        vaultManagerLogicAddress: managerLogicAddress,
        chainId: optimism.id,
      }),
    )

    expect(web3Hooks.useStaticCallQuery).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useStaticCallQuery).toHaveBeenCalledWith({
      dynamicContractAddress: managerLogicAddress,
      contractId: 'poolManagerLogic',
      chainId: optimism.id,
      functionName: 'totalFundValueMutable',
      args: [],
    })

    expect(result.current).toBe('100')
  })
})
