const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');
const mappingPath = path.join(__dirname, 'figma-url-map.json');

// Read the mapping file
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

function updateFigmaUrls() {
  fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .forEach((dirent) => {
      const dirName = dirent.name;
      const figmaPath = path.join(componentsDir, dirName, `${dirName}.figma.ts`);

      if (fs.existsSync(figmaPath)) {
        const figmaContent = fs.readFileSync(figmaPath, 'utf8');
        const figmaUrl = mapping[dirName];

        if (figmaUrl && figmaUrl.startsWith('https://www.figma.com/file/')) {
          // Replace the URL in the figma.connect call
          const updatedContent = figmaContent.replace(
            /figma\.connect\(['"]([^'"\)]+)['"]/,
            `figma.connect('${figmaUrl}'`
          );

          fs.writeFileSync(figmaPath, updatedContent, 'utf8');
          console.log(`Updated ${dirName} with URL: ${figmaUrl}`);
        } else {
          console.log(`Skipped ${dirName} - no valid URL in mapping`);
        }
      }
    });
}

updateFigmaUrls();