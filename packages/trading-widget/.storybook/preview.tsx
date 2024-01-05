import '../src/styles/index.css'

import { Preview } from '@storybook/react'

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
