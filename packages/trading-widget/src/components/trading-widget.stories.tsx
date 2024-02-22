import type { Meta, StoryObj } from '@storybook/react'

import { TradingWidget as TradingWidgetComponent } from './trading-widget'

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof TradingWidget> = {
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
  args: {
    //👇 The args you need here will depend on your component
  },
}
