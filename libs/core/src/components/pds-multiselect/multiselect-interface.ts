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
  isCreateOption?: boolean;
  [key: string]: unknown;
}

export interface MultiselectChangeEventDetail {
  values: string[];
  items: MultiselectOption[];
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

export interface AsyncResponse {
  results: Array<{ id: string | number; text: string; [key: string]: unknown }>;
  totalCount?: number;
}

export interface CreateResponse {
  id: string | number;
  text: string;
  [key: string]: unknown;
}
