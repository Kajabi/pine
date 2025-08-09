const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');

function fixUrlFormat() {
  fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .forEach((dirent) => {
      const dirName = dirent.name;
      const figmaPath = path.join(componentsDir, dirName, `${dirName}.figma.ts`);

      if (fs.existsSync(figmaPath)) {
        let content = fs.readFileSync(figmaPath, 'utf8');

        // Fix URLs that use &node-id= instead of ?node-id=
        const fixedContent = content.replace(
          /(https:\/\/www\.figma\.com\/file\/[^&]+)&node-id=/g,
          '$1?node-id='
        );

        if (content !== fixedContent) {
          fs.writeFileSync(figmaPath, fixedContent, 'utf8');
          console.log(`Fixed URL format in ${dirName}.figma.ts`);
        }
      }
    });
}

fixUrlFormat();