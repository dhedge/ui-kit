import type { Meta, StoryObj } from '@storybook/react'

import { Widget } from './widget'

const meta: Meta<typeof Widget> = {
  component: Widget,
  decorators: [
    (Story) => (
      <div className="dtw-bg-themeDark-800 dtw-text-white dtw-rounded-xl dtw-pt-3">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Widget>

export const TradingWidget: Story = {
  args: {},
}
