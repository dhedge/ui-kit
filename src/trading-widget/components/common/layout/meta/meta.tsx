import type { FC, PropsWithChildren } from 'react'

export const Meta: FC<PropsWithChildren> = ({ children }) => (
  <div className="dtw-flex dtw-flex-col dtw-gap-[var(--panel-meta-group-gap,var(--panel-gap))] dtw-px-[var(--panel-meta-group-px)]">
    {children}
  </div>
)
