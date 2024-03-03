import type { FC } from 'react'

import type { ProvidersProps } from 'providers'
import { Providers } from 'providers'

import { Widget } from './widget/widget'

export const TradingWidget: FC<ProvidersProps> = (props) => (
  <Providers {...props}>
    <Widget />
  </Providers>
)
