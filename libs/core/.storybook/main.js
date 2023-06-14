module.exports = {
  stories: [
    "../src/**/*.docs.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        transcludeMarkdown: true
      },
    },
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    '@pxtrn/storybook-addon-docs-stencil',
  ],
  framework: "@storybook/web-components",
  core: {
    builder: "@storybook/builder-webpack5"
  },
  staticDirs: ['../dist', '../assets'],
}
