export interface FigmaIconConfig {
  /**
   * Branch that is located in the
   * Figma file
   * @example spike-branch
   */
  branchName: string;

  /**
   * The Personal Acecss Token created
   * from your Figma Account
   * @see {@link https://www.figma.com/developers/api#intro:~:text=Access-,tokens,-A%20personal%20access|Figma API}
   */
  figmaAccessToken: string;

  /**
   * File id
   * can be located in the url
   * @example
   * ```
   * https://www.figma.com/file/some-unique-id
   * ```
   */
  figmaFileId: string;

  /**
   * Frames that will be ignored when
   * extracting icons
   * @example
   * ```json
   * ignoreFrames: 'Docs'
   * ```
   * or
   * @example
   * ```json
   * ignoreFrames: ['Docs', 'Navigation']
   */
  ignoreFrames: string[]

  /**
   * Path to save the svgs
   * @defaultValue `src/svgs`
   */
  outputPath: string,

  /**
   * Page that contains the icons
   */
  pageName: string,
}

export type FigmaIcon = {
  /**
   * The unique identifier in Figma
   */
  id: string;

  /**
   * The name of the file stored on disk
   */
  filename?: string;

  /**
   * The name of the file stored on disk
   */
  filesize?: number;

  /**
   * The frame the icon is located inside
   * of Figma
   *
   */
  frame?: string;

  /**
   * Name of the component
   */
  name: string;

  /**
   * Url to download the icon
   */
  url?: string;

  /**
   * Tags
   */
  tags?: string;
}

export type IconFileDetail = {
  /**
   * The name of the svg file
   */
  name: string;

  /**
   * The numeric size of the file in kB
   */
  size: number;
}

export interface SvgDiffResult {

  /**
   * The name of the Previous file
   */
  previousFileName?: string;

  /**
   * The name of the file
   */
  filename: string;

  /**
   * Git status provided from SimpleGit
   * Will be 'D', 'M', or ''.
   * D: Deleted
   * M: Modified
   * '': Added
   */
  status: string;

  /**
   * What the svg content looked like before it was modified or deleted
   */
  before: string | null;

  /**
   * What the svg content looked like AFTER it was modified or deleted
   */
  after: string | null;
}
