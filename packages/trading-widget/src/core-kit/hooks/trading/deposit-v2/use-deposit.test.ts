import { act } from '@testing-library/react'
import { expect } from 'vitest'

import { BRIDGED_USDC_OPTIMISM, optimism } from 'core-kit/const'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'
import type { DynamicTradingToken } from 'core-kit/types'

import { renderHook } from 'tests/test-utils'

import { useDeposit } from './use-deposit'
import { useVaultDepositParams } from './use-vault-deposit-params'
import { useVaultDepositTransactionArguments } from './use-vault-deposit-transaction-arguments'

vi.mock('core-kit/hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
  useSendTokenInput: vi.fn(),
}))

vi.mock('core-kit/hooks/trading', () => ({
  useTradingSettleHandler: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useContractFunction: vi.fn(),
}))

vi.mock('./use-vault-deposit-params', () => ({
  useVaultDepositParams: vi.fn(),
}))

vi.mock('./use-vault-deposit-transaction-arguments', () => ({
  useVaultDepositTransactionArguments: vi.fn(),
}))

describe('useDeposit', () => {
  const chainId = optimism.id
  const updatePendingTransactionsMock = vi.fn()
  const onSettledMock = vi.fn()
  const sendMock = vi.fn()

  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () => ({ chainId }) as ReturnType<typeof useTradingPanelPoolConfig>,
    )
    vi.mocked(useTradingPanelTransactions).mockImplementation(() => [
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(useTradingSettleHandler).mockImplementation(() => onSettledMock)
    vi.mocked(useContractFunction).mockImplementation(
      () =>
        ({
          send: sendMock,
        }) as unknown as ReturnType<typeof useContractFunction>,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should process deposits', async () => {
    const depositMethod = 'depositWithCustomCooldown'
    const sendToken = { ...BRIDGED_USDC_OPTIMISM, value: '5', isLoading: false }
    const receiveToken = {
      symbol: 'USDy',
      address: '0x123',
      value: '10',
    } as unknown as DynamicTradingToken
    const depositArguments = ['0x1', '0x2', '1000']

    vi.mocked(useSendTokenInput).mockImplementationOnce(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(useReceiveTokenInput).mockImplementationOnce(() => [
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(useVaultDepositParams).mockReturnValueOnce({
      depositMethod,
      vaultDepositTokenAddress: '0x123',
    })
    vi.mocked(useVaultDepositTransactionArguments).mockReturnValueOnce(
      depositArguments,
    )

    const { result } = renderHook(() => useDeposit())

    expect(useVaultDepositTransactionArguments).toHaveBeenCalledTimes(1)
    expect(useVaultDepositTransactionArguments).toHaveBeenCalledWith({
      depositMethod,
      vaultDepositTokenAddress: '0x123',
    })
    expect(useTradingSettleHandler).toHaveBeenCalledTimes(1)
    expect(useTradingSettleHandler).toHaveBeenCalledWith('deposit')
    expect(useContractFunction).toHaveBeenCalledTimes(1)
    expect(useContractFunction).toHaveBeenCalledWith({
      contractId: 'easySwapperV2',
      functionName: depositMethod,
      onSettled: onSettledMock,
    })

    await act(async () => await result.current())

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'add',
      action: 'deposit',
      symbol: receiveToken.symbol,
      chainId,
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(...depositArguments)
  })
})
