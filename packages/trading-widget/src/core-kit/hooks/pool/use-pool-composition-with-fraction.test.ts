import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import type { PoolComposition } from 'core-kit/types'
import * as utils from 'core-kit/utils'

import { getConventionalTokenPriceDecimals, shiftBy } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import {
  formatPoolComposition,
  usePoolCompositionWithFraction,
} from './use-pool-composition-with-fraction'

vi.mock('core-kit/utils', () => ({
  formatToUsd: vi.fn(),
  getConventionalTokenPriceDecimals: vi.fn(),
  getPoolFraction: vi.fn(),
  shiftBy: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolDynamic: vi.fn(),
}))

vi.mock('./use-pool-composition', () => ({
  usePoolComposition: vi.fn(),
}))

describe('formatPoolComposition', () => {
  it('should enhance composition with extra fraction/fractionUsd data', async () => {
    const poolComposition: PoolComposition = {
      tokenName: 'tokenName',
      rate: 'rate',
      amount: 'amount',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['iconSymbol'],
      },
    }
    const fraction = 1
    const fractionUsd = '2'

    vi.mocked(utils.getPoolFraction).mockImplementation(() => fraction)
    vi.mocked(utils.formatToUsd).mockImplementation(() => fractionUsd)

    expect(
      formatPoolComposition({
        composition: [poolComposition],
        vaultTokensAmount: 'assetAmount',
        totalSupply: 'totalSupply',
      }),
    ).toEqual([
      {
        ...poolComposition,
        fraction: fraction.toFixed(getConventionalTokenPriceDecimals(fraction)),
        fractionUsd,
        fractionUsdNumber: fraction,
      },
    ])
  })

  it('should filter out zero amount assets', async () => {
    const poolComposition: PoolComposition = {
      tokenName: 'USDC',
      rate: '999',
      amount: '100',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['iconSymbol'],
      },
    }
    const zeroAmountPoolComposition: PoolComposition = {
      tokenName: 'DAI',
      rate: '998',
      amount: '0',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['iconSymbol'],
      },
    }
    const fraction = 1
    const fractionUsd = '2'

    vi.mocked(utils.getPoolFraction).mockImplementation(() => fraction)
    vi.mocked(utils.formatToUsd).mockImplementation(() => fractionUsd)

    expect(
      formatPoolComposition({
        composition: [poolComposition, zeroAmountPoolComposition],
        vaultTokensAmount: 'assetAmount',
        totalSupply: 'totalSupply',
      }),
    ).toEqual([
      {
        ...poolComposition,
        fraction: fraction.toFixed(getConventionalTokenPriceDecimals(fraction)),
        fractionUsd,
        fractionUsdNumber: fraction,
      },
    ])
  })
})

describe('usePoolCompositionWithFraction', () => {
  beforeEach(() => {
    vi.doMock('./use-pool-composition-with-fraction', () => ({
      formatPoolComposition: () => 'formatPoolComposition',
    }))
  })

  it('should return empty array for falsy totalSupply', async () => {
    const poolComposition: PoolComposition = {
      tokenName: 'tokenName',
      rate: '1',
      amount: '15',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['iconSymbol'],
      },
    }
    const vaultTokensAmount = '2'
    const totalSupply = undefined

    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      poolComposition,
    ])
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: { totalSupply },
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolCompositionWithFraction({
        address: TEST_ADDRESS,
        vaultTokensAmount,
        chainId: optimism.id,
      }),
    )

    expect(result.current).toEqual([])
  })

  it('should return formatted pool composition', async () => {
    const poolComposition: PoolComposition = {
      tokenName: 'tokenName',
      rate: '1',
      amount: '15',
      isDeposit: true,
      tokenAddress: TEST_ADDRESS,
      precision: DEFAULT_PRECISION,
      asset: {
        iconSymbols: ['iconSymbol'],
      },
    }
    const vaultTokensAmount = '2'
    const totalSupply = '10'
    const fraction = 1
    const fractionUsd = '2'

    vi.mocked(utils.getPoolFraction).mockImplementation(() => fraction)
    vi.mocked(utils.formatToUsd).mockImplementation(() => fractionUsd)
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      poolComposition,
    ])
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: { totalSupply },
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolCompositionWithFraction({
        address: TEST_ADDRESS,
        vaultTokensAmount,
        chainId: optimism.id,
      }),
    )

    expect(result.current).toEqual(
      formatPoolComposition({
        composition: [poolComposition],
        vaultTokensAmount: shiftBy(vaultTokensAmount || 0),
        totalSupply: totalSupply.toString(),
      }),
    )
  })
})
