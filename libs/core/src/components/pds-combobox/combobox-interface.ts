export interface ComboboxOption {
  id: string | number;
  text: string;
  /**
   * Label of the group this option belongs to. Options sharing a group are rendered under one
   * group label, in the order the group first appears, the same as slotted `<optgroup>` markup.
   */
  group?: string;
  /**
   * Pine icon name shown beside the group's label. Read from the first option of each group,
   * the same as `data-icon` on a slotted `<optgroup>`.
   */
  groupIcon?: string;
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
