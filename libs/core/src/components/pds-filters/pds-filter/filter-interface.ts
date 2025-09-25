export interface PdsFilterOpenEventDetail {
  componentId: string;
  variant: string;
  text?: string;
}

export interface PdsFilterCloseEventDetail {
  componentId: string;
  variant: string;
  text?: string;
}

export interface PdsFilterClearEventDetail {
  componentId: string;
  text?: string;
}

export interface PdsFilterEvent<T> extends CustomEvent {
  detail: T;
  target: HTMLPdsFilterElement;
}
