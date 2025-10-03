export interface PdsPopoverEventDetail {
  componentId: string;
  popoverType: 'auto' | 'manual';
  text?: string;
}

export interface ToggleEvent extends Event {
  newState: 'open' | 'closed';
}

