import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

import pdsIconsJson from '../../../../icons/dist/pds-icons.json';

interface IconControlArgs {
  component: string,
  property: string
}

/**
 *
 * @param component - string - Name of the compoennt to extract args. e.g pds-button
 * @param property - string - Name of the property used within the component e.g icon
 * @returns object
 */
export const customArgsWithIconControl = ({component, property}: IconControlArgs) => {
  const extractedArgs = extractArgTypes(component);

  extractedArgs[property].control.type = 'select';
  extractedArgs[property].options = Object.values(pdsIconsJson["icons"]).map((icon) => (icon.name));

  return extractedArgs;
}

