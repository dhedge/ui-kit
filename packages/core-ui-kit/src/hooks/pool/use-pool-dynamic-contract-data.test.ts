import { formatDuration, intervalToDuration } from 'date-fns'

import { expect } from 'vitest'

import { DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES, optimism } from 'const'
import * as poolHooks from 'hooks/pool'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { Address } from 'types'

import {
  getDataFromSummary,
  usePoolDynamicContractData,
} from './use-pool-dynamic-contract-data'

vi.mock('hooks/pool/multicall', () => ({
  usePoolDynamic: vi.fn(),
}))
vi.mock('hooks/pool', () => ({
  useManagerLogicAddress: vi.fn(),
  useTotalFundValueMutable: vi.fn(),
}))

describe('getDataFromSummary', () => {
  it('should parse summary data', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    expect(getDataFromSummary(summary)).toEqual({
      isPrivate: summary.privatePool,
      performanceFee: summary.performanceFeeNumerator.toString(),
      streamingFee: summary.managerFeeNumerator.toString(),
      totalSupply: summary.totalSupply.toString(),
      totalValue: summary.totalFundValue.toString(),
      entryFee: summary.entryFeeNumerator.toString(),
    })
  })
})

describe('usePoolDynamicContractData', () => {
  it('should call getExitRemainingCooldown and getFundSummary methods on PoolLogicAbi', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    const exitCooldown = BigInt(1)
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            getExitRemainingCooldown: exitCooldown,
            getFundSummary: summary,
          },
          isFetched: true,
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
        chainId,
      }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolDynamic)).toHaveBeenCalledTimes(
      1,
    )
    expect(vi.mocked(poolMulticallHooks.usePoolDynamic)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })
  })

  it('should resolve positive cooldown data', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    const exitCooldown = BigInt(1)
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            getExitRemainingCooldown: exitCooldown,
            getFundSummary: summary,
          },
          isFetched: true,
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
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
      }),
    )
  })

  it('should resolve zero cooldown data', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    const exitCooldown = undefined
    const chainId = optimism.id

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            getExitRemainingCooldown: exitCooldown,
            getFundSummary: summary,
          },
          isFetched: true,
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
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

  it('should return parsed fund summary data for non synthetix v3 vault', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    const exitCooldown = undefined
    const chainId = optimism.id
    const isFetched = true

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            getExitRemainingCooldown: exitCooldown,
            getFundSummary: summary,
          },
          isFetched,
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
        chainId,
      }),
    )

    expect(poolHooks.useManagerLogicAddress).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId,
    })

    expect(poolHooks.useTotalFundValueMutable).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
    )

    expect(result.current).toEqual(
      expect.objectContaining({
        ...getDataFromSummary(summary),
        isFetched,
      }),
    )
  })

  it('should return parsed fund summary data for synthetix v3 vault', () => {
    const summary = {
      creationTime: BigInt(0),
      exitFeeDenominator: BigInt(0),
      exitFeeNumerator: BigInt(0),
      manager: TEST_ADDRESS,
      managerFeeDenominator: BigInt(0),
      managerFeeNumerator: BigInt(0),
      managerName: 'managerName',
      name: 'name',
      performanceFeeNumerator: BigInt(0),
      privatePool: true,
      totalFundValue: BigInt(0),
      totalSupply: BigInt(0),
      entryFeeNumerator: BigInt(0),
    }
    const exitCooldown = undefined
    const chainId = optimism.id
    const isFetched = true
    const address = DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES[0] as Address
    const managerLogicAddress = '0x123' as Address
    const customTotalFundValue = '1111111'

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            getExitRemainingCooldown: exitCooldown,
            getFundSummary: summary,
          },
          isFetched,
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
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
        ...getDataFromSummary(summary),
        totalValue: customTotalFundValue,
        isFetched,
      }),
    )
  })
})
