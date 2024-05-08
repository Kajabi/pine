export interface SortableType {
  animation: number;
  ghostClass: string;
  dragClass: string;
  onEnd: (evt: Event) => void;
  handle?: string;
}