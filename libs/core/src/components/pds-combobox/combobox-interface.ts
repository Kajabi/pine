export interface ComboboxOption {
  id: string | number;
  text: string;
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
