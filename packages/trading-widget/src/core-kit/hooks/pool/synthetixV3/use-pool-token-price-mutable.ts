import BigNumber from 'bignumber.js'

import { PoolLogicAbi } from 'core-kit/abi'
import { AddressZero, DEFAULT_PRECISION } from 'core-kit/const'
import { useReadContract, useReadContracts } from 'core-kit/hooks/web3'
import type { Address, ChainId } from 'core-kit/types/web3.types'
import { isZeroAddress } from 'core-kit/utils'

import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

interface PoolTokenPriceParams {
  address: Address
  chainId: ChainId
  disabled?: boolean
}

export const usePoolTokenPriceMutable = ({
  address,
  chainId,
  disabled,
}: PoolTokenPriceParams): string | undefined => {
  const { data: [poolManagerLogic, totalSupply] = [] } = useReadContracts({
    contracts: [
      {
        address,
        abi: PoolLogicAbi,
        functionName: 'poolManagerLogic',
        chainId,
      },
      {
        address,
        abi: PoolLogicAbi,
        functionName: 'totalSupply',
        chainId,
      },
    ],
    query: {
      enabled: !!address && !isZeroAddress(address) && !disabled,
    },
  })

  const totalFundValueMutable = useTotalFundValueMutable({
    vaultManagerLogicAddress: poolManagerLogic?.result ?? AddressZero,
    chainId,
    disabled,
  })
  const { data: managerFee } = useReadContract({
    address,
    abi: PoolLogicAbi,
    functionName: 'calculateAvailableManagerFee',
    chainId,
    args: [totalFundValueMutable ? BigInt(totalFundValueMutable) : BigInt(0)],
    query: {
      enabled: !!totalFundValueMutable,
    },
  })

  const totalSupplyWithManagerFee = totalSupply?.result
    ? new BigNumber(totalSupply.result.toString()).plus(
        managerFee?.toString() ?? '0',
      )
    : null

  return totalFundValueMutable && totalSupplyWithManagerFee
    ? new BigNumber(totalFundValueMutable)
        .dividedBy(totalSupplyWithManagerFee.toFixed())
        .shiftedBy(DEFAULT_PRECISION)
        .toFixed(0)
    : undefined
}
