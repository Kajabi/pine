const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');

// Components that still have placeholder URLs (no Figma designs yet)
const componentsToRemove = [
  'pds-sortable',
  'pds-text',
  'pds-image',
  'pds-progress'
];

function removePlaceholderFigmaFiles() {
  componentsToRemove.forEach(componentName => {
    const figmaPath = path.join(componentsDir, componentName, `${componentName}.figma.ts`);

    if (fs.existsSync(figmaPath)) {
      fs.unlinkSync(figmaPath);
      console.log(`Removed ${componentName}.figma.ts - no Figma design available`);
    } else {
      console.log(`${componentName}.figma.ts not found`);
    }
  });
}

removePlaceholderFigmaFiles();