import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'

import type { PoolComposition } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolComposition } from './use-pool-composition'

vi.mock('./use-contract-pool-composition', () => ({
  useContractPoolComposition: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

describe('usePoolComposition', () => {
  it('should return pool composition from contract', () => {
    const contractPoolComposition: PoolComposition[] = [
      {
        tokenName: 'tokenName',
        rate: 'rate',
        amount: 'amount',
        isDeposit: true,
        tokenAddress: TEST_ADDRESS,
        precision: DEFAULT_PRECISION,
        asset: {
          iconSymbols: ['iconSymbol'],
        },
      },
    ]
    const fallbackComposition: PoolComposition[] = [
      {
        tokenName: 'fallback_tokenName',
        rate: 'fallback_rate',
        amount: 'fallback_amount',
        isDeposit: true,
        tokenAddress: TEST_ADDRESS,
        precision: DEFAULT_PRECISION,
        asset: {
          iconSymbols: ['fallback_iconSymbol'],
        },
      },
    ]

    vi.mocked(poolHooks.useContractPoolComposition).mockImplementation(
      () => contractPoolComposition,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () => [
        { poolCompositions: fallbackComposition, address: TEST_ADDRESS },
        vi.fn(),
      ],
    )

    const { result } = renderHook(() =>
      usePoolComposition({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(result.current).toEqual(contractPoolComposition)
  })

  it('should return fallback pool composition', () => {
    const contractPoolComposition: PoolComposition[] = []
    const fallbackComposition: PoolComposition[] = [
      {
        tokenName: 'fallback_tokenName',
        rate: 'fallback_rate',
        amount: 'fallback_amount',
        isDeposit: true,
        tokenAddress: TEST_ADDRESS,
        precision: DEFAULT_PRECISION,
        asset: {
          iconSymbols: ['fallback_iconSymbol'],
        },
      },
    ]

    vi.mocked(poolHooks.useContractPoolComposition).mockImplementation(
      () => contractPoolComposition,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () => [
        { poolCompositions: fallbackComposition, address: TEST_ADDRESS },
        vi.fn(),
      ],
    )

    const { result } = renderHook(() =>
      usePoolComposition({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(result.current).toEqual(fallbackComposition)
  })

  it('should return empty pool composition', () => {
    const contractPoolComposition: PoolComposition[] = []
    const fallbackComposition = undefined

    vi.mocked(poolHooks.useContractPoolComposition).mockImplementation(
      () => contractPoolComposition,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () => [
        { poolCompositions: fallbackComposition, address: TEST_ADDRESS },
        vi.fn(),
      ],
    )

    const { result } = renderHook(() =>
      usePoolComposition({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(result.current).toEqual([])
  })
})
