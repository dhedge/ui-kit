import type { Meta, StoryObj } from '@storybook/react'

import { base, optimism } from 'core-kit/const'

import { TradingWidget as TradingWidgetComponent } from '.'
import type { ComponentProviderProps } from '../providers/component-provider'

const FLAT_MONEY_PRESET = {
  theme: {
    global: {
      color: {
        colorBgPrimary: '#161213',
      },
      style: {
        radiusPrimary: '4px',
        radiusSecondary: '4px',
      },
    },
    component: {
      input: {
        color: {
          bgColor: '#161213',
          buttonBgColor: '#161213',
          buttonBorderColor: '#404040',
          borderColor: '#404040',
        },
        style: {
          buttonRadius: '4px',
          radius: '4px',
        },
      },
      tab: {
        color: {
          colorText: '#E5E5E5',
        },
      },
      popup: {
        color: {
          colorBg: '#161213',
        },
      },
      switch: {
        color: {
          colorBgChecked: '#C2A6F1',
        },
      },
    },
  },
  components: {
    ActionButton: ({ onClick, disabled, children }) => {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="dtw-border-0 dtw-w-full dtw-font-medium dtw-overflow-hidden dtw-bg-clip-text dtw-py-4 dtw-px-6 dtw-text-[color:#161213] dtw-rounded-xl"
          style={{
            background:
              'linear-gradient(222deg, rgba(219, 219, 219, 0.00) 16.49%, rgba(209, 209, 209, 0.00) 133.24%), linear-gradient(123deg, #EBF3D0 0%, rgba(235, 243, 208, 0.00) 18.4%), radial-gradient(76.99% 38.01% at 44.25% 86.96%, #DC968D 0%, rgba(220, 155, 141, 0.00) 100%), radial-gradient(63.36% 43.91% at 35.87% 100%, #DCA08D 0%, rgba(220, 169, 141, 0.00) 100%), radial-gradient(65.51% 30.74% at 45.56% 44.65%, #CBADEB 0%, rgba(194, 166, 241, 0.00) 100%), linear-gradient(135deg, #CDF9E8 20.63%, rgba(205, 249, 232, 0.00) 47.84%), linear-gradient(216deg, rgba(192, 169, 240, 0.00) -16.52%, #C0A9F0 -1.04%, rgba(192, 169, 240, 0.00) 16.99%), linear-gradient(129deg, rgba(192, 169, 240, 0.00) 28.63%, #C0A9F0 38.5%, rgba(192, 169, 240, 0.00) 50.26%), radial-gradient(52.57% 113.78% at 144.91% 58.16%, #E6A577 0%, #EAA66D 34.46%, #EAA66D 64.76%, rgba(255, 129, 38, 0.00) 100%), #C2A6F1',
          }}
        >
          {children}
        </button>
      )
    },
  } as ComponentProviderProps['config'],
}


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
    ...FLAT_MONEY_PRESET,
  },
}

export default meta
type Story = StoryObj<typeof TradingWidgetComponent>

export const TradingWidget: Story = {
  args: {},
}
