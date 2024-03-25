import { useMemo } from 'react'

import { SYNTHETIX_V3_PERIOD } from 'trading-widget/types/synthetix-v3.types'
import {
  getCurrentRangeIndex,
  getRangeData,
  getWithdrawalWindowStart,
} from 'trading-widget/utils/synthetix-v3'

export const useSynthetixWithdrawalWindow = () =>
  useMemo(() => {
    const currentIndex = getCurrentRangeIndex()
    const data = getRangeData()

    return {
      isWithdrawal: data[currentIndex]?.id === SYNTHETIX_V3_PERIOD.WITHDRAWAL,
      startTime: getWithdrawalWindowStart(),
    }
  }, [])
