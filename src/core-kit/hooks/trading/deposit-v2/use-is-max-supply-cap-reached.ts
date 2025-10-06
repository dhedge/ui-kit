import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatUnits } from 'core-kit/utils'

export const useIsMaxSupplyCapReached = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { data: { maxSupplyCapD18 } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })
  const { data: { totalSupplyD18 } = {} } = usePoolDynamic({ address, chainId })
  const [receiveToken] = useReceiveTokenInput()

  if (!maxSupplyCapD18 || maxSupplyCapD18 === 0n) {
    return false
  }

  const totalSupply = Number(
    formatUnits(BigInt(totalSupplyD18 ?? 0), DEFAULT_PRECISION),
  )
  const depositAmount = Number(receiveToken.value || '0')
  const maxSupplyCap = Number(formatUnits(maxSupplyCapD18, DEFAULT_PRECISION))

  return Number(totalSupply) + Number(depositAmount) > maxSupplyCap
}
