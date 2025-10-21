import { useVaultSupplyCap } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatToUsd } from 'core-kit/utils'

export const useIsMaxSupplyCapReached = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const vaultSupplyInfo = useVaultSupplyCap({ address, chainId })
  const [receiveToken] = useReceiveTokenInput()

  if (!vaultSupplyInfo) {
    return { isMaxSupplyCapReached: false, supplyCapInUsd: '' }
  }

  const { totalSupplyNumber, maxSupplyCapNumber, remainingSupplyCapInUsd } =
    vaultSupplyInfo

  const depositAmountNumber = Number(receiveToken.value || '0')

  const isMaxSupplyCapReached =
    totalSupplyNumber + depositAmountNumber > maxSupplyCapNumber

  const supplyCapInUsd = formatToUsd({
    value: remainingSupplyCapInUsd,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  return {
    isMaxSupplyCapReached,
    supplyCapInUsd,
  }
}
