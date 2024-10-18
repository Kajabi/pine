import { brandFilter } from "./sd-filters.mjs";

export const generateBrandFiles = (theme) => {
  const filesArr = [];

  // not theme-specific outputs
  filesArr.push({
    format: "css/variables",
    filter: brandFilter(false),
    destination: `brand/${theme.toLowerCase()}.scss`,
  });

  return filesArr;
};
