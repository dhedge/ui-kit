import type { Meta, StoryObj } from '@storybook/react'

import { base, optimism } from 'core-kit/const'

import { TradingWidget as TradingWidgetComponent } from '.'

const meta: Meta<typeof TradingWidgetComponent> = {
  component: TradingWidgetComponent,
  decorators: [
    (Story) => (
      <div className="dtw-bg-themeDark-800 dtw-text-white dtw-rounded-xl">
        <Story />
      </div>
    ),
  ],
  args: {
    config: {
      params: {
        chainConfig: {
          [optimism.id]: { name: 'Optimism', iconPath: '' },
          [base.id]: { name: 'Base', iconPath: '' },
        },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TradingWidgetComponent>

export const TradingWidget: Story = {
  args: {},
}
