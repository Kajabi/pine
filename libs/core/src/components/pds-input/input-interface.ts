export interface InputChangeEventDetail {
  value?: string | number | null;
  event?: Event;
}

export interface InputInputEventDetail {
  value?: string | number | null;
  event?: Event;
}

export interface InputEvent <T = InputChangeEventDetail> extends CustomEvent {
  detai: T;
  target: HTMLPdsInputElement;
}
