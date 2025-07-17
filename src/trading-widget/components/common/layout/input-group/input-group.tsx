import type { FC, PropsWithChildren } from 'react'

export const InputGroup: FC<PropsWithChildren> = ({ children }) => (
  <div className="dtw-flex dtw-flex-col dtw-gap-[var(--panel-inputs-group-gap,var(--panel-gap))] dtw-px-[var(--panel-inputs-group-px)]">
    {children}
  </div>
)
