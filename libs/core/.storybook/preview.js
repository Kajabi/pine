import { setCustomElementsManifest } from '@storybook/web-components';
import { useEffect } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import stencilDocs from '../dist/docs.json';

// Import defineCustomElements from loader (prestart runs build first to generate polyfills)
import { defineCustomElements } from '../loader';

// Register Stencil custom elements
defineCustomElements();

// Get all custom event names from Stencil docs
const allEventNames = stencilDocs.components
  .flatMap(component => component.events?.map(event => event.event) || [])
  .filter(Boolean);

// Decorator to capture custom events and log them to the Actions panel
const withCustomEventActions = (StoryFn, context) => {
  useEffect(() => {
    // Use document to capture bubbling events
    const handlers = {};

    // Create handlers for each event
    allEventNames.forEach(eventName => {
      handlers[eventName] = (event) => {
        // Log event with more details
        action(eventName)({
          detail: event.detail,
          target: event.target?.tagName?.toLowerCase(),
          type: event.type,
          timeStamp: event.timeStamp,
          bubbles: event.bubbles,
          composed: event.composed,
        });
      };
      document.addEventListener(eventName, handlers[eventName]);
    });

    // Cleanup
    return () => {
      allEventNames.forEach(eventName => {
        document.removeEventListener(eventName, handlers[eventName]);
      });
    };
  }, [context.id]);

  return StoryFn();
};

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
  decorators: [withCustomEventActions],

  parameters: {
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
