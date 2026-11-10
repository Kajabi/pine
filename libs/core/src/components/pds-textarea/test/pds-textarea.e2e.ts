import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo"></pds-textarea>');
    await page.waitForChanges();
    const element = await page.find('pds-textarea');

    expect(element).toHaveClass('hydrated');
  });

  it('renders a value and updates', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo" required="true"></pds-textarea> <button>test</button>');
    const textarea = await page.find('pds-textarea >>> textarea');
    const button = await page.find('button');

    let value = await textarea.getProperty('value');
    expect(value).toBe('');

    await textarea.focus();
    await page.waitForChanges();

    const event = await page.spyOnEvent('pdsTextareaChange');
    await page.keyboard.type('Hello');
    await page.waitForChanges();
    await button.focus();
    await page.waitForChanges();

    value = await textarea.getProperty('value');

    expect(value).toBe('Hello');
    expect(event).toHaveReceivedEvent();
  });

  it('renders action slot content when provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-textarea label="Description">
          <span slot="action">0/500</span>
        </pds-textarea>
      `);

    const actionSlot = await page.find('pds-textarea >>> .pds-textarea__action');
    expect(actionSlot).not.toBeNull();

    const slotContent = await page.find('pds-textarea span[slot="action"]');
    expect(await slotContent.innerText).toBe('0/500');
  });

  it('does not render action wrapper when no action content is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea label="Description"></pds-textarea>');

    const actionSlot = await page.find('pds-textarea >>> .pds-textarea__action');
    expect(actionSlot).toBeNull();
  });

  it('sets has-action attribute when action slot has content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-textarea label="Comments">
          <a slot="action" href="#">View guidelines</a>
        </pds-textarea>
      `);

    const component = await page.find('pds-textarea');
    expect(component).toHaveAttribute('has-action');
    expect(await component.getAttribute('has-action')).toBe('true');
  });

  describe('character counter', () => {
    it('displays character counter when maxLength is set', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Bio" max-length="50" value="Hello"></pds-textarea>');
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      expect(counter).not.toBeNull();
      expect(await counter.innerText).toBe('5 / 50');
    });

    it('does not display character counter when maxLength is not set', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Bio" value="Hello"></pds-textarea>');
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      expect(counter).toBeNull();
    });

    it('updates character counter as user types', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Bio" max-length="20" value=""></pds-textarea>');
      await page.waitForChanges();

      const textarea = await page.find('pds-textarea >>> textarea');
      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');

      // Initial state
      expect(await counter.innerText).toBe('0 / 20');

      // Type some text
      await textarea.focus();
      await page.keyboard.type('Hello');
      await page.waitForChanges();

      expect(await counter.innerText).toBe('5 / 20');

      // Type more text
      await page.keyboard.type(' World');
      await page.waitForChanges();

      expect(await counter.innerText).toBe('11 / 20');
    });

    it('prevents typing beyond maxLength limit', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Short" max-length="5" value=""></pds-textarea>');
      await page.waitForChanges();

      const textarea = await page.find('pds-textarea >>> textarea');
      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');

      await textarea.focus();
      await page.keyboard.type('Hello World!');
      await page.waitForChanges();

      // Should be truncated to maxLength
      const value = await textarea.getProperty('value');
      expect(value).toBe('Hello');
      expect(await counter.innerText).toBe('5 / 5');
    });

    it('works with disabled textarea', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Bio" max-length="100" disabled="true" value="Disabled text"></pds-textarea>');
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      expect(counter).not.toBeNull();
      expect(await counter.innerText).toBe('13 / 100');

      const textarea = await page.find('pds-textarea >>> textarea');
      expect(await textarea.getProperty('disabled')).toBe(true);
    });

    it('works with readonly textarea', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Bio" max-length="200" readonly="true" value="Readonly text"></pds-textarea>');
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      expect(counter).not.toBeNull();
      expect(await counter.innerText).toBe('13 / 200');

      const textarea = await page.find('pds-textarea >>> textarea');
      expect(await textarea.getProperty('readOnly')).toBe(true);
    });

    it('counter remains visible during textarea resize', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-textarea label="Resizable" max-length="100" value="Test content" rows="3"></pds-textarea>
      `);
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      expect(counter).not.toBeNull();

      // Counter should be positioned absolutely and remain visible
      const counterRect = await page.evaluate(() => {
        const textarea = document.querySelector('pds-textarea');
        const counter = textarea?.shadowRoot?.querySelector('.pds-textarea__character-counter');
        const rect = counter?.getBoundingClientRect();
        return { width: rect?.width || 0, height: rect?.height || 0 };
      });
      expect(counterRect).not.toBeNull();
      expect(counterRect.width).toBeGreaterThan(0);
      expect(counterRect.height).toBeGreaterThan(0);
    });

    it('shows correct count with various text inputs', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-textarea label="Test" max-length="50" value=""></pds-textarea>');
      await page.waitForChanges();

      const textarea = await page.find('pds-textarea >>> textarea');
      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');

      // Test with special characters
      await textarea.focus();
      await textarea.type('Hello\nWorld!\t123');
      await page.waitForChanges();

      expect(await counter.innerText).toBe('16 / 50');
    });

    it('integrates properly with error and helper messages', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-textarea
          label="Bio"
          max-length="100"
          helper-message="Tell us about yourself"
          error-message="This field is required"
          invalid="true"
          required="true"
          value="Short bio"
        ></pds-textarea>
      `);
      await page.waitForChanges();

      const counter = await page.find('pds-textarea >>> .pds-textarea__character-counter');
      const helper = await page.find('pds-textarea >>> .pds-textarea__helper-message');
      const error = await page.find('pds-textarea >>> .pds-textarea__error-message');

      expect(counter).not.toBeNull();
      expect(helper).not.toBeNull();
      expect(error).not.toBeNull();

      expect(await counter.innerText).toBe('9 / 100');
    });
  });

  it('applies highlight styling when highlight prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea highlight label="Message" name="message" value="test"></pds-textarea>');

    const component = await page.find('pds-textarea');
    expect(component).toHaveClass('hydrated');
    expect(component).toHaveAttribute('highlight');

    // Verify highlight attribute is reflected
    const hasHighlight = await component.getAttribute('highlight');
    expect(hasHighlight).not.toBeNull();
  });

  it('toggles highlight attribute when property changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea label="Message" name="message"></pds-textarea>');
    const component = await page.find('pds-textarea');

    // Initially no highlight
    expect(component).not.toHaveAttribute('highlight');

    // Set highlight property
    component.setProperty('highlight', true);
    await page.waitForChanges();

    // Should have highlight attribute
    expect(component).toHaveAttribute('highlight');

    // Unset highlight property
    component.setProperty('highlight', false);
    await page.waitForChanges();

    // Should not have highlight attribute
    expect(component).not.toHaveAttribute('highlight');
  });
});

describe('pds-textarea validity', () => {
  it('stays valid while required and disabled with no value', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-textarea component-id="bio" name="bio" label="Bio" required disabled></pds-textarea></form>');
    await page.waitForChanges();

    const invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(false);
  });

  it('goes required-invalid once re-enabled, instead of keeping the validity it had while disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<form><pds-textarea component-id="bio" name="bio" label="Bio" required disabled></pds-textarea></form>');
    await page.waitForChanges();

    await page.$eval('pds-textarea', (el: Element) => {
      el.removeAttribute('disabled');
    });
    await page.waitForChanges();

    const invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(true);

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('stays valid while required and empty inside a disabled fieldset, then goes invalid once the fieldset is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form>
        <fieldset disabled>
          <pds-textarea component-id="bio" name="bio" label="Bio" required></pds-textarea>
        </fieldset>
      </form>
    `);
    await page.waitForChanges();

    let invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(false);

    await page.$eval('fieldset', (el: Element) => el.removeAttribute('disabled'));
    await page.waitForChanges();

    invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(true);
  });

  it('goes required-invalid when required is turned on at runtime with no value', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" name="bio" label="Bio"></pds-textarea>');
    await page.waitForChanges();

    let invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(false);

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { required: boolean }).required = true;
    });
    await page.waitForChanges();

    invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(true);
  });

  it('keeps a required-empty field invalid when maxLength also changes, instead of maxLengthChanged clearing it', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" name="bio" label="Bio" required></pds-textarea>');
    await page.waitForChanges();

    let invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(true);

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { maxLength: number }).maxLength = 100;
    });
    await page.waitForChanges();

    invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(true);
  });

  it('keeps an over-maxLength value invalid when required or disabled is toggled afterward', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" name="bio" label="Bio" value="abcdef"></pds-textarea>');
    await page.waitForChanges();

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { maxLength: number }).maxLength = 3;
    });
    await page.waitForChanges();

    const isInvalid = () => page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(await isInvalid()).toBe(true);

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { required: boolean }).required = true;
    });
    await page.waitForChanges();
    expect(await isInvalid()).toBe(true);

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { disabled: boolean }).disabled = true;
    });
    await page.waitForChanges();
    expect(await isInvalid()).toBe(false);

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { disabled: boolean }).disabled = false;
    });
    await page.waitForChanges();
    expect(await isInvalid()).toBe(true);
  });

  it('goes valid when maxLength is removed from a field that was over it', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" name="bio" label="Bio" value="abcdef"></pds-textarea>');
    await page.waitForChanges();

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { maxLength: number }).maxLength = 3;
    });
    await page.waitForChanges();

    await page.$eval('pds-textarea', (el: Element) => {
      (el as unknown as { maxLength: number | undefined }).maxLength = undefined;
    });
    await page.waitForChanges();

    const invalid = await page.$eval('pds-textarea', (el: Element) => el.matches(':invalid'));
    expect(invalid).toBe(false);
  });
});

describe('pds-textarea accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" label="Bio"></pds-textarea>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with an error message', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea component-id="bio" label="Bio" invalid error-message="Bio is required"></pds-textarea>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
