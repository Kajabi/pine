import { semanticFilter } from "../filters/semantic.mjs";

const format = "css/variables";

export const generateSemanticFiles = (theme) => {
  const filesArr = [];
  const [themeName, mode] = theme.toLowerCase().split('-');

  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true),
    destination: `brand/${themeName}/styles/${mode}.scss`,
  });


  // not theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(false),
    destination: `brand/${themeName}/styles/semantic.scss`,
  });

  return filesArr;
};
