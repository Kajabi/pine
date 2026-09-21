import { unwrapReconnectedContent } from '../reconnected-content';

describe('unwrapReconnectedContent', () => {
  it('does nothing when the container is null', () => {
    expect(() => unwrapReconnectedContent(null, '.wrapper')).not.toThrow();
  });

  it('leaves pristine (never-nested) content alone', () => {
    const container = document.createElement('div');
    container.innerHTML = 'Content';

    unwrapReconnectedContent(container, '.wrapper');

    expect(container.innerHTML).toBe('Content');
  });

  // No contentSelector: the wrapper's own children ARE the slotted content
  // (e.g. pds-tabpanel's single-layer `.pds-tabpanel` div).
  describe('without a contentSelector (single-layer wrapper)', () => {
    it('unwraps a single nested copy', () => {
      const container = document.createElement('div');
      container.className = 'wrapper';
      container.innerHTML = '<div class="wrapper">Content</div>';

      unwrapReconnectedContent(container, '.wrapper');

      expect(container.querySelector('.wrapper')).toBeNull();
      expect(container.textContent).toBe('Content');
    });

    it('drains a doubly-nested copy in one call', () => {
      const container = document.createElement('div');
      container.className = 'wrapper';
      container.innerHTML = '<div class="wrapper"><div class="wrapper">Content</div></div>';

      unwrapReconnectedContent(container, '.wrapper');

      expect(container.querySelector('.wrapper')).toBeNull();
      expect(container.textContent).toBe('Content');
    });
  });

  // With a contentSelector: the wrapper nests a separate content element
  // (e.g. pds-tab's `<a class="pds-tab">` wrapping a `.pds-tab__content` div).
  describe('with a contentSelector (two-layer wrapper)', () => {
    it('unwraps a single nested copy', () => {
      const container = document.createElement('div');
      container.className = 'content';
      container.innerHTML = '<span class="control"><div class="content">Chat</div></span>';

      unwrapReconnectedContent(container, '.control', '.content');

      expect(container.querySelector('.control')).toBeNull();
      expect(container.textContent).toBe('Chat');
    });

    // Built via DOM APIs rather than an innerHTML string: HTML parsing wouldn't
    // allow two <a> elements to nest (the parser auto-closes the outer one), but
    // Stencil's live-DOM slot relocation — the real mechanism this is guarding
    // against — has no such restriction, and this is exactly the shape it
    // produces for a reconnect stacked on top of an earlier unflattened one.
    it('drains a doubly-nested copy in one call', () => {
      const container = document.createElement('div');
      container.className = 'content';

      const outerControl = document.createElement('a');
      outerControl.className = 'control';
      const midContent = document.createElement('div');
      midContent.className = 'content';
      const innerControl = document.createElement('a');
      innerControl.className = 'control';
      const innermostContent = document.createElement('div');
      innermostContent.className = 'content';
      innermostContent.textContent = 'Chat';

      innerControl.appendChild(innermostContent);
      midContent.appendChild(innerControl);
      outerControl.appendChild(midContent);
      container.appendChild(outerControl);

      unwrapReconnectedContent(container, '.control', '.content');

      expect(container.querySelector('.control')).toBeNull();
      expect(container.textContent).toBe('Chat');
    });

    it('falls back to the stale control itself when it has no nested content element', () => {
      const container = document.createElement('div');
      container.className = 'content';
      container.innerHTML = '<span class="control">Chat</span>';

      unwrapReconnectedContent(container, '.control', '.content');

      expect(container.querySelector('.control')).toBeNull();
      expect(container.textContent).toBe('Chat');
    });
  });
});
