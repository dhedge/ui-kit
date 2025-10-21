import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import { useAvailableManagerFee } from 'core-kit/hooks/pool/use-available-manager-fee'
import { usePoolTokenPrice } from 'core-kit/hooks/pool/use-pool-token-price'
import type { Address, ChainId } from 'core-kit/types'
import { normalizeNumber } from 'core-kit/utils'

interface UseVaultSupplyCapParams {
  address: Address
  chainId: ChainId
}

// Returns null if no supply cap is set
export const useVaultSupplyCap = ({
  address,
  chainId,
}: UseVaultSupplyCapParams) => {
  const { data: { maxSupplyCapD18 } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })
  const { data: { totalSupplyD18 } = {} } = usePoolDynamic({ address, chainId })
  const tokenPrice = usePoolTokenPrice({ address, chainId })
  const { data: availableManagerFee = 0 } = useAvailableManagerFee({
    address,
    chainId,
  })

  if (!maxSupplyCapD18 || maxSupplyCapD18 === 0n) {
    return null
  }

  const totalSupplyNumber = Math.ceil(normalizeNumber(totalSupplyD18 ?? 0))
  const maxSupplyCapNumber = normalizeNumber(maxSupplyCapD18)

  const effectiveMaxSupplyCapNumber = Math.max(
    0,
    maxSupplyCapNumber - availableManagerFee,
  )
  const remainingSupplyCapNumber = Math.max(
    0,
    effectiveMaxSupplyCapNumber - totalSupplyNumber,
  )
  const remainingSupplyCapInUsd = remainingSupplyCapNumber * Number(tokenPrice)

  return {
    totalSupplyNumber,
    maxSupplyCapNumber: effectiveMaxSupplyCapNumber,
    remainingSupplyCapNumber,
    remainingSupplyCapInUsd,
  }
}
