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
   * ignoreFrames: ['Docs', 'Navgigation']
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
   * Name of the component
   */
  name: string;

  /**
   * Url to download the icon
   */
  url?: string;
}
