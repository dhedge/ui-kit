import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { useFlatmoneyPointsUserBalances } from 'core-kit/hooks/user'
import { commify, formatNumberToLimitedDecimals } from 'core-kit/utils'
import {
  ActionButton,
  Layout,
  PendingOverlay,
} from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export const FmedWithdrawalOverlay: FC<OverlayProps> = ({ type }) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleReject, handleConfirm } = useOverlayHandlers({ type })
  const { unlockTaxAmount, unlockDate, unlockTimestamp, isLoading } =
    useFlatmoneyPointsUserBalances()

  return isLoading ? (
    <PendingOverlay />
  ) : (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-1">
      <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-warning">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>Withdraw Alert</p>
      </div>
      {unlockTimestamp && Date.now() < unlockTimestamp ? (
        <p className="dtw-text-sm">
          By proceeding with this trade, you acknowledge and accept the
          possibility of losing a part of your rewards (FMP).
        </p>
      ) : null}
      <p className="dtw-text-sm dtw-self-start">
        Please consider the following before confirming:
      </p>
      <ul className="dtw-self-start dtw-list-inside dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm dtw-text-[color:var(--panel-secondary-content-color)] dtw-max-h-28 dtw-overflow-y-scroll">
        {!!unlockTaxAmount && unlockTaxAmount !== '0' && (
          <>
            <li className="dtw-text-warning">
              If you withdraw now, you will incur a penalty of{' '}
              {commify(formatNumberToLimitedDecimals(unlockTaxAmount, 0))} FMP
            </li>
            <li className="dtw-text-warning">
              Wait until {unlockDate} for locked points vesting to complete
            </li>
          </>
        )}
        <li>After withdrawal, you won’t be able to redeposit</li>
      </ul>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <Button highlighted={false} onClick={handleReject}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </div>
    </Layout.Overlay>
  )
}
