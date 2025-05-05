import type { Meta, StoryObj } from '@storybook/react'

import { base, optimism } from 'core-kit/const'

import { TradingWidget as TradingWidgetComponent } from '.'

const meta: Meta<typeof TradingWidgetComponent> = {
  component: TradingWidgetComponent,
  args: {
    config: {
      params: {
        chainConfig: {
          [optimism.id]: { name: 'Optimism', iconPath: '' },
          [base.id]: { name: 'Base', iconPath: '' },
        },
      },
    },
    theme: {
      global: {
        color: {
          colorBgPrimary: '#1B2433',
          colorIcon: '#ADB3BC',
        },
      },
      component: {
        tab: {
          color: {
            colorBg: '#D1D2D3',
            colorText: '#ADB3BC',
            selectColorText: '#1B1B1B',
          },
          style: {
            lineHeight: '1',
          },
        },
        tabList: {
          style: {
            radius: '9999px',
          },
        },
        tabContent: {
          size: {
            pt: '28px',
            gap: '28px',
          },
        },
        balance: {
          size: {
            fontSize: '22px',
          },
        },
        input: {
          color: {
            bgColor: '#171C25',
            bgColorFocus: '#171C25',
            borderColor: 'transparent',
            borderColorFocus: 'transparent',
            buttonBorderColor: 'transparent',
            buttonTextColor: '#ADB3BC',
          },
          size: {
            fontSize: '22px',
            fontSizeLg: '22px',
            iconSize: '22px',
          },
        },
        switch: {
          color: {
            colorBgChecked: '#D1D2D3',
            colorChecked: '#1B1B1B',
          },
        },
        meta: {
          size: {
            gap: '28px',
          },
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
