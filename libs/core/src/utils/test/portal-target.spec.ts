import { findPortalTarget, isTopLayerInDocument } from '../portal-target';

// The spec DOM can't evaluate :modal or :popover-open, so each element states which ones it matches.
function matching<T extends Element>(el: T, ...selectors: string[]): T {
  jest.spyOn(el, 'matches').mockImplementation((selector) => selectors.includes(selector));
  return el;
}

function openDialog(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  Object.defineProperty(dialog, 'open', { value: true });
  return dialog;
}

describe('findPortalTarget', () => {
  let child: HTMLElement;

  beforeEach(() => {
    child = document.createElement('span');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('returns the body outside any dialog or popover', () => {
    document.body.appendChild(child);

    expect(findPortalTarget(child)).toBe(document.body);
  });

  it('returns the open dialog around the element', () => {
    const dialog = openDialog();
    dialog.appendChild(child);
    document.body.appendChild(dialog);

    expect(findPortalTarget(child)).toBe(dialog);
  });

  it('passes over a closed dialog', () => {
    const dialog = document.createElement('dialog');
    dialog.appendChild(child);
    document.body.appendChild(dialog);

    expect(findPortalTarget(child)).toBe(document.body);
  });

  it('returns the open popover around the element', () => {
    const popover = matching(document.createElement('div'), ':popover-open');
    popover.setAttribute('popover', 'auto');
    popover.appendChild(child);
    document.body.appendChild(popover);

    expect(findPortalTarget(child)).toBe(popover);
  });

  it('returns the nearest ancestor the isHost check accepts', () => {
    const outer = document.createElement('section');
    const inner = document.createElement('div');
    inner.appendChild(child);
    outer.appendChild(inner);
    document.body.appendChild(outer);

    expect(findPortalTarget(child, (el) => el.localName === 'section')).toBe(outer);
  });

  describe('with isTopLayerInDocument', () => {
    it('passes over a dialog that is open but not modal to the modal dialog around it', () => {
      const modal = matching(openDialog(), ':modal');
      const nonModal = matching(openDialog());
      nonModal.appendChild(child);
      modal.appendChild(nonModal);
      document.body.appendChild(modal);

      expect(findPortalTarget(child, isTopLayerInDocument)).toBe(modal);
    });

    it('returns an open popover inside a modal dialog, the nearer of the two', () => {
      const modal = matching(openDialog(), ':modal');
      const popover = matching(document.createElement('div'), ':popover-open');
      popover.appendChild(child);
      modal.appendChild(popover);
      document.body.appendChild(modal);

      expect(findPortalTarget(child, isTopLayerInDocument)).toBe(popover);
    });

    it('stays in the body inside a dialog that is open but not modal', () => {
      const nonModal = matching(openDialog());
      nonModal.appendChild(child);
      document.body.appendChild(nonModal);

      expect(findPortalTarget(child, isTopLayerInDocument)).toBe(document.body);
    });
  });
});

describe('isTopLayerInDocument', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('accepts a modal dialog', () => {
    const dialog = matching(openDialog(), ':modal');
    document.body.appendChild(dialog);

    expect(isTopLayerInDocument(dialog)).toBe(true);
  });

  it('accepts an open popover', () => {
    const popover = matching(document.createElement('div'), ':popover-open');
    document.body.appendChild(popover);

    expect(isTopLayerInDocument(popover)).toBe(true);
  });

  it('rejects a dialog that is open but not modal', () => {
    const dialog = matching(openDialog());
    document.body.appendChild(dialog);

    expect(isTopLayerInDocument(dialog)).toBe(false);
  });

  it("rejects a host in a shadow root, which the document's stylesheets don't reach", () => {
    const dialog = matching(openDialog(), ':modal');
    jest.spyOn(dialog, 'getRootNode').mockReturnValue(document.createDocumentFragment());

    expect(isTopLayerInDocument(dialog)).toBe(false);
  });

  it("treats a selector the browser doesn't support as no match", () => {
    const dialog = openDialog();
    jest.spyOn(dialog, 'matches').mockImplementation(() => {
      throw new SyntaxError('unsupported selector');
    });
    document.body.appendChild(dialog);

    expect(isTopLayerInDocument(dialog)).toBe(false);
  });
});
