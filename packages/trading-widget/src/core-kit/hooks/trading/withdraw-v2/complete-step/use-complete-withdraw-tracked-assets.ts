import BigNumber from 'bignumber.js'
import { useCallback } from 'react'

import { EasySwapperV2Abi, PoolFactoryAbi, erc20Abi } from 'core-kit/abi'
import {
  AddressZero,
  BRIDGED_TOKENS_SYMBOLS,
  DEFAULT_PRECISION,
} from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import {
  useAccount,
  useReadContract,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type { Address, MulticallReturnType } from 'core-kit/types/web3.types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

const getContracts = ({
  assets,
  chainId,
}: {
  assets: readonly { token: Address; balance: bigint }[]
  chainId: number
}) =>
  assets.flatMap(({ token }) => [
    {
      address: token,
      abi: erc20Abi,
      functionName: 'symbol',
      chainId,
      args: [],
    },
    {
      address: token,
      abi: erc20Abi,
      functionName: 'decimals',
      chainId,
      args: [],
    },
    {
      address: getContractAddressById('factory', chainId),
      abi: PoolFactoryAbi,
      functionName: 'getAssetPrice',
      chainId,
      args: [token],
    },
  ])
const contractCallsAmount = 3

export const useCompleteWithdrawTrackedAssets = () => {
  const { account = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()

  const { data: assets = [] } = useReadContract({
    address: getContractAddressById('easySwapperV2', chainId),
    abi: EasySwapperV2Abi,
    functionName: 'getTrackedAssets',
    chainId,
    args: [account],
    query: { enabled: !isZeroAddress(account) },
  })

  const select = useCallback(
    (data: MulticallReturnType<ReturnType<typeof getContracts>>) =>
      assets.map(({ token, balance: rawBalance }, index) => {
        const symbolIndex = index * contractCallsAmount
        const decimalsIndex = symbolIndex + 1
        const priceIndex = decimalsIndex + 1
        const decimals = Number(
          data[decimalsIndex]?.result ?? DEFAULT_PRECISION,
        )
        const symbol =
          BRIDGED_TOKENS_SYMBOLS[token.toLowerCase()] ??
          data[symbolIndex]?.result?.toString() ??
          ''
        return {
          address: token,
          symbol,
          decimals,
          rawBalance,
          balance: new BigNumber(rawBalance.toString())
            .shiftedBy(-decimals)
            .toNumber(),
          price: new BigNumber(data[priceIndex]?.result?.toString() ?? 0)
            .shiftedBy(-DEFAULT_PRECISION)
            .toNumber(),
        }
      }),
    [assets],
  )

  return useReadContracts({
    contracts: getContracts({ assets, chainId }),
    query: {
      enabled: assets.length > 0,
      select,
    },
  })
}
