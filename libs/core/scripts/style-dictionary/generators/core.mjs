export const generateCoreFiles = () => [
  {
    destination: `base/_core.scss`,
    format: 'css/variables',
    filter: token => token.filePath.includes('base/core'),
    options: {
      outputReferences: true
    }
  }
];
