import BigNumber from 'bignumber.js'

import { PoolLogicAbi } from 'abi'
import { AddressZero, DEFAULT_PRECISION } from 'const'
import { useContractRead, useContractReads } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { isZeroAddress } from 'utils'

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
}: PoolTokenPriceParams): bigint | undefined => {
  const { data: [poolManagerLogic, totalSupply] = [] } = useContractReads({
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
    enabled: !!address && !isZeroAddress(address) && !disabled,
  })

  const totalFundValueMutable = useTotalFundValueMutable({
    vaultManagerLogicAddress: poolManagerLogic?.result ?? AddressZero,
    chainId,
    disabled,
  })
  const { data: managerFee } = useContractRead({
    address,
    abi: PoolLogicAbi,
    functionName: 'calculateAvailableManagerFee',
    chainId,
    args: [totalFundValueMutable ? BigInt(totalFundValueMutable) : BigInt(0)],
    enabled: !!totalFundValueMutable,
  })

  const totalSupplyWithManagerFee = totalSupply?.result
    ? new BigNumber(totalSupply.result.toString()).plus(
        managerFee?.toString() ?? '0',
      )
    : null

  return totalFundValueMutable && totalSupplyWithManagerFee
    ? BigInt(
        new BigNumber(totalFundValueMutable)
          .dividedBy(totalSupplyWithManagerFee.toFixed())
          .shiftedBy(DEFAULT_PRECISION)
          .toFixed(0),
      )
    : undefined
}
