import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

export const useIsInsufficientBalance = (): boolean => {
  const [{ value, symbol, address }] = useSendTokenInput()
  const sendAssetBalance = useUserTokenBalance({ symbol, address })

  return new BigNumber(value || 0).gt(sendAssetBalance ?? 0)
}
