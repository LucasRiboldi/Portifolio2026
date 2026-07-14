import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../src/styles/globals.css'
import { ArtFilters } from '../src/components/design-system/art-filters'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'aranhaverso',
      values: [
        { name: 'aranhaverso', value: '#0a0612' },
        { name: 'paper', value: '#fff8e7' },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
  },
  decorators: [
    (Story) => (
      <div className="sv-canvas" style={{ minHeight: '100%', padding: '2.5rem' }}>
        <ArtFilters />
        <Story />
      </div>
    ),
  ],
}

export default preview
