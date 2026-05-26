import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../*/src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.esbuild = { ...config.esbuild, target: 'es2020' }
    return config
  },
}

export default config
