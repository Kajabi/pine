const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');
const mappingPath = path.join(__dirname, 'figma-url-map.json');

// Components that have "corresponding node is not a component or component set" errors
const componentsToRemove = [
  'pds-tabs',        // node-id=488-43471
  'pds-table',       // node-id=2708-24009
  'pds-popover',     // node-id=2738-23248
  'pds-loader',      // node-id=2738-23248
  'pds-modal',       // node-id=2537-20081
  'pds-input',       // node-id=430-3529
  'pds-dropdown-menu', // node-id=36002-2315
  'pds-copytext'     // node-id=39264-36565
];

function removeInvalidFigmaFiles() {
  // Remove the .figma.ts files
  componentsToRemove.forEach(componentName => {
    const figmaPath = path.join(componentsDir, componentName, `${componentName}.figma.ts`);

    if (fs.existsSync(figmaPath)) {
      fs.unlinkSync(figmaPath);
      console.log(`Removed ${componentName}.figma.ts - invalid Figma node`);
    } else {
      console.log(`${componentName}.figma.ts not found`);
    }
  });

  // Update the URL mapping file
  if (fs.existsSync(mappingPath)) {
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

    // Set empty strings for removed components
    componentsToRemove.forEach(componentName => {
      mapping[componentName] = '';
    });

    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    console.log(`Updated figma-url-map.json - set empty URLs for removed components`);
  }
}

removeInvalidFigmaFiles();