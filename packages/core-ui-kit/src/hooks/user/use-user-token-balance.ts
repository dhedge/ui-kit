import { AddressZero, DEFAULT_PRECISION } from 'const'
import { useTradingPanelPoolConfig } from 'hooks/state'
import { erc20Abi } from 'abi'
import {
  useAccount,
  useBalance,
  useGasPrice,
  useInvalidateOnBlock,
  useReadContracts,
} from 'hooks/web3'
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
    chainId: poolConfig.chainId,
    query: {
      enabled: isNative,
    },
  })
  const { data: nativeData, queryKey: nativeBalanceQueryKey } = useBalance({
    chainId: poolConfig.chainId,
    address: account,
    query: {
      enabled: isNative && !!account,
    },
  })

  const { data: tokenData, queryKey: tokenBalanceQueryKey } = useReadContracts({
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account ?? AddressZero],
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ],
    query: {
      enabled: !isNative && !!account,
    },
  })

  useInvalidateOnBlock({
    watch: watch && isNative,
    queryKey: nativeBalanceQueryKey,
  })

  useInvalidateOnBlock({
    watch: watch && !isNative,
    queryKey: tokenBalanceQueryKey,
  })

  return isNative
    ? getNativeTokenInvestableBalance(
        formatUnits(
          nativeData?.value ?? BigInt(0),
          nativeData?.decimals ?? DEFAULT_PRECISION,
        ),
        Number(gasData?.gasPrice ?? 0),
      ).toString()
    : formatUnits(
        tokenData?.[0]?.result ?? BigInt(0),
        tokenData?.[1]?.result ?? DEFAULT_PRECISION,
      )
}
