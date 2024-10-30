import BigNumber from 'bignumber.js'
import { useCallback } from 'react'

import { PoolFactoryAbi, erc20Abi } from 'core-kit/abi'
import { BRIDGED_TOKENS_SYMBOLS, DEFAULT_PRECISION } from 'core-kit/const'
import { useReadContracts } from 'core-kit/hooks/web3'
import type { Address, MulticallReturnType } from 'core-kit/types/web3.types'
import { getContractAddressById } from 'core-kit/utils'

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

interface UseWithdrawAssetsInfoParams {
  assets: readonly {
    token: Address
    balance: bigint
  }[]
  chainId: number
}

export const useWithdrawAssetsInfo = ({
  assets,
  chainId,
}: UseWithdrawAssetsInfoParams) => {
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
