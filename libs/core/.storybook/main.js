import { dirname, join } from "path";

const config = {
  stories: [
    "../src/**/*.docs.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@pxtrn/storybook-addon-docs-stencil",
    "@storybook/addon-mdx-gfm",
    "@chromatic-com/storybook"
  ],

  core: {},

  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },

  staticDirs: ['../dist', '../assets'],

  docs: {}
}

export default config;

