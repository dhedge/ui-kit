import { DEFAULT_PRECISION } from 'const'
import { useTradingPanelPoolConfig } from 'hooks/state'
import { useAccount, useBalance, useGasPrice } from 'hooks/web3'
import type { Address } from 'types/web3.types'
import {
  formatUnits,
  getNativeTokenInvestableBalance,
  isNativeToken,
} from 'utils'

interface UserTokenBalanceParams {
  symbol: string
  address: Address
  watch?: boolean
}
export const useUserTokenBalance = ({
  symbol,
  address,
  watch = false,
}: UserTokenBalanceParams): string => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const isNative = isNativeToken(symbol, poolConfig.chainId)
  const { data: gasData } = useGasPrice({
    enabled: isNative,
    chainId: poolConfig.chainId,
  })
  const { data } = useBalance({
    chainId: poolConfig.chainId,
    address: account,
    token: !isNative ? address : undefined,
    watch,
  })

  return isNative
    ? getNativeTokenInvestableBalance(
        formatUnits(
          data?.value ?? BigInt(0),
          data?.decimals ?? DEFAULT_PRECISION,
        ),
        Number(gasData?.gasPrice ?? 0),
      ).toString()
    : formatUnits(data?.value ?? BigInt(0), data?.decimals ?? DEFAULT_PRECISION)
}
