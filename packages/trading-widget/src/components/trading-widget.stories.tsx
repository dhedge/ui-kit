import type { Meta, StoryObj } from '@storybook/react'

import { TradingWidget as TradingWidgetComponent } from '.'

const meta: Meta<typeof TradingWidgetComponent> = {
  component: TradingWidgetComponent,
  decorators: [
    (Story) => (
      <div className="dtw-bg-themeDark-800 dtw-text-white dtw-rounded-xl dtw-pt-3">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TradingWidgetComponent>

export const TradingWidget: Story = {
  args: {},
}
