import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  // Vite 8 usa lightningcss para minificar e falha com nosso CSS (Tailwind + data-URIs).
  // Usa esbuild para minificar o CSS, evitando o erro de token.
  viteFinal: async (viteConfig) => {
    viteConfig.build = viteConfig.build ?? {};
    viteConfig.build.cssMinify = 'esbuild';
    if (viteConfig.css) {
      // remove transformer lightningcss se ativado
      delete (viteConfig.css as { transformer?: unknown }).transformer;
      delete (viteConfig.css as { lightningcss?: unknown }).lightningcss;
    }
    return viteConfig;
  },
};
export default config;
