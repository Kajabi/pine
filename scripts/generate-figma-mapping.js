const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');
const figmaUrlPlaceholder = 'https://www.figma.com/design/REPLACE_WITH_YOUR_FILE_AND_NODE_ID';

function toTagName(dirName) {
  // e.g. pds-divider => pds-divider
  return dirName;
}

function toFileName(dirName) {
  // e.g. pds-divider => pds-divider.figma.ts
  return `${dirName}.figma.ts`;
}

function generateFigmaFile(dirName) {
  const tag = toTagName(dirName);
  const fileName = toFileName(dirName);
  const filePath = path.join(componentsDir, dirName, fileName);
  const content = `import figma from '@figma/code-connect/html';\n\nfigma.connect('${tag}', '${figmaUrlPlaceholder}', {\n  props: {\n    // Add prop mappings here\n  },\n  example: (props) => {\n    return \`<${tag}></${tag}>\`;\n  },\n});\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Generated: ${filePath}`);
}

fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
  .forEach((dirent) => {
    generateFigmaFile(dirent.name);
  });