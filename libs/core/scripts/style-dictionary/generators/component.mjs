import fs from 'fs-extra'
import { outputReferencesTransformed } from "style-dictionary/utils";
import { componentFilter } from "../filters/index.mjs";
import { basePath } from "../utils.mjs";

const componentPrefix = 'pds';
const format = "css/variables";

// for each component, filter those specific component tokens and output them
// to the component folder where the component source code will live
export const generateComponentFiles = () => {
  const filesArr = [];

  // Generates a list of components from the tokens/components folder
  const components = fs.readdirSync(`${basePath}/components`).map((comp) => comp.replace(/.json$/g, ""));

  for (const comp of components) {
    // theme-specific outputs
    const componentName = `${componentPrefix}-${comp}`;

    filesArr.push({
      format,
      filter: componentFilter(comp, true),
      options: {
        selector: ":host",
        outputReferences: outputReferencesTransformed,
      },
      destination: `../../../components/${componentName}/${componentName}.tokens.scss`,
    });
  }
  return filesArr;
};
