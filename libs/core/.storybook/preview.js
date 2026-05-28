import { setCustomElementsManifest } from '@storybook/web-components';
import { useEffect } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import stencilDocs from '../dist/docs.json';

// Import pine-core ESM bundle which auto-registers all custom elements on import
// Note: We use dist/pine-core instead of loader because:
// - loader/index.js references dist/esm which only exists in production builds (buildEs5: 'prod')
// - dist/pine-core is always built, even in dev mode
import '../dist/pine-core/pine-core.esm.js';

// Get all custom event names from Stencil docs
const allEventNames = stencilDocs.components
  .flatMap(component => component.events?.map(event => event.event) || [])
  .filter(Boolean);

// Track processed events to prevent duplicates
const processedEvents = new Set();

// Decorator to capture custom events and log them to the Actions panel
const withCustomEventActions = (StoryFn, context) => {
  useEffect(() => {
    // Use document to capture bubbling events
    const handlers = {};

    // Create handlers for each event
    allEventNames.forEach(eventName => {
      handlers[eventName] = (event) => {
        // Create unique key for this event instance
        const eventKey = `${eventName}-${event.timeStamp}`;

        // Skip if we've already processed this exact event
        if (processedEvents.has(eventKey)) return;
        processedEvents.add(eventKey);

        // Clean up old entries (keep set small)
        if (processedEvents.size > 100) {
          const entries = Array.from(processedEvents);
          entries.slice(0, 50).forEach(e => processedEvents.delete(e));
        }

        // Log event with details
        action(eventName)({
          detail: event.detail,
          target: event.target?.tagName?.toLowerCase(),
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

// Theme decorator that applies data-theme attribute
const withTheme = (StoryFn, context) => {
  const theme = context.globals.theme || 'light';

  // Apply immediately for initial render
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);

  // Also apply reactively when theme changes via toolbar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Notify parent window of theme change (for docs pages)
    try {
      window.parent.document.documentElement.setAttribute('data-theme', theme);
      window.parent.document.body.setAttribute('data-theme', theme);
    } catch (e) {
      // Cross-origin access may fail, that's ok
    }
  }, [theme]);

  return StoryFn();
};

// Direction decorator that applies `dir` on the preview iframe only.
// Unlike data-theme, `dir` is interpreted by the browser and must not be set on
// window.parent (that would flip Storybook manager/docs chrome).
// See Guides/RTL and localization for usage.
const withDirection = (StoryFn, context) => {
  const direction = context.globals.direction || 'ltr';

  document.documentElement.setAttribute('dir', direction);
  document.body.setAttribute('dir', direction);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.body.setAttribute('dir', direction);
  }, [direction]);

  return StoryFn();
};

const preview = {
  decorators: [
    withCustomEventActions,
    withTheme,
    withDirection,
  ],

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Document direction (LTR or RTL)',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR', right: 'Left-to-right' },
          { value: 'rtl', title: 'RTL', right: 'Right-to-left' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
    direction: 'ltr',
  },

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
