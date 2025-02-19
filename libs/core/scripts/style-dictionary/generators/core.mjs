import { coreFilter } from "../filters/index.mjs";

const format = "css/variables";

export const generateCoreFiles = () => [
  {
    destination: `base/_core.scss`,
    format,
    filter: coreFilter
  }
];
