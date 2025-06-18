const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../libs/core/src/components');
const figmaUrlPlaceholder = 'https://www.figma.com/file/REPLACE_WITH_FILE_KEY?node-id=REPLACE_WITH_NODE_ID';

function extractProps(tsxContent) {
  const propRegex = /@Prop\([^)]*\)\s+(\w+)\??:\s*([^=;]+)(?:\s*=\s*([^;]+))?/g;
  const simplePropRegex = /@Prop\([^)]*\)\s+(\w+)\??\s*=\s*([^;]+)/g;
  const barePropRegex = /@Prop\([^)]*\)\s+(\w+)\??\s*;/g;

  let match;
  const props = [];

  while ((match = propRegex.exec(tsxContent))) {
    props.push({
      name: match[1],
      type: match[2].trim(),
      default: match[3] ? match[3].trim() : undefined,
    });
  }
  while ((match = simplePropRegex.exec(tsxContent))) {
    if (!props.find(p => p.name === match[1])) {
      props.push({
        name: match[1],
        type: 'boolean',
        default: match[2].trim(),
      });
    }
  }
  while ((match = barePropRegex.exec(tsxContent))) {
    if (!props.find(p => p.name === match[1])) {
      props.push({
        name: match[1],
        type: 'string',
      });
    }
  }
  return props;
}

function typeToFigma(name, type) {
  if (/\|/.test(type)) {
    const options = {};
    type.split('|').map(s => s.trim().replace(/['"]/g, ''))
      .forEach(opt => {
        if (opt) options[opt.charAt(0).toUpperCase() + opt.slice(1)] = opt;
      });
    return `figma.enum('${name[0].toUpperCase() + name.slice(1)}', ${JSON.stringify(options, null, 2)})`;
  }
  if (/boolean/.test(type)) return `figma.boolean('${name[0].toUpperCase() + name.slice(1)}')`;
  if (/number/.test(type)) return `figma.string('${name[0].toUpperCase() + name.slice(1)}')`;
  if (/string/.test(type)) return `figma.string('${name[0].toUpperCase() + name.slice(1)}')`;
  return `figma.string('${name[0].toUpperCase() + name.slice(1)}')`;
}

function generatePropsSection(props) {
  return props.map(p => `    ${p.name}: ${typeToFigma(p.name, p.type)},`).join('\n');
}

function generateExample(tag, props) {
  const attrs = props.map(p => {
    if (/boolean/.test(p.type)) return `?${p.name}=\${props.${p.name}}`;
    return `${p.name}=\${props.${p.name}}`;
  }).join('\n    ');
  return `  example: (props) => html\`<${tag}\n    ${attrs}\n  ></${tag}>\`,`;
}

function regenerateFigmaFile(dirName, tag, figmaUrl, props) {
  const filePath = path.join(componentsDir, dirName, `${dirName}.figma.ts`);
  const content = `import figma, { html } from '@figma/code-connect/html';

figma.connect('${figmaUrl}', {
  props: {
${generatePropsSection(props)}
  },
${generateExample(tag, props)}
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Regenerated: ${filePath}`);
}

fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
  .forEach((dirent) => {
    const dirName = dirent.name;
    const tag = dirName;
    const tsxPath = path.join(componentsDir, dirName, `${dirName}.tsx`);
    const figmaPath = path.join(componentsDir, dirName, `${dirName}.figma.ts`);
    let figmaUrl = figmaUrlPlaceholder;

    // Try to extract existing URL
    if (fs.existsSync(figmaPath)) {
      const figmaContent = fs.readFileSync(figmaPath, 'utf8');
      const urlMatch = figmaContent.match(/figma\.connect\(['"]([^'"\)]+)['"]/);
      if (
        urlMatch &&
        urlMatch[1].startsWith('https://www.figma.com/file/') &&
        !urlMatch[1].includes('REPLACE_WITH')
      ) {
        figmaUrl = urlMatch[1];
      }
    }

    if (fs.existsSync(tsxPath)) {
      const tsxContent = fs.readFileSync(tsxPath, 'utf8');
      const props = extractProps(tsxContent);
      regenerateFigmaFile(dirName, tag, figmaUrl, props);
    }
  });