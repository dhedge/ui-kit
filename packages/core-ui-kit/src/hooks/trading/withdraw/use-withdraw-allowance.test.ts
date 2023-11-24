import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION, optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as allowanceHooks from 'hooks/trading/allowance'
import * as withdrawHooks from 'hooks/trading/withdraw'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import type { TradingToken } from 'types'

import { getContractAddressById } from 'utils'

import { useWithdrawAllowance } from './use-withdraw-allowance'

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

vi.mock('./use-is-multi-asset-withdraw', () => ({
  useIsMultiAssetWithdraw: vi.fn(),
}))

describe('useWithdrawAllowance', () => {
  it('should return positive canSpend flag', () => {
    const account = TEST_ADDRESS
    const isMultiAssetsWithdraw = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolConfig = { chainId: optimism.id }
    const canSpend = true
    const updateApprovingStatusMock = vi.fn()

    expect(canSpend).toBe(true)

    vi.mocked(web3Hooks.useAccount).mockReturnValue({
      account,
    } as unknown as ReturnType<typeof web3Hooks.useAccount>)
    vi.mocked(withdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      updateApprovingStatusMock,
    ])
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(allowanceHooks.useCanSpend).mockReturnValue(canSpend)

    const { result } = renderHook(() => useWithdrawAllowance())

    expect(result.current.canSpend).toEqual(canSpend)
    expect(vi.mocked(allowanceHooks.useCanSpend)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(allowanceHooks.useCanSpend)).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenAddress: sendToken.address,
        ownerAddress: account,
        spenderAddress: getContractAddressById(
          'easySwapper',
          poolConfig.chainId,
        ),
        rawAmountToSpend: new BigNumber(sendToken.value)
          .shiftedBy(sendToken.decimals)
          .toFixed(0, BigNumber.ROUND_UP),
        chainId: poolConfig.chainId,
        skip: false,
      }),
    )
    expect(updateApprovingStatusMock).toHaveBeenCalledWith('success')
  })

  it('should return negative canSpend flag', () => {
    const account = TEST_ADDRESS
    const isMultiAssetsWithdraw = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolConfig = { chainId: optimism.id }
    const canSpend = false
    const updateApprovingStatusMock = vi.fn()

    expect(canSpend).toBe(false)

    vi.mocked(web3Hooks.useAccount).mockReturnValue({
      account,
    } as unknown as ReturnType<typeof web3Hooks.useAccount>)
    vi.mocked(withdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      updateApprovingStatusMock,
    ])
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(allowanceHooks.useCanSpend).mockReturnValue(canSpend)

    const { result } = renderHook(() => useWithdrawAllowance())

    expect(result.current.canSpend).toEqual(canSpend)
    expect(vi.mocked(allowanceHooks.useCanSpend)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(allowanceHooks.useCanSpend)).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenAddress: sendToken.address,
        ownerAddress: account,
        spenderAddress: getContractAddressById(
          'easySwapper',
          poolConfig.chainId,
        ),
        rawAmountToSpend: new BigNumber(sendToken.value)
          .shiftedBy(sendToken.decimals)
          .toFixed(0, BigNumber.ROUND_UP),
        chainId: poolConfig.chainId,
        skip: false,
      }),
    )
    expect(updateApprovingStatusMock).toHaveBeenCalledWith(undefined)
  })

  it('should return approve cb', () => {
    const account = TEST_ADDRESS
    const isMultiAssetsWithdraw = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolConfig = { chainId: optimism.id }
    const canSpend = true
    const updateApprovingStatusMock = vi.fn()
    const approveMock = vi.fn(() => Promise.resolve())

    vi.mocked(web3Hooks.useAccount).mockReturnValue({
      account,
    } as unknown as ReturnType<typeof web3Hooks.useAccount>)
    vi.mocked(withdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      updateApprovingStatusMock,
    ])
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(allowanceHooks.useCanSpend).mockReturnValue(canSpend)
    vi.mocked(allowanceHooks.useApprove).mockReturnValue(approveMock)

    const { result } = renderHook(() => useWithdrawAllowance())

    expect(result.current.approve).toEqual(approveMock)
    expect(vi.mocked(allowanceHooks.useApprove)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(allowanceHooks.useApprove)).toHaveBeenCalledWith({
      token: sendToken,
      rawTokenAmount: new BigNumber(sendToken.value || '0')
        .shiftedBy(sendToken.decimals)
        .toFixed(0, BigNumber.ROUND_UP),
      spenderAddress: getContractAddressById('easySwapper', poolConfig.chainId),
    })
  })
})
