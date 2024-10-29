import { brandFilter } from "./sd-filters.mjs";

export const generateBrandFiles = (theme) => {
  const filesArr = [];
  console.log('Theme Name: ',theme)
  // not theme-specific outputs
  filesArr.push({
    format: "css/variables",
    filter: brandFilter(false),
    destination: `${theme.split('-')[0]}/${theme.toLowerCase()}.scss`,
  });

  return filesArr;
};
