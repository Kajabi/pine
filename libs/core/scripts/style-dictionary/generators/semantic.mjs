import { semanticFilter } from "../filters/semantic.mjs";

const format = "css/variables";

export const generateSemanticFiles = (theme) => {
  const filesArr = [];
  const [themeName] = theme.toLowerCase().split('-');

  // Base semantic tokens (non-themeable)
  filesArr.push({
    format,
    filter: semanticFilter(false),
    destination: `base/_semantic.scss`,
    options: {
      outputReferences: true
    }
  });

  // Theme-specific semantic tokens
  filesArr.push({
    format,
    filter: semanticFilter(true, themeName),
    destination: `brand/${themeName}/${themeName}.scss`,
    options: {
      outputReferences: true
    }
  });

  return filesArr;
};
