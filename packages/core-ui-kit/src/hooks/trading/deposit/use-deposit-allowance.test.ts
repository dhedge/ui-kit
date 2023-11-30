import { act } from '@testing-library/react'

import {
  AddressZero,
  BRIDGED_USDC_OPTIMISM,
  contractsAddressesMap,
  optimism,
} from 'const'
import * as stateHooks from 'hooks/state'
import * as allowanceHooks from 'hooks/trading/allowance'
import { useAccount } from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useDepositAllowance } from './use-deposit-allowance'

vi.mock('hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelApprovingStatus: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('hooks/trading/allowance', () => ({
  useApprove: vi.fn(),
  useCanSpend: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useAccount: vi.fn(),
}))
const chainId = optimism.id

describe('useDepositAllowance', () => {
  beforeEach(() => {
    vi.mocked(useAccount).mockImplementationOnce(
      () => ({ account: TEST_ADDRESS }) as ReturnType<typeof useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementationOnce(
      () =>
        ({
          chainId,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
  })

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

    const { result } = renderHook(() => useDepositAllowance())

    expect(allowanceHooks.useCanSpend).toHaveBeenCalledTimes(1)
    expect(allowanceHooks.useCanSpend).toHaveBeenCalledWith({
      tokenAddress: sendToken.address,
      ownerAddress: TEST_ADDRESS,
      spenderAddress: contractsAddressesMap[chainId]?.easySwapper,
      rawAmountToSpend: '1000000',
      chainId,
      skip: false,
    })
    expect(allowanceHooks.useApprove).toHaveBeenCalledTimes(1)
    expect(allowanceHooks.useApprove).toHaveBeenCalledWith({
      token: sendToken,
      rawTokenAmount: '1000000',
      spenderAddress: contractsAddressesMap[chainId]?.easySwapper,
    })
    expect(updateApprovingStatusMock).toHaveBeenCalledTimes(1)
    expect(updateApprovingStatusMock).toHaveBeenCalledWith('success')
    expect(result.current.canSpend).toEqual(canSpend)
    act(() => result.current.approve())
    expect(approveMock).toHaveBeenCalledTimes(1)
  })

  it('should not check send token allowance when token is native', () => {
    const chainId = optimism.id
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
      spenderAddress: contractsAddressesMap[chainId]?.easySwapper,
      rawAmountToSpend: '1000',
      chainId,
      skip: true,
    })
    expect(updateApprovingStatusMock).toHaveBeenCalledTimes(1)
    expect(updateApprovingStatusMock).toHaveBeenCalledWith(undefined)
  })
})
