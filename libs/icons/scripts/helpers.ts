export interface SvgData {
  /**
   * /dist/svg/airplane-outline.svg
   */
  distSvgFilePath: string;

  /**
   * airplaneOutline
   */
  exportName: string;

  /**
   * airplane-outline.svg
   */
  fileName: string;

  /**
   * airplane-outline.js
   */
  fileNameCjs: string;

  /**
   * airplane-outline.mjs
   */
  fileNameMjs: string;

  /**
   * airplane-outline
   */
  iconName: string;

  /**
   * /dist/sage-icons/svg/airplane-outline.svg
   */
  optimizedFilePath: string;

  /**
   * Optimized svg content data generated from
   * SVGO
   */
  optimizedSvgContent: string;

  /**
   * The path to the save the optimized SVG
   */
  outputSvgFilePath: string;

  /**
   * /tmp/svg/airplane-outline.svg
   */
  srcFilePath: string;

  /**
   * airplane
   */
  title: string;
}

export interface JsonData {
  icons: { name: string; tags?: string[] }[];
  version?: string;
}


export const reservedKeywords = new Set([
  'do',
  'if',
  'in',
  'for',
  'let',
  'new',
  'try',
  'var',
  'case',
  'else',
  'enum',
  'eval',
  'null',
  'this',
  'true',
  'void',
  'with',
  'await',
  'break',
  'catch',
  'class',
  'const',
  'false',
  'super',
  'throw',
  'while',
  'yield',
  'delete',
  'export',
  'import',
  'public',
  'return',
  'static',
  'switch',
  'typeof',
  'default',
  'extends',
  'finally',
  'private',
  'continue',
  'debugger',
  'function',
  'arguments',
  'interface',
  'protected',
  'implements',
  'instanceof',
  'constructor',
])
