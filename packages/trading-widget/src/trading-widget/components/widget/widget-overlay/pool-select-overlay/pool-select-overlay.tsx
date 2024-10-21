import classNames from 'classnames'
import type { FC } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { Layout } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { NetworkHeader } from './network-header/network-header'

import { usePoolSelectOverlay } from './pool-select-overlay.hooks'

import type { PoolSelectOverlayProps } from './pool-select-overlay.hooks'
import { TokenSelectItem } from '../token-select-overlay/token-select-item/token-select-item'

export const PoolSelectOverlay: FC<PoolSelectOverlayProps> = ({
  type,
  searchQuery,
}) => {
  const t = useTranslationContext()
  const { poolList, onClose, onSelect } = usePoolSelectOverlay({
    type,
    searchQuery,
  })

  return (
    <Layout.Overlay
      onClose={onClose}
      centered={false}
      className="dtw-gap-[var(--panel-gap)]"
    >
      <span className="dtw-text-center dtw-text-[length:var(--panel-font-size-sm)] dtw-font-[var(--panel-font-weight-medium)]">
        {t.selectToken}
      </span>
      <div className="dtw-grid dtw-gap-[calc(var(--panel-gap) * 0.5)] dtw-overflow-y-auto">
        {poolList.map(({ chainId, configs }) => (
          <NetworkHeader key={chainId} chainId={chainId}>
            {configs.map(({ isActive, symbol, address }) => (
              <div
                key={`${address}_${symbol}`}
                className={classNames(
                  'dtw-rounded-xl dtw-drop-shadow-md even:odd:dtw-bg-[color:var(--panel-popup-list-item-bg-even)] odd:dtw-bg-[color:var(--panel-popup-list-item-bg-odd)] dtw-group',
                  {
                    'dtw-cursor-pointer ': !isActive,
                  },
                )}
              >
                <TokenSelectItem
                  token={{
                    symbol,
                    address,
                    value: '',
                    decimals: DEFAULT_PRECISION,
                  }}
                  onSelect={onSelect}
                  isActive={isActive}
                  onClose={onClose}
                />
              </div>
            ))}
          </NetworkHeader>
        ))}
      </div>
    </Layout.Overlay>
  )
}
