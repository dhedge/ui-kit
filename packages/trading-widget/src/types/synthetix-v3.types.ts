export const SYNTHETIX_V3_PERIOD = {
  DELEGATION: 'DELEGATION',
  UNDELEGATION: 'UNDELEGATION',
  WAIT: 'WAIT',
  WITHDRAWAL: 'WITHDRAWAL',
} as const

export type SynthetixV3PeriodType =
  (typeof SYNTHETIX_V3_PERIOD)[keyof typeof SYNTHETIX_V3_PERIOD]

interface DayParams {
  dayOfWeek: number
  hour: number
}

interface WeekPeriod {
  start: DayParams
  end: DayParams
}

export interface PeriodConfig {
  id: SynthetixV3PeriodType
  name: string
  description?: string
  gradient: [string, string]
  start: DayParams
  end: DayParams
  intraWeekRanges: WeekPeriod[]
}
