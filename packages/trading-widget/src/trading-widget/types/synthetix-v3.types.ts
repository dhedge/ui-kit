export const SYNTHETIX_V3_PERIOD = {
  DELEGATION: 'DELEGATION',
  UNDELEGATION: 'UNDELEGATION',
  WAIT: 'WAIT',
  WITHDRAWAL: 'WITHDRAWAL',
} as const

export type SynthetixV3PeriodType =
  (typeof SYNTHETIX_V3_PERIOD)[keyof typeof SYNTHETIX_V3_PERIOD]

export interface DayParams {
  dayOfWeek: number
  hour: number
}

export interface WeekPeriod {
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
