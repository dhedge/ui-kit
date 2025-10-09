import { useEffect } from 'react'

import { LOCAL_STORAGE_KEYS } from 'core-kit/const'
import { useBrowserStorage } from 'core-kit/hooks/utils'
import type { UseReferralProgramProps } from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

const REFERRAL_QUERY = 'ref'

export const useReferralProgram = ({
  vaultAddress,
  userAddress,
  query,
  logEvent,
  tagInvestorByReferrer,
}: UseReferralProgramProps) => {
  const [referredBy, setReferredBy] = useBrowserStorage(
    'localStorage',
    LOCAL_STORAGE_KEYS.REFERRER,
    '',
  )
  const [refPool, setRefPool] = useBrowserStorage(
    'localStorage',
    LOCAL_STORAGE_KEYS.REF_POOL,
    '',
  )
  const refQuery = query[REFERRAL_QUERY]

  useEffect(() => {
    if (
      !refQuery ||
      typeof refQuery !== 'string' ||
      isZeroAddress(vaultAddress)
    )
      return

    if (localStorage.getItem(LOCAL_STORAGE_KEYS.REFERRER)) {
      return
    }
    setReferredBy(refQuery)
    setRefPool(vaultAddress)
    logEvent?.()
  }, [vaultAddress, refQuery, setRefPool, setReferredBy, logEvent])

  useEffect(() => {
    if (
      !userAddress ||
      !referredBy ||
      refPool.toLowerCase() !== vaultAddress.toLowerCase()
    )
      return

    const tagInvestor = async () => {
      try {
        await tagInvestorByReferrer({
          investorAddress: userAddress,
          poolAddress: refPool,
          referrerAddress: referredBy,
        })
      } catch (err) {
        console.error(
          '[core-ui-kit]: Error on tagging investor by referrer',
          err,
        )
      }
    }
    tagInvestor()
  }, [refPool, referredBy, tagInvestorByReferrer, userAddress, vaultAddress])
}
