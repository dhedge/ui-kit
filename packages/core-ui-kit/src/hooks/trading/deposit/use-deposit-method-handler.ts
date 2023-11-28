import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { usePoolDynamicContractData } from 'hooks/pool'
import {
  useTradingPanelDepositMethod,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { useEasySwapperStableData } from 'hooks/trading'
import { useIsPoolManagerAccount } from 'hooks/user'
import type { DepositMethodName } from 'types/trading-panel.types'

export const useDepositMethodHandler = (): [
  DepositMethodName,
  (method: DepositMethodName) => void,
  boolean,
] => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [depositMethod, setDepositMethod] = useTradingPanelDepositMethod()
  const isPoolManagerAccount = useIsPoolManagerAccount()
  const { isEasySwapperAllowedPool: isPoolAllowed } = useEasySwapperStableData({
    poolAddress: address,
    chainId,
  })
  const { entryFee } = usePoolDynamicContractData({
    address,
    chainId,
  })

  const entryFeeBN = new BigNumber(entryFee)
  const hasDepositOptions =
    (entryFeeBN.isNaN() || entryFeeBN.isZero()) &&
    isPoolAllowed &&
    !isPoolManagerAccount

  const setPoolDepositMethod = useCallback(
    (method: DepositMethodName) => {
      setDepositMethod({
        address,
        method,
      })
    },
    [setDepositMethod, address],
  )

  return useMemo(
    () => [depositMethod, setPoolDepositMethod, hasDepositOptions],
    [depositMethod, setPoolDepositMethod, hasDepositOptions],
  )
}
