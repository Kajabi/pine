import { dirname, join } from "path";

const config = {
  stories: [
    "../src/**/*.docs.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@pxtrn/storybook-addon-docs-stencil"),
  ],

  core: {},

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {}
  },

  staticDirs: ['../dist', '../assets']
}

export default config;

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
