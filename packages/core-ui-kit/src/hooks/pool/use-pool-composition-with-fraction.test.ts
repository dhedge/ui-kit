import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION, optimism } from 'const'
import * as poolHooks from 'hooks/pool'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { PoolComposition } from 'types'
import * as utils from 'utils'

import { getConventionalTokenPriceDecimals, shiftBy } from 'utils'

import {
  formatPoolComposition,
  usePoolCompositionWithFraction,
} from './use-pool-composition-with-fraction'

vi.mock('utils', () => ({
  formatToUsd: vi.fn(),
  getConventionalTokenPriceDecimals: vi.fn(),
  getPoolFraction: vi.fn(),
  shiftBy: vi.fn(),
  isSynthetixV3Asset: vi.fn(),
}))

vi.mock('./use-pool-dynamic-contract-data', () => ({
  usePoolDynamicContractData: vi.fn(),
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
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          totalSupply,
        }) as unknown as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
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
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          totalSupply,
        }) as unknown as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
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
        vaultTokensAmount: shiftBy(new BigNumber(vaultTokensAmount || 0)),
        totalSupply: totalSupply.toString(),
      }),
    )
  })
})
