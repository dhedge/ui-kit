import type { FC, PropsWithChildren } from 'react'

export const Overlay: FC<PropsWithChildren> = ({ children }) => (
  <div className="dtw-absolute dtw-top-0 dtw-left-0 dtw-right-0 dtw-bottom-0 dtw-flex dtw-items-center dtw-justify-center dtw-rounded-xl dtw-backdrop-blur-md dtw-backdrop-brightness-75 dtw-backdrop-filter">
    {children}
  </div>
)
