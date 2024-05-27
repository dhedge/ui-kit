import 'styles/index.css'

import type { Preview } from '@storybook/react'

import { Providers } from '../src/examples/simple-example'

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
