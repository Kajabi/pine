import { newSpecPage } from '@stencil/core/testing';
import type { SpecPage } from '@stencil/core/testing';
import { PdsSwitch } from '../pds-switch';
import { danger } from '@pine-ds/icons/icons';

describe('pds-switch', () => {
  it('renders an input as a checkbox with label', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-e1"
          label="Switch label">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-e1" class="pds-switch" label="Switch label">
        <mock:shadow-root>
          <label for="pds-switch-e1">
            <input id="pds-switch-e1" name="pds-switch-e1" class="pds-switch__input" type="checkbox">
            <span><slot name="label"></slot>Switch label</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('does not render a label when hide-label is true', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch component-id="pds-switch-e1" label="Switch label" hide-label="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-e1" class="pds-switch" label="Switch label" hide-label="true">
        <mock:shadow-root>
          <label for="pds-switch-e1">
            <input id="pds-switch-e1" name="pds-switch-e1" class="pds-switch__input" type="checkbox">
            <span class="visually-hidden"><slot name="label"></slot>Switch label</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a disabled input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-disabled"
          label="Switch disabled"
          disabled="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-disabled" class="pds-switch" label="Switch disabled" aria-disabled="true" disabled="true">
        <mock:shadow-root>
          <label for="pds-switch-disabled">
            <input id="pds-switch-disabled" name="pds-switch-disabled" class="pds-switch__input" type="checkbox" disabled>
            <span><slot name="label"></slot>Switch disabled</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a required input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-required"
          label="Switch required"
          required="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-required" class="pds-switch" label="Switch required" required="true">
        <mock:shadow-root>
          <label for="pds-switch-required">
            <input id="pds-switch-required" name="pds-switch-required" class="pds-switch__input" type="checkbox" required>
            <span><slot name="label"></slot>Switch required</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-msg"
          label="Switch helper message"
          helper-message="Direct trade next level slow-carb, hashtag distillery">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-msg" class="pds-switch pds-switch--message" label="Switch helper message" helper-message="Direct trade next level slow-carb, hashtag distillery">
        <mock:shadow-root>
          <label for="pds-switch-msg">
            <input aria-describedby="pds-switch-msg__helper-message" id="pds-switch-msg" name="pds-switch-msg" class="pds-switch__input" type="checkbox">
            <span><slot name="label"></slot>Switch helper message</span>
          </label>
          <div id="pds-switch-msg__helper-message"  class="pds-switch__message">Direct trade next level slow-carb, hashtag distillery</div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders an error message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-err"
          label="Switch error message"
          error-message="La croix blue bottle narwhal fam"
          invalid="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-err" class="pds-switch pds-switch--error" label="Switch error message" error-message="La croix blue bottle narwhal fam" invalid="true">
        <mock:shadow-root>
          <label for="pds-switch-err">
            <input aria-describedby="pds-switch-err__error-message" aria-invalid="true" id="pds-switch-err" name="pds-switch-err" class="pds-switch__input" type="checkbox">
            <span><slot name="label"></slot>Switch error message</span>
          </label>
          <div aria-live="assertive" id="pds-switch-err__error-message" class="pds-switch__message pds-switch__message--error">
            <pds-icon aria-hidden="true" icon="${danger}" size="small"></pds-icon>
            La croix blue bottle narwhal fam
          </div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a helper and error message and assigns aria-description to the input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html:`
        <pds-switch
          component-id="switch-with-description"
          invalid="true"
          label="Switch with description"
          helper-message="This is a helper message"
          error-message="This is an error message">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="switch-with-description" class="pds-switch pds-switch--message pds-switch--error" label="Switch with description" helper-message="This is a helper message" error-message="This is an error message" invalid="true">
        <mock:shadow-root>
          <label for="switch-with-description">
            <input aria-describedby="switch-with-description__error-message" aria-invalid="true" id="switch-with-description" name="switch-with-description" class="pds-switch__input" type="checkbox">
            <span><slot name="label"></slot>Switch with description</span>
          </label>
          <div id="switch-with-description__helper-message"  class="pds-switch__message">This is a helper message</div>
          <div aria-live="assertive" id="switch-with-description__error-message" class="pds-switch__message pds-switch__message--error">
            <pds-icon aria-hidden="true" icon="${danger}" size="small"></pds-icon>
            This is an error message
          </div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a name attribute', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch component-id="pds-switch-name" name="pds-switch-name" label="Switch name">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-name" class="pds-switch" name="pds-switch-name" label="Switch name">
        <mock:shadow-root>
          <label for="pds-switch-name">
            <input id="pds-switch-name" name="pds-switch-name" class="pds-switch__input" type="checkbox">
            <span><slot name="label"></slot>Switch name</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('emits a `pdsSwitchChange` event when the input is changed', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="switch-with-event"
          label="Switch with event">
        </pds-switch>
      `
    });

    const component = page.root?.shadowRoot?.querySelector('input');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsSwitchChange', eventSpy);
    component?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });

  it('will not emit a `pdsSwitchChange` event when the input is disabled', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="switch-with-event"
          disabled="true"
          label="Switch with event">
        </pds-switch>
      `
    });

    const component = page.root?.shadowRoot?.querySelector('input');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsSwitchChange', eventSpy);
    component?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).not.toHaveBeenCalled();
  });

  it('describes the helper message when invalid with no error message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<pds-switch component-id="sw" invalid helper-message="Pick one"></pds-switch>`,
    });

    const shadow = page.root.shadowRoot;
    const describedBy = shadow.querySelector('input').getAttribute('aria-describedby');

    expect(describedBy).toBe('sw__helper-message');
    expect(shadow.querySelector(`#${describedBy}`).textContent).toContain('Pick one');
  });

  it('renders the label prop as a text node outside the label slot', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<pds-switch component-id="default" label="Label text"></pds-switch>`,
    });

    const span = page.root.shadowRoot.querySelector('label span');
    expect(span.querySelector('slot[name="label"]').textContent).toBe('');
    expect(span.textContent).toBe('Label text');
  });

  it('drops the label prop text when the label slot has content', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<pds-switch component-id="default" label="Label text"><span slot="label">Slotted label</span></pds-switch>`,
    });

    expect(page.root.shadowRoot.querySelector('label span').textContent).toBe('');
    expect(page.root.querySelector('[slot="label"]').textContent).toBe('Slotted label');
  });

  it('marks the host only when the label slot has content', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch component-id="slotted"><span slot="label">Slotted label</span></pds-switch>
        <pds-switch component-id="prop" label="Label text"></pds-switch>
      `,
    });

    const [slotted, prop] = Array.from(page.body.querySelectorAll('pds-switch'));
    expect(slotted).toHaveClass('pds-switch--label-slot');
    expect(prop).not.toHaveClass('pds-switch--label-slot');
  });

  it('takes its disabled state from a disabled fieldset', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<fieldset disabled><pds-switch component-id="in-fieldset" label="Label"></pds-switch></fieldset>`,
    });

    page.rootInstance.formDisabledCallback(true);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(true);

    page.rootInstance.formDisabledCallback(false);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(false);
  });

  // formDisabledCallback also fires when this element's own `disabled` attribute is merely
  // present (even as the literal string "false", which a consumer's or React's attribute
  // serialization can write) — the platform treats any value as disabled, independent of a real
  // fieldset. Without a disabled fieldset ancestor, that call must not disable the switch.
  it('ignores formDisabledCallback(true) with no disabled fieldset ancestor', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<pds-switch component-id="no-fieldset" label="Label" disabled="false"></pds-switch>`,
    });

    page.rootInstance.formDisabledCallback(true);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(false);
  });
  describe('unchecked-value', () => {
    const formValue = (page: SpecPage) => (page.rootInstance as unknown as { formValue: () => string | null }).formValue();

    it('submits nothing while unchecked when unset', async () => {
      const page = await newSpecPage({
        components: [PdsSwitch],
        html: `<pds-switch component-id="notify" name="notify" label="Notify"></pds-switch>`,
      });

      expect(formValue(page)).toBeNull();
    });

    it('submits the unchecked value while unchecked, and the value once checked', async () => {
      const page = await newSpecPage({
        components: [PdsSwitch],
        html: `<pds-switch component-id="notify" name="notify" label="Notify" value="1" unchecked-value="0"></pds-switch>`,
      });

      expect(formValue(page)).toBe('0');

      page.root.checked = true;
      await page.waitForChanges();
      expect(formValue(page)).toBe('1');
    });

    it('submits a blank unchecked value', async () => {
      const page = await newSpecPage({
        components: [PdsSwitch],
        html: `<pds-switch component-id="notify" name="notify" label="Notify" unchecked-value=""></pds-switch>`,
      });

      expect(formValue(page)).toBe('');
    });

    it('keeps the input value attribute for the checked value only', async () => {
      const page = await newSpecPage({
        components: [PdsSwitch],
        html: `<pds-switch component-id="notify" name="notify" label="Notify" value="1" unchecked-value="0"></pds-switch>`,
      });

      expect(page.root.shadowRoot.querySelector('input').getAttribute('value')).toBe('1');
    });
  });

  it('describes a disabled switch with its helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `<pds-switch component-id="commissions" label="Affiliate commissions" disabled helper-message="Free offers can't have affiliate commissions."></pds-switch>`,
    });

    const input = page.root.shadowRoot.querySelector('input');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('commissions__helper-message');
  });

  describe('aria-describedby on the host', () => {
    // mock-doc has no MutationObserver, so this one reports host attribute changes the way a browser would.
    class HostAttributeObserver {
      static instances: HostAttributeObserver[] = [];
      private attributeFilter: string[] = [];
      constructor(private callback: MutationCallback) {
        HostAttributeObserver.instances.push(this);
      }
      observe(_target: Node, options: MutationObserverInit) {
        this.attributeFilter = options.attributeFilter ?? [];
      }
      disconnect() {}
      notify(attributeName: string) {
        if (this.attributeFilter.includes(attributeName)) this.callback([], this as unknown as MutationObserver);
      }
    }

    const originalObserver = globalThis.MutationObserver;
    // mock-doc has no global Document to tell the document root apart, so it gets the spec page's.
    let hadDocument = false;
    let originalDocument: unknown;

    beforeEach(() => {
      HostAttributeObserver.instances = [];
      globalThis.MutationObserver = HostAttributeObserver as unknown as typeof MutationObserver;
      hadDocument = 'Document' in globalThis;
      originalDocument = (globalThis as { Document?: unknown }).Document;
    });

    afterEach(() => {
      globalThis.MutationObserver = originalObserver;
      if (hadDocument) {
        (globalThis as { Document?: unknown }).Document = originalDocument;
      } else {
        delete (globalThis as { Document?: unknown }).Document;
      }
    });

    const setHostAttribute = async (page: SpecPage, value: string | null) => {
      if (value === null) {
        page.root?.removeAttribute('aria-describedby');
      } else {
        page.root?.setAttribute('aria-describedby', value);
      }
      HostAttributeObserver.instances.forEach((observer) => observer.notify('aria-describedby'));
      await page.waitForChanges();
    };

    // mock-doc has no ARIA element reflection, so the input gets the property a browser would have.
    const renderWithReflection = async (html: string) => {
      const page = await newSpecPage({ components: [PdsSwitch], html });
      (globalThis as { Document?: unknown }).Document = page.doc.constructor;
      const input = page.root.shadowRoot.querySelector('input');
      Object.defineProperty(input, 'ariaDescribedByElements', { value: null, writable: true });
      return { page, input };
    };
    const describedIds = (input: HTMLInputElement) =>
      Array.from(((input as unknown as { ariaDescribedByElements: Element[] | null }).ariaDescribedByElements ?? []), (el) => el.id);

    it('stays on the host instead of being copied onto the input as IDs that cannot resolve there', async () => {
      const page = await newSpecPage({
        components: [PdsSwitch],
        html: `<p id="card-description">Card text</p><pds-switch component-id="card" label="Card" helper-message="Help" aria-describedby="card-description"></pds-switch>`,
      });

      const host = page.body.querySelector('pds-switch');
      expect(host.getAttribute('aria-describedby')).toBe('card-description');
      expect(host.shadowRoot.querySelector('input').getAttribute('aria-describedby')).toBe('card__helper-message');
    });

    it('points the input at the referenced elements, then its own message, and follows changes and removal', async () => {
      const { page, input } = await renderWithReflection(`
        <p id="first">First</p>
        <p id="second">Second</p>
        <pds-switch component-id="card" label="Card" helper-message="Help"></pds-switch>
      `);

      await setHostAttribute(page, 'first missing');
      expect(describedIds(input)).toEqual(['first', 'card__helper-message']);

      await setHostAttribute(page, 'first second');
      expect(describedIds(input)).toEqual(['first', 'second', 'card__helper-message']);

      await setHostAttribute(page, null);
      expect(input.getAttribute('aria-describedby')).toBe('card__helper-message');
    });

    it('points the input at the referenced elements alone without a message', async () => {
      const { page, input } = await renderWithReflection(`<p id="first">First</p><pds-switch component-id="card" label="Card"></pds-switch>`);

      await setHostAttribute(page, 'first');
      expect(describedIds(input)).toEqual(['first']);

      await setHostAttribute(page, null);
      expect(input.hasAttribute('aria-describedby')).toBe(false);
    });

    it('picks up a referenced element added after the switch when the input is focused', async () => {
      const { page, input } = await renderWithReflection(`<pds-switch component-id="card" label="Card" aria-describedby="late"></pds-switch>`);
      expect(describedIds(input)).toEqual([]);

      const late = page.doc.createElement('p');
      late.id = 'late';
      page.body.appendChild(late);
      input.dispatchEvent(new Event('focus'));
      await page.waitForChanges();

      expect(describedIds(input)).toEqual(['late']);
    });
  });
});
