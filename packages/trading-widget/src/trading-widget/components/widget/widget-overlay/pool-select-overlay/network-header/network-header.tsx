import type { FC, PropsWithChildren } from 'react'

import type { ChainId } from 'core-kit/types'
import { Image as DefaultImage } from 'trading-widget/components/default-examples/image/image'
import { useComponentContext } from 'trading-widget/providers/component-provider'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface NetworkHeaderProps {
  chainId: ChainId
}

export const NetworkHeader: FC<PropsWithChildren<NetworkHeaderProps>> = ({
  children,
  chainId,
}) => {
  const { chainConfig } = useConfigContextParams()
  const { Image = DefaultImage } = useComponentContext()
  const src = chainConfig[chainId]?.iconPath
  const name = chainConfig[chainId]?.name
  return (
    <div>
      <div className="dtw-sticky dtw-top-0 dtw-z-10 dtw-flex dtw-items-center dtw-space-x-3 dtw-bg-[color:var(--panel-popup-list-header-bg)] dtw-drop-shadow-md dtw-p-3">
        {src && (
          <div className="dtw-h-6 dtw-w-6">
            <Image
              className="dtw-h-full dtw-w-full dtw-rounded-full dtw-object-contain"
              src={src}
              alt="chain icon"
              width={100}
              height={100}
            />
          </div>
        )}
        <p className="dtw-whitespace-nowrap dtw-text-sm">{name ?? chainId}</p>
      </div>
      {children}
    </div>
  )
}
