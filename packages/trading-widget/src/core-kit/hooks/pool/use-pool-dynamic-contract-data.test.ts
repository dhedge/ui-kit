import { formatDuration, intervalToDuration } from 'date-fns'

import { expect } from 'vitest'

import { DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES, optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import type { Address } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolsDynamic: vi.fn(),
}))
vi.mock('core-kit/hooks/pool', () => ({
  useManagerLogicAddress: vi.fn(),
  useTotalFundValueMutable: vi.fn(),
}))

describe('usePoolDynamicContractData', () => {
  it('should call usePoolsDynamic', () => {
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolsDynamic).mockImplementation(
      () =>
        ({
          data: {},
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolsDynamic>,
    )

    renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
        chainId,
      }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolsDynamic)).toHaveBeenCalledTimes(
      1,
    )
  })

  it('should resolve positive cooldown data', () => {
    const exitCooldown = '1'
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolsDynamic).mockImplementation(
      () =>
        ({
          data: {
            [TEST_ADDRESS]: {
              userBalance: '1',
              tokenPrice: '2',
              totalValue: '3',
              totalSupply: '4',
              isPrivateVault: true,
              performanceFee: '5',
              streamingFee: '6',
              entryFee: '7',
              exitFee: '10',
              getExitRemainingCooldown: exitCooldown,
            },
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolsDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
        chainId,
      }),
    )

    expect(result.current).toEqual(
      expect.objectContaining({
        cooldownActive: true,
        cooldownEndsInTime: formatDuration(
          intervalToDuration({ start: 0, end: Number(exitCooldown) * 1000 }),
        ),
        userBalance: '1',
        tokenPrice: '2',
        totalValue: '3',
        totalSupply: '4',
        isPrivateVault: true,
        performanceFee: '5',
        streamingFee: '6',
        entryFee: '7',
        exitFee: '10',
      }),
    )
  })

  it('should resolve zero cooldown data', () => {
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolsDynamic).mockImplementation(
      () =>
        ({
          data: {},
        }) as ReturnType<typeof poolMulticallHooks.usePoolsDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
        chainId,
      }),
    )

    expect(result.current).toEqual(
      expect.objectContaining({
        cooldownActive: false,
        cooldownEndsInTime: formatDuration(
          intervalToDuration({ start: 0, end: 0 }),
        ),
      }),
    )
  })

  it('should return parsed fund summary data for synthetix v3 vault', () => {
    const exitCooldown = undefined
    const chainId = optimism.id
    const isFetched = true
    const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
    const managerLogicAddress = '0x123' as Address
    const customTotalFundValue = '1111111'

    vi.mocked(poolMulticallHooks.usePoolsDynamic).mockImplementation(
      () =>
        ({
          data: {
            [address]: {
              userBalance: '1',
              tokenPrice: '2',
              totalValue: '3',
              totalSupply: '4',
              isPrivateVault: true,
              performanceFee: '5',
              streamingFee: '6',
              entryFee: '7',
              exitFee: '10',
              getExitRemainingCooldown: exitCooldown,
            },
          },
          isFetched: true,
        }) as ReturnType<typeof poolMulticallHooks.usePoolsDynamic>,
    )

    vi.mocked(poolHooks.useManagerLogicAddress).mockImplementationOnce(
      () => managerLogicAddress,
    )
    vi.mocked(poolHooks.useTotalFundValueMutable).mockImplementationOnce(
      () => customTotalFundValue,
    )

    const { result } = renderHook(() =>
      usePoolDynamicContractData({
        address,
        chainId,
      }),
    )

    expect(poolHooks.useManagerLogicAddress).toHaveBeenCalledWith({
      address,
      chainId,
    })

    expect(poolHooks.useTotalFundValueMutable).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: false }),
    )

    expect(result.current).toEqual(
      expect.objectContaining({
        totalValue: customTotalFundValue,
        isFetched,
      }),
    )
  })
})
