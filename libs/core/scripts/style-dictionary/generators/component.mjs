import { outputReferencesTransformed } from "style-dictionary/utils";
import { componentFilter } from "../filters/index.mjs";

const componentPrefix = 'pds';
const format = "css/variables";

// for each component, filter those specific component tokens and output them
// to the component folder where the component source code will live
export const generateComponentFiles = (components) => {
  const filesArr = [];

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
