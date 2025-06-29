import type { Meta, StoryObj } from '@storybook/react'

import type { FC } from 'react'

import { AddressZero, arbitrum } from 'core-kit/const'
import { BASE_COLORS, TOROS } from 'theme/colors'

import type { LimitOrderModalProps } from './limit-order-modal'
import { LimitOrderModal as LimitOrderModalComponent } from './limit-order-modal'

const LimitOrderModalComponentWithTrigger: FC<Partial<LimitOrderModalProps>> = (
  props,
) => (
  <LimitOrderModalComponent
    vaultAddress={AddressZero}
    vaultChainId={arbitrum.id}
    pricingAsset={{ address: AddressZero, symbol: 'ETH' }}
    isModalOpen
    {...props}
  >
    {() => <button>Limit Order</button>}
  </LimitOrderModalComponent>
)

const meta: Meta<typeof LimitOrderModalComponentWithTrigger> = {
  component: LimitOrderModalComponentWithTrigger,
  args: {},
}

const themeConfig: LimitOrderModalProps['themeConfig'] = {
  global: {
    color: {
      colorBgPrimary: TOROS.card.bg,
      colorTextPrimary: TOROS.text.primary,
      colorTextPrimaryHover: TOROS.text['primary-hover'],
      colorTextSecondary: TOROS.text.secondary,
      colorBgAccentFrom: TOROS.button.primary.bg,
      colorBgAccentTo: TOROS.button.primary.bg,
      colorBgAccentFromHover: TOROS.button.primary['bg-hover'],
      colorBgAccentToHover: TOROS.button.primary['bg-hover'],
      colorTextAccentHover: TOROS.text['primary-hover'],
      colorBgNeutral: TOROS.button.secondary.bg,
      colorTextNeutral: TOROS.button.secondary.text,
      colorTextLoading: TOROS.button.disabled.text,
      colorTextError: TOROS.text.error,
      colorTextWarning: TOROS.text.warning,
      colorBorderPrimary: TOROS.button.primary.border,
      colorScrollbar: TOROS.button.primary.border,
      colorIcon: TOROS.button.secondary.text,
    },
  },
  component: {
    actionButton: {
      color: {
        colorBgFrom: TOROS.button.primary.bg,
        colorBgTo: TOROS.button.primary.bg,
        colorText: TOROS.button.primary.text,
        colorBgFromHover: TOROS.button.primary['bg-hover'],
        colorBgToHover: TOROS.button.primary['bg-hover'],
        colorBorder: TOROS.button.primary.border,
        outlineColorBorder: TOROS.button.secondary.border,
        outlineColorBorderHover: TOROS.button.secondary['border-hover'],
        outlineColorText: TOROS.button.secondary.text,
      },
    },
    input: {
      color: {
        textColor: TOROS.text.primary,
        loadingTextColor: TOROS.text.disabled,
        bgColor: TOROS.input.bg,
        bgColorFocus: TOROS.input['bg-focus'],
        borderColor: TOROS.input.border,
        borderColorFocus: TOROS.input.border,
        placeholderColor: TOROS.text.secondary,
        buttonBgColor: TOROS.button.secondary.bg,
        buttonBorderColor: TOROS.button.secondary.border,
        buttonTextColor: TOROS.button.secondary.text,
      },
    },
    switch: {
      color: {
        colorBgChecked: TOROS.button.primary.bg,
        colorBg: BASE_COLORS.GRAY['400'],
        colorThumbBg: TOROS.button.secondary.text,
        colorThumbBgChecked: TOROS.button.primary.text,
      },
    },
    switchPanel: {
      color: {
        colorBorder: '#858B96',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof LimitOrderModalComponentWithTrigger>

export const LimitOrderModal: Story = {
  args: {
    themeConfig,
  },
}
