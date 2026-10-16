export interface ComboboxOption {
  id: string | number;
  text: string;
  /**
   * Label of the group this option belongs to. Options sharing a group are rendered together
   * under one group label, where the group first appears, the same as slotted `<optgroup>`
   * markup. With `group-display="inline"`, options without a group are listed before every group;
   * with `flyout` and `drill-in`, options without a group and groups keep the array's order.
   */
  group?: string;
  /**
   * Pine icon name shown beside the group's label (letters, digits and hyphens, for example
   * `hashtag`); URLs and file paths are not accepted. The first option in the group that sets
   * one wins, the same as `data-icon` on a slotted `<optgroup>`.
   */
  groupIcon?: string;
  /**
   * Pine icon name shown before the option's text (letters, digits and hyphens, for example
   * `hashtag`); URLs and file paths are not accepted. The same as `data-icon` on a slotted `<option>`.
   * Once the option is chosen, the `button` trigger shows it too.
   */
  icon?: string;
  /**
   * When `true`, the option stays reachable by the arrow keys and the pointer, so assistive tech
   * announces it as unavailable, but it cannot be selected.
   */
  disabled?: boolean;
  [key: string]: unknown;
}

export interface ComboboxChangeEventDetail {
  value: string;
}

export interface ComboboxSearchEventDetail {
  query: string;
}

export interface ComboboxLoadOptionsEventDetail {
  query: string;
  page: number;
}

export interface AsyncResponse {
  results: Array<{ id: string | number; text: string; [key: string]: unknown }>;
  totalCount?: number;
}
