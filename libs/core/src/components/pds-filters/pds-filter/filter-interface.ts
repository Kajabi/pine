export type PdsFilterVariant = 'default' | 'selected' | 'more' | 'clear';

export interface PdsFilterOpenEventDetail {
  componentId: string;
  variant: PdsFilterVariant;
  text?: string;
}

export interface PdsFilterCloseEventDetail {
  componentId: string;
  variant: PdsFilterVariant;
  text?: string;
}

export interface PdsFilterClearEventDetail {
  componentId: string;
  text?: string;
}

export interface PdsFilterEvent<T> extends CustomEvent<T> {
  readonly detail: T;
  readonly target: HTMLPdsFilterElement | null;
}
