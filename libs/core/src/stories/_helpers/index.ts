import pdsIconsJson from '@pine-ds/icons/dist/pds-icons.json';

interface IconControlArgs {
  component: string,
  property: string
}

/**
 * Creates custom argTypes configuration for icon properties with a select control
 * populated with available icon names.
 *
 * Note: In Storybook 10 with @stencil/storybook-plugin, argTypes are automatically
 * extracted from custom-elements.json. This helper only overrides the icon property
 * to use a select control with available icon options.
 *
 * @param component - string - Name of the component (not used with Stencil plugin auto-extraction)
 * @param property - string - Name of the icon property to customize (e.g., 'icon')
 * @returns object - ArgTypes configuration for the icon property
 */
export const customArgsWithIconControl = ({property}: Omit<IconControlArgs, 'component'>) => {
  // Return argTypes override for the icon property
  // The Stencil plugin will handle other argTypes automatically
  return {
    [property]: {
      control: {
        type: 'select',
      },
      options: Object.values(pdsIconsJson["icons"]).map((icon) => (icon.name)),
    }
  };
}

export { ChangelogLoader } from './ChangelogLoader';
export { ChangelogRenderer } from './ChangelogRenderer';

