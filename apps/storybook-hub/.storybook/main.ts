import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  refs: {
    react: {
      title: 'React Components',
      url: 'http://localhost:6006',
    },
  },
}

export default config
