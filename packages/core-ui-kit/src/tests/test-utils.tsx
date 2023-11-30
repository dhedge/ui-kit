import type { Queries, queries } from '@testing-library/dom'
import type { RenderHookOptions, RenderOptions } from '@testing-library/react'
import { render, renderHook } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

import { TradingPanelProvider } from 'providers'
import type { TradingPanelContextConfig } from 'types'

import { CALLBACK_CONFIG_MOCK, POOL_CONFIG_MAP_MOCK } from './mocks'

interface TestProvidersProps extends Partial<TradingPanelContextConfig> {
  children: ReactNode
}

export const TestProviders = ({
  children,
  actions,
  initialState,
}: TestProvidersProps) => (
  <TradingPanelProvider
    initialState={{
      ...initialState,
      poolConfigMap: initialState?.poolConfigMap ?? POOL_CONFIG_MAP_MOCK,
    }}
    actions={actions ?? CALLBACK_CONFIG_MOCK}
    isDev
  >
    {children}
  </TradingPanelProvider>
)

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: TestProviders, ...options })

const customRenderHook = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>,
) =>
  renderHook<Result, Props, Q, Container, BaseElement>(render, {
    wrapper: TestProviders,
    ...options,
  })

// eslint-disable-next-line import/export
export * from '@testing-library/react'
// eslint-disable-next-line import/export
export { customRender as render, customRenderHook as renderHook }
