import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';
import { expectRespectsReducedMotion } from '../../../utils/test/reduced-motion';

describe('pds-switch', () => {
  it('renders a checked input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = await el.getProperty('checked');
    expect(value).toBe(false);

    component.setProperty('checked', 'true');
    await page.waitForChanges();

    value = await el.getProperty('checked');
    expect(value).toBe(true);
  });

  it('renders a disabled input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = await el.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();

    value = await el.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders an invalid input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = el.getAttribute('aria-invalid');
    expect(value).toBe(null);

    component.setProperty('invalid', 'true');
    await page.waitForChanges();

    value = el.getAttribute('aria-invalid');
    expect(value).toBe('true');
  });

  it('renders an invalid input with error message when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="switch-with-error" invalid="true" error-message="Please correct this item"></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    const errText = await page.find('pds-switch >>> .pds-switch__message--error');
    const ariaDesc = el.getAttribute('aria-describedby');
    const ariaInvalid = el.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe('true');
    expect(ariaDesc).toBe('switch-with-error__error-message');
    expect(errText.textContent).toEqual(`Please correct this item`);
  });

  it('renders a helper and error message and assigns the aria-description to the input', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-switch component-id="switch-with-description" invalid="true" helper-message="This is a helper message" error-message="This is an error message"></pds-switch>',
    );

    const component = await page.find('pds-switch');
    const el = await page.find('pds-switch >>> input');
    expect(component).toHaveClass('hydrated');

    const helperMessage = await page.find('pds-switch >>> #switch-with-description__helper-message');
    const errorMessage = await page.find('pds-switch >>> #switch-with-description__error-message');

    const ariaDesc = el.getAttribute('aria-describedby');
    const ariaInvalid = el.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe('true');
    expect(ariaDesc).toBe('switch-with-description__error-message');
    expect(helperMessage.textContent).toEqual(`This is a helper message`);
    expect(errorMessage.textContent).toEqual(`This is an error message`);
  });

  it('toggles when slotted label content is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="default"><pds-chip slot="label">Spring Launch</pds-chip></pds-switch>');

    const input = await page.find('pds-switch >>> input');
    const eventSpy = await page.spyOnEvent('pdsSwitchChange');
    await (await page.find('pds-chip')).click();
    await page.waitForChanges();

    expect(await input.getProperty('checked')).toBe(true);
    expect(eventSpy).toHaveReceivedEventTimes(1);
  });

  it('takes its accessible name from slotted label content, or the label prop without it', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-switch component-id="slotted" label="Fallback"><pds-chip slot="label">Spring Launch</pds-chip></pds-switch>
      <pds-switch component-id="prop" label="Label text"></pds-switch>
    `);

    const tree = await page.accessibility.snapshot();
    const findInputs = (node) => [node.role === 'checkbox' ? node.name : null, ...(node.children ?? []).flatMap(findInputs)].filter(Boolean);

    expect(findInputs(tree)).toEqual(['Spring Launch', 'Label text']);
  });

  it('centers the control on slotted label content', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="default"><pds-chip slot="label" dot>Spring Launch</pds-chip></pds-switch>');

    const offset = await page.evaluate(() => {
      const middle = (rect: DOMRect) => rect.top + rect.height / 2;
      const host = document.querySelector('pds-switch');
      const input = host.shadowRoot.querySelector('input').getBoundingClientRect();
      const chip = host.querySelector('pds-chip').getBoundingClientRect();
      return Math.abs(middle(input) - middle(chip));
    });

    expect(offset).toBeLessThan(1);
  });
});

describe('pds-switch reduced motion', () => {
  // --number-transition-timing previously hard-coded 0.15s directly, invisible
  // to prefers-reduced-motion. Covers both the input's own transition and the
  // toggle knob's ::after transition — both consume the same custom property.
  it('zeroes out the input transition under prefers-reduced-motion', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');
    await expectRespectsReducedMotion(page, 'pds-switch', 'input');
  });

  it('zeroes out the toggle knob transition under prefers-reduced-motion', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');
    await expectRespectsReducedMotion(page, 'pds-switch', 'input', 'after');
  });
});

describe('pds-switch accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="notify" label="Enable notifications"></pds-switch>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with an error message', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="notify" label="Enable notifications" invalid error-message="Turn on notifications to continue"></pds-switch>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with slotted label content', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="tag"><pds-chip slot="label" sentiment="neutral">Spring Launch</pds-chip></pds-switch>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-switch wrote, including the ones its CSS selects on.
describe('pds-switch after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch class="consumer" component-id="switch" label="Switch" invalid disabled helper-message="Help"></pds-switch>');

    await expectStylingSurvivesStrip(page, 'pds-switch', { removeAttributes: ['aria-disabled'] });
  });
});

describe('pds-switch in a disabled fieldset', () => {
  it('is disabled while the fieldset is, and comes back when it is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form>
        <fieldset disabled>
          <pds-switch component-id="in-fieldset" name="notify" label="Enable notifications"></pds-switch>
        </fieldset>
      </form>
    `);
    await page.waitForChanges();
    const disabled = () =>
      page.evaluate(() => (document.querySelector('pds-switch') as HTMLElement & { disabled: boolean }).disabled);

    expect(await disabled()).toBe(true);

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');

    await page.evaluate(() => document.querySelector('fieldset')!.removeAttribute('disabled'));
    await page.waitForChanges();
    expect(await disabled()).toBe(false);
  });
});

describe('pds-switch form value', () => {
  const submitted = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
    page.$eval('form', (form: HTMLFormElement) => new FormData(form).getAll('notify'));

  it('submits under a name set as a property, and as an attribute the way the React wrapper sets it', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch id="prop" component-id="prop" checked></pds-switch><pds-switch id="attr" component-id="attr" name="viaAttribute" checked></pds-switch></form>');

    await page.$eval('#prop', (el: HTMLPdsSwitchElement) => (el.name = 'notify'));
    await page.waitForChanges();

    expect(await submitted(page)).toEqual(['on']);
    expect(await page.$eval('form', (form: HTMLFormElement) => new FormData(form).getAll('viaAttribute'))).toEqual(['on']);
  });

  it('submits nothing while unchecked without unchecked-value', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify"></pds-switch></form>');

    expect(await submitted(page)).toEqual([]);
  });

  it('submits unchecked-value while unchecked, and the value once toggled on and back off', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify" value="1" unchecked-value="0"></pds-switch></form>');

    expect(await submitted(page)).toEqual(['0']);

    await (await page.find('pds-switch >>> input')).click();
    await page.waitForChanges();
    expect(await submitted(page)).toEqual(['1']);

    await (await page.find('pds-switch >>> input')).click();
    await page.waitForChanges();
    expect(await submitted(page)).toEqual(['0']);
  });

  it('submits a blank unchecked-value', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify" unchecked-value=""></pds-switch></form>');

    expect(await submitted(page)).toEqual(['']);
  });

  it('follows a change to unchecked-value', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify"></pds-switch></form>');

    await page.$eval('pds-switch', (el: HTMLPdsSwitchElement) => (el.uncheckedValue = 'off'));
    await page.waitForChanges();
    expect(await submitted(page)).toEqual(['off']);
  });

  it('submits nothing while disabled through the property, as React sets it', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify" value="1" unchecked-value="0" checked></pds-switch></form>');

    await page.$eval('pds-switch', (el: HTMLPdsSwitchElement) => (el.disabled = true));
    await page.waitForChanges();
    expect(await submitted(page)).toEqual([]);

    await page.$eval('pds-switch', (el: HTMLPdsSwitchElement) => (el.disabled = false));
    await page.waitForChanges();
    expect(await submitted(page)).toEqual(['1']);
  });

  it('submits nothing while disabled, even with unchecked-value', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-switch component-id="notify" name="notify" label="Notify" unchecked-value="0" disabled></pds-switch></form>');

    expect(await submitted(page)).toEqual([]);
  });
});

describe('pds-switch description', () => {
  // The accessibility tree node of the inner input, as a screen reader reads it.
  const inputAxNode = async (page: Awaited<ReturnType<typeof newE2EPage>>, selector = 'pds-switch') => {
    const input = await page.evaluateHandle(
      (hostSelector) => document.querySelector(hostSelector)?.shadowRoot?.querySelector('input') as HTMLElement,
      selector,
    );
    return page.accessibility.snapshot({ root: input, interestingOnly: false });
  };

  it('describes a disabled switch with its helper message, which a tooltip around it cannot do for keyboard users', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-switch component-id="commissions" label="Affiliate commissions" disabled helper-message="Free offers can't have affiliate commissions."></pds-switch>
    `);

    const node = await inputAxNode(page);
    expect(node?.disabled).toBe(true);
    expect(node?.description).toBe("Free offers can't have affiliate commissions.");

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('describes the input with the text aria-describedby points at, then its own message, and follows changes', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <p id="card-description">Send a receipt after each purchase.</p>
      <p id="other">Something else.</p>
      <pds-switch component-id="receipts" label="Receipts" helper-message="Applies to new orders." aria-describedby="card-description"></pds-switch>
    `);

    expect((await inputAxNode(page))?.description).toBe('Send a receipt after each purchase. Applies to new orders.');

    await page.$eval('pds-switch', (el) => el.setAttribute('aria-describedby', 'other'));
    await page.waitForChanges();
    expect((await inputAxNode(page))?.description).toBe('Something else. Applies to new orders.');

    await page.$eval('pds-switch', (el) => el.removeAttribute('aria-describedby'));
    await page.waitForChanges();
    expect((await inputAxNode(page))?.description).toBe('Applies to new orders.');
  });

  it('keeps the error message in the description while invalid', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <p id="card-description">Send a receipt after each purchase.</p>
      <pds-switch component-id="receipts" label="Receipts" aria-describedby="card-description"></pds-switch>
    `);

    await page.$eval('pds-switch', (el: HTMLPdsSwitchElement) => {
      el.errorMessage = 'Turn on receipts to continue';
      el.invalid = true;
    });
    await page.waitForChanges();

    expect((await inputAxNode(page))?.description).toBe('Send a receipt after each purchase. Turn on receipts to continue');
  });

  it('picks up a description added after the switch once it is focused', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="receipts" label="Receipts" aria-describedby="late"></pds-switch>');

    await page.evaluate(() => {
      const late = document.createElement('p');
      late.id = 'late';
      late.textContent = 'Added later.';
      document.body.appendChild(late);
    });
    await (await page.find('pds-switch >>> input')).focus();
    await page.waitForChanges();

    expect((await inputAxNode(page))?.description).toBe('Added later.');
  });

  it('has no axe violations when described by a pds-text outside it', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-text id="card-description" tag="p">Send a receipt after each purchase.</pds-text>
      <pds-switch component-id="receipts" label="Receipts" aria-describedby="card-description"></pds-switch>
    `);
    expect((await inputAxNode(page))?.description).toBe('Send a receipt after each purchase.');

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
