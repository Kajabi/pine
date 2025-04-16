import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

import pdsIconsJson from '@pine-ds/icons/dist/pds-icons.json';

interface IconControlArgs {
  component: string,
  property: string[]
}

/**
 *
 * @param component - string - Name of the compoennt to extract args. e.g pds-button
 * @param property - string[] - Name of the properties used within the component e.g icon, trailingIcon
 * @returns object
 */
export const customArgsWithIconControl = ({component, property}: IconControlArgs) => {
  const extractedArgs = extractArgTypes(component);

  if (Array.isArray(property)) {
    property.forEach((prop) => {
      extractedArgs[prop].control.type = 'select';
      extractedArgs[prop].options = Object.values(pdsIconsJson["icons"]).map((icon) => (icon.name));
    });
  } else {
    extractedArgs[property].control.type = 'select';
    extractedArgs[property].options = Object.values(pdsIconsJson["icons"]).map((icon) => (icon.name));
  }

  return extractedArgs;
}

