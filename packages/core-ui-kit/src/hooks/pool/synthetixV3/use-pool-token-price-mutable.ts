import BigNumber from 'bignumber.js'

import { PoolLogicAbi } from 'abi'
import { AddressZero, DEFAULT_PRECISION } from 'const'
import { useContractReads } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { isZeroAddress } from 'utils'

import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

interface PoolTokenPriceParams {
  address: Address
  chainId: ChainId
  disabled?: boolean
}

// TODO: add available manager fee to token price calculations
// https://github.com/dhedge/dhedge-v2/pull/821/files#diff-ef65448920630318c6d283f1624a24d941804de54d7e9a0e2944d6e5f54d9152
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

  return totalFundValueMutable && totalSupply?.result
    ? BigInt(
        new BigNumber(totalFundValueMutable)
          .dividedBy(totalSupply.result.toString())
          .shiftedBy(DEFAULT_PRECISION)
          .toFixed(0),
      )
    : undefined
}
