import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'hooks/state'
import { useUserTokenBalance } from 'hooks/user'

export const useIsInsufficientBalance = (): boolean => {
  const [{ value, symbol, address }] = useSendTokenInput()
  const sendAssetBalance = useUserTokenBalance({ symbol, address })

  return new BigNumber(value || 0).gt(sendAssetBalance ?? 0)
}
