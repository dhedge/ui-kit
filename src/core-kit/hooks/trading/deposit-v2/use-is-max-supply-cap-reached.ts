import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import { useAvailableManagerFee } from 'core-kit/hooks/pool/use-available-manager-fee'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatToUsd, normalizeNumber } from 'core-kit/utils'

export const useIsMaxSupplyCapReached = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { data: { maxSupplyCapD18 } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })
  const { data: { totalSupplyD18 } = {} } = usePoolDynamic({ address, chainId })
  const [receiveToken] = useReceiveTokenInput()
  const tokenPrice = usePoolTokenPrice({ address, chainId })
  const { data: availableManagerFee = 0 } = useAvailableManagerFee()

  if (!maxSupplyCapD18 || maxSupplyCapD18 === 0n) {
    return { isMaxSupplyCapReached: false, supplyCapInUsd: '' }
  }

  const totalSupply = Math.ceil(normalizeNumber(totalSupplyD18 ?? 0))

  const depositAmount = Number(receiveToken.value || '0')
  const maxSupplyCap = normalizeNumber(maxSupplyCapD18)

  const effectiveMaxSupplyCap = Math.max(0, maxSupplyCap - availableManagerFee)
  const remainingCapInTokens = Math.max(0, effectiveMaxSupplyCap - totalSupply)
  const remainingCapInUsdNumber = remainingCapInTokens * Number(tokenPrice)
  const supplyCapInUsd = formatToUsd({
    value: remainingCapInUsdNumber,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  return {
    isMaxSupplyCapReached:
      Number(totalSupply) + Number(depositAmount) > effectiveMaxSupplyCap,
    supplyCapInUsd,
  }
}
