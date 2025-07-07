import type { FC } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { InputGroup } from 'limit-orders/component/input-group/input-group'
import { LimitOrderApproveButton } from 'limit-orders/component/limit-order-button/limit-order-approve-button'
import { LimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button'
import { LimitOrderDeleteButton } from 'limit-orders/component/limit-order-button/limit-order-delete-button'
import { NetworkCheckButton } from 'limit-orders/component/limit-order-button/network-check-button'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

interface LimitOrderContentProps {
  onClose?: () => void
  hideDeleteButton?: boolean
}

export const LimitOrderContent: FC<LimitOrderContentProps> = ({
  onClose,
  hideDeleteButton,
}) => {
  const t = useTranslationContext()

  return (
    <div className="dtw-flex dtw-flex-col dtw-gap-2">
      <InputGroup />
      <NetworkCheckButton>
        <LimitOrderApproveButton>
          <LimitOrderButton />
        </LimitOrderApproveButton>
        {!hideDeleteButton && <LimitOrderDeleteButton />}
      </NetworkCheckButton>
      <ActionButton highlighted={false} onClick={onClose}>
        {t.cancel}
      </ActionButton>
    </div>
  )
}
