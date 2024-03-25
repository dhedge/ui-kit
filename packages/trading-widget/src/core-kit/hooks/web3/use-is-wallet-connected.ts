import { useEffect, useState } from 'react'

import { useAccount } from './use-account'

// const { isConnected } = useAccount() has hydration issues
export const useIsWalletConnected = () => {
  const { account } = useAccount()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setIsConnected(!!account)
  }, [account])

  return isConnected
}
