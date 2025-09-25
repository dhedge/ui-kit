import { act } from '@testing-library/react'

import { stringToHex } from 'viem'

import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useMinVaultTokensReceivedAmount } from 'core-kit/hooks/trading/deposit-v2/use-min-vault-tokens-received-amount'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2/use-swap-data-based-on-send-token'
import { useVaultDepositTokenAmount } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-token-amount'
import { useVaultDepositTransactionArguments } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-transaction-arguments'
import type { VaultDepositParams } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))
vi.mock('./use-applied-deposit-slippage', () => ({
  useAppliedDepositSlippage: vi.fn(),
}))
vi.mock('./use-min-vault-tokens-received-amount', () => ({
  useMinVaultTokensReceivedAmount: vi.fn(),
}))
vi.mock('./use-swap-data-based-on-send-token', () => ({
  useSwapDataBasedOnSendToken: vi.fn(),
}))
vi.mock('./use-vault-deposit-token-amount', () => ({
  useVaultDepositTokenAmount: vi.fn(),
}))

describe('useVaultDepositTransactionArguments', () => {
  const sendToken = { value: '100', decimals: 0, address: '0x123' }
  const vaultDepositTokenAmount = '100'
  const swapData = {
    rawTransaction: {
      data: '0x123123123123123',
    },
    routerKey: 'ZERO_X',
    destinationAmount: '100',
  }
  const minVaultTokensReceivedAmount = '50'
  const depositSlippage = 1
  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId: 1, address: TEST_ADDRESS }) as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
    vi.mocked(useSendTokenInput).mockReturnValue([
      sendToken,
    ] as unknown as ReturnType<typeof useSendTokenInput>)
    vi.mocked(useVaultDepositTokenAmount).mockReturnValue(
      vaultDepositTokenAmount,
    )
    vi.mocked(useSwapDataBasedOnSendToken).mockReturnValue({
      data: swapData,
    } as unknown as ReturnType<typeof useSwapDataBasedOnSendToken>)
    vi.mocked(useMinVaultTokensReceivedAmount).mockReturnValue(
      minVaultTokensReceivedAmount,
    )
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(depositSlippage)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return arguments for native deposit', () => {
    const depositParams: VaultDepositParams = {
      depositMethod: 'nativeDeposit',
      vaultDepositTokenAddress: '0x111',
    }

    const { result, rerender } = renderHook(
      ({ depositParams }) => useVaultDepositTransactionArguments(depositParams),
      {
        initialProps: { depositParams },
      },
    )
    const expectedDepositArguments = [
      TEST_ADDRESS,
      minVaultTokensReceivedAmount,
      { value: vaultDepositTokenAmount },
    ]

    expect(result.current).toEqual(expectedDepositArguments)

    const customCooldownDepositParams: VaultDepositParams = {
      depositMethod: 'nativeDepositWithCustomCooldown',
      vaultDepositTokenAddress: '0x111',
    }
    act(() => rerender({ depositParams: customCooldownDepositParams }))

    expect(result.current).toEqual(expectedDepositArguments)
  })

  it('should return arguments for zap native deposit', () => {
    const depositParams: VaultDepositParams = {
      depositMethod: 'zapNativeDeposit',
      vaultDepositTokenAddress: '0x111',
    }

    const { result, rerender } = renderHook(
      ({ depositParams }) => useVaultDepositTransactionArguments(depositParams),
      {
        initialProps: { depositParams },
      },
    )

    const expectedDepositArguments = [
      TEST_ADDRESS,
      [
        [
          sendToken.address,
          sendToken.value,
          [
            stringToHex(swapData.routerKey, { size: 32 }),
            swapData.rawTransaction.data,
          ],
        ],
        [depositParams.vaultDepositTokenAddress, '99'],
      ],
      minVaultTokensReceivedAmount,
      { value: sendToken.value },
    ]

    expect(result.current).toEqual(expectedDepositArguments)

    const customCooldownDepositParams: VaultDepositParams = {
      depositMethod: 'zapNativeDepositWithCustomCooldown',
      vaultDepositTokenAddress: '0x111',
    }
    act(() => rerender({ depositParams: customCooldownDepositParams }))

    expect(result.current).toEqual(expectedDepositArguments)
  })

  it('should return arguments for zap deposit', () => {
    const depositParams: VaultDepositParams = {
      depositMethod: 'zapDeposit',
      vaultDepositTokenAddress: '0x111',
    }

    const { result, rerender } = renderHook(
      ({ depositParams }) => useVaultDepositTransactionArguments(depositParams),
      {
        initialProps: { depositParams },
      },
    )

    const expectedDepositArguments = [
      TEST_ADDRESS,
      [
        [
          sendToken.address,
          sendToken.value,
          [
            stringToHex(swapData.routerKey, { size: 32 }),
            swapData.rawTransaction.data,
          ],
        ],
        [depositParams.vaultDepositTokenAddress, '99'],
      ],
      minVaultTokensReceivedAmount,
    ]

    expect(result.current).toEqual(expectedDepositArguments)

    const customCooldownDepositParams: VaultDepositParams = {
      depositMethod: 'zapDepositWithCustomCooldown',
      vaultDepositTokenAddress: '0x111',
    }
    act(() => rerender({ depositParams: customCooldownDepositParams }))

    expect(result.current).toEqual(expectedDepositArguments)
  })

  it('should return arguments for default deposits', () => {
    const depositParams: VaultDepositParams = {
      depositMethod: 'deposit',
      vaultDepositTokenAddress: '0x111',
    }

    const { result, rerender } = renderHook(
      ({ depositParams }) => useVaultDepositTransactionArguments(depositParams),
      {
        initialProps: { depositParams },
      },
    )
    const expectedDepositArguments = [
      TEST_ADDRESS,
      depositParams.vaultDepositTokenAddress,
      vaultDepositTokenAmount,
      minVaultTokensReceivedAmount,
    ]

    expect(result.current).toEqual(expectedDepositArguments)

    const customCooldownDepositParams: VaultDepositParams = {
      depositMethod: 'depositWithCustomCooldown',
      vaultDepositTokenAddress: '0x111',
    }
    act(() => rerender({ depositParams: customCooldownDepositParams }))

    expect(result.current).toEqual(expectedDepositArguments)
  })
})
