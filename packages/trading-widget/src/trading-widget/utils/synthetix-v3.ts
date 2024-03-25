import { UTCDate } from '@date-fns/utc'

import {
  differenceInHours,
  format,
  isWithinInterval,
  setDay,
  setHours,
  startOfWeek,
} from 'date-fns'

import { SYNTHETIX_V3_PERIOD_RANGE_CONFIG } from 'trading-widget/constants/synthetix-v3'
import type { SynthetixV3PeriodType } from 'trading-widget/types/synthetix-v3.types'
import { SYNTHETIX_V3_PERIOD } from 'trading-widget/types/synthetix-v3.types'

const WEEK_IN_HOURS = 24 * 7

export const getDateRangeByPeriod = (period: SynthetixV3PeriodType) => {
  const config = SYNTHETIX_V3_PERIOD_RANGE_CONFIG[period]
  const date = startOfWeek(new UTCDate(), { weekStartsOn: 1 })

  const from = setHours(setDay(date, config.start.dayOfWeek), config.start.hour)
  const to = setHours(setDay(date, config.end.dayOfWeek), config.end.hour)

  const durationHours = differenceInHours(to, from)

  return {
    from,
    to,
    intraWeekRanges: config.intraWeekRanges.map((range) => ({
      from: setHours(setDay(date, range.start.dayOfWeek), range.start.hour),
      to: setHours(setDay(date, range.end.dayOfWeek), range.end.hour),
    })),
    duration: {
      percentage: (durationHours / WEEK_IN_HOURS) * 100,
    },
    format: {
      from: format(new Date(from.toString()), 'iii HH:mm'),
      to: format(new Date(to.toString()), 'iii HH:mm'),
    },
  }
}

export const getRangeData = () =>
  Object.values(SYNTHETIX_V3_PERIOD_RANGE_CONFIG).map((config) => ({
    ...config,
    ...getDateRangeByPeriod(config.id),
  }))

export const getCurrentRangeIndex = () => {
  const now = new UTCDate()

  return Object.values(SYNTHETIX_V3_PERIOD_RANGE_CONFIG).reduce(
    (acc, config, index) => {
      const range = getDateRangeByPeriod(config.id)
      return range.intraWeekRanges.some((segment) =>
        isWithinInterval(now, { start: segment.from, end: segment.to }),
      )
        ? index
        : acc
    },
    0,
  )
}

export const getWithdrawalWindowStart = () => {
  const config = getDateRangeByPeriod(SYNTHETIX_V3_PERIOD.WITHDRAWAL)

  return format(new Date(config.from.toString()), 'iii, MMM do, HH:mm')
}
