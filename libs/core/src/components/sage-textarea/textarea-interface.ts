export interface TextareaChangeEventDetail {
  event?: Event;
  value: string | null;
}

export interface TextareaEvent <T = TextareaChangeEventDetail> extends CustomEvent {
  detail: T;
  target: HTMLSageTextareaElement;
}
