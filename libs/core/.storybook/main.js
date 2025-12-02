import { fileURLToPath } from "node:url";
import { dirname, join } from "path";
import react from '@vitejs/plugin-react';

const config = {
  stories: [
    "../src/**/docs/*.mdx",
    "../src/stories/**/*.docs.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
  ],

  core: {},

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {}
  },

  staticDirs: ['../dist', '../assets'],

  docs: {},

  async viteFinal(config) {
    config.plugins = config.plugins || [];

    // Add React plugin to support React components in MDX (for @pine-ds/doc-components)
    config.plugins.push(react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }));

    // Add plugin early in the chain to fix file:// protocol imports
    config.plugins.unshift({
      name: 'fix-mdx-file-protocol-imports',
      enforce: 'pre',

      resolveId(source, importer) {
        // Handle file:// protocol imports
        if (source.startsWith('file://')) {
          // Remove file:// protocol to get the actual file system path
          const filePath = source.replace('file://', '');

          // Return the absolute path directly
          // Vite needs the actual file path, not a module specifier
          return {
            id: filePath,
            external: false
          };
        }
        return null;
      }
    });

    // Configure Vite server for better MDX handling
    config.server = config.server || {};
    config.server.fs = config.server.fs || {};
    config.server.fs.strict = false; // Allow serving files from outside root

    // Make sure MDX files and web components are optimized correctly
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push(
      '@storybook/web-components',
      '@storybook/addon-docs'
    );

    // Exclude MDX files from optimization to prevent issues
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    config.optimizeDeps.exclude.push('@mdx-js/react');

    return config;
  }
}

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

