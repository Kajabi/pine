interface OverlayArgs {
  elem: HTMLElement | null;
  elemPlacement: string;
  overlay: HTMLElement | null;
  offset?: number;
}

export const positionTooltip = ({elem, elemPlacement, overlay, offset = 8}: OverlayArgs): boolean => {
  if (elem === null || overlay === null) return false;
  if (typeof elemPlacement !== 'string' || elemPlacement.trim() === '') {
    return false;
  }

  const rect = elem.getBoundingClientRect();
  const contentRect = overlay.getBoundingClientRect();

  // Reset styles
  overlay.style.top = '';
  overlay.style.left = '';
  overlay.style.right = '';
  overlay.style.bottom = '';
  overlay.style.transform = '';

  // Use fixed positioning for portal overlays
  overlay.style.position = 'fixed';

  // Detect if the trigger is a span with only text or a text node
  let isTextTrigger = false;
  if (elem.childNodes.length === 1 && elem.childNodes[0].nodeType === Node.TEXT_NODE) {
    isTextTrigger = true;
  } else if (elem.childNodes.length === 1 && elem.childNodes[0].nodeType === Node.ELEMENT_NODE) {
    const child = elem.childNodes[0] as HTMLElement;
    if (child.tagName === 'SPAN' && child.childNodes.length === 1 && child.childNodes[0].nodeType === Node.TEXT_NODE) {
      isTextTrigger = true;
    }
  }

  switch (true) {
    case elemPlacement.includes('right'):
      if (isTextTrigger) {
        // Align to the bottom of the trigger for text triggers
        overlay.style.top = `${rect.bottom - contentRect.height / 2}px`;
      } else {
        overlay.style.top = `${rect.top + rect.height / 2 - contentRect.height / 2}px`;
      }
      overlay.style.left = `${rect.right + offset}px`;
      if (elemPlacement.includes('start')) {
        overlay.style.top = `${rect.top}px`;
      }
      if (elemPlacement.includes('end')) {
        overlay.style.top = `${rect.bottom - contentRect.height}px`;
      }
      break;
    case elemPlacement.includes('left'):
      if (isTextTrigger) {
        overlay.style.top = `${rect.bottom - contentRect.height / 2}px`;
      } else {
        overlay.style.top = `${rect.top + rect.height / 2 - contentRect.height / 2}px`;
      }
      overlay.style.left = `${rect.left - contentRect.width - offset}px`;
      if (elemPlacement.includes('start')) {
        overlay.style.top = `${rect.top}px`;
      }
      if (elemPlacement.includes('end')) {
        overlay.style.top = `${rect.bottom - contentRect.height}px`;
      }
      break;
    case elemPlacement.includes('bottom'):
      overlay.style.top = `${rect.bottom + offset}px`;
      overlay.style.left = `${rect.left + rect.width / 2 - contentRect.width / 2}px`;
      if (elemPlacement.includes('start')) {
        overlay.style.left = `${rect.left}px`;
      }
      if (elemPlacement.includes('end')) {
        overlay.style.left = 'initial';
        overlay.style.right = '0px';
      }
      break;
    case elemPlacement.includes('top'):
      overlay.style.top = `${rect.top - contentRect.height - offset}px`;
      overlay.style.left = `${rect.left + rect.width / 2 - contentRect.width / 2}px`;
      if (elemPlacement.includes('start')) {
        overlay.style.left = `${rect.left}px`;
      }
      if (elemPlacement.includes('end')) {
        overlay.style.left = 'initial';
        overlay.style.right = '0';
      }
      break;
  }
  return true;
}
