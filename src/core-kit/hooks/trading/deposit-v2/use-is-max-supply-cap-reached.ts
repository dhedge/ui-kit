import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatToUsd, formatUnits } from 'core-kit/utils'

const SUPPLY_CAP_GAP_TOKENS = 100

export const useIsMaxSupplyCapReached = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { data: { maxSupplyCapD18 } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })
  const { data: { totalSupplyD18 } = {} } = usePoolDynamic({ address, chainId })
  const [receiveToken] = useReceiveTokenInput()
  const tokenPrice = usePoolTokenPrice({ address, chainId })

  if (!maxSupplyCapD18 || maxSupplyCapD18 === 0n) {
    return { isMaxSupplyCapReached: false, supplyCapInUsd: '' }
  }

  const totalSupply = Math.ceil(
    Number(formatUnits(BigInt(totalSupplyD18 ?? 0), DEFAULT_PRECISION)),
  )

  const depositAmount = Number(receiveToken.value || '0')
  const maxSupplyCap = Number(formatUnits(maxSupplyCapD18, DEFAULT_PRECISION))

  const effectiveMaxSupplyCap = Math.max(
    0,
    maxSupplyCap - SUPPLY_CAP_GAP_TOKENS,
  )
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
