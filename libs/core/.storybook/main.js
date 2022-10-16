module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        transcludeMarkdown: true
      },
    },
    '@pxtrn/storybook-addon-docs-stencil'
  ],
  framework: "@storybook/web-components",
  core: {
    builder: "@storybook/builder-webpack5"
  },
  staticDirs: ['../dist'],
}
