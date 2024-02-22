import '../src/styles/index.css'

import type { Preview } from '@storybook/react'

import { Providers } from '../src/providers'

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
}

export default preview
