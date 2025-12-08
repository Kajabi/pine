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

    const currentDir = dirname(fileURLToPath(import.meta.url));
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Resolve @pine-ds/doc-components to source files (no pre-build needed)
    config.resolve.alias['@pine-ds/doc-components'] = join(currentDir, '../../doc-components/src');


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

    // Exclude Stencil loader from Vite analysis to prevent "dist/esm" resolution errors
    // The loader references dist/esm which only exists in production builds
    config.optimizeDeps.exclude.push('@pine-ds/core/loader');

    // Configure Vite watch settings for HMR
    // The key issue: Storybook loads from dist/, so we need Vite to watch dist/ files
    // But we also need to watch source files so changes trigger reloads
    config.server.watch = config.server.watch || {};
    config.server.watch.ignored = config.server.watch.ignored || [];

    // Only ignore specific build artifacts that shouldn't trigger reloads
    // Don't ignore dist/ entirely - we need to watch dist/docs.json and dist/collection for changes
    config.server.watch.ignored.push(
      '**/loader/**',  // Ignore loader to prevent test rebuild issues
      '**/www/**',     // Ignore www build output
      '**/node_modules/**',
      '**/coverage/**',
      // Ignore specific dist subdirectories that aren't used by Storybook
      '**/dist/cjs/**',
      '**/dist/esm-es5/**',
      '**/dist/pine-core/**',
      '**/dist/types/**',
      // Note: We DO want to watch dist/docs.json and dist/collection/** for component changes
    );

    // Enable HMR for better live reload experience
    config.server.hmr = config.server.hmr || {};
    config.server.hmr.overlay = true;

    // Configure Vite to use native file system events (faster than polling)
    config.server.watch.usePolling = false;

    // Dedupe lit to avoid "Multiple versions of Lit loaded" warning
    config.resolve.dedupe = config.resolve.dedupe || [];
    config.resolve.dedupe.push('lit', 'lit-html', 'lit-element', '@lit/reactive-element');

    return config;
  }
}

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

