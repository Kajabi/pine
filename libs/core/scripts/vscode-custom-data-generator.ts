import { JsonDocs, JsonDocsComponent, JsonDocsProp } from '@stencil/core/internal';
import * as fs from 'fs';
import * as path from 'path';

/**
 * VS Code HTML Custom Data Generator
 *
 * Generates a VS Code custom data file that maximizes the spec:
 * - Tag descriptions with markdown
 * - Attribute descriptions with types and defaults
 * - Attribute value descriptions for enums
 * - References to documentation
 * - Slot documentation as attributes
 * - CSS Parts documentation
 * - Event documentation
 */

interface VSCodeCustomData {
  version: 1.1;
  tags: VSCodeTag[];
  globalAttributes?: VSCodeAttribute[];
}

interface VSCodeTag {
  name: string;
  description: string | { kind: 'markdown' | 'plaintext'; value: string };
  attributes: VSCodeAttribute[];
  references?: VSCodeReference[];
}

interface VSCodeAttribute {
  name: string;
  description?: string | { kind: 'markdown' | 'plaintext'; value: string };
  values?: VSCodeAttributeValue[];
  references?: VSCodeReference[];
}

interface VSCodeAttributeValue {
  name: string;
  description?: string;
  references?: VSCodeReference[];
}

interface VSCodeReference {
  name: string;
  url: string;
}

// Configuration
const DOCS_BASE_URL = 'https://pine-design-system.netlify.app';

// Cache for component tag -> storybook title mapping
let storyTitleCache: Map<string, string> | null = null;

// Cache for component tag -> parsed MDX data (docs and examples)
interface MdxParsedData {
  docs: string;
  examples: string[];
}
let mdxCache: Map<string, MdxParsedData> | null = null;

/**
 * Find the MDX documentation file for a component
 */
function findMdxFile(componentTag: string): string | null {
  const componentsDir = path.resolve(__dirname, '..', 'src', 'components');

  // Try direct path first: pds-button -> pds-button/docs/pds-button.mdx
  const directPath = path.join(componentsDir, componentTag, 'docs', `${componentTag}.mdx`);
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  // Try nested component path: pds-table-cell -> pds-table/pds-table-cell/docs/pds-table-cell.mdx
  // Search recursively for the docs folder
  const searchForMdx = (dir: string): string | null => {
    if (!fs.existsSync(dir)) return null;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name === componentTag) {
          const mdxPath = path.join(dir, entry.name, 'docs', `${componentTag}.mdx`);
          if (fs.existsSync(mdxPath)) {
            return mdxPath;
          }
        }
        // Recurse into subdirectories
        const found = searchForMdx(path.join(dir, entry.name));
        if (found !== null) return found;
      }
    }
    return null;
  };

  return searchForMdx(componentsDir);
}

/**
 * Parse MDX content and extract h3 headings under the ## Examples section.
 * Returns an array of example names (e.g., ["Primary", "Secondary", "Tertiary"]).
 */
function parseMdxExamples(mdxContent: string): string[] {
  const lines = mdxContent.split('\n');
  const examples: string[] = [];

  let inExamplesSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Look for ## Examples heading
    if (trimmedLine.toLowerCase() === '## examples') {
      inExamplesSection = true;
      continue;
    }

    // Stop at the next h2 heading (but not h3/h4)
    if (inExamplesSection && trimmedLine.startsWith('## ') && trimmedLine.toLowerCase() !== '## examples') {
      break;
    }

    // Collect h3 headings within the Examples section
    if (inExamplesSection && trimmedLine.startsWith('### ')) {
      const heading = trimmedLine.replace(/^### /, '').trim();
      examples.push(heading);
    }
  }

  return examples;
}

/**
 * Parse MDX content and extract the first paragraph after the component name header.
 * This provides a concise description for VS Code hover tooltips.
 */
function parseMdxToMarkdown(mdxContent: string): string {
  const lines = mdxContent.split('\n');

  let foundHeader = false;
  const paragraphLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip import statements and JSX at the top
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('<Meta')) {
      continue;
    }

    // Look for the main component header (# ComponentName)
    if (!foundHeader && trimmedLine.startsWith('# ')) {
      foundHeader = true;
      continue;
    }

    // Once we've found the header, collect the first paragraph
    if (foundHeader) {
      // Skip empty lines before the paragraph starts
      if (paragraphLines.length === 0 && trimmedLine === '') {
        continue;
      }

      // Stop at the next heading, empty line after paragraph, or JSX
      if (trimmedLine.startsWith('#') || trimmedLine.startsWith('<') || (paragraphLines.length > 0 && trimmedLine === '')) {
        break;
      }

      paragraphLines.push(trimmedLine);
    }
  }

  return paragraphLines.join(' ').trim();
}

/**
 * Get parsed MDX data for a component (with caching).
 * Reads and parses the MDX file once, extracting both docs and examples.
 */
function getMdxData(componentTag: string): MdxParsedData {
  if (!mdxCache) {
    mdxCache = new Map();
  }

  const cached = mdxCache.get(componentTag);
  if (cached) {
    return cached;
  }

  const emptyData: MdxParsedData = { docs: '', examples: [] };

  const mdxPath = findMdxFile(componentTag);
  if (!mdxPath) {
    mdxCache.set(componentTag, emptyData);
    return emptyData;
  }

  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const data: MdxParsedData = {
      docs: parseMdxToMarkdown(mdxContent),
      examples: parseMdxExamples(mdxContent),
    };
    mdxCache.set(componentTag, data);
    return data;
  } catch {
    mdxCache.set(componentTag, emptyData);
    return emptyData;
  }
}

/**
 * Recursively find all story files in a directory
 */
function findStoryFiles(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findStoryFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.stories.js')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Build cache mapping component tags to their Storybook titles
 * by reading story files
 */
function buildStoryTitleCache(): void {
  if (storyTitleCache) {
    return;
  }

  storyTitleCache = new Map();
  const componentsDir = path.resolve(__dirname, '..', 'src', 'components');
  const storyFiles = findStoryFiles(componentsDir);

  for (const storyFile of storyFiles) {
    try {
      const content = fs.readFileSync(storyFile, 'utf-8');

      // Extract component tag from the story file
      const componentMatch = content.match(/component:\s*['"]([^'"]+)['"]/);
      // Extract title from the story file
      const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);

      if (componentMatch && titleMatch) {
        storyTitleCache.set(componentMatch[1], titleMatch[1]);
      }
    } catch {
      // Skip files that can't be read
    }
  }
}

/**
 * Get the Storybook title for a component
 */
function getStoryTitle(tag: string): string | undefined {
  buildStoryTitleCache();
  return storyTitleCache?.get(tag);
}

/**
 * Convert a Storybook title to a URL path segment
 * e.g., "components/Table" -> "components-table"
 * e.g., "components/Copy Text" -> "components-copy-text"
 * e.g., "components/Radio Group/Radio" -> "components-radio-group-radio"
 */
function titleToUrlPath(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces to dashes
    .replace(/\//g, '-'); // slashes to dashes
}

/**
 * Get the Storybook documentation URL for a component
 */
function getComponentDocsUrl(tag: string): string {
  const title = getStoryTitle(tag);

  if (title !== undefined) {
    // Generate proper Storybook docs URL
    const urlPath = titleToUrlPath(title);
    return `${DOCS_BASE_URL}/?path=/docs/${urlPath}--docs`;
  }

  // Fallback for components without a story file
  // Convert pds-button -> components-button
  const componentName = tag.replace(/^pds-/, '');
  return `${DOCS_BASE_URL}/?path=/docs/components-${componentName}--docs`;
}

/**
 * Convert an MDX heading to a URL anchor fragment
 * e.g., "Primary" -> "primary", "Icon Only" -> "icon-only", "Full Width" -> "full-width"
 */
function headingToAnchor(heading: string): string {
  return heading.toLowerCase().replace(/\s+/g, '-'); // spaces to dashes
}

/**
 * Get a URL to a specific example section in the docs (using anchor)
 */
function getExampleUrl(tag: string, exampleHeading: string): string {
  const docsUrl = getComponentDocsUrl(tag);
  const anchor = headingToAnchor(exampleHeading);
  return `${docsUrl}#${anchor}`;
}

function formatPropDescription(prop: JsonDocsProp): string {
  const parts: string[] = [];

  // Main description
  if (prop.docs) {
    parts.push(prop.docs);
  }

  // Type info (skip common primitive types)
  if (prop.type && prop.type !== 'string' && prop.type !== 'boolean') {
    parts.push(`\n\n**Type:** \`${prop.type}\``);
  }

  // Default value
  const defaultTag = prop.docsTags?.find((t) => t.name === 'default');
  const defaultValue = defaultTag?.text || prop.default;
  if (defaultValue) {
    parts.push(`\n\n**Default:** \`${defaultValue}\``);
  }

  // Deprecation warning
  const deprecatedTag = prop.docsTags?.find((t) => t.name === 'deprecated');
  if (deprecatedTag) {
    parts.push(`\n\n⚠️ **Deprecated:** ${deprecatedTag.text || 'This property is deprecated.'}`);
  }

  return parts.join('');
}

function formatComponentDescription(component: JsonDocsComponent): string {
  const parts: string[] = [];
  const mdxData = getMdxData(component.tag);

  // Try to get rich MDX documentation first, fallback to JSDoc description
  if (mdxData.docs) {
    parts.push(mdxData.docs);
  } else if (component.docs) {
    parts.push(component.docs);
  }

  // Add Examples section with links to MDX example headings
  if (mdxData.examples.length > 0) {
    const exampleLinks = mdxData.examples.map((heading) => {
      const url = getExampleUrl(component.tag, heading);
      return `[${heading}](${url})`;
    });
    parts.push(`\n\n**Examples:**\n${exampleLinks.join(', ')}`);
  }

  // Slots
  if (component.slots && component.slots.length > 0) {
    parts.push('\n\n**Slots:**');
    for (const slot of component.slots) {
      const slotName = slot.name === '' || slot.name === '(default)' ? '(default)' : slot.name;
      parts.push(`\n- \`${slotName}\` - ${slot.docs || 'No description'}`);
    }
  }

  // CSS Parts
  if (component.parts && component.parts.length > 0) {
    parts.push('\n\n**CSS Parts:**');
    for (const part of component.parts) {
      parts.push(`\n- \`${part.name}\` - ${part.docs || 'No description'}`);
    }
  }

  // Events
  if (component.events && component.events.length > 0) {
    parts.push('\n\n**Events:**');
    for (const event of component.events) {
      parts.push(`\n- \`${event.event}\` - ${event.docs || 'No description'}`);
    }
  }

  return parts.join('');
}

function extractEnumValues(prop: JsonDocsProp): VSCodeAttributeValue[] | undefined {
  // Check if prop.values has string literal values
  if (prop.values === undefined || prop.values.length === 0) {
    return undefined;
  }

  const enumValues = prop.values.filter((v) => v.type === 'string' && v.value);

  if (enumValues.length === 0) {
    return undefined;
  }

  return enumValues.map((v) => ({
    name: v.value!,
    description: undefined, // Could be enhanced with JSDoc @value tags if we add them
  }));
}

function convertPropToAttribute(prop: JsonDocsProp): VSCodeAttribute | null {
  // Skip props that don't have an HTML attribute equivalent
  if (prop.attr === undefined || prop.attr === '') {
    return null;
  }

  const attribute: VSCodeAttribute = {
    name: prop.attr,
    description: {
      kind: 'markdown',
      value: formatPropDescription(prop),
    },
  };

  // Add enum values if applicable
  const enumValues = extractEnumValues(prop);
  if (enumValues) {
    attribute.values = enumValues;
  }

  return attribute;
}

function convertComponent(component: JsonDocsComponent): VSCodeTag | null {
  // Skip test/mock components
  if (component.tag.startsWith('mock-') || component.filePath.includes('/test/')) {
    return null;
  }

  const tag: VSCodeTag = {
    name: component.tag,
    description: {
      kind: 'markdown',
      value: formatComponentDescription(component),
    },
    attributes: [],
    references: [
      {
        name: 'Documentation',
        url: getComponentDocsUrl(component.tag),
      },
    ],
  };

  // Convert props to attributes
  if (component.props !== undefined && component.props.length > 0) {
    for (const prop of component.props) {
      const attr = convertPropToAttribute(prop);
      if (attr) {
        tag.attributes.push(attr);
      }
    }
  }

  return tag;
}

export function generateVSCodeCustomData(docs: JsonDocs, outputPath: string): void {
  // Reset caches for fresh generation
  storyTitleCache = null;
  mdxCache = null;

  const customData: VSCodeCustomData = {
    version: 1.1,
    tags: [],
  };

  for (const component of docs.components) {
    const tag = convertComponent(component);
    if (tag) {
      customData.tags.push(tag);
    }
  }

  // Sort tags alphabetically
  customData.tags.sort((a, b) => a.name.localeCompare(b.name));

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const newContent = JSON.stringify(customData, null, 2);

  // Only write if content has changed (prevents watch loop)
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(outputPath, 'utf-8');
  } catch {
    // File doesn't exist yet, that's fine
  }

  if (newContent !== existingContent) {
    fs.writeFileSync(outputPath, newContent);
    console.log(`✅ Generated VS Code custom data: ${outputPath}`);
    console.log(`   ${customData.tags.length} components documented`);
  } else {
    console.log(`ℹ️  VS Code custom data unchanged: ${outputPath}`);
  }
}

// For use as a Stencil docs-custom generator
export default function vscodeCustomDataOutputTarget(outputPath: string = 'vscode.html-data.json') {
  return {
    type: 'docs-custom' as const,
    generator: (docs: JsonDocs) => {
      generateVSCodeCustomData(docs, outputPath);
    },
  };
}
