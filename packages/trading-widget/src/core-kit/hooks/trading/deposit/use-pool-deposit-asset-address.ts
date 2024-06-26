import { useMemo } from 'react'

import {
  BRIDGED_USDC_ARBITRUM,
  BRIDGED_USDC_OPTIMISM,
  BRIDGED_USDC_POLYGON,
  DAI_OPTIMISM,
  DAI_POLYGON,
  USDC_ARBITRUM,
  USDC_BASE,
  USDC_OPTIMISM,
  USDC_POLYGON,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC_ARBITRUM,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_ARBITRUM,
  WETH_BASE,
  WETH_OPTIMISM,
  WETH_POLYGON,
  WMATIC_POLYGON,
  arbitrum,
  base,
  optimism,
  polygon,
} from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool'
import type { TradingToken } from 'core-kit/types/trading-panel.types'
import type { Address, ChainId } from 'core-kit/types/web3.types'

const FALLBACK_ASSET_SYMBOLS = [
  'WMATIC',
  'WETH',
  'USDCe',
  'USDC',
  'USDT',
  'DAI',
  'WBTC',
]
const FALLBACK_ASSETS_ADRESSES_MAP: Record<
  ChainId,
  Record<string, TradingToken>
> = {
  [optimism.id]: {
    WETH: WETH_OPTIMISM,
    USDC: USDC_OPTIMISM,
    USDCe: BRIDGED_USDC_OPTIMISM,
    USDT: USDT_OPTIMISM,
    DAI: DAI_OPTIMISM,
    WBTC: WBTC_OPTIMISM,
  },
  [polygon.id]: {
    WMATIC: WMATIC_POLYGON,
    WETH: WETH_POLYGON,
    USDC: USDC_POLYGON,
    USDCe: BRIDGED_USDC_POLYGON,
    USDT: USDT_POLYGON,
    DAI: DAI_POLYGON,
    WBTC: WBTC_POLYGON,
  },
  [arbitrum.id]: {
    WETH: WETH_ARBITRUM,
    USDC: USDC_ARBITRUM,
    USDCe: BRIDGED_USDC_ARBITRUM,
    WBTC: WBTC_ARBITRUM,
  },
  [base.id]: {
    WETH: WETH_BASE,
    USDC: USDC_BASE,
  },
}

interface PoolDepositAssetAddressParams {
  investAssetAddress: Address
  symbol: string
  productPoolAddress: Address
  chainId: ChainId
}

export const usePoolDepositAssetAddress = ({
  investAssetAddress,
  symbol,
  productPoolAddress,
  chainId,
}: PoolDepositAssetAddressParams): Address => {
  const poolComposition = usePoolComposition({
    address: productPoolAddress,
    chainId,
  })
  const poolInvestTokens = poolComposition.filter(({ isDeposit }) => isDeposit)
  const isCustomTokenDeposit = !poolInvestTokens.some(
    ({ tokenName }) => tokenName === symbol,
  )
  const [initialInvestToken] = poolInvestTokens

  return useMemo<Address>(() => {
    if (initialInvestToken) {
      if (isCustomTokenDeposit) {
        const depositTokens = poolComposition
          .filter(({ isDeposit }) => isDeposit)
          .map(({ tokenName }) => tokenName)
        const fallbackAssetSymbol = FALLBACK_ASSET_SYMBOLS.find((symbol) => {
          return depositTokens.includes(symbol)
        })

        // use fallback asset
        return fallbackAssetSymbol
          ? FALLBACK_ASSETS_ADRESSES_MAP[chainId]?.[fallbackAssetSymbol]
              ?.address ?? initialInvestToken.tokenAddress
          : initialInvestToken.tokenAddress
      }
    }

    return investAssetAddress
  }, [
    chainId,
    investAssetAddress,
    isCustomTokenDeposit,
    poolComposition,
    initialInvestToken,
  ])
}
