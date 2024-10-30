import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import {
  FLATMONEY_COLLATERAL_SYMBOL_MAP,
  FLAT_MONEY_UNIT_LINK,
  SYNTHETIX_V3_VAULTS_WITHDRAW_ASSET_SYMBOL_MAP,
} from 'core-kit/const'
import {
  getFlatMonetUnitSymbol,
  isFlatMoneyLeveragedRethAsset,
  isSynthetixV3Asset,
} from 'core-kit/utils'
import { Skeleton, TokenBadge } from 'trading-widget/components/common'

import type { AllAssetsCompositionTableProps } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/all-assets-composition-table/all-assets-composition-table.hooks'
import { useAllAssetsCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/all-assets-composition-table/all-assets-composition-table.hooks'
import { WithdrawExplanationTip } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/all-assets-composition-table/withdraw-explanation-tip'

export const AllAssetsCompositionTable = ({
  className,
  showFraction = true,
  iconSize,
}: AllAssetsCompositionTableProps) => {
  const { poolComposition, chainId, showUnitWithdrawalTip, address } =
    useAllAssetsCompositionTable()

  return (
    <div className={classNames('dtw-text-sm dtw-font-light', className)}>
      {poolComposition.length > 0 ? (
        <>
          <table
            className="dtw-min-w-full dtw-border-separate"
            style={{ borderSpacing: '0px 0.25rem' }}
          >
            <tbody>
              {poolComposition.map(
                ({ fraction, fractionUsd, tokenName, asset, tokenAddress }) => {
                  const isLeveragedRethAsset =
                    isFlatMoneyLeveragedRethAsset(tokenAddress)
                  const isSynthetixAsset = isSynthetixV3Asset(tokenAddress)

                  return (
                    <tr key={tokenName}>
                      <td
                        style={{
                          width: 150,
                          maxWidth: 150,
                        }}
                      >
                        <TokenBadge
                          symbol={tokenName}
                          iconSymbols={asset.iconSymbols}
                          symbolClasses="dtw-text-xs dtw-font-bold"
                          size={iconSize}
                        />
                        {isLeveragedRethAsset && (
                          <WithdrawExplanationTip
                            symbol={
                              FLATMONEY_COLLATERAL_SYMBOL_MAP[chainId] ?? 'rETH'
                            }
                          />
                        )}
                        {isSynthetixAsset && (
                          <WithdrawExplanationTip
                            symbol={
                              SYNTHETIX_V3_VAULTS_WITHDRAW_ASSET_SYMBOL_MAP[
                                address
                              ] ?? 'Synthetix V3'
                            }
                          />
                        )}
                      </td>
                      {showFraction && (
                        <td
                          style={{
                            width: 150,
                            maxWidth: 150,
                          }}
                        >
                          <p className="dtw-truncate">{fraction}</p>
                          <p className="dtw-truncate dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
                            {fractionUsd}
                          </p>
                        </td>
                      )}
                    </tr>
                  )
                },
              )}
            </tbody>
          </table>
          {showUnitWithdrawalTip && (
            <p className="dtw-text-warning dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))]">
              {getFlatMonetUnitSymbol(chainId)} can be redeemed using{' '}
              <a
                className="dtw-underline dtw-inline-flex dtw-gap-0.5"
                href={FLAT_MONEY_UNIT_LINK}
                target="_blank"
                rel="noreferrer"
              >
                Flat Money <ArrowTopRightOnSquareIcon className="dtw-w-3" />
              </a>
            </p>
          )}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}
