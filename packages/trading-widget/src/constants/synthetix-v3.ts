import { COLORS } from 'theme/colors'
import type {
  PeriodConfig,
  SynthetixV3PeriodType,
} from 'types/synthetix-v3.types'
import { SYNTHETIX_V3_PERIOD } from 'types/synthetix-v3.types'

export const SYNTHETIX_V3_PERIOD_RANGE_CONFIG: Record<
  SynthetixV3PeriodType,
  PeriodConfig
> = {
  DELEGATION: {
    id: SYNTHETIX_V3_PERIOD.DELEGATION,
    name: 'Delegation',
    description:
      'Automated strategy picks up new deposits, compounds fees and rewards, monitors debt',
    gradient: [COLORS.GRAY.DEFAULT, COLORS.GRAY['600']],
    start: {
      dayOfWeek: 2,
      hour: 0,
    },
    end: {
      dayOfWeek: 4,
      hour: 12,
    },
    intraWeekRanges: [
      {
        start: {
          dayOfWeek: 2,
          hour: 0,
        },
        end: {
          dayOfWeek: 4,
          hour: 12,
        },
      },
    ],
  },
  UNDELEGATION: {
    id: SYNTHETIX_V3_PERIOD.UNDELEGATION,
    name: 'Undelegation',
    description:
      'Automated strategy frees up a portion of locked funds to make it available as withdrawal liquidity',
    gradient: [COLORS.GRAY.DEFAULT, COLORS.GRAY['600']],
    start: {
      dayOfWeek: 4,
      hour: 12,
    },
    end: {
      dayOfWeek: 5,
      hour: 0,
    },
    intraWeekRanges: [
      {
        start: {
          dayOfWeek: 4,
          hour: 12,
        },
        end: {
          dayOfWeek: 5,
          hour: 0,
        },
      },
    ],
  },
  WAIT: {
    id: SYNTHETIX_V3_PERIOD.WAIT,
    name: 'Wait',
    gradient: [COLORS.GRAY.DEFAULT, COLORS.GRAY['600']],
    description: 'Please wait until the withdrawal window to redeem assets',
    start: {
      dayOfWeek: 5,
      hour: 0,
    },
    end: {
      dayOfWeek: 6,
      hour: 0,
    },
    intraWeekRanges: [
      {
        start: {
          dayOfWeek: 5,
          hour: 0,
        },
        end: {
          dayOfWeek: 6,
          hour: 0,
        },
      },
    ],
  },
  WITHDRAWAL: {
    id: SYNTHETIX_V3_PERIOD.WITHDRAWAL,
    name: 'Withdrawal',
    description: 'Withdrawal window open. Token can be redeemed at this time',
    gradient: [COLORS.GREEN.DEFAULT, COLORS.GREEN['700']],
    start: {
      dayOfWeek: 6,
      hour: 0,
    },
    end: {
      dayOfWeek: 9,
      hour: 0,
    },
    intraWeekRanges: [
      {
        start: {
          dayOfWeek: 1,
          hour: 0,
        },
        end: {
          dayOfWeek: 1,
          hour: 24,
        },
      },
      {
        start: {
          dayOfWeek: 6,
          hour: 0,
        },
        end: {
          dayOfWeek: 7,
          hour: 24,
        },
      },
      {
        start: {
          dayOfWeek: 8,
          hour: 0,
        },
        end: {
          dayOfWeek: 8,
          hour: 24,
        },
      },
    ],
  },
}
