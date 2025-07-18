import type { FC } from 'react'

import { MULTI_ASSET_TOKEN } from 'core-kit/const'
import { Layout } from 'trading-widget/components/common'

import { MultiTokenSelectItem } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/multi-token-select-item/multi-token-select-item'
import { TokenSelectItem } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/token-select-item/token-select-item'

import { useTokenSelectOverlay } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/token-select-overlay.hooks'

import type { TokenSelectOverlayProps } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/token-select-overlay.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const TokenSelectOverlay: FC<TokenSelectOverlayProps> = ({
  type,
  searchQuery,
}) => {
  const t = useTranslationContext()
  const {
    tokenList,
    activeTokens,
    onSelect,
    showMultiAssetWithdrawalOption,
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
      <ul className="dtw-grid dtw-gap-[calc(var(--panel-gap) * 0.5)] dtw-overflow-y-auto theme-scrollbar">
        {tokenList.map((token) => {
          const isActive = activeTokens.some(
            ({ address, symbol }) =>
              address === token.address && symbol === token.symbol,
          )
          return (
            <li
              key={`${token.address}_${token.symbol}`}
              className="dtw-cursor-pointer dtw-rounded-xl dtw-drop-shadow-md even:odd:dtw-bg-[color:var(--panel-popup-list-item-bg-even)] odd:dtw-bg-[color:var(--panel-popup-list-item-bg-odd)] dtw-group"
            >
              <TokenSelectItem
                token={token}
                onSelect={onSelect}
                isActive={isActive}
                onClose={onClose}
              />
            </li>
          )
        })}
        {showMultiAssetWithdrawalOption && (
          <li className="dtw-cursor-pointer dtw-rounded-xl dtw-p-0.5 even:dtw-bg-[color:var(--panel-popup-list-item-bg-even)] odd:dtw-bg-[color:var(--panel-popup-list-item-bg-odd)] dtw-group">
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
