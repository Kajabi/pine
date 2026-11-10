export interface MultiselectOption {
  id: string | number;
  text: string;
  /** When `true`, the option is rendered as non-interactive and cannot be selected. */
  disabled?: boolean;
  /**
   * Optional section label for grouped rendering (with `options` prop or parsed slots).
   * Options that share a `group` value must be contiguous in the array; non-contiguous
   * rows with the same label produce separate headers (mirrors native `<optgroup>`).
   */
  group?: string;
  /**
   * Sets the dot color of the option's chip when the multiselect's `optionDisplay` is `'chip'`. Accepts a sentiment
   * name other than `brand` (e.g. `success`), a color token, or a [valid color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
   */
  dotColor?: string;
  /**
   * The name of the icon for this option's action, such as `pen`; URLs and file paths are not accepted. Shown when the
   * multiselect has `optionActions`; options without a valid icon name have no action.
   */
  actionIcon?: string;
  /** Overrides the multiselect's `optionActionLabel` for this option; `{text}` is interpolated. */
  actionLabel?: string;
  isCreateOption?: boolean;
  [key: string]: unknown;
}

export interface MultiselectChangeEventDetail {
  values: string[];
  items: MultiselectOption[];
  /** Values selected by this change. Always present on emitted events. */
  added?: string[];
  /** Values deselected by this change. Always present on emitted events. */
  removed?: string[];
}

export interface MultiselectSearchEventDetail {
  query: string;
}

export interface MultiselectLoadOptionsEventDetail {
  query: string;
  page: number;
}

export interface MultiselectCreateEventDetail {
  query: string;
  newOption: MultiselectOption;
}

export interface MultiselectOptionActionEventDetail {
  option: MultiselectOption;
}

export interface AsyncResponse {
  results: Array<{ id: string | number; text: string; [key: string]: unknown }>;
  totalCount?: number;
}

export interface CreateResponse {
  id: string | number;
  text: string;
  [key: string]: unknown;
}
