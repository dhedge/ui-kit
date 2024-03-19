import { useEffect } from 'react'

import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import {
  useTradingPanelDepositMethod,
  useTradingPanelEntryFee,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'
import { getPercent, isBigInt } from 'core-kit/utils'

export const useHandlePoolSwapInfo = () => {
  const { address, chainId } = useTradingPanelPoolConfig()

  const {
    data: {
      easySwapperFeeDenominator,
      easySwapperFeeNumerator,
      easySwapperAllowedPools: isPoolSwapAllowed = false,
    } = {},
  } = usePoolStatic({
    address,
    chainId,
  })
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
      isBigInt(easySwapperFeeNumerator) &&
      isBigInt(easySwapperFeeDenominator) &&
      isPoolSwapAllowed &&
      depositMethod === 'depositWithCustomCooldown'
    ) {
      updateEntryFee({
        depositWithCustomCooldown: getPercent(
          Number(easySwapperFeeNumerator),
          Number(easySwapperFeeDenominator),
        ),
      })
    }
  }, [
    updateEntryFee,
    easySwapperFeeNumerator,
    easySwapperFeeDenominator,
    depositMethod,
    isPoolSwapAllowed,
  ])
}
