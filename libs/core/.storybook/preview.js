import { setCustomElementsManifest } from '@storybook/web-components';
import stencilDocs from '../dist/docs.json';

// Import defineCustomElements from loader (prestart runs build first to generate polyfills)
import { defineCustomElements } from '../loader';

// Register Stencil custom elements
defineCustomElements();

// Transform Stencil's docs-json to Custom Elements Manifest format
// This enables automatic argTypes extraction for controls
const customElementsManifest = {
  schemaVersion: '1.0.0',
  modules: stencilDocs.components.map(component => ({
    kind: 'javascript-module',
    path: component.filePath,
    declarations: [{
      kind: 'class',
      name: component.tag,
      tagName: component.tag,
      customElement: true,
      description: component.docs,
      // Transform Stencil props to CEM members
      members: component.props?.map(prop => ({
        kind: 'field',
        name: prop.name,
        type: { text: prop.type },
        description: prop.docs,
        default: prop.default,
        attribute: prop.attr,
      })) || [],
      // Transform Stencil events to CEM events
      events: component.events?.map(event => ({
        name: event.event,
        type: { text: event.detail },
        description: event.docs,
      })) || [],
      // Transform Stencil slots
      slots: component.slots?.map(slot => ({
        name: slot.name || '',
        description: slot.docs,
      })) || [],
      // Transform CSS custom properties
      cssProperties: component.styles?.map(style => ({
        name: style.name,
        description: style.docs,
      })) || [],
      // Transform CSS parts
      cssParts: component.parts?.map(part => ({
        name: part.name,
        description: part.docs,
      })) || [],
    }],
    exports: [{
      kind: 'custom-element-definition',
      name: component.tag,
      declaration: { name: component.tag },
    }],
  })),
};

setCustomElementsManifest(customElementsManifest);

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', ['Welcome',], 'Foundations', 'Design Tokens', ['Tokens'], 'Guides', 'Components', 'Resources'],
        locales: 'en-US',
      },
    }
  },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    hideNoControlsWarning: true,
  },

  tags: ['autodocs']
}

export default preview;
