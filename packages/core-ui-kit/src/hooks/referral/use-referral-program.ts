import { useBrowserStorage } from 'hooks/utils'
import { useEffect } from 'react'

import type { UseReferralProgramProps } from 'types'

const REFERRER = 'referrer'
const REF_POOL = 'ref_pool'
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
    REFERRER,
    '',
  )
  const [refPool, setRefPool] = useBrowserStorage('localStorage', REF_POOL, '')
  const refQuery = query[REFERRAL_QUERY]

  useEffect(() => {
    if (!refQuery || typeof refQuery !== 'string') return

    if (localStorage.getItem(REFERRER)) {
      return
    }
    logEvent?.()
    setReferredBy(refQuery)
    setRefPool(vaultAddress)
  }, [vaultAddress, refQuery, setRefPool, setReferredBy, logEvent])

  useEffect(() => {
    if (!userAddress || !referredBy || refPool !== vaultAddress) return

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
