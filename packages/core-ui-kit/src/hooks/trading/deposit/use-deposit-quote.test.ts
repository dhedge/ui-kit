import { act } from '@testing-library/react'
import BigNumber from 'bignumber.js'

import { expect } from 'vitest'

import { DhedgeEasySwapperAbi } from 'abi'
import { AddressZero, optimism } from 'const'
import * as poolHooks from 'hooks/pool'
import { usePoolTokenPrice } from 'hooks/pool'
import * as stateHooks from 'hooks/state'
import { usePoolDepositAssetAddress } from 'hooks/trading/deposit'
import { useContractReads } from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'
import type { Address, DynamicTradingToken } from 'types'

import { useDepositQuote } from './use-deposit-quote'
import { useAssetPrice } from '../use-asset-price'
import { useIsEasySwapperTrading } from '../use-is-easy-swapper-trading'

vi.mock('hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolFallbackData: vi.fn(),
  useTradingPanelSettings: vi.fn().mockImplementation(() => []),
  useTradingPanelPoolConfig: vi.fn(),
}))
vi.mock('hooks/utils', () => ({
  useDebounce: vi.fn().mockImplementation((v) => v),
}))
vi.mock('hooks/web3', () => ({
  useContractReads: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))
vi.mock('hooks/trading/deposit', () => ({
  usePoolDepositAssetAddress: vi.fn(),
}))
vi.mock('hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))
vi.mock('../use-is-easy-swapper-trading', () => ({
  useIsEasySwapperTrading: vi.fn(),
}))
vi.mock('../use-asset-price', () => ({
  useAssetPrice: vi.fn(),
}))

describe('useDepositQuote', () => {
  it('should update receive token input based on deposit quote with default multiplier', () => {
    const isDeposit = true
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()
    expect(isDeposit).toBe(true)
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => isDeposit,
    )
    vi.mocked(usePoolDepositAssetAddress).mockImplementation(
      () => sendToken.address,
    )
    vi.mocked(useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof useContractReads>,
    )
    vi.mocked(useIsEasySwapperTrading).mockImplementation(() => true)

    const { rerender } = renderHook(() =>
      useDepositQuote({
        address: TEST_ADDRESS,
        chainId: optimism.id,
        depositParams: { customTokens: [] },
      }),
    )
    expect(usePoolDepositAssetAddress).toHaveBeenCalledTimes(1)
    expect(usePoolDepositAssetAddress).toHaveBeenCalledWith({
      investAssetAddress: sendToken.address,
      symbol: sendToken.symbol,
      productPoolAddress: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(useContractReads).toHaveBeenCalledTimes(1)
    expect(useContractReads).toHaveBeenCalledWith({
      watch: true,
      enabled: true,
      contracts: [
        expect.objectContaining({
          abi: DhedgeEasySwapperAbi,
          functionName: 'depositQuote',
          chainId: optimism.id,
          args: [
            TEST_ADDRESS,
            sendToken.address,
            BigInt(
              new BigNumber(sendToken.value)
                .shiftedBy(sendToken.decimals)
                .toFixed(0),
            ),
            sendToken.address,
            false,
          ],
        }),
      ],
    })
    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(2)
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(1, {
      isLoading: false,
    })
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(2, {
      value: '99.970',
    })
    vi.mocked(useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: BigInt(500000) }],
        }) as ReturnType<typeof useContractReads>,
    )
    act(() => rerender())
    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(4)
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(4, {
      value: '499.850',
    })
  })

  it('should update receive token input based on deposit quote with custom multiplier', () => {
    const isDeposit = true
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()
    expect(isDeposit).toBe(true)
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => isDeposit,
    )
    vi.mocked(usePoolDepositAssetAddress).mockImplementation(
      () => AddressZero, // sendToken.address !== poolDepositAssetAddress
    )
    vi.mocked(useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof useContractReads>,
    )

    renderHook(() =>
      useDepositQuote({
        address: TEST_ADDRESS,
        chainId: optimism.id,
        depositParams: {
          method: 'depositWithCustomCooldown',
          customTokens: [],
        },
      }),
    )
    expect(useContractReads).toHaveBeenCalledWith({
      watch: true,
      enabled: true,
      contracts: [
        expect.objectContaining({
          args: [
            TEST_ADDRESS,
            sendToken.address,
            BigInt(
              new BigNumber(sendToken.value)
                .shiftedBy(sendToken.decimals)
                .toFixed(0),
            ),
            AddressZero,
            true,
          ],
        }),
      ],
    })
    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(2)
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(1, {
      isLoading: false,
    })
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(2, {
      value: '99.900',
    })
  })

  it('should not update receive token input when trading type is "withdraw"', () => {
    const isDeposit = false
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()
    expect(isDeposit).toBe(false)
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => isDeposit,
    )
    vi.mocked(usePoolDepositAssetAddress).mockImplementation(
      () => receiveToken.address as Address,
    )
    vi.mocked(useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof useContractReads>,
    )

    renderHook(() =>
      useDepositQuote({
        address: TEST_ADDRESS,
        chainId: optimism.id,
        depositParams: { customTokens: [] },
      }),
    )

    expect(updateReceiveTokenMock).not.toHaveBeenCalled()
  })

  it('should set receive token value and slippage to 0 when send token value is not defined', () => {
    const isDeposit = false
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()
    const updateTradingSettingsMock = vi.fn()
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => isDeposit,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementationOnce(() => [
      {
        slippage: 'auto',
        isInfiniteAllowance: false,
        isMultiAssetWithdrawalEnabled: false,
        isMaxSlippageLoading: false,
      },
      updateTradingSettingsMock,
    ])
    vi.mocked(usePoolDepositAssetAddress).mockImplementation(
      () => receiveToken.address as Address,
    )
    vi.mocked(useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof useContractReads>,
    )

    renderHook(() =>
      useDepositQuote({
        address: TEST_ADDRESS,
        chainId: optimism.id,
        depositParams: { customTokens: [] },
      }),
    )

    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ value: '0' })
    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateTradingSettingsMock).toHaveBeenCalledWith({ minSlippage: 0 })
  })

  it('should update receive token input for synthetix vault', () => {
    const isDeposit = true
    const sendToken: DynamicTradingToken = {
      symbol: 'USDC',
      address: '0x123',
      decimals: 6,
      value: '100',
      isLoading: false,
    }
    const receiveToken: DynamicTradingToken = {
      symbol: 'USDy',
      address: '0x111',
      decimals: 3,
      value: '50',
      isLoading: false,
    }
    const updateReceiveTokenMock = vi.fn()
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      updateReceiveTokenMock,
    ])
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => isDeposit,
    )
    vi.mocked(usePoolDepositAssetAddress).mockImplementation(
      () => sendToken.address,
    )
    vi.mocked(useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof useContractReads>,
    )
    vi.mocked(useIsEasySwapperTrading).mockImplementation(() => false)
    vi.mocked(poolHooks.usePoolTokenPrice).mockImplementation(() => '100')
    vi.mocked(useAssetPrice).mockImplementation(() => '100')

    renderHook(() =>
      useDepositQuote({
        address: receiveToken.address,
        chainId: optimism.id,
        depositParams: { customTokens: [] },
      }),
    )
    expect(usePoolTokenPrice).toHaveBeenCalledTimes(1)
    expect(usePoolTokenPrice).toHaveBeenCalledWith({
      address: receiveToken.address,
      chainId: optimism.id,
      disabled: false,
    })
    expect(useAssetPrice).toHaveBeenCalledTimes(1)
    expect(useAssetPrice).toHaveBeenCalledWith({
      address: sendToken.address,
      chainId: optimism.id,
      disabled: false,
    })
    expect(useContractReads).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(updateReceiveTokenMock).toHaveBeenCalledTimes(1)
    expect(updateReceiveTokenMock).toHaveBeenNthCalledWith(1, {
      value: '100.000',
    })
  })
})
