import { act } from '@testing-library/react'

import {
  AddressZero,
  BRIDGED_USDC_OPTIMISM,
  base,
  contractsAddressesMap,
} from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import * as allowanceHooks from 'core-kit/hooks/trading/allowance'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useDepositAllowance } from './use-deposit-allowance'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelApprovingStatus: vi.fn(),
  useTradingPanelPoolConfig: vi.fn().mockImplementation(
    () =>
      ({
        chainId,
      }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
  ),
}))

vi.mock('core-kit/hooks/trading/allowance', () => ({
  useApprove: vi.fn(),
  useCanSpend: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn().mockImplementation(() => ({ account: TEST_ADDRESS })),
}))
vi.mock('../use-is-easy-swapper-trading', () => ({
  useIsEasySwapperTrading: vi.fn(),
}))
const chainId = base.id

describe('useDepositAllowance', () => {
  it('should return approve fn and check send token allowance when token is not native', () => {
    const sendToken = { ...BRIDGED_USDC_OPTIMISM, value: '1', isLoading: false }
    const canSpend = true
    const updateApprovingStatusMock = vi.fn()
    const approveMock = vi.fn()

    vi.mocked(stateHooks.useSendTokenInput).mockImplementationOnce(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockImplementationOnce(
      () => ['pending', updateApprovingStatusMock],
    )
    vi.mocked(allowanceHooks.useCanSpend).mockImplementationOnce(() => canSpend)
    vi.mocked(allowanceHooks.useApprove).mockImplementationOnce(
      () => approveMock,
    )
    vi.mocked(allowanceHooks.useApprove).mockImplementationOnce(
      () => approveMock,
    )

    const { result } = renderHook(() => useDepositAllowance())

    expect(allowanceHooks.useCanSpend).toHaveBeenCalledTimes(1)
    expect(allowanceHooks.useCanSpend).toHaveBeenCalledWith({
      tokenAddress: sendToken.address,
      ownerAddress: TEST_ADDRESS,
      spenderAddress: contractsAddressesMap[chainId]?.easySwapperV2,
      rawAmountToSpend: '1000000',
      chainId,
      skip: false,
    })
    expect(allowanceHooks.useApprove).toHaveBeenCalledTimes(1)
    expect(allowanceHooks.useApprove).toHaveBeenCalledWith({
      token: sendToken,
      rawTokenAmount: '1000000',
      spenderAddress: contractsAddressesMap[chainId]?.easySwapperV2,
    })
    expect(updateApprovingStatusMock).toHaveBeenCalledTimes(1)
    expect(updateApprovingStatusMock).toHaveBeenCalledWith('success')
    expect(result.current.canSpend).toEqual(canSpend)
    act(() => result.current.approve())
    expect(approveMock).toHaveBeenCalledTimes(1)
  })

  it('should not check send token allowance when token is native', () => {
    const chainId = base.id
    const sendToken = {
      symbol: 'ETH',
      value: '1',
      isLoading: false,
      address: AddressZero,
      decimals: 3,
    }
    const updateApprovingStatusMock = vi.fn()

    vi.mocked(stateHooks.useSendTokenInput).mockImplementationOnce(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockImplementationOnce(
      () => ['success', updateApprovingStatusMock],
    )
    vi.mocked(allowanceHooks.useApprove).mockImplementationOnce(() => vi.fn())

    renderHook(() => useDepositAllowance())

    expect(allowanceHooks.useCanSpend).toHaveBeenCalledTimes(1)
    expect(allowanceHooks.useCanSpend).toHaveBeenCalledWith({
      tokenAddress: sendToken.address,
      ownerAddress: TEST_ADDRESS,
      spenderAddress: contractsAddressesMap[chainId]?.easySwapperV2,
      rawAmountToSpend: '1000',
      chainId,
      skip: true,
    })
    expect(updateApprovingStatusMock).toHaveBeenCalledTimes(1)
    expect(updateApprovingStatusMock).toHaveBeenCalledWith(undefined)
  })
})
