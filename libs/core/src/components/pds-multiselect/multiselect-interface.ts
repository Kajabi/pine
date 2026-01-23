export interface MultiselectOption {
  id: string | number;
  text: string;
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

export interface AsyncResponse {
  results: Array<{ id: string | number; text: string; [key: string]: unknown }>;
  totalCount?: number;
}
