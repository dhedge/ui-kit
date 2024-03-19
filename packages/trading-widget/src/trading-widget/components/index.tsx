import type { FC } from 'react'

import type { ProvidersProps } from 'trading-widget/providers'
import { Providers } from 'trading-widget/providers'

import { Widget } from './widget/widget'

export const TradingWidget: FC<ProvidersProps> = (props) => (
  <Providers {...props}>
    <Widget />
  </Providers>
)
