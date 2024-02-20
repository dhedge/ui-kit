import { useEffect } from 'react'

import { usePoolStatic } from 'hooks/pool/multicall'
import {
  useTradingPanelDepositMethod,
  useTradingPanelEntryFee,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { useIsPoolManagerAccount } from 'hooks/user'
import { getPercent, isBigInt } from 'utils'

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
