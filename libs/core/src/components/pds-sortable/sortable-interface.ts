import type { SortableEvent } from 'sortablejs';

export interface SortableType {
  animation: number;
  ghostClass: string;
  dragClass: string;
  onEnd: (evt: SortableEvent) => void;
  handle?: string;
}

