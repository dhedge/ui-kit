import {
  useTradingPanelDepositMethod,
  useTradingPanelEntryFee,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { useEasySwapperStableData } from 'hooks/trading'
import { useIsPoolManagerAccount } from 'hooks/user'
import { useEffect } from 'react'
import { getPercent, isBigInt } from 'utils'

export const useHandlePoolSwapInfo = () => {
  const { address, chainId } = useTradingPanelPoolConfig()

  const {
    isEasySwapperAllowedPool: isPoolSwapAllowed,
    feeNumerator,
    feeDenominator,
  } = useEasySwapperStableData({ poolAddress: address, chainId })
  const isPoolManagerAccount = useIsPoolManagerAccount()

  const [depositMethod, setDepositMethod] = useTradingPanelDepositMethod()
  const updateEntryFee = useTradingPanelEntryFee()[1]

  useEffect(() => {
    if (isPoolManagerAccount && isPoolSwapAllowed) {
      setDepositMethod({ address, method: 'depositWithCustomCooldown' })
    }
  }, [isPoolManagerAccount, isPoolSwapAllowed, address, setDepositMethod])

  useEffect(() => {
    if (
      isBigInt(feeNumerator) &&
      isBigInt(feeDenominator) &&
      isPoolSwapAllowed &&
      depositMethod === 'depositWithCustomCooldown'
    ) {
      updateEntryFee({
        depositWithCustomCooldown: getPercent(
          Number(feeNumerator),
          Number(feeDenominator),
        ),
      })
    }
  }, [
    updateEntryFee,
    feeNumerator,
    feeDenominator,
    depositMethod,
    isPoolSwapAllowed,
  ])
}
