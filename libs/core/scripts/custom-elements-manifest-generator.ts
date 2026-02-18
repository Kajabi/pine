import {
  JsonDocs,
  JsonDocsComponent,
  JsonDocsProp,
  JsonDocsEvent,
  JsonDocsMethod,
  JsonDocMethodParameter,
  JsonDocsSlot,
  JsonDocsPart,
  JsonDocsStyle,
} from '@stencil/core/internal';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom Elements Manifest Generator
 *
 * Generates a standard Custom Elements Manifest (CEM) file following the
 * schema defined at: https://github.com/webcomponents/custom-elements-manifest
 *
 * This format is supported by:
 * - VS Code web components extension
 * - Storybook (web-components)
 * - JetBrains IDEs
 * - Other tooling that follows the CEM spec
 */

// ============================================================================
// MDX Documentation Parsing
// ============================================================================

interface MdxParsedData {
  description: string;
  summary: string;
  examples: MdxExample[];
}

interface MdxExample {
  name: string;
  description: string;
  code: string;
}

// Cache for parsed MDX data
let mdxCache: Map<string, MdxParsedData> | null = null;

// Cache for component tag -> storybook title mapping
let storyTitleCache: Map<string, string> | null = null;

// Configuration
const DOCS_BASE_URL = 'https://pine-design-system.netlify.app';
const GITHUB_REPO_URL = 'https://github.com/AmerisourceBergen/pine/blob/main/libs/core';

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
        const found = searchForMdx(path.join(dir, entry.name));
        if (found !== null) return found;
      }
    }
    return null;
  };

  return searchForMdx(componentsDir);
}

/**
 * Parse MDX content and extract the first paragraph after the component name header.
 */
function parseMdxDescription(mdxContent: string): string {
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
      if (paragraphLines.length === 0 && trimmedLine === '') {
        continue;
      }
      if (trimmedLine.startsWith('#') || trimmedLine.startsWith('<') || (paragraphLines.length > 0 && trimmedLine === '')) {
        break;
      }
      paragraphLines.push(trimmedLine);
    }
  }

  return paragraphLines.join(' ').trim();
}

/**
 * Parse MDX content and extract examples with code snippets
 */
function parseMdxExamples(mdxContent: string): MdxExample[] {
  const lines = mdxContent.split('\n');
  const examples: MdxExample[] = [];
  let inExamplesSection = false;
  let currentExample: MdxExample | null = null;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Look for ## Examples heading
    if (trimmedLine.toLowerCase() === '## examples') {
      inExamplesSection = true;
      continue;
    }

    // Stop at the next h2 heading
    if (inExamplesSection && trimmedLine.startsWith('## ') && trimmedLine.toLowerCase() !== '## examples') {
      if (currentExample) {
        examples.push(currentExample);
      }
      break;
    }

    if (!inExamplesSection) continue;

    // New example heading
    if (trimmedLine.startsWith('### ')) {
      if (currentExample) {
        examples.push(currentExample);
      }
      currentExample = {
        name: trimmedLine.replace(/^### /, '').trim(),
        description: '',
        code: '',
      };
      continue;
    }

    if (!currentExample) continue;

    // Code block handling
    if (trimmedLine.startsWith('```html') || trimmedLine.startsWith('```jsx')) {
      inCodeBlock = true;
      codeLines = [];
      continue;
    }

    if (inCodeBlock && trimmedLine === '```') {
      inCodeBlock = false;
      if (codeLines.length > 0 && !currentExample.code) {
        currentExample.code = codeLines.join('\n').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Description text (before code blocks, skip JSX)
    if (!currentExample.code && !trimmedLine.startsWith('<') && trimmedLine !== '') {
      if (currentExample.description) {
        currentExample.description += ' ' + trimmedLine;
      } else {
        currentExample.description = trimmedLine;
      }
    }
  }

  // Don't forget the last example
  if (currentExample && inExamplesSection) {
    examples.push(currentExample);
  }

  return examples;
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
 */
function titleToUrlPath(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
}

/**
 * Get the Storybook documentation URL for a component
 */
function getComponentDocsUrl(tag: string): string {
  const title = getStoryTitle(tag);

  if (title !== undefined) {
    const urlPath = titleToUrlPath(title);
    return `${DOCS_BASE_URL}/?path=/docs/${urlPath}--docs`;
  }

  // Fallback for components without a story file
  const componentName = tag.replace(/^pds-/, '');
  return `${DOCS_BASE_URL}/?path=/docs/components-${componentName}--docs`;
}

/**
 * Convert an MDX heading to a URL anchor fragment
 */
function headingToAnchor(heading: string): string {
  return heading.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get a URL to a specific example section in the docs
 */
function getExampleUrl(tag: string, exampleHeading: string): string {
  const docsUrl = getComponentDocsUrl(tag);
  const anchor = headingToAnchor(exampleHeading);
  return `${docsUrl}#${anchor}`;
}

/**
 * Get the GitHub source URL for a component file
 */
function getSourceUrl(filePath: string): string {
  // filePath is like "src/components/pds-button/pds-button.tsx"
  return `${GITHUB_REPO_URL}/${filePath}`;
}

/**
 * Build a rich component description matching VS Code custom data format
 */
function buildComponentDescription(component: JsonDocsComponent): string {
  const parts: string[] = [];
  const mdxData = getMdxData(component.tag);
  const docsUrl = getComponentDocsUrl(component.tag);

  // Main description from MDX or JSDoc
  if (mdxData.description) {
    parts.push(mdxData.description);
  } else if (component.docs) {
    parts.push(component.docs);
  }

  // Examples section with links (kept in description for quick access)
  if (mdxData.examples.length > 0) {
    const exampleLinks = mdxData.examples.map((example) => {
      const url = getExampleUrl(component.tag, example.name);
      return `[${example.name}](${url})`;
    });
    parts.push(`\n\n**Examples:** ${exampleLinks.join(', ')}`);
  }

  // Note: Slots, CSS Parts, and Events are omitted from description
  // since they're now structured fields in the CEM (slots, cssParts, events)

  // Documentation link
  parts.push(`\n\n---\n📖 [View full documentation](${docsUrl})`);

  return parts.join('');
}

/**
 * Get parsed MDX data for a component (with caching)
 */
function getMdxData(componentTag: string): MdxParsedData {
  if (!mdxCache) {
    mdxCache = new Map();
  }

  const cached = mdxCache.get(componentTag);
  if (cached) {
    return cached;
  }

  const emptyData: MdxParsedData = { description: '', summary: '', examples: [] };

  const mdxPath = findMdxFile(componentTag);
  if (!mdxPath) {
    mdxCache.set(componentTag, emptyData);
    return emptyData;
  }

  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const description = parseMdxDescription(mdxContent);
    const data: MdxParsedData = {
      description,
      summary: description.split('.')[0] + '.', // First sentence as summary
      examples: parseMdxExamples(mdxContent),
    };
    mdxCache.set(componentTag, data);
    return data;
  } catch {
    mdxCache.set(componentTag, emptyData);
    return emptyData;
  }
}

// ============================================================================
// Custom Elements Manifest Types (following CEM schema v1.0.0)
// ============================================================================

interface CustomElementsManifest {
  schemaVersion: string;
  readme?: string;
  modules: Module[];
}

interface Module {
  kind: 'javascript-module';
  path: string;
  declarations: Declaration[];
  exports: Export[];
}

type Declaration = CustomElementDeclaration;

interface CustomElementDeclaration {
  kind: 'class';
  name: string;
  tagName: string;
  customElement: true;
  description?: string;
  summary?: string;
  deprecated?: string | boolean;
  superclass?: Reference;
  source?: SourceReference;
  attributes?: Attribute[];
  members?: Member[];
  events?: Event[];
  slots?: Slot[];
  cssParts?: CssPart[];
  cssProperties?: CssProperty[];
  demos?: Demo[];
}

interface Demo {
  description?: string;
  url?: string;
  source?: {
    code: string;
    language?: string;
  };
}

interface Reference {
  name: string;
  package?: string;
  module?: string;
}

interface SourceReference {
  href: string;
}

interface Attribute {
  name: string;
  type?: Type;
  default?: string;
  description?: string;
  fieldName?: string;
  deprecated?: string | boolean;
}

interface Type {
  text: string;
}

type Member = Field | Method;

interface Field {
  kind: 'field';
  name: string;
  type?: Type;
  default?: string;
  description?: string;
  privacy?: 'public' | 'protected' | 'private';
  static?: boolean;
  readonly?: boolean;
  attribute?: string;
  reflects?: boolean;
  deprecated?: string | boolean;
}

interface Method {
  kind: 'method';
  name: string;
  description?: string;
  privacy?: 'public' | 'protected' | 'private';
  static?: boolean;
  return?: ReturnType;
  parameters?: Parameter[];
  deprecated?: string | boolean;
}

interface ReturnType {
  type?: Type;
  description?: string;
}

interface Parameter {
  name: string;
  type?: Type;
  default?: string;
  description?: string;
  optional?: boolean;
  rest?: boolean;
}

interface Event {
  name: string;
  type?: Type;
  description?: string;
  deprecated?: string | boolean;
}

interface Slot {
  name: string;
  description?: string;
}

interface CssPart {
  name: string;
  description?: string;
}

interface CssProperty {
  name: string;
  default?: string;
  description?: string;
  syntax?: string; // CSS syntax like "<color>", "<length>", etc.
}

interface Export {
  kind: 'js' | 'custom-element-definition';
  name: string;
  declaration: Reference;
}

// ============================================================================
// Conversion Functions
// ============================================================================

/**
 * Convert a Stencil component tag to a class name
 * e.g., "pds-button" -> "PdsButton"
 */
function tagToClassName(tag: string): string {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Clean up type strings for better readability
 */
function cleanTypeString(type: string): string {
  // Remove extra quotes around union members for cleaner display
  return type.replace(/"/g, "'");
}

/**
 * Extract default value, handling Stencil's format
 */
function getDefaultValue(prop: JsonDocsProp): string | undefined {
  if (prop.default !== undefined) {
    return prop.default;
  }

  // Check docsTags for @default or @defaultValue
  const defaultTag = prop.docsTags?.find((t) => t.name === 'default' || t.name === 'defaultValue');
  if (defaultTag?.text) {
    return defaultTag.text;
  }

  return undefined;
}

/**
 * Get deprecation info from a prop
 */
function getDeprecation(prop: JsonDocsProp): string | undefined {
  if (prop.deprecation) {
    return prop.deprecation;
  }

  const deprecatedTag = prop.docsTags?.find((t) => t.name === 'deprecated');
  if (deprecatedTag) {
    return deprecatedTag.text || 'This property is deprecated.';
  }

  return undefined;
}

// Note: buildAttributeDescription removed - type, default, and deprecated
// are now structured CEM fields, so we just use the plain docs string

/**
 * Convert a Stencil prop to a CEM attribute
 */
function convertPropToAttribute(prop: JsonDocsProp): Attribute | null {
  // Only include props that have an HTML attribute representation
  if (!prop.attr) {
    return null;
  }

  const attribute: Attribute = {
    name: prop.attr,
    fieldName: prop.name,
    description: prop.docs || undefined,
  };

  if (prop.type) {
    attribute.type = { text: cleanTypeString(prop.type) };
  }

  const defaultValue = getDefaultValue(prop);
  if (defaultValue) {
    attribute.default = defaultValue;
  }

  const deprecation = getDeprecation(prop);
  if (deprecation) {
    attribute.deprecated = deprecation;
  }

  return attribute;
}

/**
 * Convert a Stencil prop to a CEM field member
 */
function convertPropToField(prop: JsonDocsProp): Field {
  const field: Field = {
    kind: 'field',
    name: prop.name,
    privacy: 'public',
    description: prop.docs || undefined,
  };

  if (prop.type) {
    field.type = { text: cleanTypeString(prop.type) };
  }

  const defaultValue = getDefaultValue(prop);
  if (defaultValue) {
    field.default = defaultValue;
  }

  if (prop.attr) {
    field.attribute = prop.attr;
  }

  if (prop.reflectToAttr) {
    field.reflects = true;
  }

  const deprecation = getDeprecation(prop);
  if (deprecation) {
    field.deprecated = deprecation;
  }

  return field;
}

/**
 * Convert Stencil method parameters to CEM parameters
 */
function convertParameters(params: JsonDocMethodParameter[]): Parameter[] {
  return params.map((param) => ({
    name: param.name,
    type: param.type ? { text: cleanTypeString(param.type) } : undefined,
    description: param.docs || undefined,
  }));
}

/**
 * Convert a Stencil method to a CEM method member
 */
function convertMethod(method: JsonDocsMethod): Method {
  const cemMethod: Method = {
    kind: 'method',
    name: method.name,
    privacy: 'public',
    description: method.docs || undefined,
  };

  if (method.returns) {
    cemMethod.return = {
      type: method.returns.type ? { text: cleanTypeString(method.returns.type) } : undefined,
      description: method.returns.docs || undefined,
    };
  }

  if (method.parameters && method.parameters.length > 0) {
    cemMethod.parameters = convertParameters(method.parameters);
  }

  const deprecatedTag = method.docsTags?.find((t) => t.name === 'deprecated');
  if (deprecatedTag) {
    cemMethod.deprecated = deprecatedTag.text || 'This method is deprecated.';
  }

  return cemMethod;
}

/**
 * Convert a Stencil event to a CEM event
 */
function convertEvent(event: JsonDocsEvent): Event {
  const cemEvent: Event = {
    name: event.event,
    description: event.docs || undefined,
  };

  // Construct the CustomEvent type
  if (event.detail) {
    cemEvent.type = { text: `CustomEvent<${event.detail}>` };
  } else {
    cemEvent.type = { text: 'CustomEvent' };
  }

  const deprecatedTag = event.docsTags?.find((t) => t.name === 'deprecated');
  if (deprecatedTag) {
    cemEvent.deprecated = deprecatedTag.text || 'This event is deprecated.';
  }

  return cemEvent;
}

/**
 * Convert a Stencil slot to a CEM slot
 */
function convertSlot(slot: JsonDocsSlot): Slot {
  // CEM uses empty string for default slot, Stencil uses "(default)"
  const name = slot.name === '(default)' ? '' : slot.name;

  return {
    name,
    description: slot.docs || undefined,
  };
}

/**
 * Convert a Stencil CSS part to a CEM CSS part
 */
function convertCssPart(part: JsonDocsPart): CssPart {
  return {
    name: part.name,
    description: part.docs || undefined,
  };
}

/**
 * Convert a Stencil CSS custom property to a CEM CSS property
 */
function convertCssProperty(style: JsonDocsStyle): CssProperty {
  return {
    name: style.name,
    description: style.docs || undefined,
  };
}

/**
 * Convert a Stencil component to a CEM module
 */
function convertComponent(component: JsonDocsComponent): Module | null {
  // Skip test/mock components
  if (component.tag.startsWith('mock-') || component.filePath.includes('/test/')) {
    return null;
  }

  const className = tagToClassName(component.tag);

  // Get rich documentation from MDX files
  const mdxData = getMdxData(component.tag);

  // Build the class declaration
  const declaration: CustomElementDeclaration = {
    kind: 'class',
    name: className,
    tagName: component.tag,
    customElement: true,
  };

  // Build rich description matching VS Code custom data format
  declaration.description = buildComponentDescription(component);

  // Add summary for quick display
  if (mdxData.summary) {
    declaration.summary = mdxData.summary;
  }

  // Add source link to GitHub
  declaration.source = {
    href: getSourceUrl(component.filePath),
  };

  // Add demos/examples with URLs
  if (mdxData.examples.length > 0) {
    declaration.demos = mdxData.examples.map((example) => ({
      description: example.name,
      url: getExampleUrl(component.tag, example.name),
      source: example.code
        ? {
            code: example.code,
            language: 'html',
          }
        : undefined,
    }));
  }

  // Superclass (all Stencil components extend HTMLElement conceptually)
  declaration.superclass = {
    name: 'HTMLElement',
    package: 'global',
  };

  // Convert attributes
  const attributes: Attribute[] = [];
  if (component.props) {
    for (const prop of component.props) {
      const attr = convertPropToAttribute(prop);
      if (attr) {
        attributes.push(attr);
      }
    }
  }
  if (attributes.length > 0) {
    declaration.attributes = attributes;
  }

  // Convert members (fields and methods)
  const members: Member[] = [];

  // Add fields from props
  if (component.props) {
    for (const prop of component.props) {
      members.push(convertPropToField(prop));
    }
  }

  // Add methods
  if (component.methods) {
    for (const method of component.methods) {
      members.push(convertMethod(method));
    }
  }

  if (members.length > 0) {
    declaration.members = members;
  }

  // Convert events
  if (component.events && component.events.length > 0) {
    declaration.events = component.events.map(convertEvent);
  }

  // Convert slots
  if (component.slots && component.slots.length > 0) {
    declaration.slots = component.slots.map(convertSlot);
  }

  // Convert CSS parts
  if (component.parts && component.parts.length > 0) {
    declaration.cssParts = component.parts.map(convertCssPart);
  }

  // Convert CSS custom properties
  if (component.styles && component.styles.length > 0) {
    declaration.cssProperties = component.styles.map(convertCssProperty);
  }

  // Create the module
  const module: Module = {
    kind: 'javascript-module',
    path: component.filePath,
    declarations: [declaration],
    exports: [
      {
        kind: 'js',
        name: className,
        declaration: {
          name: className,
          module: component.filePath,
        },
      },
      {
        kind: 'custom-element-definition',
        name: component.tag,
        declaration: {
          name: className,
          module: component.filePath,
        },
      },
    ],
  };

  return module;
}

// ============================================================================
// Main Generator Function
// ============================================================================

/**
 * Generate a Custom Elements Manifest from Stencil docs
 */
export function generateCustomElementsManifest(docs: JsonDocs, outputPath: string): void {
  // Reset caches for fresh generation
  mdxCache = null;
  storyTitleCache = null;

  const manifest: CustomElementsManifest = {
    schemaVersion: '1.0.0',
    readme: 'Pine Design System Web Components',
    modules: [],
  };

  for (const component of docs.components) {
    const module = convertComponent(component);
    if (module) {
      manifest.modules.push(module);
    }
  }

  // Sort modules by tag name for consistent output
  manifest.modules.sort((a, b) => {
    const tagA = (a.declarations[0] as CustomElementDeclaration)?.tagName || '';
    const tagB = (b.declarations[0] as CustomElementDeclaration)?.tagName || '';
    return tagA.localeCompare(tagB);
  });

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const newContent = JSON.stringify(manifest, null, 2);

  // Only write if content has changed (prevents watch loop)
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(outputPath, 'utf-8');
  } catch {
    // File doesn't exist yet, that's fine
  }

  if (newContent !== existingContent) {
    fs.writeFileSync(outputPath, newContent);

    // Count components with enhanced docs
    const withMdxDocs = manifest.modules.filter((m) => {
      const decl = m.declarations[0] as CustomElementDeclaration;
      return decl?.summary !== undefined;
    }).length;
    const withExamples = manifest.modules.filter((m) => {
      const decl = m.declarations[0] as CustomElementDeclaration;
      return decl?.demos && decl.demos.length > 0;
    }).length;

    console.log(`✅ Generated Custom Elements Manifest: ${outputPath}`);
    console.log(`   ${manifest.modules.length} components documented`);
    console.log(`   ${withMdxDocs} with rich MDX descriptions`);
    console.log(`   ${withExamples} with code examples`);
    console.log(`   Schema version: ${manifest.schemaVersion}`);
  } else {
    console.log(`ℹ️  Custom Elements Manifest unchanged: ${outputPath}`);
  }
}

// ============================================================================
// Stencil Output Target
// ============================================================================

/**
 * Custom Stencil output target for generating Custom Elements Manifest
 *
 * Usage in stencil.config.ts:
 * ```ts
 * import customElementsManifestOutputTarget from './scripts/custom-elements-manifest-generator';
 *
 * export const config: Config = {
 *   outputTargets: [
 *     customElementsManifestOutputTarget('./dist/custom-elements.json'),
 *   ],
 * };
 * ```
 */
export default function customElementsManifestOutputTarget(outputPath: string = './custom-elements-manifest.json') {
  return {
    type: 'docs-custom' as const,
    generator: (docs: JsonDocs) => {
      generateCustomElementsManifest(docs, outputPath);
    },
  };
}
