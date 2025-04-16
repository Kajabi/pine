export const generateSemanticFiles = () => {
  const filesArr = [];

  // Base semantic tokens (non-themeable)
  filesArr.push({
    destination: `base/_semantic.scss`,
    format: 'css/variables',
    filter: token => token.filePath.includes('base/semantic'),
    options: {
      outputReferences: true
    }
  });

  return filesArr;
};
