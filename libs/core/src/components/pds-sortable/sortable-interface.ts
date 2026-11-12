import type { SortableEvent } from 'sortablejs';

export interface SortableType {
  animation: number;
  disabled: boolean;
  draggable: string;
  ghostClass: string;
  dragClass: string;
  onEnd: (evt: SortableEvent) => void;
  handle?: string;
}

