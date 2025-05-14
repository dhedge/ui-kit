import type { FC } from 'react'

export const TermsContent: FC = () => (
  <div className="dtw-w-full dtw-text-sm dtw-mt-2 dtw-max-h-[120px] dtw-overflow-y-auto theme-scrollbar dtw-text-[color:var(--limit-order-secondary-content-color)]">
    <ol className="dtw-list-decimal dtw-list-inside dtw-space-y-2">
      <li>
        1. Once a limit order is placed, the associated vault token balance must
        remain unchanged. Any transfers or manual withdrawals will prevent the
        order from being executed.
      </li>
      <li>
        2. Revoking token approval after placing an order will prevent the order
        from being executed.
      </li>
      <li>
        3. If the vault tokens are still subject to a lock-up period, the order
        cannot be executed.
      </li>
      <li>
        4. Limit sells are intended to settle in USDC. In rare cases where
        market conditions or high slippage prevent a USDC swap, the order may be
        settled in the underlying tokens of the respective vault.
      </li>
      <li>
        5. While limit sells are generally expected to execute, they are
        currently in beta and execution is not guaranteed.
      </li>
    </ol>
  </div>
)
