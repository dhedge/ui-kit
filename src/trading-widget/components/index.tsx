import type { FC } from 'react'

import { Widget } from 'trading-widget/components/widget/widget'
import type { ProvidersProps } from 'trading-widget/providers'
import { Providers } from 'trading-widget/providers'

export const TradingWidget: FC<ProvidersProps> = (props) => (
  <Providers {...props}>
    <Widget />
  </Providers>
)
