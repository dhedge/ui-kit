import type { FC } from 'react'

import { Layout, Spinner } from 'components/common'
import { useComponentContext } from 'providers/component-provider'

interface PendingOverlayProps {
  title?: string
  text?: string
}

export const PendingOverlay: FC<PendingOverlayProps> = ({ title, text }) => {
  const { LogoSpinner = Spinner } = useComponentContext()

  return (
    <Layout.Overlay>
      <div className="dtw-flex dtw-flex-col dtw-items-center dtw-rounded-xl dtw-px-5 dtw-py-5">
        {title && (
          <span className="dtw-mb-8 dtw-font-medium dtw-text-themeGray-600">
            {title}
          </span>
        )}
        <LogoSpinner className="dtw-h-[80px] dtw-w-[60px]" />
        {text && <p className="dtw-mt-6 dtw-text-xl dtw-font-light">{text}</p>}
      </div>
    </Layout.Overlay>
  )
}
