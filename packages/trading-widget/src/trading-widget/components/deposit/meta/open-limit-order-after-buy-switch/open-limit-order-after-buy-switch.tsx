import type { FC } from 'react'

import { Switch } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useOpenLimitOrderAfterBuySwitch } from './open-limit-order-after-buy-switch.hooks'

export const OpenLimitOrderAfterBuySwitch: FC = () => {
  const t = useTranslationContext()
  const {
    setOpenLimitOrderAfterBuy,
    openLimitOrderModalAfterBuy,
    displaySwitch,
  } = useOpenLimitOrderAfterBuySwitch()

  if (!displaySwitch) {
    return null
  }

  return (
    <div className="dtw-flex dtw-items-center dtw-justify-between dtw-flex-nowrap dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)]">
      <p className="dtw-py-0.5 dtw-text-md dtw-text-[color:var(--panel-primary-content-color)]">
        {t.openLimitOrderAfterBuySwitchLabel}
      </p>
      <div className="dtw-flex-shrink-0">
        <Switch
          defaultEnabled={openLimitOrderModalAfterBuy}
          onChange={setOpenLimitOrderAfterBuy}
        />
      </div>
    </div>
  )
}
