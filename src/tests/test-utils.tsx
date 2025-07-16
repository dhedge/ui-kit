import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from '@tanstack/react-query'
import type { Queries, queries } from '@testing-library/dom'
import type { RenderHookOptions, RenderOptions } from '@testing-library/react'
import { render, renderHook } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

import { TradingPanelProvider } from 'core-kit/providers'
import { WagmiProvider } from 'core-kit/providers/wagmi-provider'

import type { TradingPanelContextConfig } from 'core-kit/types'

import { CALLBACK_CONFIG_MOCK, POOL_CONFIG_MAP_MOCK } from 'tests/mocks'

interface TestProvidersProps extends Partial<TradingPanelContextConfig> {
  children: ReactNode
}

const queryClient = new QueryClient()

export const TestProviders = ({
  children,
  actions,
  initialState,
}: TestProvidersProps) => (
  <WagmiProvider>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TradingPanelProvider
          initialState={{
            ...initialState,
            poolConfigMap: initialState?.poolConfigMap ?? POOL_CONFIG_MAP_MOCK,
          }}
          actions={actions ?? CALLBACK_CONFIG_MOCK}
        >
          {children}
        </TradingPanelProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </WagmiProvider>
)

afterEach(() => {
  queryClient.clear()
})

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
