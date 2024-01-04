import type { Meta, StoryObj } from '@storybook/react'

import { TradingWidget as TradingWidgetComponent } from './trading-widget'

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof TradingWidget> = {
  component: TradingWidgetComponent,
}

export default meta
type Story = StoryObj<typeof TradingWidgetComponent>

export const TradingWidget: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
}
