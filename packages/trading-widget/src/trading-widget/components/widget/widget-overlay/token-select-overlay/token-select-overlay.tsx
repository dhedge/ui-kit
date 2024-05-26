import classNames from 'classnames'
import type { FC } from 'react'

import { MULTI_ASSET_TOKEN } from 'core-kit/const'
import { Layout } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { MultiTokenSelectItem } from './multi-token-select-item/multi-token-select-item'
import { TokenSelectItem } from './token-select-item/token-select-item'

import { useTokenSelectOverlay } from './token-select-overlay.hooks'

import type { TokenSelectOverlayProps } from './token-select-overlay.hooks'

export const TokenSelectOverlay: FC<TokenSelectOverlayProps> = ({
  type,
  searchQuery,
}) => {
  const t = useTranslationContext()
  const {
    tokenList,
    activeTokens,
    onSelect,
    isMultiAssetWithdrawalEnabled,
    onClose,
  } = useTokenSelectOverlay({ type, searchQuery })

  return (
    <Layout.Overlay
      onClose={onClose}
      centered={false}
      className="dtw-gap-[var(--panel-gap)]"
    >
      <span className="dtw-text-center dtw-text-[length:var(--panel-font-size-sm)] dtw-font-[var(--panel-font-weight-medium)]">
        {t.selectToken}
      </span>
      <ul className="dtw-grid dtw-gap-[calc(var(--panel-gap) * 0.5)] dtw-overflow-y-auto">
        {tokenList.map((token) => {
          const isActive = activeTokens.some(
            ({ address, symbol }) =>
              address === token.address && symbol === token.symbol,
          )
          return (
            <li
              key={`${token.address}_${token.symbol}`}
              className={classNames(
                'dtw-rounded-xl dtw-drop-shadow-md odd:dtw-bg-themeDark-400 dtw-group',
                {
                  'dtw-cursor-pointer ': !isActive,
                },
              )}
            >
              <TokenSelectItem
                token={token}
                onSelect={onSelect}
                isActive={isActive}
              />
            </li>
          )
        })}
        {isMultiAssetWithdrawalEnabled && (
          <li className="tw-cursor-pointer tw-rounded-2xl tw-p-0.5 odd:tw-bg-themeDark-400 tw-group">
            <MultiTokenSelectItem
              token={MULTI_ASSET_TOKEN}
              onSelect={onSelect}
            />
          </li>
        )}
      </ul>
    </Layout.Overlay>
  )
}
