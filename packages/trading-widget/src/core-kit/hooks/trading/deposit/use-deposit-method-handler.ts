import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { usePoolDynamicContractData } from 'core-kit/hooks/pool'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import {
  useTradingPanelDepositMethod,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'
import type { DepositMethodName } from 'core-kit/types/trading-panel.types'

export const useDepositMethodHandler = (): [
  DepositMethodName,
  (method: DepositMethodName) => void,
  boolean,
] => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [depositMethod, setDepositMethod] = useTradingPanelDepositMethod()
  const isPoolManagerAccount = useIsPoolManagerAccount()
  const { data: { easySwapperAllowedPools: isPoolAllowed = false } = {} } =
    usePoolStatic({
      address,
      chainId,
    })
  const { entryFee = '0' } = usePoolDynamicContractData({
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
